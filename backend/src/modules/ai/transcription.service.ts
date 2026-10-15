import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

const MAX_AUDIO_SIZE_BYTES = 25 * 1024 * 1024;
const MAX_MIME_TYPE_LENGTH = 100;
const MAX_FILE_NAME_LENGTH = 255;

const SUPPORTED_AUDIO_TYPES = new Set([
  'audio/flac',
  'audio/m4a',
  'audio/mp3',
  'audio/mp4',
  'audio/mpeg',
  'audio/mpga',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'audio/x-m4a',
  'audio/x-wav',
]);

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);

  async transcribeAudio(
    bytes: ArrayBuffer,
    mimeType = 'audio/ogg',
    fileName = 'whatsapp-audio.ogg',
  ): Promise<string> {
    if (!(bytes instanceof ArrayBuffer)) {
      throw new BadRequestException(
        'O áudio recebido possui um formato binário inválido.',
      );
    }

    if (bytes.byteLength === 0) {
      throw new BadRequestException('O arquivo de áudio está vazio.');
    }

    if (bytes.byteLength > MAX_AUDIO_SIZE_BYTES) {
      throw new BadRequestException(
        'O áudio excede o tamanho máximo permitido de 25 MB.',
      );
    }

    if (
      typeof mimeType !== 'string' ||
      mimeType.length > MAX_MIME_TYPE_LENGTH
    ) {
      throw new BadRequestException('O tipo do arquivo de áudio é inválido.');
    }

    const normalizedMimeType = mimeType.split(';')[0].trim().toLowerCase();

    if (!SUPPORTED_AUDIO_TYPES.has(normalizedMimeType)) {
      throw new BadRequestException(
        'Formato de áudio não suportado para transcrição.',
      );
    }

    if (
      typeof fileName !== 'string' ||
      fileName.trim().length === 0 ||
      fileName.length > MAX_FILE_NAME_LENGTH
    ) {
      throw new BadRequestException('O nome do arquivo de áudio é inválido.');
    }

    const safeFileName = fileName
      .replace(/\\/g, '/')
      .split('/')
      .pop()
      ?.replace(/[\u0000-\u001F\u007F]/g, '')
      .trim();

    if (!safeFileName) {
      throw new BadRequestException('O nome do arquivo de áudio é inválido.');
    }

    const apiKey = process.env.GROQ_API_KEY;
    const baseUrl =
      process.env.GROQ_BASE_URL?.trim() || 'https://api.groq.com/openai/v1';

    if (!apiKey?.trim()) {
      this.logger.error('GROQ_API_KEY não está configurada.');

      throw new InternalServerErrorException(
        'O serviço de transcrição não está configurado.',
      );
    }

    const model =
      process.env.GROQ_TRANSCRIPTION_MODEL?.trim() || 'whisper-large-v3-turbo';

    const form = new FormData();

    form.append(
      'file',
      new Blob([bytes], { type: normalizedMimeType }),
      safeFileName,
    );

    form.append('model', model);
    form.append('language', 'pt');

    let response: Response;

    try {
      response = await fetch(`${baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: form,
        signal: AbortSignal.timeout(60_000),
      });
    } catch (error: unknown) {
      const reason =
        error instanceof Error ? error.message : 'Erro de conexão desconhecido';

      this.logger.error(`Falha de conexão com a API de transcrição: ${reason}`);

      throw new ServiceUnavailableException(
        'Não foi possível conectar ao serviço de transcrição. Tente novamente.',
      );
    }

    if (!response.ok) {
      const status = response.status;

      this.logger.error(`API de transcrição retornou status HTTP ${status}.`);

      if (status === 401 || status === 403) {
        throw new InternalServerErrorException(
          'A configuração de acesso ao serviço de transcrição é inválida.',
        );
      }

      if (status === 429) {
        throw new ServiceUnavailableException(
          'O serviço de transcrição está temporariamente indisponível. Tente novamente em instantes.',
        );
      }

      if (status >= 500) {
        throw new ServiceUnavailableException(
          'O serviço de transcrição está indisponível no momento.',
        );
      }

      if (status === 400 || status === 413 || status === 415) {
        throw new BadRequestException(
          'Não foi possível processar esse áudio. Envie outro arquivo de áudio.',
        );
      }

      throw new InternalServerErrorException(
        'Ocorreu um erro ao processar o áudio.',
      );
    }

    let data: unknown;

    try {
      data = await response.json();
    } catch {
      this.logger.error('A API de transcrição retornou JSON inválido.');

      throw new InternalServerErrorException(
        'A resposta do serviço de transcrição é inválida.',
      );
    }

    if (
      typeof data !== 'object' ||
      data === null ||
      !('text' in data) ||
      typeof data.text !== 'string'
    ) {
      this.logger.error('A resposta da transcrição não contém texto válido.');

      throw new InternalServerErrorException(
        'Não foi possível obter o texto transcrito.',
      );
    }

    const transcription = data.text.trim();

    if (!transcription) {
      throw new BadRequestException(
        'Não foi possível identificar fala nesse áudio. Tente enviar outro.',
      );
    }

    return transcription;
  }
}
