import { Injectable } from '@nestjs/common';
import { AttachmentPermissionContext } from '../interfaces/attachment-permission-context.interface';
import { AttachmentPermissionStrategy } from './attachment-permission.strategy';

@Injectable()
export class CollaboratorPermissionStrategy implements AttachmentPermissionStrategy {
  canReplace(context: AttachmentPermissionContext): boolean {
    return context.userId === context.uploadedByUserId;
  }

  canDelete(context: AttachmentPermissionContext): boolean {
    return context.userId === context.uploadedByUserId;
  }
}
