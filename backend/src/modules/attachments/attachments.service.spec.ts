import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { SupabaseService } from '../supabase.service';
import { AttachmentsRepository } from './repositories/attachments.repository';
import { AttachmentPermissionService } from './strategies/attachment-permission.service';

describe('AttachmentsService', () => {
  let service: AttachmentsService;

  let repository: {
    findTransaction: jest.Mock;
    findMembership: jest.Mock;
    findByTransactionId: jest.Mock;
    saveMetadata: jest.Mock;
    findById: jest.Mock;
    deleteMetadata: jest.Mock;
  };

  let permissionService: {
    assertCanReplace: jest.Mock;
    assertCanDelete: jest.Mock;
  };

  let storage: {
    upload: jest.Mock;
    remove: jest.Mock;
    createSignedUrl: jest.Mock;
  };

  const transactionId = '9662b535-d8b1-483e-b912-e6824b18b691';
  const attachmentId = '05de9f42-de9b-4f44-8ba8-e9a56a8d0fad';
  const companyId = '11111111-1111-4111-8111-111111111111';
  const userId = 'f7104380-3aa5-4b7d-896e-abda7881402b';

  const validPdf = (): Express.Multer.File => {
    const buffer = Buffer.from('%PDF-1.7\nconteudo de teste');

    return {
      fieldname: 'file',
      originalname: 'comprovante.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      size: buffer.length,
      buffer,
      destination: '',
      filename: 'comprovante.pdf',
      path: '',
      stream: undefined as never,
    };
  };

  const transaction = {
    id: transactionId,
    company_id: companyId,
  };

  const membership = {
    id: 'membership-id',
    role: 'owner',
  };

  const savedAttachment = {
    id: attachmentId,
    transaction_id: transactionId,
    company_id: companyId,
    file_name: 'comprovante.pdf',
    object_key: `${companyId}/${transactionId}/arquivo.pdf`,
    content_type: 'application/pdf',
    size_bytes: validPdf().size,
    uploaded_by_user_id: userId,
    created_at: '2026-10-13T12:00:00.000Z',
  };

  beforeEach(() => {
    repository = {
      findTransaction: jest.fn().mockResolvedValue({
        data: transaction,
        error: null,
      }),
      findMembership: jest.fn().mockResolvedValue({
        data: membership,
        error: null,
      }),
      findByTransactionId: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
      saveMetadata: jest.fn().mockResolvedValue({
        data: savedAttachment,
        error: null,
      }),
      findById: jest.fn().mockResolvedValue({
        data: savedAttachment,
        error: null,
      }),
      deleteMetadata: jest.fn().mockResolvedValue({
        error: null,
      }),
    };

    permissionService = {
      assertCanReplace: jest.fn(),
      assertCanDelete: jest.fn(),
    };

    storage = {
      upload: jest.fn().mockResolvedValue({ error: null }),
      remove: jest.fn().mockResolvedValue({ error: null }),
      createSignedUrl: jest.fn().mockResolvedValue({
        data: { signedUrl: 'https://example.test/download' },
        error: null,
      }),
    };

    const supabaseService = {
      getClient: jest.fn().mockReturnValue({
        storage: {
          from: jest.fn().mockReturnValue(storage),
        },
      }),
    };

    service = new AttachmentsService(
      supabaseService as unknown as SupabaseService,
      repository as unknown as AttachmentsRepository,
      permissionService as unknown as AttachmentPermissionService,
    );
  });

  describe('upload', () => {
    it('deve rejeitar arquivo ausente', async () => {
      await expect(
        service.upload(transactionId, userId, undefined as never),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('deve rejeitar arquivo vazio', async () => {
      const file = validPdf();
      file.size = 0;

      await expect(
        service.upload(transactionId, userId, file),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('deve rejeitar arquivo maior que 5 MB', async () => {
      const file = validPdf();
      file.size = 5 * 1024 * 1024 + 1;

      await expect(
        service.upload(transactionId, userId, file),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('deve rejeitar tipo MIME não permitido', async () => {
      const file = validPdf();
      file.mimetype = 'text/plain';

      await expect(
        service.upload(transactionId, userId, file),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('deve rejeitar PDF com assinatura inválida', async () => {
      const file = validPdf();
      file.buffer = Buffer.from('isto nao e um PDF');
      file.size = file.buffer.length;

      await expect(
        service.upload(transactionId, userId, file),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('deve rejeitar transação inexistente', async () => {
      repository.findTransaction.mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(
        service.upload(transactionId, userId, validPdf()),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('deve rejeitar usuário que não pertence à empresa', async () => {
      repository.findMembership.mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(
        service.upload(transactionId, userId, validPdf()),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('deve enviar PDF válido e salvar os metadados', async () => {
      const result = await service.upload(transactionId, userId, validPdf());

      expect(storage.upload).toHaveBeenCalledTimes(1);
      expect(repository.saveMetadata).toHaveBeenCalledWith(
        expect.objectContaining({
          transaction_id: transactionId,
          company_id: companyId,
          content_type: 'application/pdf',
          uploaded_by_user_id: userId,
        }),
      );

      expect(result.message).toBe('Comprovante enviado com sucesso.');
      expect(result.attachment.id).toBe(attachmentId);
    });

    it('deve negar substituição quando a regra de permissão bloquear', async () => {
      repository.findByTransactionId.mockResolvedValue({
        data: {
          ...savedAttachment,
          uploaded_by_user_id: 'outro-usuario',
        },
        error: null,
      });

      permissionService.assertCanReplace.mockImplementation(() => {
        throw new ForbiddenException();
      });

      await expect(
        service.upload(transactionId, userId, validPdf()),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(storage.upload).not.toHaveBeenCalled();
      expect(repository.saveMetadata).not.toHaveBeenCalled();
    });

    it('deve limpar o arquivo do Storage se salvar metadados falhar', async () => {
      repository.saveMetadata.mockResolvedValue({
        data: null,
        error: { message: 'Falha simulada' },
      });

      await expect(
        service.upload(transactionId, userId, validPdf()),
      ).rejects.toBeInstanceOf(InternalServerErrorException);

      expect(storage.upload).toHaveBeenCalledTimes(1);
      expect(storage.remove).toHaveBeenCalledTimes(1);
    });

    it('deve remover o arquivo do Storage quando falhar ao salvar os metadados', async () => {
      repository.findTransaction.mockResolvedValue({
        data: transaction,
        error: null,
      });

      repository.findMembership.mockResolvedValue({
        data: membership,
        error: null,
      });

      repository.findByTransactionId.mockResolvedValue({
        data: null,
        error: null,
      });

      repository.saveMetadata.mockResolvedValue({
        data: null,
        error: { message: 'Erro ao salvar metadados' },
      });

      await expect(
        service.upload(transactionId, userId, validPdf()),
      ).rejects.toBeInstanceOf(InternalServerErrorException);

      expect(storage.upload).toHaveBeenCalledTimes(1);
      expect(storage.remove).toHaveBeenCalledTimes(1);
    });

    it('deve registrar erro se falhar a limpeza após falha nos metadados', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      repository.findTransaction.mockResolvedValue({
        data: transaction,
        error: null,
      });

      repository.findMembership.mockResolvedValue({
        data: membership,
        error: null,
      });

      repository.findByTransactionId.mockResolvedValue({
        data: null,
        error: null,
      });

      repository.saveMetadata.mockResolvedValue({
        data: null,
        error: { message: 'Erro ao salvar metadados' },
      });

      storage.remove.mockResolvedValue({
        error: { message: 'Erro ao remover arquivo' },
      });

      try {
        await expect(
          service.upload(transactionId, userId, validPdf()),
        ).rejects.toBeInstanceOf(InternalServerErrorException);

        expect(storage.remove).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Não foi possível remover o arquivo após falha ao salvar metadados.',
          { message: 'Erro ao remover arquivo' },
        );
      } finally {
        consoleErrorSpy.mockRestore();
      }
    });
  });

  describe('createDownloadUrl', () => {
    it('deve gerar URL temporária para membro autorizado', async () => {
      const result = await service.createDownloadUrl(attachmentId, userId);

      expect(storage.createSignedUrl).toHaveBeenCalledWith(
        savedAttachment.object_key,
        60,
        { download: savedAttachment.file_name },
      );

      expect(result.url).toBe('https://example.test/download');
      expect(result.expires_in).toBe(60);
    });

    it('deve negar download para usuário sem acesso à empresa', async () => {
      repository.findMembership.mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(
        service.createDownloadUrl(attachmentId, userId),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(storage.createSignedUrl).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deve excluir arquivo e metadados para usuário autorizado', async () => {
      const result = await service.delete(attachmentId, userId);

      expect(permissionService.assertCanDelete).toHaveBeenCalledWith({
        role: 'owner',
        userId,
        uploadedByUserId: userId,
      });

      expect(storage.remove).toHaveBeenCalledWith([savedAttachment.object_key]);

      expect(repository.deleteMetadata).toHaveBeenCalledWith(attachmentId);
      expect(result.message).toBe('Comprovante excluído com sucesso.');
    });

    it('deve negar exclusão quando a regra de permissão bloquear', async () => {
      permissionService.assertCanDelete.mockImplementation(() => {
        throw new ForbiddenException();
      });

      await expect(service.delete(attachmentId, userId)).rejects.toBeInstanceOf(
        ForbiddenException,
      );

      expect(storage.remove).not.toHaveBeenCalled();
      expect(repository.deleteMetadata).not.toHaveBeenCalled();
    });

    it('deve informar quando o comprovante não existe', async () => {
      repository.findById.mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(service.delete(attachmentId, userId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('deve lançar erro quando o Storage falhar no upload', async () => {
      repository.findTransaction.mockResolvedValue({
        data: transaction,
        error: null,
      });

      repository.findMembership.mockResolvedValue({
        data: membership,
        error: null,
      });

      repository.findByTransactionId.mockResolvedValue({
        data: null,
        error: null,
      });

      storage.upload.mockResolvedValue({
        error: { message: 'Storage indisponível' },
      });

      await expect(
        service.upload(transactionId, userId, validPdf()),
      ).rejects.toBeInstanceOf(InternalServerErrorException);

      expect(storage.upload).toHaveBeenCalledTimes(1);
      expect(repository.saveMetadata).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando falhar a consulta da transação', async () => {
      repository.findTransaction.mockResolvedValue({
        data: null,
        error: { message: 'Erro no banco de dados' },
      });

      await expect(
        service.upload(transactionId, userId, validPdf()),
      ).rejects.toBeInstanceOf(InternalServerErrorException);

      expect(repository.findMembership).not.toHaveBeenCalled();
      expect(storage.upload).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando falhar a consulta de associação à empresa', async () => {
      repository.findTransaction.mockResolvedValue({
        data: transaction,
        error: null,
      });

      repository.findMembership.mockResolvedValue({
        data: null,
        error: { message: 'Erro ao consultar associação' },
      });

      await expect(
        service.upload(transactionId, userId, validPdf()),
      ).rejects.toBeInstanceOf(InternalServerErrorException);

      expect(repository.findByTransactionId).not.toHaveBeenCalled();
      expect(storage.upload).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando falhar a consulta do comprovante anterior', async () => {
      repository.findTransaction.mockResolvedValue({
        data: transaction,
        error: null,
      });

      repository.findMembership.mockResolvedValue({
        data: membership,
        error: null,
      });

      repository.findByTransactionId.mockResolvedValue({
        data: null,
        error: { message: 'Erro ao consultar comprovante' },
      });

      await expect(
        service.upload(transactionId, userId, validPdf()),
      ).rejects.toBeInstanceOf(InternalServerErrorException);

      expect(storage.upload).not.toHaveBeenCalled();
      expect(repository.saveMetadata).not.toHaveBeenCalled();
    });
  });
});
