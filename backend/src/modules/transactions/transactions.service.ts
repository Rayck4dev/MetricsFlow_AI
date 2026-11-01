import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  CreateTransactionDto,
  TransactionType,
} from './dto/create-transaction.dto';
import { TransactionFiltersDto } from './dto/transaction-filters.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsRepository } from './repositories/transactions.repository';
import { TransactionValidatorService } from './services/transaction-validator.service';
import { toTransactionUpdateData } from './transaction-update.mapper';

type TransactionRecord = {
  id: string;
  company_id: string;
  type: TransactionType;
  category_id: string | null;
};

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly validator: TransactionValidatorService,
  ) {}

  async create(dto: CreateTransactionDto, userId: string) {
    await this.validator.ensureCompanyAccess(dto.company_id, userId);

    if (dto.category_id) {
      await this.validator.ensureCategoryCompatibility(
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
      this.validator.handleDatabaseError('criar movimentação', error);
    }

    if (!data) {
      throw new InternalServerErrorException(
        'Não foi possível confirmar a criação da movimentação.',
      );
    }

    return data;
  }

  async findByUser(userId: string, filters: TransactionFiltersDto) {
    this.validator.validateDateRange(filters);

    const { data: memberships, error: membershipError } =
      await this.transactionsRepository.findCompanyIdsByUser(userId);

    if (membershipError) {
      this.validator.handleDatabaseError(
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
        this.validator.handleDatabaseError(
          'validar categoria do filtro',
          categoryError,
        );
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
      this.validator.handleDatabaseError('listar movimentações', error);
    }

    return data ?? [];
  }

  async update(
    transactionId: string,
    dto: UpdateTransactionDto,
    userId: string,
  ) {
    this.validator.ensureValidTransactionId(transactionId);

    const { data: transaction, error: transactionError } =
      await this.transactionsRepository.findById(transactionId);

    if (transactionError) {
      this.validator.handleDatabaseError(
        'consultar movimentação para atualização',
        transactionError,
      );
    }

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    const currentTransaction = transaction as TransactionRecord;

    await this.validator.ensureCompanyAccess(
      currentTransaction.company_id,
      userId,
    );

    const nextType = dto.type ?? currentTransaction.type;

    const nextCategoryId =
      dto.category_id !== undefined
        ? dto.category_id
        : currentTransaction.category_id;

    if (nextCategoryId) {
      await this.validator.ensureCategoryCompatibility(
        nextCategoryId,
        currentTransaction.company_id,
        nextType,
      );
    }

    const updateData = toTransactionUpdateData(dto);

    const { data, error } = await this.transactionsRepository.update(
      transactionId,
      currentTransaction.company_id,
      updateData,
    );

    if (error) {
      this.validator.handleDatabaseError('atualizar movimentação', error);
    }

    if (!data) {
      throw new NotFoundException(
        'A movimentação não foi encontrada para atualização.',
      );
    }

    return data;
  }

  async remove(transactionId: string, userId: string) {
    this.validator.ensureValidTransactionId(transactionId);

    const { data: transaction, error: transactionError } =
      await this.transactionsRepository.findById(transactionId);

    if (transactionError) {
      this.validator.handleDatabaseError(
        'consultar movimentação para exclusão',
        transactionError,
      );
    }

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    const currentTransaction = transaction as TransactionRecord;

    await this.validator.ensureCompanyAccess(
      currentTransaction.company_id,
      userId,
    );

    const { data, error } = await this.transactionsRepository.delete(
      transactionId,
      currentTransaction.company_id,
    );

    if (error) {
      this.validator.handleDatabaseError('excluir movimentação', error);
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
}
