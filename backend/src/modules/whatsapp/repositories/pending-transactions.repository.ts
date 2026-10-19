import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase.service';

export type PendingTransactionStatus =
  'awaiting_information' | 'awaiting_confirmation' | 'expired' | 'cancelled';

export type ActivePendingTransactionStatus =
  'awaiting_information' | 'awaiting_confirmation';

@Injectable()
export class PendingTransactionsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async findLatestPending(userId: string, companyId: string) {
    return this.supabase
      .from('pending_transactions')
      .select(
        `
        id,
        company_id,
        user_id,
        type,
        amount,
        description,
        category_id,
        category_name,
        payment_method,
        transaction_date,
        raw_message,
        missing_fields,
        status,
        expires_at,
        created_at
      `,
      )
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .in('status', ['awaiting_information', 'awaiting_confirmation'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
  }

  async expirePending(
    pendingId: string,
    expectedStatuses: ActivePendingTransactionStatus[] = [
      'awaiting_information',
      'awaiting_confirmation',
    ],
  ) {
    return this.supabase
      .from('pending_transactions')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString(),
      })
      .eq('id', pendingId)
      .in('status', expectedStatuses)
      .select('id, status')
      .maybeSingle();
  }

  async cancelPending(
    pendingId: string,
    userId: string,
    companyId: string,
    expectedStatuses: ActivePendingTransactionStatus[] = [
      'awaiting_information',
      'awaiting_confirmation',
    ],
  ) {
    return this.supabase
      .from('pending_transactions')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', pendingId)
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .in('status', expectedStatuses)
      .select('id, status')
      .maybeSingle();
  }

  async updatePendingTransaction(
    pendingId: string,
    userId: string,
    companyId: string,
    data: Record<string, unknown>,
  ) {
    return this.supabase
      .from('pending_transactions')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pendingId)
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .eq('status', 'awaiting_information')
      .select('id, status, expires_at')
      .maybeSingle();
  }

  async createPendingTransaction(
    userId: string,
    companyId: string,
    data: Record<string, unknown>,
  ) {
    return this.supabase
      .from('pending_transactions')
      .insert({
        ...data,
        user_id: userId,
        company_id: companyId,
      })
      .select('id, status, expires_at')
      .single();
  }

  async confirmPendingTransaction(
    pendingId: string,
    userId: string,
    companyId: string,
  ) {
    return this.supabase.rpc('confirm_pending_whatsapp_transaction', {
      p_pending_id: pendingId,
      p_user_id: userId,
      p_company_id: companyId,
    });
  }

  async findLatestActivePending(userId: string, companyId: string) {
    return this.supabase
      .from('pending_transactions')
      .select(
        'id,type,amount,description,category_id,category_name,payment_method,transaction_date,raw_message,missing_fields,status,expires_at',
      )
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .in('status', ['awaiting_information', 'awaiting_confirmation'])
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
  }

  async updateActivePending(
    pendingId: string,
    userId: string,
    companyId: string,
    data: Record<string, unknown>,
  ) {
    return this.supabase
      .from('pending_transactions')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pendingId)
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .in('status', ['awaiting_information', 'awaiting_confirmation'])
      .select('id, status, expires_at')
      .maybeSingle();
  }
}
