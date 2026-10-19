import { BadRequestException, Injectable } from '@nestjs/common';
import { TranscriptionService } from '../../ai/transcription.service';

@Injectable()
export class WhatsappMediaService {
  constructor(private readonly transcriptionService: TranscriptionService) {}

  async transcribeUploadedAudio(file: {
    buffer?: Buffer;
    mimetype?: string;
    originalname?: string;
  }): Promise<string> {
    if (!file?.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Nenhum arquivo de áudio foi recebido.');
    }

    const rawArrayBuffer = file.buffer.buffer.slice(
      file.buffer.byteOffset,
      file.buffer.byteOffset + file.buffer.byteLength,
    ) as ArrayBuffer;

    const transcription = await this.transcriptionService.transcribeAudio(
      rawArrayBuffer,
      file.mimetype || 'audio/webm',
      file.originalname || 'whatsapp-demo.webm',
    );

    const normalizedText = transcription.trim();

    if (!normalizedText) {
      throw new BadRequestException(
        'Ops! Não consegui entender o áudio 🎙️. Tente gravar mais perto do microfone ou envie por texto.',
      );
    }

    return normalizedText;
  }
}
