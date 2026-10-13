import { ForbiddenException, Injectable } from '@nestjs/common';
import { OwnerPermissionStrategy } from './owner-permission.strategy';
import { CollaboratorPermissionStrategy } from './collaborator-permission.strategy';
import { AttachmentPermissionStrategy } from './attachment-permission.strategy';
import { AttachmentPermissionContext } from '../interfaces/attachment-permission-context.interface';

@Injectable()
export class AttachmentPermissionService {
  constructor(
    private readonly ownerStrategy: OwnerPermissionStrategy,
    private readonly collaboratorStrategy: CollaboratorPermissionStrategy,
  ) {}

  private getStrategy(role: string): AttachmentPermissionStrategy {
    switch (role) {
      case 'owner':
        return this.ownerStrategy;
      case 'collaborator':
        return this.collaboratorStrategy;
      default:
        throw new ForbiddenException(
          'Seu perfil não possui permissão para esta operação.',
        );
    }
  }

  assertCanReplace(context: AttachmentPermissionContext): void {
    if (!this.getStrategy(context.role).canReplace(context)) {
      throw new ForbiddenException(
        'Você só pode substituir comprovantes enviados por você, a menos que seja proprietário da empresa.',
      );
    }
  }

  assertCanDelete(context: AttachmentPermissionContext): void {
    if (!this.getStrategy(context.role).canDelete(context)) {
      throw new ForbiddenException(
        'Você só pode excluir comprovantes enviados por você, a menos que seja proprietário da empresa.',
      );
    }
  }
}
