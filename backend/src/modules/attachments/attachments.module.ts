import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SupabaseModule } from '../supabase.module';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsRepository } from './repositories/attachments.repository';
import { AttachmentsService } from './attachments.service';
import { AttachmentPermissionService } from './strategies/attachment-permission.service';
import { OwnerPermissionStrategy } from './strategies/owner-permission.strategy';
import { CollaboratorPermissionStrategy } from './strategies/collaborator-permission.strategy';

@Module({
  imports: [AuthModule, SupabaseModule],
  controllers: [AttachmentsController],
  providers: [
    AttachmentsService,
    AttachmentsRepository,
    AttachmentPermissionService,
    OwnerPermissionStrategy,
    CollaboratorPermissionStrategy,
  ],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
