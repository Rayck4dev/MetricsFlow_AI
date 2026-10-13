import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SupabaseService } from '../supabase.service';
import { AttachmentsRepository } from './repositories/attachments.repository';
import { AttachmentPermissionService } from './strategies/attachment-permission.service';

const BUCKET = 'transaction-attachments';
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly repository: AttachmentsRepository,
    private readonly permissionService: AttachmentPermissionService,
  ) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  private async assertMembership(companyId: string, userId: string) {
    const { data, error } = await this.repository.findMembership(
      companyId,
      userId,
    );

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível verificar o acesso à empresa.',
      );
    }

    if (!data) {
      throw new ForbiddenException('Você não tem acesso a esta empresa.');
    }

    return data;
  }

  private validateFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Envie um arquivo no campo "file".');
    }

    if (!file.buffer || file.size <= 0) {
      throw new BadRequestException('O arquivo está vazio ou inválido.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('O comprovante deve ter no máximo 5 MB.');
    }

    if (
      !ALLOWED_TYPES.includes(file.mimetype as (typeof ALLOWED_TYPES)[number])
    ) {
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

  private getExtension(contentType: string): string {
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

  async upload(
    transactionId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    this.validateFile(file);

    const { data: transaction, error: transactionError } =
      await this.repository.findTransaction(transactionId);

    if (transactionError) {
      throw new InternalServerErrorException(
        'Não foi possível consultar a transação.',
      );
    }

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    const membership = await this.assertMembership(
      transaction.company_id,
      userId,
    );

    const { data: previous, error: previousError } =
      await this.repository.findByTransactionId(transactionId);

    if (previousError) {
      throw new InternalServerErrorException(
        'Não foi possível consultar o comprovante atual.',
      );
    }

    if (previous) {
      this.permissionService.assertCanReplace({
        role: membership.role,
        userId,
        uploadedByUserId: previous.uploaded_by_user_id,
      });
    }

    const extension = this.getExtension(file.mimetype);

    const objectKey = `${transaction.company_id}/${transactionId}/${randomUUID()}.${extension}`;

    const { error: uploadError } = await this.supabase.storage
      .from(BUCKET)
      .upload(objectKey, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw new InternalServerErrorException(
        'Não foi possível enviar o comprovante ao armazenamento.',
      );
    }

    const { data: saved, error: saveError } =
      await this.repository.saveMetadata({
        transaction_id: transactionId,
        company_id: transaction.company_id,
        file_name: file.originalname.replace(/[\\/]/g, '_').slice(0, 255),
        object_key: objectKey,
        content_type: file.mimetype,
        size_bytes: file.size,
        uploaded_by_user_id: userId,
      });

    if (saveError || !saved) {
      const { error: cleanupError } = await this.supabase.storage
        .from(BUCKET)
        .remove([objectKey]);

      if (cleanupError) {
        console.error(
          'Não foi possível remover o arquivo após falha ao salvar metadados.',
          cleanupError,
        );
      }

      throw new InternalServerErrorException(
        'Não foi possível registrar os dados do comprovante.',
      );
    }

    if (previous?.object_key) {
      const { error: removeOldError } = await this.supabase.storage
        .from(BUCKET)
        .remove([previous.object_key]);

      if (removeOldError) {
        console.error(
          'Não foi possível remover o comprovante anterior do Storage.',
          removeOldError,
        );
      }
    }

    return {
      message: 'Comprovante enviado com sucesso.',
      attachment: {
        id: saved.id,
        transaction_id: saved.transaction_id,
        file_name: saved.file_name,
        content_type: saved.content_type,
        size_bytes: saved.size_bytes,
        uploaded_by_user_id: saved.uploaded_by_user_id,
        created_at: saved.created_at,
      },
    };
  }

  async findByTransaction(transactionId: string, userId: string) {
    const { data: transaction, error: transactionError } =
      await this.repository.findTransaction(transactionId);

    if (transactionError) {
      throw new InternalServerErrorException(
        'Não foi possível consultar a transação.',
      );
    }

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    await this.assertMembership(transaction.company_id, userId);

    const { data, error } =
      await this.repository.findByTransactionId(transactionId);

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível consultar o comprovante.',
      );
    }

    if (!data) {
      throw new NotFoundException('Esta transação não possui comprovante.');
    }

    return {
      id: data.id,
      transaction_id: data.transaction_id,
      file_name: data.file_name,
      content_type: data.content_type,
      size_bytes: data.size_bytes,
      uploaded_by_user_id: data.uploaded_by_user_id,
      created_at: data.created_at,
    };
  }

  async createDownloadUrl(attachmentId: string, userId: string) {
    const { data: attachment, error } =
      await this.repository.findById(attachmentId);

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível consultar o comprovante.',
      );
    }

    if (!attachment) {
      throw new NotFoundException('Comprovante não encontrado.');
    }

    await this.assertMembership(attachment.company_id, userId);

    const expiresIn = 60;

    const { data, error: urlError } = await this.supabase.storage
      .from(BUCKET)
      .createSignedUrl(attachment.object_key, expiresIn, {
        download: attachment.file_name,
      });

    if (urlError || !data?.signedUrl) {
      throw new InternalServerErrorException(
        'Não foi possível gerar o link do comprovante.',
      );
    }

    return {
      url: data.signedUrl,
      expires_in: expiresIn,
      file_name: attachment.file_name,
    };
  }

  async delete(attachmentId: string, userId: string) {
    const { data: attachment, error } =
      await this.repository.findById(attachmentId);

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível consultar o comprovante.',
      );
    }

    if (!attachment) {
      throw new NotFoundException('Comprovante não encontrado.');
    }

    const membership = await this.assertMembership(
      attachment.company_id,
      userId,
    );

    this.permissionService.assertCanDelete({
      role: membership.role,
      userId,
      uploadedByUserId: attachment.uploaded_by_user_id,
    });

    const { error: storageError } = await this.supabase.storage
      .from(BUCKET)
      .remove([attachment.object_key]);

    if (storageError) {
      throw new InternalServerErrorException(
        'Não foi possível excluir o arquivo do armazenamento.',
      );
    }

    const { error: metadataError } =
      await this.repository.deleteMetadata(attachmentId);

    if (metadataError) {
      throw new InternalServerErrorException(
        'O arquivo foi removido, mas não foi possível excluir seus metadados.',
      );
    }

    return {
      message: 'Comprovante excluído com sucesso.',
    };
  }
}
