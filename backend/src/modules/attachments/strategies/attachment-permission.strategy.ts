import { AttachmentPermissionContext } from '../interfaces/attachment-permission-context.interface';

export interface AttachmentPermissionStrategy {
  canReplace(context: AttachmentPermissionContext): boolean;
  canDelete(context: AttachmentPermissionContext): boolean;
}
