import { Injectable } from '@nestjs/common';

import type { IncomingWhatsAppMessage } from './types';

@Injectable()
export class MetaService {
  private readonly graphVersion =
    process.env.WHATSAPP_GRAPH_API_VERSION || 'v23.0';

  normalizePhone(phone: string) {
    return phone.replace(/\D/g, '');
  }

  parseMetaWebhook(payload: unknown): IncomingWhatsAppMessage[] {
    const messages: IncomingWhatsAppMessage[] = [];

    const root = payload as {
      entry?: Array<{
        changes?: Array<{
          value?: {
            messages?: Array<{
              id?: string;
              from?: string;
              type?: string;
              text?: {
                body?: string;
              };
              audio?: {
                id?: string;
              };
            }>;
          };
        }>;
      }>;
    };

    for (const entry of root.entry ?? []) {
      for (const change of entry.changes ?? []) {
        for (const message of change.value?.messages ?? []) {
          if (!message.id || !message.from) {
            continue;
          }

          if (message.type === 'text' && message.text?.body) {
            messages.push({
              providerMessageId: message.id,
              phoneNumber: this.normalizePhone(message.from),
              type: 'text',
              text: message.text.body,
              payload,
            });
          }

          if (message.type === 'audio' && message.audio?.id) {
            messages.push({
              providerMessageId: message.id,
              phoneNumber: this.normalizePhone(message.from),
              type: 'audio',
              mediaId: message.audio.id,
              payload,
            });
          }
        }
      }
    }

    return messages;
  }

  private getMetaConfig() {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
      throw new Error(
        'WHATSAPP_ACCESS_TOKEN e WHATSAPP_PHONE_NUMBER_ID são obrigatórios.',
      );
    }

    return {
      token,
      phoneNumberId,
    };
  }

  async sendWhatsAppText(to: string, body: string) {
    if (process.env.WHATSAPP_DRY_RUN === 'true') {
      console.log(`[WHATSAPP DRY RUN] Para: ${to} | Mensagem: ${body}`);

      return {
        dryRun: true,
        to,
        body,
      };
    }
    const { token, phoneNumberId } = this.getMetaConfig();

    const response = await fetch(
      `https://graph.facebook.com/${this.graphVersion}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: {
            body,
          },
        }),
      },
    );

    if (!response.ok) {
      const responseBody = await response.text();

      throw new Error(
        `Falha ao enviar WhatsApp: ${response.status} ${responseBody}`,
      );
    }

    return response.json();
  }

  async downloadWhatsAppMedia(mediaId: string) {
    const { token } = this.getMetaConfig();

    const metadataResponse = await fetch(
      `https://graph.facebook.com/${this.graphVersion}/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!metadataResponse.ok) {
      throw new Error(`Falha ao obter mídia: ${metadataResponse.status}`);
    }

    const metadata = (await metadataResponse.json()) as {
      url?: string;
      mime_type?: string;
    };

    if (!metadata.url) {
      throw new Error('Meta não retornou URL da mídia.');
    }

    const mediaResponse = await fetch(metadata.url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!mediaResponse.ok) {
      throw new Error(`Falha ao baixar mídia: ${mediaResponse.status}`);
    }

    return {
      bytes: await mediaResponse.arrayBuffer(),
      mimeType:
        metadata.mime_type ||
        mediaResponse.headers.get('content-type') ||
        'audio/ogg',
    };
  }
}
