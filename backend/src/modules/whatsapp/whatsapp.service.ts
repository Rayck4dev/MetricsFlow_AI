import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';

import { ParserService } from '../ai/parser.service';
import { TranscriptionService } from '../ai/transcription.service';
import { CategoriesService } from '../categories/categories.service';
import { CompaniesService } from '../companies/companies.service';
import { SupabaseService } from '../supabase.service';

import type { ConfirmWhatsappDto } from './dto/confirm-whatsapp.dto';
import type { ConnectWhatsappDto } from './dto/connect-whatsapp.dto';
import { MessageGuardService } from './message-guard.service';
import { MetaService } from './meta.service';
import { ProcessMessageService } from './process-message.service';
import {
  formatConfirmation,
  missingQuestion,
  normalizeParsedMessage,
} from './services/financial-message.utils';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly categoriesService: CategoriesService,
    private readonly supabaseService: SupabaseService,
    private readonly parserService: ParserService,
    private readonly transcriptionService: TranscriptionService,
    private readonly messageGuardService: MessageGuardService,
    private readonly metaService: MetaService,
    private readonly processMessageService: ProcessMessageService,
  ) {}

  private async recordDemoMessage(params: {
    companyId: string;
    userId: string;
    direction: 'inbound' | 'outbound';
    messageType: string;
    text?: string | null;
    transcription?: string | null;
    pendingTransactionId?: string | null;
    transactionId?: string | null;
  }) {
    const supabase = this.supabaseService.getClient();
    const providerMessageId = `demo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const { data, error } = await supabase
      .from('whatsapp_messages')
      .insert({
        company_id: params.companyId,
        user_id: params.userId,
        provider_message_id: providerMessageId,
        phone_number: 'demo',
        direction: params.direction,
        message_type: params.messageType,
        message_text: params.text ?? null,
        transcription: params.transcription ?? null,
        pending_transaction_id: params.pendingTransactionId ?? null,
        transaction_id: params.transactionId ?? null,
        status: 'processed',
      })
      .select('id, created_at')
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível salvar a mensagem da demonstração.',
      );
    }

    return data;
  }

  async getDemoMessages(user: User) {
    const company = await this.getUserCompany(user.id);
    const supabase = this.supabaseService.getClient();

    const welcomeText =
      'Oi! 👋 Sou o assistente financeiro da MetricsFlow AI. Posso ajudar a registrar receitas e despesas do seu negócio. Por exemplo: "Recebi R$ 350 por uma venda via Pix". Vamos registrar sua próxima movimentação?';

    const { data: history, error: historyError } = await supabase
      .from('whatsapp_messages')
      .select(
        'id, direction, message_type, message_text, transcription, status, pending_transaction_id, transaction_id, created_at',
      )
      .eq('user_id', user.id)
      .eq('company_id', company.id)
      .eq('phone_number', 'demo')
      .order('created_at', { ascending: false })
      .limit(100);

    if (historyError) {
      throw new InternalServerErrorException(
        'Não foi possível carregar o histórico da demonstração.',
      );
    }

    const { data: pending, error: pendingError } = await supabase
      .from('pending_transactions')
      .select(
        'id,type,amount,description,category_id,category_name,payment_method,transaction_date,raw_message,missing_fields,status,expires_at',
      )
      .eq('user_id', user.id)
      .eq('company_id', company.id)
      .in('status', ['awaiting_information', 'awaiting_confirmation'])
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pendingError) {
      throw new InternalServerErrorException(
        'Não foi possível carregar a proposta pendente da demonstração.',
      );
    }

    const formattedMessages = [...(history ?? [])].reverse().map((m, index) => {
      const date = new Date(m.created_at);
      const time = !Number.isNaN(date.getTime())
        ? date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '12:00';

      return {
        id: index + 1,
        mine: m.direction === 'inbound',
        messageType: m.message_type,
        text: m.message_text ?? m.transcription ?? '',
        transcription: m.transcription ?? null,
        time,
        status: 'read' as const,
        pendingTransactionId: m.pending_transaction_id,
        transactionId: m.transaction_id,
        createdAt: m.created_at,
      };
    });

    const seenBotMessages = new Set<string>();
    const uniqueMessages = formattedMessages.filter((m) => {
      if (m.mine) return true;
      const normalizedText = m.text.trim();
      if (seenBotMessages.has(normalizedText)) {
        return false;
      }
      seenBotMessages.add(normalizedText);
      return true;
    });

    if (uniqueMessages.length === 0) {
      return {
        welcomeMessage: welcomeText,
        messages: [
          {
            id: 1,
            mine: false,
            messageType: 'text',
            text: welcomeText,
            time: new Date().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: 'read' as const,
            createdAt: new Date().toISOString(),
          },
        ],
        pending: pending ?? null,
        company: { id: company.id, name: company.name },
      };
    }

    return {
      welcomeMessage: welcomeText,
      messages: uniqueMessages,
      pending: pending ?? null,
      company: { id: company.id, name: company.name },
    };
  }

  async processDemoAudio(
    file: { buffer?: Buffer; mimetype?: string; originalname?: string },
    user: User,
  ) {
    if (!file?.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Nenhum arquivo de áudio foi recebido.');
    }

    const rawArrayBuffer = file.buffer.buffer.slice(
      file.buffer.byteOffset,
      file.buffer.byteOffset + file.buffer.byteLength,
    ) as ArrayBuffer;

    const transcription = await this.transcriptionService.transcribeAudio(
      rawArrayBuffer,
      file.mimetype || 'audio/webm',
      file.originalname || 'whatsapp-demo.webm',
    );

    const normalizedText = transcription.trim();
    if (!normalizedText) {
      throw new BadRequestException(
        'Não consegui entender o áudio. Tente falar mais perto do microfone ou envie por texto.',
      );
    }

    const result = await this.processDemoMessage(normalizedText, user, {
      isAudio: true,
      transcription: normalizedText,
    });

    return {
      ...result,
      transcription: normalizedText,
    };
  }

  async processDemoMessage(
    text: string,
    user: User,
    options?: { isAudio?: boolean; transcription?: string },
  ) {
    const normalizedText = text?.trim();

    if (!normalizedText) {
      throw new BadRequestException('Digite uma mensagem para continuar.');
    }

    if (normalizedText.length > 4000) {
      throw new BadRequestException(
        'A mensagem ultrapassa o limite permitido.',
      );
    }

    const company = await this.getUserCompany(user.id);
    const supabase = this.supabaseService.getClient();

    const { data: pendingLatest, error: pendingError } = await supabase
      .from('pending_transactions')
      .select(
        'id,type,amount,description,category_id,category_name,payment_method,transaction_date,raw_message,missing_fields,status,expires_at',
      )
      .eq('user_id', user.id)
      .eq('company_id', company.id)
      .in('status', ['awaiting_information', 'awaiting_confirmation'])
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pendingError) {
      throw new InternalServerErrorException(
        'Não foi possível consultar as propostas pendentes.',
      );
    }

    const pending = pendingLatest;
    await this.recordDemoMessage({
      companyId: company.id,
      userId: user.id,
      direction: 'inbound',
      messageType: options?.isAudio ? 'audio' : 'text',
      text: normalizedText,
      transcription: options?.transcription ?? null,
      pendingTransactionId: pending?.id ?? null,
    });

    const categories = await this.categoriesService.findByCompany(
      { company_id: company.id },
      user.id,
    );

    const isConfirmation =
      /^(confirmar|confirmo|sim|ok|pode confirmar|pode registrar|confirmado)[.! ]*$/i.test(
        normalizedText,
      );
    const isCancellation =
      /^(cancelar|cancela|cancele|não|nao|desistir|deixa pra lá|deixa para lá)[.! ]*$/i.test(
        normalizedText,
      );
    const isGenericCorrection =
      /^(corrigir|corrige|editar|alterar|quero corrigir|quero alterar)[.! ]*$/i.test(
        normalizedText,
      );

    if (
      isConfirmation &&
      pending &&
      pending.status === 'awaiting_confirmation'
    ) {
      const confirmResult = await this.confirmTransaction(
        { pendingTransactionId: pending.id },
        user,
      );

      const replyText =
        '✅ Movimentação registrada com sucesso na MetricsFlow AI!';

      await this.recordDemoMessage({
        companyId: company.id,
        userId: user.id,
        direction: 'outbound',
        messageType: 'text',
        text: replyText,
        transactionId: confirmResult.transactionId,
        pendingTransactionId: pending.id,
      });

      return {
        ok: true,
        confirmed: true,
        transactionId: confirmResult.transactionId,
        message: replyText,
        reply: replyText,
      };
    }

    if (isCancellation && pending) {
      const { data: cancelled, error: cancelError } = await supabase
        .from('pending_transactions')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', pending.id)
        .eq('user_id', user.id)
        .eq('company_id', company.id)
        .in('status', ['awaiting_information', 'awaiting_confirmation'])
        .select('id')
        .maybeSingle();

      if (cancelError) {
        throw new InternalServerErrorException(
          'Não foi possível cancelar a proposta da demonstração.',
        );
      }

      if (!cancelled) {
        throw new BadRequestException(
          'A proposta da demonstração não está mais disponível.',
        );
      }

      const replyText =
        '❌ Tudo certo, a proposta foi cancelada. Nenhuma movimentação foi registrada. Se quiser, envie outra receita ou despesa.';

      await this.recordDemoMessage({
        companyId: company.id,
        userId: user.id,
        direction: 'outbound',
        messageType: 'text',
        text: replyText,
        pendingTransactionId: pending.id,
      });

      return {
        ok: true,
        cancelled: true,
        message: replyText,
        reply: replyText,
      };
    }

    const isSpecificCorrection =
      pending &&
      /^(corrigir|corrige|alterar|mudar|muda)\s+(o|a)?\s*(descrição|descricao|valor|categoria|pagamento|data)/i.test(
        normalizedText,
      );

    if (isSpecificCorrection && pending) {
      const fieldMatch = normalizedText.match(
        /(descrição|descricao|valor|categoria|pagamento|data)/i,
      );
      const fieldKey = fieldMatch ? fieldMatch[1].toLowerCase() : '';

      const parts = normalizedText.split(/\s+(?:para|em|como)\s+|\s*=\s*/i);
      const newValue = parts.length > 1 ? parts[parts.length - 1].trim() : '';

      if (newValue) {
        const updatedParsed = {
          intent: 'create_transaction' as const,
          type: pending.type as 'income' | 'expense' | null,
          amount: pending.amount,
          description: pending.description,
          categoryId: pending.category_id,
          categoryName: pending.category_name,
          paymentMethod: pending.payment_method,
          transactionDate: pending.transaction_date,
          confidence: 1,
          missingFields: pending.missing_fields ?? [],
        };

        if (fieldKey.includes('descri')) {
          updatedParsed.description = newValue.replace(/[.]$/, '').trim();
        } else if (fieldKey.includes('valor')) {
          const numericValue = parseFloat(
            newValue.replace(/[^\d,]/g, '').replace(',', '.'),
          );
          if (!Number.isNaN(numericValue)) {
            updatedParsed.amount = numericValue;
          }
        } else if (fieldKey.includes('pagamento')) {
          updatedParsed.paymentMethod = newValue.toLowerCase() as any;
        } else if (fieldKey.includes('data')) {
          updatedParsed.transactionDate = newValue;
        }

        normalizeParsedMessage(updatedParsed, pending.raw_message, categories);

        const newStatus =
          updatedParsed.missingFields.length > 0
            ? 'awaiting_information'
            : 'awaiting_confirmation';

        const { data: updatedPending, error: updateError } = await supabase
          .from('pending_transactions')
          .update({
            type: updatedParsed.type,
            amount: updatedParsed.amount,
            description: updatedParsed.description,
            category_id: updatedParsed.categoryId,
            category_name: updatedParsed.categoryName,
            payment_method: updatedParsed.paymentMethod,
            transaction_date: updatedParsed.transactionDate,
            missing_fields: updatedParsed.missingFields,
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', pending.id)
          .select('id,status,expires_at')
          .maybeSingle();

        if (!updateError && updatedPending) {
          const replyText =
            updatedPending.status === 'awaiting_confirmation'
              ? formatConfirmation(updatedParsed)
              : missingQuestion(updatedParsed);

          await this.recordDemoMessage({
            companyId: company.id,
            userId: user.id,
            direction: 'outbound',
            messageType: 'text',
            text: replyText,
            pendingTransactionId: updatedPending.id,
          });

          return {
            ok: true,
            pendingTransactionId: updatedPending.id,
            status: updatedPending.status,
            expiresAt: updatedPending.expires_at,
            message: replyText,
            reply: replyText,
            canConfirm: updatedPending.status === 'awaiting_confirmation',
            companyId: company.id,
            companyName: company.name,
            categories,
            parsed: updatedParsed,
            missingFields: updatedParsed.missingFields,
          };
        }
      }
    }

    if (isGenericCorrection && pending) {
      const { data: cancelled, error: cancelError } = await supabase
        .from('pending_transactions')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', pending.id)
        .eq('user_id', user.id)
        .eq('company_id', company.id)
        .in('status', ['awaiting_information', 'awaiting_confirmation'])
        .select('id')
        .maybeSingle();

      if (cancelError) {
        throw new InternalServerErrorException(
          'Não foi possível descartar a proposta da demonstração.',
        );
      }

      if (!cancelled) {
        throw new BadRequestException(
          'A proposta da demonstração não está mais disponível.',
        );
      }

      const replyText =
        '✏️ Certo! A proposta anterior foi descartada. Envie novamente a movimentação com os dados corrigidos. Nada foi registrado ainda.';

      await this.recordDemoMessage({
        companyId: company.id,
        userId: user.id,
        direction: 'outbound',
        messageType: 'text',
        text: replyText,
      });

      return {
        ok: true,
        corrected: true,
        message: replyText,
        reply: replyText,
      };
    }

    const guard = this.messageGuardService.check(
      normalizedText,
      Boolean(pending && pending.status === 'awaiting_information'),
    );

    if (!guard.allowed) {
      await this.recordDemoMessage({
        companyId: company.id,
        userId: user.id,
        direction: 'outbound',
        messageType: 'text',
        text: guard.response,
        pendingTransactionId: pending?.id ?? null,
      });

      return {
        ok: false,
        reason: guard.reason,
        message: guard.response,
        reply: guard.response,
      };
    }

    const isCompletingInfo =
      pending && pending.status === 'awaiting_information';
    const combinedText = isCompletingInfo
      ? `${pending.raw_message}\nInformação complementar: ${normalizedText}`
      : normalizedText;

    const parsed = await this.parserService.parseWhatsAppMessage(
      combinedText,
      categories,
    );

    if (!parsed || parsed.intent !== 'create_transaction') {
      const replyText =
        'Não consegui identificar uma movimentação financeira válida. Informe uma receita ou despesa, por exemplo: "Gastei R$ 150 com materiais via Pix".';

      await this.recordDemoMessage({
        companyId: company.id,
        userId: user.id,
        direction: 'outbound',
        messageType: 'text',
        text: replyText,
        pendingTransactionId: pending?.id ?? null,
      });

      return {
        ok: false,
        message: replyText,
        reply: replyText,
      };
    }

    normalizeParsedMessage(parsed, combinedText, categories);

    const missingFields = Array.isArray(parsed.missingFields)
      ? parsed.missingFields
      : [];

    const status =
      missingFields.length > 0
        ? 'awaiting_information'
        : 'awaiting_confirmation';

    const proposalData = {
      type: parsed.type,
      amount: parsed.amount,
      description: parsed.description,
      category_id: parsed.categoryId,
      category_name: parsed.categoryName,
      payment_method: parsed.paymentMethod,
      transaction_date: parsed.transactionDate,
      raw_message: combinedText,
      missing_fields: missingFields,
      status,
      updated_at: new Date().toISOString(),
    };

    let savedPending: {
      id: string;
      status: string;
      expires_at: string;
    } | null = null;

    if (isCompletingInfo) {
      const { data, error } = await supabase
        .from('pending_transactions')
        .update(proposalData)
        .eq('id', pending.id)
        .eq('user_id', user.id)
        .eq('company_id', company.id)
        .select('id,status,expires_at')
        .maybeSingle();

      if (error) {
        throw new InternalServerErrorException(
          'Não foi possível atualizar a proposta de movimentação.',
        );
      }

      savedPending = data;
    } else {
      const { data, error } = await supabase
        .from('pending_transactions')
        .insert({
          company_id: company.id,
          user_id: user.id,
          ...proposalData,
        })
        .select('id,status,expires_at')
        .single();

      if (error) {
        throw new InternalServerErrorException(
          'Não foi possível salvar a proposta de movimentação.',
        );
      }

      savedPending = data;
    }

    if (!savedPending) {
      throw new InternalServerErrorException(
        'Falha ao persistir a proposta de movimentação.',
      );
    }

    const replyText =
      savedPending.status === 'awaiting_confirmation'
        ? formatConfirmation(parsed)
        : missingQuestion(parsed);

    await this.recordDemoMessage({
      companyId: company.id,
      userId: user.id,
      direction: 'outbound',
      messageType: 'text',
      text: replyText,
      pendingTransactionId: savedPending.id,
    });

    return {
      ok: true,
      pendingTransactionId: savedPending.id,
      status: savedPending.status,
      expiresAt: savedPending.expires_at,
      message: replyText,
      reply: replyText,
      canConfirm: savedPending.status === 'awaiting_confirmation',
      companyId: company.id,
      companyName: company.name,
      categories,
      parsed,
      missingFields,
    };
  }

  async confirmTransaction(body: ConfirmWhatsappDto, user: User) {
    const pendingId =
      body?.pendingTransactionId || body?.pending_transaction_id;

    if (!pendingId) {
      throw new BadRequestException('Informe o identificador da proposta.');
    }

    const company = await this.getUserCompany(user.id);
    const supabase = this.supabaseService.getClient();

    const { data: transactionId, error } = await supabase.rpc(
      'confirm_pending_whatsapp_transaction',
      {
        p_pending_id: pendingId,
        p_user_id: user.id,
        p_company_id: company.id,
      },
    );

    if (error) {
      if (['P0002', 'P0001', '22023'].includes(error.code ?? '')) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'Não foi possível confirmar a movimentação.',
      );
    }

    if (!transactionId) {
      throw new BadRequestException(
        'A proposta expirou ou já foi confirmada. Gere uma nova proposta.',
      );
    }

    return {
      ok: true,
      transactionId,
      message: 'Movimentação confirmada com sucesso.',
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
      throw new InternalServerErrorException(
        'Não foi possível consultar a conexão do WhatsApp.',
      );
    }

    return {
      connection: data ?? null,
    };
  }

  async connectWhatsApp(body: ConnectWhatsappDto, user: User) {
    const phoneNumber = body.phoneNumber?.trim() ?? '';
    const normalized = this.metaService.normalizePhone(phoneNumber);

    if (!/^\d{10,15}$/.test(normalized)) {
      throw new BadRequestException('Informe um número válido com DDI e DDD.');
    }

    const company = await this.getUserCompany(user.id);
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('whatsapp_connections')
      .upsert(
        {
          user_id: user.id,
          company_id: company.id,
          phone_number: normalized,
          status: 'pending',
          verified_at: null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,company_id',
        },
      )
      .select('id,phone_number,status,verified_at,company_id')
      .single();

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível registrar o número do WhatsApp.',
      );
    }

    return {
      ok: true,
      connection: data,
      message:
        'Número registrado. A verificação ainda precisa ser implementada.',
    };
  }

  async verifyWebhook(mode: string, token: string, challenge: string) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (
      !verifyToken ||
      mode !== 'subscribe' ||
      !token ||
      token !== verifyToken ||
      !challenge
    ) {
      throw new UnauthorizedException('Falha na verificação do webhook.');
    }

    return challenge;
  }

  async receiveWebhook(request: Request & { rawBody?: Buffer }, body: unknown) {
    const rawBody = request.rawBody;

    if (!rawBody) {
      throw new BadRequestException(
        'Raw body não disponível para validar o webhook.',
      );
    }

    const signatureHeader = request.headers['x-hub-signature-256'];

    const signature = Array.isArray(signatureHeader)
      ? signatureHeader[0]
      : signatureHeader;

    if (!this.isValidMetaSignature(rawBody, signature ?? null)) {
      throw new UnauthorizedException('Assinatura do webhook inválida.');
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
        const result =
          await this.processMessageService.processIncomingWhatsAppMessage(
            message,
          );

        results.push(result);
      } catch {
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

  private async getUserCompany(userId: string) {
    const companies = await this.companiesService.findByUser(userId);

    if (!companies.length) {
      throw new BadRequestException(
        'Usuário não está vinculado a uma empresa.',
      );
    }

    return companies[0];
  }

  private isValidMetaSignature(
    rawBody: Buffer,
    signature: string | null,
  ): boolean {
    const appSecret = process.env.WHATSAPP_APP_SECRET;

    if (!appSecret || !signature?.startsWith('sha256=')) {
      return false;
    }

    const receivedHash = signature.slice('sha256='.length);

    if (!/^[a-fA-F0-9]{64}$/.test(receivedHash)) {
      return false;
    }

    const expectedHash = createHmac('sha256', appSecret)
      .update(rawBody)
      .digest();

    const receivedHashBuffer = Buffer.from(receivedHash, 'hex');

    return (
      expectedHash.length === receivedHashBuffer.length &&
      timingSafeEqual(expectedHash, receivedHashBuffer)
    );
  }
}
