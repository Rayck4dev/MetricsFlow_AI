import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import {
  ActivePendingTransactionStatus,
  PendingTransactionsRepository,
  PendingTransactionStatus,
} from '../repositories/pending-transactions.repository';

@Injectable()
export class PendingTransactionService {
  constructor(
    private readonly pendingTransactionsRepository: PendingTransactionsRepository,
  ) {}

  async findLatest(userId: string, companyId: string) {
    const { data, error } =
      await this.pendingTransactionsRepository.findLatestPending(
        userId,
        companyId,
      );

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível consultar a transação pendente.',
      );
    }

    if (!data) {
      return null;
    }

    const pending = data as {
      id: string;
      status: PendingTransactionStatus;
      expires_at: string;
    };

    if (new Date(pending.expires_at).getTime() <= Date.now()) {
      const { error: expireError } =
        await this.pendingTransactionsRepository.expirePending(pending.id);

      if (expireError) {
        throw new InternalServerErrorException(
          'Não foi possível expirar a transação pendente.',
        );
      }

      return null;
    }

    return data;
  }

  async cancel(
    pendingId: string,
    userId: string,
    companyId: string,
    expectedStatuses: ActivePendingTransactionStatus[] = [
      'awaiting_information',
      'awaiting_confirmation',
    ],
  ) {
    const { data, error } =
      await this.pendingTransactionsRepository.cancelPending(
        pendingId,
        userId,
        companyId,
        expectedStatuses,
      );

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível cancelar a transação pendente.',
      );
    }

    if (!data) {
      throw new BadRequestException(
        'A transação não está mais disponível para cancelamento.',
      );
    }

    return data;
  }

  async update(
    pendingId: string,
    userId: string,
    companyId: string,
    changes: Record<string, unknown>,
  ) {
    const { data, error } =
      await this.pendingTransactionsRepository.updatePendingTransaction(
        pendingId,
        userId,
        companyId,
        changes,
      );

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível atualizar a transação pendente.',
      );
    }

    if (!data) {
      throw new BadRequestException(
        'A transação pendente não está mais disponível para atualização.',
      );
    }

    return data;
  }

  async create(
    userId: string,
    companyId: string,
    data: Record<string, unknown>,
  ) {
    const { data: created, error } =
      await this.pendingTransactionsRepository.createPendingTransaction(
        userId,
        companyId,
        data,
      );

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível criar a transação pendente.',
      );
    }

    if (!created) {
      throw new InternalServerErrorException(
        'A transação pendente não foi criada.',
      );
    }

    return created;
  }

  async confirm(pendingId: string, userId: string, companyId: string) {
    const { data, error } =
      await this.pendingTransactionsRepository.confirmPendingTransaction(
        pendingId,
        userId,
        companyId,
      );

    if (error) {
      if (['P0002', 'P0001', '22023'].includes(error.code ?? '')) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'Não foi possível confirmar a transação.',
      );
    }

    if (!data) {
      throw new BadRequestException(
        'A transação não foi confirmada. Ela pode ter expirado ou não estar mais disponível.',
      );
    }

    return data as string;
  }
}
