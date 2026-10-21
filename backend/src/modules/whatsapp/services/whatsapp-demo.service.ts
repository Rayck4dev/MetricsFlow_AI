import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { User } from '@supabase/supabase-js';

import { CategoriesService } from '../../categories/categories.service';
import { MessageGuardService } from '../message-guard.service';
import { PendingTransactionsRepository } from '../repositories/pending-transactions.repository';
import { WhatsappConnectionService } from './whatsapp-connection.service';
import { WhatsappDemoActionHandler } from './whatsapp-demo-action.handler';
import {
  PendingProposalState,
  WhatsappDemoCorrectionHandler,
} from './whatsapp-demo-correction.handler';
import { WhatsappDemoHistoryService } from './whatsapp-demo-history.service';
import { WhatsappDemoProposalHandler } from './whatsapp-demo-proposal.handler';
import { WhatsappMediaService } from './whatsapp-media.service';

@Injectable()
export class WhatsappDemoService {
  constructor(
    private readonly connectionService: WhatsappConnectionService,
    private readonly historyService: WhatsappDemoHistoryService,
    private readonly pendingRepository: PendingTransactionsRepository,
    private readonly actionHandler: WhatsappDemoActionHandler,
    private readonly categoriesService: CategoriesService,
    private readonly mediaService: WhatsappMediaService,
    private readonly messageGuardService: MessageGuardService,
    private readonly demoCorrectionHandler: WhatsappDemoCorrectionHandler,
    private readonly proposalHandler: WhatsappDemoProposalHandler,
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
    return this.historyService.recordDemoMessage(params);
  }

  async getDemoMessages(user: User) {
    return this.historyService.getDemoMessages(user);
  }

  async processDemoAudio(
    file: { buffer?: Buffer; mimetype?: string; originalname?: string },
    user: User,
  ) {
    const transcription = await this.mediaService.transcribeUploadedAudio(file);

    const result = await this.processDemoMessage(transcription, user, {
      isAudio: true,
      transcription,
    });

    return {
      ...result,
      transcription,
    };
  }

  async processDemoMessage(
    text: string,
    user: User,
    options?: { isAudio?: boolean; transcription?: string },
  ) {
    const normalizedText = text?.trim();

    if (!normalizedText) {
      throw new BadRequestException('Digite uma mensagem para continuar.');
    }

    if (normalizedText.length > 4000) {
      throw new BadRequestException(
        'A mensagem ultrapassa o limite permitido.',
      );
    }

    const company = await this.connectionService.getUserCompany(user.id);

    const { data: pendingLatest, error: pendingError } =
      await this.pendingRepository.findLatestActivePending(user.id, company.id);

    if (pendingError) {
      throw new InternalServerErrorException(
        'Não foi possível consultar as propostas pendentes.',
      );
    }

    const pending = pendingLatest as PendingProposalState | null;

    await this.recordDemoMessage({
      companyId: company.id,
      userId: user.id,
      direction: 'inbound',
      messageType: options?.isAudio ? 'audio' : 'text',
      text: normalizedText,
      transcription: options?.transcription ?? null,
      pendingTransactionId: pending?.id ?? null,
    });

    const actionResult = await this.actionHandler.tryHandleAction(
      normalizedText,
      pending,
      user.id,
      company.id,
    );

    if (actionResult) {
      if (actionResult.message || actionResult.reply) {
        const actionAny = actionResult as any;

        await this.recordDemoMessage({
          companyId: company.id,
          userId: user.id,
          direction: 'outbound',
          messageType: 'text',
          text: actionResult.message || actionResult.reply,
          pendingTransactionId:
            actionAny.pendingTransactionId ?? pending?.id ?? null,
          transactionId: actionAny.transactionId ?? null,
        });
      }
      return actionResult;
    }

    const categories = await this.categoriesService.findByCompany(
      { company_id: company.id },
      user.id,
    );

    if (
      this.demoCorrectionHandler.isSpecificCorrection(
        normalizedText,
        Boolean(pending),
      ) &&
      pending
    ) {
      const correctionResult =
        await this.demoCorrectionHandler.executeCorrection({
          pending,
          text: normalizedText,
          userId: user.id,
          companyId: company.id,
          companyName: company.name,
          categories,
        });

      if (correctionResult) {
        await this.recordDemoMessage({
          companyId: company.id,
          userId: user.id,
          direction: 'outbound',
          messageType: 'text',
          text: correctionResult.message,
          pendingTransactionId: correctionResult.pendingTransactionId,
        });
        return correctionResult;
      }
    }

    const guard = this.messageGuardService.check(
      normalizedText,
      Boolean(pending && pending.status === 'awaiting_information'),
    );

    if (!guard.allowed) {
      await this.recordDemoMessage({
        companyId: company.id,
        userId: user.id,
        direction: 'outbound',
        messageType: 'text',
        text: guard.response,
        pendingTransactionId: pending?.id ?? null,
      });

      return {
        ok: false,
        reason: guard.reason,
        message: guard.response,
        reply: guard.response,
      };
    }

    const proposalResult = await this.proposalHandler.createOrUpdateProposal({
      userId: user.id,
      companyId: company.id,
      companyName: company.name,
      normalizedText,
      pending,
      categories,
    });

    await this.recordDemoMessage({
      companyId: company.id,
      userId: user.id,
      direction: 'outbound',
      messageType: 'text',
      text: proposalResult.message,
      pendingTransactionId: proposalResult.pendingTransactionId ?? null,
    });

    return proposalResult;
  }
}
