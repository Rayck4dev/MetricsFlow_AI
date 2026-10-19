import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AttachmentsRepository } from './repositories/attachments.repository';
import { AttachmentFileValidatorService } from './services/attachment-file-validator.service';
import { AttachmentStorageService } from './services/attachment-storage.service';
import { AttachmentPermissionService } from './strategies/attachment-permission.service';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly repository: AttachmentsRepository,
    private readonly permissionService: AttachmentPermissionService,
    private readonly validator: AttachmentFileValidatorService,
    private readonly storage: AttachmentStorageService,
  ) {}

  private async assertMembership(companyId: string, userId: string) {
    const { data, error } = await this.repository.findMembership(companyId, userId);
    if (error) {
      throw new InternalServerErrorException('Não foi possível verificar o acesso à empresa.');
    }
    if (!data) {
      throw new ForbiddenException('Você não tem acesso a esta empresa.');
    }
    return data;
  }

  async upload(transactionId: string, userId: string, file: Express.Multer.File) {
    this.validator.validateFile(file);

    const { data: transaction, error: transactionError } =
      await this.repository.findTransaction(transactionId);

    if (transactionError) {
      throw new InternalServerErrorException('Não foi possível consultar a transação.');
    }
    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    const membership = await this.assertMembership(transaction.company_id, userId);

    const { data: previous, error: previousError } =
      await this.repository.findByTransactionId(transactionId);

    if (previousError) {
      throw new InternalServerErrorException('Não foi possível consultar o comprovante atual.');
    }

    if (previous) {
      this.permissionService.assertCanReplace({
        role: membership.role,
        userId,
        uploadedByUserId: previous.uploaded_by_user_id,
      });
    }

    const extension = this.validator.getExtension(file.mimetype);
    const objectKey = `${transaction.company_id}/${transactionId}/${randomUUID()}.${extension}`;

    await this.storage.uploadFile(objectKey, file.buffer, file.mimetype);

    const { data: saved, error: saveError } = await this.repository.saveMetadata({
      transaction_id: transactionId,
      company_id: transaction.company_id,
      file_name: file.originalname.replace(/[\\/]/g, '_').slice(0, 255),
      object_key: objectKey,
      content_type: file.mimetype,
      size_bytes: file.size,
      uploaded_by_user_id: userId,
    });

    if (saveError || !saved) {
      await this.storage.removeFiles([objectKey]).catch(() => {});
      throw new InternalServerErrorException('Não foi possível registrar os dados do comprovante.');
    }

    if (previous?.object_key) {
      await this.storage.removeFiles([previous.object_key]).catch(() => {});
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
      throw new InternalServerErrorException('Não foi possível consultar a transação.');
    }
    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    await this.assertMembership(transaction.company_id, userId);

    const { data, error } = await this.repository.findByTransactionId(transactionId);

    if (error) {
      throw new InternalServerErrorException('Não foi possível consultar o comprovante.');
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
    const { data: attachment, error } = await this.repository.findById(attachmentId);

    if (error) {
      throw new InternalServerErrorException('Não foi possível consultar o comprovante.');
    }
    if (!attachment) {
      throw new NotFoundException('Comprovante não encontrado.');
    }

    await this.assertMembership(attachment.company_id, userId);

    const expiresIn = 60;
    const url = await this.storage.createSignedUrl(
      attachment.object_key,
      attachment.file_name,
      expiresIn,
    );

    return {
      url,
      expires_in: expiresIn,
      file_name: attachment.file_name,
    };
  }

  async delete(attachmentId: string, userId: string) {
    const { data: attachment, error } = await this.repository.findById(attachmentId);

    if (error) {
      throw new InternalServerErrorException('Não foi possível consultar o comprovante.');
    }
    if (!attachment) {
      throw new NotFoundException('Comprovante não encontrado.');
    }

    const membership = await this.assertMembership(attachment.company_id, userId);

    this.permissionService.assertCanDelete({
      role: membership.role,
      userId,
      uploadedByUserId: attachment.uploaded_by_user_id,
    });

    await this.storage.removeFiles([attachment.object_key]);

    const { error: metadataError } = await this.repository.deleteMetadata(attachmentId);

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
