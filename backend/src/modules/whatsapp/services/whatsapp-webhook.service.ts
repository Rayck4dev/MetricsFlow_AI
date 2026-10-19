import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';

import { MetaService } from '../meta.service';
import { ProcessMessageService } from '../process-message.service';

@Injectable()
export class WhatsappWebhookService {
  constructor(
    private readonly metaService: MetaService,
    private readonly processMessageService: ProcessMessageService,
  ) {}

  verifyWebhook(mode: string, token: string, challenge: string): string {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (
      !verifyToken ||
      mode !== 'subscribe' ||
      !token ||
      token !== verifyToken ||
      !challenge
    ) {
      throw new UnauthorizedException('Falha na verificação do webhook.');
    }

    return challenge;
  }

  async receiveWebhook(request: Request & { rawBody?: Buffer }, body: unknown) {
    const rawBody = request.rawBody;

    if (!rawBody) {
      throw new BadRequestException(
        'Raw body não disponível para validar o webhook.',
      );
    }

    const signatureHeader = request.headers['x-hub-signature-256'];
    const signature = Array.isArray(signatureHeader)
      ? signatureHeader[0]
      : signatureHeader;

    if (!this.isValidMetaSignature(rawBody, signature ?? null)) {
      throw new UnauthorizedException('Assinatura do webhook inválida.');
    }

    const messages = this.metaService.parseMetaWebhook(body);

    if (!messages.length) {
      return {
        ok: true,
        ignored: true,
      };
    }

    const results: Array<Record<string, unknown>> = [];

    for (const message of messages) {
      try {
        const result =
          await this.processMessageService.processIncomingWhatsAppMessage(
            message,
          );

        results.push(result);
      } catch {
        results.push({
          status: 'failed',
        });
      }
    }

    return {
      ok: true,
      results,
    };
  }

  isValidMetaSignature(rawBody: Buffer, signature: string | null): boolean {
    const appSecret = process.env.WHATSAPP_APP_SECRET;

    if (!appSecret || !signature?.startsWith('sha256=')) {
      return false;
    }

    const receivedHash = signature.slice('sha256='.length);

    if (!/^[a-fA-F0-9]{64}$/.test(receivedHash)) {
      return false;
    }

    const expectedHash = createHmac('sha256', appSecret)
      .update(rawBody)
      .digest();

    const receivedHashBuffer = Buffer.from(receivedHash, 'hex');

    return (
      expectedHash.length === receivedHashBuffer.length &&
      timingSafeEqual(expectedHash, receivedHashBuffer)
    );
  }
}
