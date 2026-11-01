import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType } from '../dto/create-transaction.dto';
import { TransactionFiltersDto } from '../dto/transaction-filters.dto';
import { TransactionsRepository } from '../repositories/transactions.repository';

export type TransactionCategory = {
  id: string;
  company_id: string;
  type: TransactionType;
};

@Injectable()
export class TransactionValidatorService {
  private readonly logger = new Logger(TransactionValidatorService.name);

  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async ensureCompanyAccess(companyId: string, userId: string): Promise<void> {
    const { data: membership, error } =
      await this.transactionsRepository.findMembership(companyId, userId);

    if (error) {
      this.handleDatabaseError('validar acesso à empresa', error);
    }

    if (!membership) {
      throw new ForbiddenException('Você não possui acesso a esta empresa.');
    }
  }

  async ensureCategoryCompatibility(
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

  validateDateRange(filters: TransactionFiltersDto): void {
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

  ensureValidTransactionId(transactionId: string): void {
    const uuidV4Pattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidV4Pattern.test(transactionId)) {
      throw new BadRequestException(
        'O identificador da movimentação é inválido.',
      );
    }
  }

  handleDatabaseError(
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
