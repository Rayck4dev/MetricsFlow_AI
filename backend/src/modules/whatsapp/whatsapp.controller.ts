import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';

import { AuthGuard } from '../auth/auth.guard';

import { ConfirmWhatsappDto } from './dto/confirm-whatsapp.dto';
import { ConnectWhatsappDto } from './dto/connect-whatsapp.dto';
import { WhatsappService } from './whatsapp.service';

interface AuthenticatedRequest extends Request {
  user: User;
  rawBody?: Buffer;
}

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @UseGuards(AuthGuard)
  @Get('demo/messages')
  async getDemoMessages(@Req() request: AuthenticatedRequest) {
    return this.whatsappService.getDemoMessages(request.user);
  }

  @UseGuards(AuthGuard)
  @Post('demo')
  async processDemo(
    @Body() body: { text?: string },
    @Req() request: AuthenticatedRequest,
  ) {
    return this.whatsappService.processDemoMessage(
      body?.text ?? '',
      request.user,
    );
  }

  @UseGuards(AuthGuard)
  @Post('demo/audio')
  @UseInterceptors(
    FileInterceptor('audio', {
      limits: {
        files: 1,
        fileSize: 25 * 1024 * 1024,
      },
    }),
  )
  async processDemoAudio(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.whatsappService.processDemoAudio(file, request.user);
  }

  @UseGuards(AuthGuard)
  @Post('confirm')
  async confirm(
    @Body() body: ConfirmWhatsappDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.whatsappService.confirmTransaction(body, request.user);
  }

  @UseGuards(AuthGuard)
  @Get('connection')
  async getConnection(@Req() request: AuthenticatedRequest) {
    return this.whatsappService.getConnection(request.user);
  }

  @UseGuards(AuthGuard)
  @Post('connection')
  async connect(
    @Body() body: ConnectWhatsappDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.whatsappService.connectWhatsApp(body, request.user);
  }

  @Get('webhook')
  async verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    return this.whatsappService.verifyWebhook(mode, token, challenge);
  }

  @Post('webhook')
  async receiveWebhook(
    @Req() request: AuthenticatedRequest,
    @Body() body: unknown,
  ) {
    return this.whatsappService.receiveWebhook(request, body);
  }
}
