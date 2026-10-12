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
}