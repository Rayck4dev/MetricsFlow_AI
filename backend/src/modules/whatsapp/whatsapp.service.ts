import { BadRequestException, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';

import type { ConfirmWhatsappDto } from './dto/confirm-whatsapp.dto';
import type { ConnectWhatsappDto } from './dto/connect-whatsapp.dto';
import { PendingTransactionService } from './services/pending-transaction.service';
import { WhatsappConnectionService } from './services/whatsapp-connection.service';
import { WhatsappDemoService } from './services/whatsapp-demo.service';
import { WhatsappWebhookService } from './services/whatsapp-webhook.service';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly connectionService: WhatsappConnectionService,
    private readonly demoService: WhatsappDemoService,
    private readonly webhookService: WhatsappWebhookService,
    private readonly pendingTransactionService: PendingTransactionService,
  ) {}

  async getDemoMessages(user: User) {
    return this.demoService.getDemoMessages(user);
  }

  async processDemoAudio(
    file: { buffer?: Buffer; mimetype?: string; originalname?: string },
    user: User,
  ) {
    return this.demoService.processDemoAudio(file, user);
  }

  async processDemoMessage(
    text: string,
    user: User,
    options?: { isAudio?: boolean; transcription?: string },
  ) {
    return this.demoService.processDemoMessage(text, user, options);
  }

  async confirmTransaction(body: ConfirmWhatsappDto, user: User) {
    const pendingId =
      body?.pendingTransactionId || body?.pending_transaction_id;

    if (!pendingId) {
      throw new BadRequestException('Informe o identificador da proposta.');
    }

    const company = await this.connectionService.getUserCompany(user.id);

    const transactionId = await this.pendingTransactionService.confirm(
      pendingId,
      user.id,
      company.id,
    );

    return {
      ok: true,
      transactionId,
      message: 'Movimentação confirmada com sucesso.',
    };
  }

  async getConnection(user: User) {
    return this.connectionService.getConnection(user);
  }

  async connectWhatsApp(body: ConnectWhatsappDto, user: User) {
    return this.connectionService.connectWhatsApp(body, user);
  }

  verifyWebhook(mode: string, token: string, challenge: string): string {
    return this.webhookService.verifyWebhook(mode, token, challenge);
  }

  async receiveWebhook(request: Request & { rawBody?: Buffer }, body: unknown) {
    return this.webhookService.receiveWebhook(request, body);
  }
}
