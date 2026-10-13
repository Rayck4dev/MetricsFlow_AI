import { ForbiddenException } from '@nestjs/common';
import { AttachmentPermissionService } from './attachment-permission.service';
import { OwnerPermissionStrategy } from './owner-permission.strategy';
import { CollaboratorPermissionStrategy } from './collaborator-permission.strategy';
import { AttachmentPermissionContext } from '../interfaces/attachment-permission-context.interface';

describe('AttachmentPermissionService', () => {
  let service: AttachmentPermissionService;

  const owner = new OwnerPermissionStrategy();
  const collaborator = new CollaboratorPermissionStrategy();

  const context = (
    role: string,
    userId = 'user-1',
    uploadedByUserId = 'user-1',
  ): AttachmentPermissionContext => ({
    role,
    userId,
    uploadedByUserId,
  });

  beforeEach(() => {
    service = new AttachmentPermissionService(owner, collaborator);
  });

  describe('assertCanReplace', () => {
    it('permite que o proprietário substitua qualquer comprovante', () => {
      expect(() =>
        service.assertCanReplace(context('owner', 'owner-1', 'collaborator-1')),
      ).not.toThrow();
    });

    it('permite que o colaborador substitua o próprio comprovante', () => {
      expect(() =>
        service.assertCanReplace(context('collaborator', 'user-1', 'user-1')),
      ).not.toThrow();
    });

    it('bloqueia a substituição do comprovante de outra pessoa', () => {
      expect(() =>
        service.assertCanReplace(context('collaborator', 'user-1', 'user-2')),
      ).toThrow(ForbiddenException);
    });

    it('bloqueia papéis desconhecidos', () => {
      expect(() =>
        service.assertCanReplace(context('unknown', 'user-1', 'user-1')),
      ).toThrow(ForbiddenException);
    });
  });

  describe('assertCanDelete', () => {
    it('permite que o proprietário exclua qualquer comprovante', () => {
      expect(() =>
        service.assertCanDelete(context('owner', 'owner-1', 'collaborator-1')),
      ).not.toThrow();
    });

    it('permite que o colaborador exclua o próprio comprovante', () => {
      expect(() =>
        service.assertCanDelete(context('collaborator', 'user-1', 'user-1')),
      ).not.toThrow();
    });

    it('bloqueia a exclusão do comprovante de outra pessoa', () => {
      expect(() =>
        service.assertCanDelete(context('collaborator', 'user-1', 'user-2')),
      ).toThrow(ForbiddenException);
    });

    it('bloqueia papéis desconhecidos', () => {
      expect(() =>
        service.assertCanDelete(context('unknown', 'user-1', 'user-1')),
      ).toThrow(ForbiddenException);
    });
  });
});
