import { Injectable } from '@nestjs/common';

import { SupabaseService } from '../../supabase.service';

@Injectable()
export class WhatsappConnectionsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async findByUser(userId: string) {
    return this.supabase
      .from('whatsapp_connections')
      .select('id, phone_number, status, verified_at, company_id')
      .eq('user_id', userId)
      .maybeSingle();
  }

  async findVerifiedByPhone(phoneNumber: string) {
    return this.supabase
      .from('whatsapp_connections')
      .select('id, user_id, company_id, phone_number, status, verified_at')
      .eq('phone_number', phoneNumber)
      .eq('status', 'verified')
      .maybeSingle();
  }

  async upsertConnection(
    userId: string,
    companyId: string,
    phoneNumber: string,
  ) {
    return this.supabase
      .from('whatsapp_connections')
      .upsert(
        {
          user_id: userId,
          company_id: companyId,
          phone_number: phoneNumber,
          status: 'pending',
          verified_at: null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,company_id',
        },
      )
      .select('id, phone_number, status, verified_at, company_id')
      .single();
  }
}
