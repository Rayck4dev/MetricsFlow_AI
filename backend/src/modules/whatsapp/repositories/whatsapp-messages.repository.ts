import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase.service';

@Injectable()
export class WhatsappMessagesRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async findByProviderMessageId(providerMessageId: string) {
    return this.supabase
      .from('whatsapp_messages')
      .select('id, status')
      .eq('provider_message_id', providerMessageId)
      .maybeSingle();
  }

  async createInboundMessage(data: {
    company_id: string;
    user_id: string;
    provider_message_id: string;
    phone_number: string;
    message_type: string;
    message_text: string | null;
    provider_media_id: string | null;
    transcription: string | null;
    provider_payload: unknown;
  }) {
    return this.supabase
      .from('whatsapp_messages')
      .insert({
        ...data,
        direction: 'inbound',
        status: 'pending',
      })
      .select('id')
      .single();
  }

  async updateStatus(
    messageId: string,
    status: string,
    extra: Record<string, unknown> = {},
  ) {
    return this.supabase
      .from('whatsapp_messages')
      .update({
        status,
        ...extra,
      })
      .eq('id', messageId);
  }

  async createDemoMessage(params: {
    companyId: string;
    userId: string;
    direction: 'inbound' | 'outbound';
    messageType: string;
    text?: string | null;
    transcription?: string | null;
    pendingTransactionId?: string | null;
    transactionId?: string | null;
  }) {
    const providerMessageId = `demo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    return this.supabase
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
  }

  async findDemoHistory(userId: string, companyId: string, limit = 100) {
    return this.supabase
      .from('whatsapp_messages')
      .select(
        'id, direction, message_type, message_text, transcription, status, pending_transaction_id, transaction_id, created_at',
      )
      .eq('company_id', companyId)
      .eq('phone_number', 'demo')
      .order('created_at', { ascending: false })
      .limit(limit);
  }
}
