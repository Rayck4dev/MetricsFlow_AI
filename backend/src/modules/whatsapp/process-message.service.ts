import { Injectable } from '@nestjs/common';

import { MessageContentService } from './services/message-content.service';
import { MessageIntentResolverService } from './strategies/message-intent-resolver.service';
import { MessageResponseService } from './services/message-response.service';
import { PendingTransactionService } from './services/pending-transaction.service';

import { IncomingWhatsAppMessage } from './types';
import { WhatsappConnectionsRepository } from './repositories/whatsapp-connections.repository';
import { WhatsappMessagesRepository } from './repositories/whatsapp-messages.repository';
import { MessageGuardService } from './message-guard.service';
import { MessageIntentContext } from './strategies/message-intent.strategy';

@Injectable()
export class ProcessMessageService {
  constructor(
    private readonly messageContentService: MessageContentService,
    private readonly messageIntentResolver: MessageIntentResolverService,
    private readonly pendingTransactionService: PendingTransactionService,
    private readonly messageResponseService: MessageResponseService,
    private readonly whatsappConnectionsRepository: WhatsappConnectionsRepository,
    private readonly whatsappMessagesRepository: WhatsappMessagesRepository,
    private readonly guardService: MessageGuardService,
  ) {}

  async processIncomingWhatsAppMessage(message: IncomingWhatsAppMessage) {
    const { data: existingMessage } =
      await this.whatsappMessagesRepository.findByProviderMessageId(
        message.providerMessageId,
      );

    if (existingMessage) {
      return {
        ok: true,
        duplicated: true,
        messageId: existingMessage.id,
      };
    }

    const { data: connection } =
      await this.whatsappConnectionsRepository.findVerifiedByPhone(
        message.phoneNumber,
      );

    if (!connection) {
      await this.messageResponseService.sendReply(
        message.phoneNumber,
        '⚠️ Seu número de WhatsApp ainda não está vinculado ou verificado em uma conta da MetricsFlow AI. Conecte seu número na plataforma para utilizar este recurso.',
      );
      return {
        ok: false,
        reason: 'unverified_connection',
      };
    }

    const preparedContent = await this.messageContentService.prepare(
      message.type,
      message.text ?? null,
      message.mediaId ?? null,
      message.providerMessageId,
    );

    if (preparedContent.errorReply) {
      await this.messageResponseService.sendReply(
        message.phoneNumber,
        preparedContent.errorReply,
      );
      return {
        ok: false,
        reason: preparedContent.errorStatus ?? 'invalid_content',
      };
    }

    const pendingData = await this.pendingTransactionService.findLatest(
      connection.user_id,
      connection.company_id,
    );

    const pendingTransaction = pendingData
      ? {
          id: pendingData.id as string,
          status: pendingData.status as string,
          raw_message: pendingData.raw_message as string,
        }
      : null;

    const guardResult = this.guardService.check(
      preparedContent.normalizedText,
      Boolean(pendingTransaction),
    );

    if (!guardResult.allowed) {
      await this.messageResponseService.sendReply(
        message.phoneNumber,
        guardResult.response,
      );
      return {
        ok: false,
        reason: guardResult.reason,
      };
    }

    const { data: createdMessage } =
      await this.whatsappMessagesRepository.createInboundMessage({
        company_id: connection.company_id,
        user_id: connection.user_id,
        provider_message_id: message.providerMessageId,
        phone_number: message.phoneNumber,
        message_type: message.type,
        message_text: message.text ?? null,
        provider_media_id: message.mediaId ?? null,
        transcription: preparedContent.transcription,
        provider_payload: message.payload,
      });

    const dbMessageId = createdMessage?.id;

    const context: MessageIntentContext = {
      userId: connection.user_id,
      companyId: connection.company_id,
      messageText: preparedContent.normalizedText,
      phoneNumber: message.phoneNumber,
      messageId: dbMessageId ?? message.providerMessageId,
      pendingTransaction,
    };

    const strategy = this.messageIntentResolver.resolve(context);

    if (!strategy) {
      const fallbackMessage =
        'Não consegui entender sua solicitação. Envie uma movimentação financeira válida (ex: "Recebi R$ 200 de um cliente").';
      await this.messageResponseService.sendReply(
        message.phoneNumber,
        fallbackMessage,
      );

      if (dbMessageId) {
        await this.whatsappMessagesRepository.updateStatus(
          dbMessageId,
          'unrecognized',
        );
      }

      return {
        ok: true,
        handled: false,
      };
    }

    try {
      const result = await strategy.execute(context);

      if (result.reply) {
        await this.messageResponseService.sendReply(
          message.phoneNumber,
          result.reply,
        );
      }

      if (dbMessageId) {
        await this.whatsappMessagesRepository.updateStatus(
          dbMessageId,
          result.status ?? 'processed',
        );
      }

      return {
        ok: true,
        handled: result.handled,
        status: result.status,
        transactionId: result.transactionId,
        pendingTransactionId: result.pendingTransactionId,
      };
    } catch (error) {
      if (dbMessageId) {
        await this.whatsappMessagesRepository.updateStatus(
          dbMessageId,
          'failed',
        );
      }
      throw error;
    }
  }
}
