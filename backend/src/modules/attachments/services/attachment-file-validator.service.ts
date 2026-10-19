import { BadRequestException, Injectable } from '@nestjs/common';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const;

export type AllowedContentType = (typeof ALLOWED_TYPES)[number];

@Injectable()
export class AttachmentFileValidatorService {
  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Envie um arquivo no campo "file".');
    }

    if (!file.buffer || file.size <= 0) {
      throw new BadRequestException('O arquivo está vazio ou inválido.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('O comprovante deve ter no máximo 5 MB.');
    }

    if (!ALLOWED_TYPES.includes(file.mimetype as AllowedContentType)) {
      throw new BadRequestException(
        'Formato inválido. Envie um PDF, JPEG ou PNG.',
      );
    }

    const signature = file.buffer;

    const isPdf =
      file.mimetype === 'application/pdf' &&
      signature.subarray(0, 5).toString() === '%PDF-';

    const isJpeg =
      file.mimetype === 'image/jpeg' &&
      signature.length >= 3 &&
      signature[0] === 0xff &&
      signature[1] === 0xd8 &&
      signature[2] === 0xff;

    const isPng =
      file.mimetype === 'image/png' &&
      signature.length >= 8 &&
      signature
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));

    if (!isPdf && !isJpeg && !isPng) {
      throw new BadRequestException(
        'O conteúdo do arquivo não corresponde ao formato informado.',
      );
    }
  }

  getExtension(contentType: string): string {
    switch (contentType) {
      case 'application/pdf':
        return 'pdf';

      case 'image/jpeg':
        return 'jpg';

      case 'image/png':
        return 'png';

      default:
        throw new BadRequestException('Formato de arquivo não permitido.');
    }
  }
}
