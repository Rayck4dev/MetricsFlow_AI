import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AttachmentsService } from './attachments.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

@Controller()
@UseGuards(AuthGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('transactions/:transactionId/attachments')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
      },
    }),
  )
  async upload(
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('Envie um arquivo no campo "file".');
    }

    return this.attachmentsService.upload(transactionId, request.user.id, file);
  }

  @Get('transactions/:transactionId/attachments')
  async findByTransaction(
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.attachmentsService.findByTransaction(
      transactionId,
      request.user.id,
    );
  }

  @Get('attachments/:attachmentId/download')
  async download(
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.attachmentsService.createDownloadUrl(
      attachmentId,
      request.user.id,
    );
  }

  @Delete('attachments/:attachmentId')
  async delete(
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.attachmentsService.delete(attachmentId, request.user.id);
  }
}
