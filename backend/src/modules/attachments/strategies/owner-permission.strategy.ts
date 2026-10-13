import { Injectable } from '@nestjs/common';
import { AttachmentPermissionContext } from '../interfaces/attachment-permission-context.interface';
import { AttachmentPermissionStrategy } from './attachment-permission.strategy';

@Injectable()
export class OwnerPermissionStrategy implements AttachmentPermissionStrategy {
  canReplace(_context: AttachmentPermissionContext): boolean {
    return true;
  }

  canDelete(_context: AttachmentPermissionContext): boolean {
    return true;
  }
}
