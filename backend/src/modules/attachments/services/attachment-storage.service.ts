import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase.service';

const BUCKET = 'transaction-attachments';

@Injectable()
export class AttachmentStorageService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async uploadFile(
    objectKey: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<void> {
    const { error } = await this.supabase.storage
      .from(BUCKET)
      .upload(objectKey, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível enviar o comprovante ao armazenamento.',
      );
    }
  }

  async removeFiles(objectKeys: string[]): Promise<void> {
    if (objectKeys.length === 0) return;

    const { error } = await this.supabase.storage
      .from(BUCKET)
      .remove(objectKeys);

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível excluir o arquivo do armazenamento.',
      );
    }
  }

  async createSignedUrl(
    objectKey: string,
    fileName: string,
    expiresIn = 60,
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(BUCKET)
      .createSignedUrl(objectKey, expiresIn, {
        download: fileName,
      });

    if (error || !data?.signedUrl) {
      throw new InternalServerErrorException(
        'Não foi possível gerar o link do comprovante.',
      );
    }

    return data.signedUrl;
  }
}
