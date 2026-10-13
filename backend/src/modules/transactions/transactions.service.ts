import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  CreateTransactionDto,
  TransactionType,
} from './dto/create-transaction.dto';
import { TransactionFiltersDto } from './dto/transaction-filters.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsRepository } from './repositories/transactions.repository';

type TransactionCategory = {
  id: string;
  company_id: string;
  type: TransactionType;
};

type TransactionRecord = {
  id: string;
  company_id: string;
  type: TransactionType;
  category_id: string | null;
};

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}
  async create(dto: CreateTransactionDto, userId: string) {
    await this.ensureCompanyAccess(dto.company_id, userId);

    if (dto.category_id) {
      await this.ensureCategoryCompatibility(
        dto.category_id,
        dto.company_id,
        dto.type,
      );
    }

    const { data, error } = await this.transactionsRepository.create(
      dto,
      userId,
    );

    if (error) {
      this.handleDatabaseError('criar movimentação', error);
    }

    if (!data) {
      throw new InternalServerErrorException(
        'Não foi possível confirmar a criação da movimentação.',
      );
    }

    return data;
  }
  async findByUser(userId: string, filters: TransactionFiltersDto) {
    this.validateDateRange(filters);

    const { data: memberships, error: membershipError } =
      await this.transactionsRepository.findCompanyIdsByUser(userId);

    if (membershipError) {
      this.handleDatabaseError(
        'consultar empresas do usuário',
        membershipError,
      );
    }

    const companyIds = [
      ...new Set(
        (memberships ?? []).map((membership) => membership.company_id),
      ),
    ];

    if (companyIds.length === 0) {
      if (filters.company_id) {
        throw new ForbiddenException('Você não possui acesso a esta empresa.');
      }

      return [];
    }

    let allowedCompanyIds = companyIds;

    if (filters.company_id) {
      if (!companyIds.includes(filters.company_id)) {
        throw new ForbiddenException('Você não possui acesso a esta empresa.');
      }

      allowedCompanyIds = [filters.company_id];
    }

    if (filters.category_id) {
      const { data: category, error: categoryError } =
        await this.transactionsRepository.findCategoryById(filters.category_id);

      if (categoryError) {
        this.handleDatabaseError('validar categoria do filtro', categoryError);
      }

      if (!category) {
        throw new NotFoundException('Categoria não encontrada.');
      }

      if (!allowedCompanyIds.includes(category.company_id)) {
        throw new ForbiddenException(
          'A categoria não pertence a uma empresa autorizada.',
        );
      }
    }

    const { data, error } = await this.transactionsRepository.findAll(
      allowedCompanyIds,
      filters,
    );

    if (error) {
      this.handleDatabaseError('listar movimentações', error);
    }

    return data ?? [];
  }

  async update(
    transactionId: string,
    dto: UpdateTransactionDto,
    userId: string,
  ) {
    this.ensureValidTransactionId(transactionId);

    const { data: transaction, error: transactionError } =
      await this.transactionsRepository.findById(transactionId);

    if (transactionError) {
      this.handleDatabaseError(
        'consultar movimentação para atualização',
        transactionError,
      );
    }

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    const currentTransaction = transaction as TransactionRecord;

    await this.ensureCompanyAccess(currentTransaction.company_id, userId);

    const nextType = dto.type ?? currentTransaction.type;

    const nextCategoryId =
      dto.category_id !== undefined
        ? dto.category_id
        : currentTransaction.category_id;

    if (nextCategoryId) {
      await this.ensureCategoryCompatibility(
        nextCategoryId,
        currentTransaction.company_id,
        nextType,
      );
    }

    const updateData: Record<string, unknown> = {};

    if (dto.type !== undefined) {
      updateData.type = dto.type;
    }

    if (dto.category_id !== undefined) {
      updateData.category_id = dto.category_id;
    }

    if (dto.amount !== undefined) {
      updateData.amount = dto.amount;
    }

    if (dto.description !== undefined) {
      updateData.description = dto.description.trim();
    }

    if (dto.payment_method !== undefined) {
      updateData.payment_method = dto.payment_method;
    }

    if (dto.transaction_date !== undefined) {
      updateData.transaction_date = dto.transaction_date;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'Informe pelo menos um campo para atualizar.',
      );
    }

    const { data, error } = await this.transactionsRepository.update(
      transactionId,
      currentTransaction.company_id,
      updateData,
    );

    if (error) {
      this.handleDatabaseError('atualizar movimentação', error);
    }

    if (!data) {
      throw new NotFoundException(
        'A movimentação não foi encontrada para atualização.',
      );
    }

    return data;
  }

  async remove(transactionId: string, userId: string) {
    this.ensureValidTransactionId(transactionId);

    const { data: transaction, error: transactionError } =
      await this.transactionsRepository.findById(transactionId);

    if (transactionError) {
      this.handleDatabaseError(
        'consultar movimentação para exclusão',
        transactionError,
      );
    }

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    const currentTransaction = transaction as TransactionRecord;

    await this.ensureCompanyAccess(currentTransaction.company_id, userId);

    const { data, error } = await this.transactionsRepository.delete(
      transactionId,
      currentTransaction.company_id,
    );

    if (error) {
      this.handleDatabaseError('excluir movimentação', error);
    }

    if (!data) {
      throw new NotFoundException(
        'A movimentação não foi encontrada para exclusão.',
      );
    }

    return {
      message: 'Transação excluída com sucesso.',
    };
  }

  private async ensureCompanyAccess(
    companyId: string,
    userId: string,
  ): Promise<void> {
    const { data: membership, error } =
      await this.transactionsRepository.findMembership(companyId, userId);

    if (error) {
      this.handleDatabaseError('validar acesso à empresa', error);
    }

    if (!membership) {
      throw new ForbiddenException('Você não possui acesso a esta empresa.');
    }
  }

  private async ensureCategoryCompatibility(
    categoryId: string,
    companyId: string,
    transactionType: TransactionType,
  ): Promise<TransactionCategory> {
    const { data: category, error } =
      await this.transactionsRepository.findCategory(categoryId, companyId);

    if (error) {
      this.handleDatabaseError('validar categoria', error);
    }

    if (!category) {
      throw new NotFoundException(
        'Categoria não encontrada para esta empresa.',
      );
    }

    if (category.type !== transactionType) {
      throw new BadRequestException(
        'A categoria selecionada não corresponde ao tipo da movimentação.',
      );
    }

    return category as TransactionCategory;
  }

  private validateDateRange(filters: TransactionFiltersDto): void {
    if (!filters.start_date || !filters.end_date) {
      return;
    }

    const startDate = new Date(filters.start_date);
    const endDate = new Date(filters.end_date);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new BadRequestException(
        'O intervalo de datas informado é inválido.',
      );
    }

    if (startDate.getTime() > endDate.getTime()) {
      throw new BadRequestException(
        'A data inicial não pode ser posterior à data final.',
      );
    }
  }

  private ensureValidTransactionId(transactionId: string): void {
    const uuidV4Pattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidV4Pattern.test(transactionId)) {
      throw new BadRequestException(
        'O identificador da movimentação é inválido.',
      );
    }
  }

  private handleDatabaseError(
    operation: string,
    error: { message: string; code?: string },
  ): never {
    this.logger.error(
      `Falha ao ${operation}. Código: ${error.code ?? 'desconhecido'}.`,
      error.message,
    );

    if (error.code === '23503') {
      throw new BadRequestException(
        'A operação referencia um registro inexistente ou inválido.',
      );
    }

    if (error.code === '23505') {
      throw new BadRequestException(
        'Já existe um registro com os dados informados.',
      );
    }

    if (error.code === '22P02') {
      throw new BadRequestException(
        'Um dos identificadores ou valores informados é inválido.',
      );
    }

    throw new InternalServerErrorException(
      `Não foi possível ${operation}. Tente novamente mais tarde.`,
    );
  }
}
