import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { User } from '@supabase/supabase-js';

import { PendingTransactionsRepository } from '../repositories/pending-transactions.repository';
import { WhatsappMessagesRepository } from '../repositories/whatsapp-messages.repository';
import { formatMessageTime } from './financial-message.utils';
import { WhatsappConnectionService } from './whatsapp-connection.service';

@Injectable()
export class WhatsappDemoHistoryService {
  constructor(
    private readonly connectionService: WhatsappConnectionService,
    private readonly messagesRepository: WhatsappMessagesRepository,
    private readonly pendingRepository: PendingTransactionsRepository,
  ) {}

  async recordDemoMessage(params: {
    companyId: string;
    userId: string;
    direction: 'inbound' | 'outbound';
    messageType: string;
    text?: string | null;
    transcription?: string | null;
    pendingTransactionId?: string | null;
    transactionId?: string | null;
  }) {
    const { data, error } =
      await this.messagesRepository.createDemoMessage(params);

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível salvar a mensagem da demonstração.',
      );
    }

    return data;
  }

  async getDemoMessages(user: User) {
    const company = await this.connectionService.getUserCompany(user.id);

    const welcomeText =
      'Olá! 👋 Sou a Metrics, a assistente financeira da MetricsFlow AI. Posso ajudar a registrar receitas e despesas do seu negócio. Vamos registrar sua próxima movimentação?';

    const { data: history, error: historyError } =
      await this.messagesRepository.findDemoHistory(user.id, company.id, 100);

    if (historyError) {
      throw new InternalServerErrorException(
        'Não foi possível carregar o histórico da demonstração.',
      );
    }

    const { data: pending, error: pendingError } =
      await this.pendingRepository.findLatestActivePending(user.id, company.id);

    if (pendingError) {
      throw new InternalServerErrorException(
        'Não foi possível carregar a proposta pendente da demonstração.',
      );
    }

    const formattedMessages = [...(history ?? [])]
      .reverse()
      .map((m, index) => ({
        id: index + 1,
        mine: m.direction === 'inbound',
        messageType: m.message_type,
        text: m.message_text ?? m.transcription ?? '',
        transcription: m.transcription ?? null,
        time: formatMessageTime(m.created_at),
        status: 'read' as const,
        pendingTransactionId: m.pending_transaction_id,
        transactionId: m.transaction_id,
        createdAt: m.created_at,
      }));

    if (formattedMessages.length === 0) {
      return {
        welcomeMessage: welcomeText,
        messages: [
          {
            id: 1,
            mine: false,
            messageType: 'text',
            text: welcomeText,
            time: formatMessageTime(new Date()),
            status: 'read' as const,
            createdAt: new Date().toISOString(),
          },
        ],
        pending: pending ?? null,
        company: { id: company.id, name: company.name },
      };
    }

    return {
      welcomeMessage: welcomeText,
      messages: formattedMessages,
      pending: pending ?? null,
      company: { id: company.id, name: company.name },
    };
  }
}
