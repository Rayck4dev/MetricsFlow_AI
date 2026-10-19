import { Injectable, Logger } from '@nestjs/common';

import { TranscriptionService } from '../../ai/transcription.service';
import { MetaService } from '../meta.service';

export interface PreparedMessageContent {
  normalizedText: string;
  transcription: string | null;
  errorStatus?: 'transcription_failed' | 'empty_transcription';
  errorReply?: string;
}

@Injectable()
export class MessageContentService {
  private readonly logger = new Logger(MessageContentService.name);

  constructor(
    private readonly metaService: MetaService,
    private readonly transcriptionService: TranscriptionService,
  ) {}

  async prepare(
    messageType: string,
    messageText: string | null,
    mediaId: string | null,
    providerMessageId: string,
  ): Promise<PreparedMessageContent> {
    if (messageType === 'text') {
      return {
        normalizedText: messageText?.trim() ?? '',
        transcription: null,
      };
    }

    if (messageType !== 'audio') {
      return {
        normalizedText: '',
        transcription: null,
        errorReply:
          'Ops! No momento, consigo processar apenas mensagens de texto e áudio.',
      };
    }

    if (!mediaId) {
      return {
        normalizedText: '',
        transcription: null,
        errorStatus: 'transcription_failed',
        errorReply:
          'Ops! Não consegui acessar o arquivo de áudio. Poderia enviar novamente ou digitar por texto?',
      };
    }

    try {
      const media = await this.metaService.downloadWhatsAppMedia(mediaId);

      if (!media.bytes || media.bytes.byteLength === 0) {
        return {
          normalizedText: '',
          transcription: null,
          errorStatus: 'transcription_failed',
          errorReply:
            'Ops! Não consegui acessar o arquivo de áudio. Poderia enviar novamente ou digitar por texto?',
        };
      }

      const transcription = await this.transcriptionService.transcribeAudio(
        media.bytes,
        media.mimeType,
        `whatsapp-${providerMessageId}.ogg`,
      );

      const normalizedText = transcription.trim();

      if (!normalizedText) {
        return {
          normalizedText: '',
          transcription: null,
          errorStatus: 'empty_transcription',
          errorReply:
            'Desculpe, o áudio ficou um pouco abafado 😅. Tente gravar novamente ou envie por texto.',
        };
      }

      return {
        normalizedText,
        transcription: normalizedText,
      };
    } catch (error) {
      this.logger.error(
        'Falha ao preparar mensagem de áudio do WhatsApp.',
        error instanceof Error ? error.stack : undefined,
      );

      return {
        normalizedText: '',
        transcription: null,
        errorStatus: 'transcription_failed',
        errorReply:
          'Ops! Tive um probleminha ao transcrever o áudio 🎙️. Tente gravar novamente ou enviar a mensagem por texto.',
      };
    }
  }
}
