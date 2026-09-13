import { Injectable } from '@nestjs/common';

@Injectable()
export class TranscriptionService {
  async transcribeAudio(
    bytes: ArrayBuffer,
    mimeType = 'audio/ogg',
    fileName = 'whatsapp-audio.ogg',
  ): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY é obrigatória para transcrever áudio.');
    }

    const form = new FormData();

    form.append(
      'file',
      new Blob([bytes], {
        type: mimeType,
      }),
      fileName,
    );

    form.append(
      'model',
      process.env.OPENAI_TRANSCRIPTION_MODEL || 'gpt-4o-transcribe',
    );

    form.append('language', 'pt');

    const response = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: form,
      },
    );

    if (!response.ok) {
      const body = await response.text();

      throw new Error(
        `Falha na transcrição (${response.status}): ${body.slice(0, 300)}`,
      );
    }

    const data = (await response.json()) as {
      text?: string;
    };

    if (!data.text?.trim()) {
      throw new Error('A transcrição retornou vazia.');
    }

    return data.text.trim();
  }
}
