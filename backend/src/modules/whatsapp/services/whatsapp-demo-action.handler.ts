import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PendingTransactionsRepository } from '../repositories/pending-transactions.repository';
import { PendingTransactionService } from './pending-transaction.service';
import type { PendingProposalState } from './whatsapp-demo-correction.handler';
import { WhatsappDemoHistoryService } from './whatsapp-demo-history.service';

@Injectable()
export class WhatsappDemoActionHandler {
  constructor(
    private readonly pendingRepository: PendingTransactionsRepository,
    private readonly pendingTransactionService: PendingTransactionService,
    private readonly historyService: WhatsappDemoHistoryService,
  ) {}

  isConfirmation(text: string): boolean {
    return /^(confirmar|confirmo|sim|ok|pode confirmar|pode registrar|confirmado)[.! ]*$/i.test(
      text,
    );
  }

  isCancellation(text: string): boolean {
    return /^(cancelar|cancela|cancele|não|nao|desistir|deixa pra lá|deixa para lá)[.! ]*$/i.test(
      text,
    );
  }

  isGenericCorrection(text: string): boolean {
    return /^(corrigir|corrige|editar|alterar|quero corrigir|quero alterar)[.! ]*$/i.test(
      text,
    );
  }

  async tryHandleAction(
    text: string,
    pending: PendingProposalState | null,
    userId: string,
    companyId: string,
  ) {
    if (
      this.isConfirmation(text) &&
      pending?.status === 'awaiting_confirmation'
    ) {
      const result = await this.handleConfirmation(pending, userId, companyId);
      await this.historyService.recordDemoMessage({
        companyId,
        userId,
        direction: 'outbound',
        messageType: 'text',
        text: result.message,
        transactionId: result.transactionId,
        pendingTransactionId: pending.id,
      });
      return result;
    }

    if (this.isCancellation(text) && pending) {
      const result = await this.handleCancellation(pending, userId, companyId);
      await this.historyService.recordDemoMessage({
        companyId,
        userId,
        direction: 'outbound',
        messageType: 'text',
        text: result.message,
        pendingTransactionId: pending.id,
      });
      return result;
    }

    if (this.isGenericCorrection(text) && pending) {
      const result = await this.handleGenericCorrection(
        pending,
        userId,
        companyId,
      );
      await this.historyService.recordDemoMessage({
        companyId,
        userId,
        direction: 'outbound',
        messageType: 'text',
        text: result.message,
      });
      return result;
    }

    return null;
  }

  async handleConfirmation(
    pending: PendingProposalState,
    userId: string,
    companyId: string,
  ) {
    const transactionId = await this.pendingTransactionService.confirm(
      pending.id,
      userId,
      companyId,
    );

    const replyText =
      '✅ Movimentação registrada com sucesso na MetricsFlow AI!';

    return {
      ok: true,
      confirmed: true,
      transactionId,
      message: replyText,
      reply: replyText,
      pendingTransactionId: pending.id,
    };
  }

  async handleCancellation(
    pending: PendingProposalState,
    userId: string,
    companyId: string,
  ) {
    const { data: cancelled, error: cancelError } =
      await this.pendingRepository.cancelPending(pending.id, userId, companyId);

    if (cancelError) {
      throw new InternalServerErrorException(
        'Não foi possível cancelar a proposta da demonstração.',
      );
    }

    if (!cancelled) {
      throw new BadRequestException(
        'A proposta da demonstração não está mais disponível.',
      );
    }

    const replyText =
      '❌ Tudo certo, a proposta foi cancelada. Nenhuma movimentação foi registrada. Se quiser, envie outra receita ou despesa.';

    return {
      ok: true,
      cancelled: true,
      message: replyText,
      reply: replyText,
      pendingTransactionId: pending.id,
    };
  }

  async handleGenericCorrection(
    pending: PendingProposalState,
    userId: string,
    companyId: string,
  ) {
    const { data: cancelled, error: cancelError } =
      await this.pendingRepository.cancelPending(pending.id, userId, companyId);

    if (cancelError) {
      throw new InternalServerErrorException(
        'Não foi possível descartar a proposta da demonstração.',
      );
    }

    if (!cancelled) {
      throw new BadRequestException(
        'A proposta da demonstração não está mais disponível.',
      );
    }

    const replyText =
      '✏️ Certo! A proposta anterior foi descartada. Envie novamente a movimentação com os dados corrigidos. Nada foi registrado ainda.';

    return {
      ok: true,
      corrected: true,
      message: replyText,
      reply: replyText,
    };
  }
}
