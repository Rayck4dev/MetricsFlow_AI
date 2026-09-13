import { Injectable } from '@nestjs/common';

import type { SupabaseClient } from '@supabase/supabase-js';

import { ParserService } from '../ai/parser.service';
import type { CompanyCategory, ParsedFinancialMessage } from '../ai/types';
import { TranscriptionService } from '../ai/transcription.service';
import { SupabaseService } from '../supabase.service';

import { MessageGuardService } from './message-guard.service';
import { MetaService } from './meta.service';
import type { IncomingWhatsAppMessage } from './types';

function money(value: number | null) {
  if (value == null) {
    return 'Não informado';
  }

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function datePtBr(value: string | null) {
  if (!value) {
    return 'Não informada';
  }

  const [year, month, day] = value.split('-');

  return `${day}/${month}/${year}`;
}

function getPaymentMethodLabel(
  paymentMethod: ParsedFinancialMessage['paymentMethod'],
) {
  if (!paymentMethod) {
    return 'Não informado';
  }

  const labels = {
    pix: 'Pix',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    bank_slip: 'Boleto',
    cash: 'Dinheiro',
    transfer: 'Transferência',
    other: 'Outro',
  } satisfies Record<
    NonNullable<ParsedFinancialMessage['paymentMethod']>,
    string
  >;

  return labels[paymentMethod];
}

function normalizeMissingField(field: string) {
  switch (field) {
    case 'payment_method':
      return 'paymentMethod';

    case 'transaction_date':
      return 'transactionDate';

    case 'categoryId':
      return 'category';

    default:
      return field;
  }
}

function normalizeParsedMessage(
  parsed: ParsedFinancialMessage,
  messageText: string,
  categories: CompanyCategory[],
) {
  parsed.missingFields = Array.from(
    new Set(parsed.missingFields.map(normalizeMissingField)),
  );

  if (!parsed.transactionDate) {
    parsed.transactionDate = new Date().toISOString().slice(0, 10);

    parsed.missingFields = parsed.missingFields.filter(
      (field) => field !== 'transactionDate',
    );
  }

  if (parsed.type && !parsed.categoryId) {
    const normalizedCategories = categories.filter(
      (category) => category.type === parsed.type,
    );

    const fallbackCategory =
      normalizedCategories.find((category) => /outr/i.test(category.name)) ??
      normalizedCategories.find((category) => category.name.length > 0) ??
      null;

    if (fallbackCategory) {
      parsed.categoryId = fallbackCategory.id;

      parsed.categoryName = fallbackCategory.name;

      parsed.missingFields = parsed.missingFields.filter(
        (field) => field !== 'category',
      );
    }
  }

  if (
    parsed.categoryId &&
    !categories.some(
      (category) =>
        category.id === parsed.categoryId && category.type === parsed.type,
    )
  ) {
    parsed.categoryId = null;
    parsed.categoryName = null;

    if (!parsed.missingFields.includes('category')) {
      parsed.missingFields.push('category');
    }
  }

  if (!messageText.trim()) {
    parsed.missingFields.push('description');
  }

  parsed.missingFields = Array.from(new Set(parsed.missingFields));
}

function missingQuestion(parsed: ParsedFinancialMessage) {
  const missing = new Set(parsed.missingFields.map(normalizeMissingField));

  if (missing.has('amount')) {
    return 'Qual foi o valor da movimentação?';
  }

  if (missing.has('type')) {
    return 'Isso foi uma receita ou uma despesa?';
  }

  if (missing.has('description')) {
    return 'Qual foi a descrição dessa movimentação?';
  }

  if (missing.has('category')) {
    return 'Não consegui identificar a categoria. Pode explicar melhor do que se trata?';
  }

  if (missing.has('paymentMethod') || missing.has('payment_method')) {
    return 'Como foi o pagamento? Pode responder: Pix, cartão de crédito, cartão de débito, boleto, dinheiro, transferência ou outro.';
  }

  if (missing.has('transactionDate')) {
    return 'Qual foi a data dessa movimentação?';
  }

  return 'Preciso de mais informações para registrar essa movimentação. Pode explicar um pouco melhor?';
}

export function formatConfirmation(parsed: ParsedFinancialMessage) {
  const kind = parsed.type === 'income' ? '💰 Receita' : '💸 Despesa';

  return [
    `${kind} identificada:`,
    '',
    `Descrição: ${parsed.description ?? 'Não informada'}`,
    `Valor: ${money(parsed.amount)}`,
    `Categoria: ${parsed.categoryName ?? 'Não identificada'}`,
    `Pagamento: ${getPaymentMethodLabel(parsed.paymentMethod)}`,
    `Data: ${datePtBr(parsed.transactionDate)}`,
    '',
    'Está correto?',
    '✅ Responda: Confirmar',
    '✏️ Responda: Corrigir',
    '❌ Responda: Cancelar',
  ].join('\n');
}

@Injectable()
export class ProcessMessageService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly parserService: ParserService,
    private readonly transcriptionService: TranscriptionService,
    private readonly metaService: MetaService,
    private readonly guardService: MessageGuardService,
  ) {}

  private getSupabase(): SupabaseClient {
    return this.supabaseService.getClient();
  }

  private async getCategories(companyId: string) {
    const supabase = this.getSupabase();

    const { data, error } = await supabase
      .from('categories')
      .select('id,name,type')
      .eq('company_id', companyId)
      .order('sort_order', {
        ascending: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as CompanyCategory[];
  }

  private async findConnection(phoneNumber: string) {
    const supabase = this.getSupabase();

    const { data, error } = await supabase
      .from('whatsapp_connections')
      .select('id,user_id,company_id,phone_number,status')
      .eq('phone_number', phoneNumber)
      .eq('status', 'verified')
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  private async getLatestPending(userId: string, companyId: string) {
    const supabase = this.getSupabase();

    const { data, error } = await supabase
      .from('pending_transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .in('status', ['awaiting_information', 'awaiting_confirmation'])
      .order('created_at', {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  private async finalizePending(pending: Record<string, any>) {
    const supabase = this.getSupabase();

    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        company_id: pending.company_id,
        category_id: pending.category_id,
        created_by_user_id: pending.user_id,
        type: pending.type,
        amount: pending.amount,
        description: pending.description,
        payment_method: pending.payment_method,
        transaction_date: pending.transaction_date,
        origin: 'whatsapp',
        raw_whatsapp_text: pending.raw_message,
      })
      .select('id')
      .single();

    if (transactionError) {
      throw new Error(transactionError.message);
    }

    const { error: pendingError } = await supabase
      .from('pending_transactions')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        transaction_id: transaction.id,
      })
      .eq('id', pending.id);

    if (pendingError) {
      throw new Error(pendingError.message);
    }

    return transaction.id as string;
  }

  async processIncomingWhatsAppMessage(message: IncomingWhatsAppMessage) {
    const supabase = this.getSupabase();

    const { data: existing } = await supabase
      .from('whatsapp_messages')
      .select('id')
      .eq('provider_message_id', message.providerMessageId)
      .maybeSingle();

    if (existing) {
      return {
        status: 'duplicate' as const,
      };
    }

    const connection = await this.findConnection(message.phoneNumber);

    if (!connection) {
      try {
        await this.metaService.sendWhatsAppText(
          message.phoneNumber,
          'Este número ainda não está vinculado ao MetricsFlow. Faça a vinculação pelo painel antes de registrar movimentações.',
        );
      } catch (error) {
        console.error(
          'Não foi possível responder número não vinculado:',
          error,
        );
      }

      return {
        status: 'unlinked' as const,
      };
    }

    const pending = await this.getLatestPending(
      connection.user_id,
      connection.company_id,
    );

    let normalizedText = message.text?.trim() ?? '';

    let transcription: string | null = null;

    if (message.type === 'audio') {
      if (!message.mediaId) {
        throw new Error('Mensagem de áudio sem mediaId.');
      }

      const media = await this.metaService.downloadWhatsAppMedia(
        message.mediaId,
      );

      transcription = await this.transcriptionService.transcribeAudio(
        media.bytes,
        media.mimeType,
        `whatsapp-${message.providerMessageId}.ogg`,
      );

      normalizedText = transcription.trim();
    }

    const guardResult = this.guardService.check(
      normalizedText,
      pending?.status === 'awaiting_information',
    );

    if (!guardResult.allowed) {
      try {
        await this.metaService.sendWhatsAppText(
          message.phoneNumber,
          guardResult.response,
        );
      } catch (error) {
        console.error('Não foi possível enviar resposta do bloqueio:', error);
      }

      return {
        status:
          guardResult.reason === 'sensitive_data'
            ? ('sensitive_blocked' as const)
            : ('off_topic' as const),
      };
    }

    const { data: savedMessage, error: saveError } = await supabase
      .from('whatsapp_messages')
      .insert({
        company_id: connection.company_id,
        user_id: connection.user_id,
        provider_message_id: message.providerMessageId,
        phone_number: message.phoneNumber,
        direction: 'inbound',
        message_type: message.type,
        message_text: message.type === 'text' ? normalizedText : null,
        provider_media_id: message.mediaId ?? null,
        transcription,
        status: 'pending',
        provider_payload: message.payload,
      })
      .select('id')
      .single();

    if (saveError) {
      throw new Error(saveError.message);
    }

    const quickIntent = normalizedText.trim().toLowerCase();

    if (
      pending &&
      /^(confirmar|confirmo|sim|ok|pode confirmar|pode registrar)$/i.test(
        quickIntent,
      )
    ) {
      if (pending.status !== 'awaiting_confirmation') {
        await this.metaService.sendWhatsAppText(
          message.phoneNumber,
          'Ainda faltam informações antes da confirmação.',
        );

        await supabase
          .from('whatsapp_messages')
          .update({
            status: 'processed',
          })
          .eq('id', savedMessage.id);

        return {
          status: 'needs_information' as const,
        };
      }

      const transactionId = await this.finalizePending(pending);

      await supabase
        .from('whatsapp_messages')
        .update({
          status: 'processed',
          transaction_id: transactionId,
        })
        .eq('id', savedMessage.id);

      await this.metaService.sendWhatsAppText(
        message.phoneNumber,
        '✅ Movimentação registrada com sucesso no MetricsFlow.',
      );

      return {
        status: 'confirmed' as const,
        transactionId,
      };
    }

    if (pending && /^(cancelar|cancela|não|nao|desistir)$/i.test(quickIntent)) {
      await supabase
        .from('pending_transactions')
        .update({
          status: 'cancelled',
        })
        .eq('id', pending.id);

      await supabase
        .from('whatsapp_messages')
        .update({
          status: 'processed',
        })
        .eq('id', savedMessage.id);

      await this.metaService.sendWhatsAppText(
        message.phoneNumber,
        '❌ Movimentação cancelada.',
      );

      return {
        status: 'cancelled' as const,
      };
    }

    if (pending && /^(corrigir|corrige|editar|alterar)$/i.test(quickIntent)) {
      await this.metaService.sendWhatsAppText(
        message.phoneNumber,
        '✏️ Sem problema. Envie novamente a movimentação com os dados corrigidos e eu vou interpretar de novo.',
      );

      await supabase
        .from('pending_transactions')
        .update({
          status: 'cancelled',
        })
        .eq('id', pending.id);

      await supabase
        .from('whatsapp_messages')
        .update({
          status: 'processed',
        })
        .eq('id', savedMessage.id);

      return {
        status: 'correction_requested' as const,
      };
    }

    const categories = await this.getCategories(connection.company_id);

    const messageForParsing =
      pending?.status === 'awaiting_information'
        ? `${String(pending.raw_message ?? '')}
Complemento do usuário: ${normalizedText}`
        : normalizedText;

    const parsed = await this.parserService.parseWhatsAppMessage(
      messageForParsing,
      categories,
    );

    normalizeParsedMessage(parsed, messageForParsing, categories);

    if (parsed.intent !== 'create_transaction') {
      await supabase
        .from('whatsapp_messages')
        .update({
          status: 'processed',
        })
        .eq('id', savedMessage.id);

      await this.metaService.sendWhatsAppText(
        message.phoneNumber,
        'Não identifiquei uma movimentação financeira nessa mensagem.',
      );

      return {
        status: 'unknown' as const,
        parsed,
      };
    }

    const pendingStatus =
      parsed.missingFields.length > 0
        ? 'awaiting_information'
        : 'awaiting_confirmation';

    if (pending) {
      await supabase
        .from('pending_transactions')
        .update({
          status: 'cancelled',
        })
        .eq('id', pending.id);
    }

    const { data: createdPending, error: pendingError } = await supabase
      .from('pending_transactions')
      .insert({
        company_id: connection.company_id,
        user_id: connection.user_id,
        source_message_id: savedMessage.id,
        type: parsed.type,
        amount: parsed.amount,
        description: parsed.description,
        category_id: parsed.categoryId,
        category_name: parsed.categoryName,
        payment_method: parsed.paymentMethod,
        transaction_date: parsed.transactionDate,
        raw_message: messageForParsing,
        confidence: parsed.confidence,
        missing_fields: parsed.missingFields,
        status: pendingStatus,
      })
      .select('id')
      .single();

    if (pendingError) {
      throw new Error(pendingError.message);
    }

    await supabase
      .from('whatsapp_messages')
      .update({
        status: 'processed',
        pending_transaction_id: createdPending.id,
      })
      .eq('id', savedMessage.id);

    if (parsed.missingFields.length > 0) {
      const question = missingQuestion(parsed);

      await this.metaService.sendWhatsAppText(message.phoneNumber, question);

      return {
        status: 'needs_information' as const,
        parsed,
        question,
      };
    }

    const confirmation = formatConfirmation(parsed);

    await this.metaService.sendWhatsAppText(message.phoneNumber, confirmation);

    return {
      status: 'awaiting_confirmation' as const,
      parsed,
      confirmation,
    };
  }
}
