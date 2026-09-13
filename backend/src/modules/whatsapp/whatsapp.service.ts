import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';

import { ParserService } from '../ai/parser.service';
import { CategoriesService } from '../categories/categories.service';
import { CompaniesService } from '../companies/companies.service';
import { SupabaseService } from '../supabase.service';

import type { ConfirmWhatsappDto } from './dto/confirm-whatsapp.dto';
import type { ConnectWhatsappDto } from './dto/connect-whatsapp.dto';
import { MetaService } from './meta.service';
import { ProcessMessageService } from './process-message.service';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly categoriesService: CategoriesService,
    private readonly supabaseService: SupabaseService,
    private readonly parserService: ParserService,
    private readonly metaService: MetaService,
    private readonly processMessageService: ProcessMessageService,
  ) {}

  async processDemoMessage(text: string, user: User) {
    const companies = await this.companiesService.findByUser(user.id);

    if (!companies.length) {
      throw new BadRequestException(
        'Usuário não está vinculado a uma empresa.',
      );
    }

    const company = companies[0];

    const categories = await this.categoriesService.findByCompany(
      {
        company_id: company.id,
      },
      user.id,
    );

    const parsed = await this.parserService.parseWhatsAppMessage(
      text,
      categories,
    );

    return {
      ok: true,
      message: text,
      userId: user.id,
      companyId: company.id,
      companyName: company.name,
      categories,
      parsed,
    };
  }

  async confirmTransaction(body: ConfirmWhatsappDto, user: User) {
    const parsed = body.parsed;

    if (!parsed || parsed.intent !== 'create_transaction') {
      throw new BadRequestException('Movimentação inválida.');
    }

    if (parsed.missingFields.length > 0) {
      throw new BadRequestException('Ainda existem informações pendentes.');
    }

    if (
      !parsed.type ||
      !parsed.amount ||
      parsed.amount <= 0 ||
      !parsed.description ||
      !parsed.categoryId ||
      !parsed.paymentMethod ||
      !parsed.transactionDate
    ) {
      throw new BadRequestException('Dados insuficientes para confirmar.');
    }

    const companies = await this.companiesService.findByUser(user.id);

    if (!companies.length) {
      throw new BadRequestException('Empresa não encontrada.');
    }

    const company = companies[0];

    const categories = await this.categoriesService.findByCompany(
      {
        company_id: company.id,
      },
      user.id,
    );

    const category = categories.find((item) => item.id === parsed.categoryId);

    if (!category || category.type !== parsed.type) {
      throw new BadRequestException('Categoria inválida para esta empresa.');
    }

    const supabase = this.supabaseService.getClient();

    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        company_id: company.id,
        category_id: parsed.categoryId,
        created_by_user_id: user.id,
        type: parsed.type,
        amount: parsed.amount,
        description: parsed.description,
        payment_method: parsed.paymentMethod,
        transaction_date: parsed.transactionDate,
        origin: 'whatsapp',
        raw_whatsapp_text: body.rawText ?? parsed.description,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      ok: true,
      transactionId: transaction.id,
    };
  }

  async getConnection(user: User) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('whatsapp_connections')
      .select('id,phone_number,status,verified_at,company_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return {
      connection: data ?? null,
    };
  }

  async connectWhatsApp(body: ConnectWhatsappDto, user: User) {
    const phoneNumber = body.phoneNumber ?? '';

    const normalized = this.metaService.normalizePhone(phoneNumber);

    if (normalized.length < 10) {
      throw new BadRequestException('Informe o número com DDI e DDD.');
    }

    const companies = await this.companiesService.findByUser(user.id);

    if (!companies.length) {
      throw new BadRequestException(
        'Usuário não está vinculado a uma empresa.',
      );
    }

    const company = companies[0];

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('whatsapp_connections')
      .upsert(
        {
          user_id: user.id,
          company_id: company.id,
          phone_number: normalized,
          status: 'verified',
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,company_id',
        },
      )
      .select('id,phone_number,status,verified_at,company_id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      ok: true,
      connection: data,
    };
  }

  async verifyWebhook(mode: string, token: string, challenge: string) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === 'subscribe' && token && token === verifyToken && challenge) {
      return challenge;
    }

    throw new UnauthorizedException('Webhook verification failed');
  }

  async receiveWebhook(
    request: Request & {
      rawBody?: Buffer;
    },
    body: unknown,
  ) {
    const rawBody = request.rawBody;

    if (!rawBody) {
      throw new BadRequestException('Raw body não disponível.');
    }

    const signature = request.headers['x-hub-signature-256'];

    const signatureValue = Array.isArray(signature) ? signature[0] : signature;

    const isValid = this.isValidMetaSignature(rawBody, signatureValue ?? null);

    if (!isValid) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const messages = this.metaService.parseMetaWebhook(body);

    if (!messages.length) {
      return {
        ok: true,
        ignored: true,
      };
    }

    const results: Array<Record<string, unknown>> = [];

    for (const message of messages) {
      try {
        results.push(
          await this.processMessageService.processIncomingWhatsAppMessage(
            message,
          ),
        );
      } catch (error) {
        console.error('Erro ao processar mensagem WhatsApp:', error);

        results.push({
          status: 'failed',
        });
      }
    }

    return {
      ok: true,
      results,
    };
  }

  private isValidMetaSignature(rawBody: Buffer, signature: string | null) {
    console.log({
      hasAppSecret: Boolean(process.env.WHATSAPP_APP_SECRET),
      nodeEnv: process.env.NODE_ENV,
      hasSignature: Boolean(signature),
    });

    const appSecret = process.env.WHATSAPP_APP_SECRET;

    if (!appSecret) {
      return process.env.NODE_ENV !== 'production';
    }

    if (!signature?.startsWith('sha256=')) {
      return false;
    }

    const expected = `sha256=${createHmac('sha256', appSecret)
      .update(rawBody)
      .digest('hex')}`;

    const expectedBuffer = Buffer.from(expected);

    const receivedBuffer = Buffer.from(signature);

    return (
      expectedBuffer.length === receivedBuffer.length &&
      timingSafeEqual(expectedBuffer, receivedBuffer)
    );
  }
}
