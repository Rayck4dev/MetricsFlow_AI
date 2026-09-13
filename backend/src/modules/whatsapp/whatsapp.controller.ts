import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';

import { AuthGuard } from '../auth/auth.guard';

import type { ConfirmWhatsappDto } from './dto/confirm-whatsapp.dto';
import type { ConnectWhatsappDto } from './dto/connect-whatsapp.dto';
import { WhatsappService } from './whatsapp.service';

interface AuthenticatedRequest extends Request {
  user: User;
  rawBody?: Buffer;
}

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @UseGuards(AuthGuard)
  @Post('demo')
  async processDemo(
    @Body('text') text: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.whatsappService.processDemoMessage(text, request.user);
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
