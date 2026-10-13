import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase.service';

@Injectable()
export class AttachmentsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async findTransaction(transactionId: string) {
    return this.supabase
      .from('transactions')
      .select('id, company_id')
      .eq('id', transactionId)
      .maybeSingle();
  }

  async findMembership(companyId: string, userId: string) {
    return this.supabase
      .from('company_members')
      .select('id, role')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .maybeSingle();
  }

  async findByTransactionId(transactionId: string) {
    return this.supabase
      .from('transaction_attachments')
      .select(
        'id, transaction_id, company_id, file_name, object_key, content_type, size_bytes, uploaded_by_user_id, created_at',
      )
      .eq('transaction_id', transactionId)
      .maybeSingle();
  }

  async findById(attachmentId: string) {
    return this.supabase
      .from('transaction_attachments')
      .select(
        'id, transaction_id, company_id, file_name, object_key, content_type, size_bytes, uploaded_by_user_id, created_at',
      )
      .eq('id', attachmentId)
      .maybeSingle();
  }

  async saveMetadata(attachment: {
    transaction_id: string;
    company_id: string;
    file_name: string;
    object_key: string;
    content_type: string;
    size_bytes: number;
    uploaded_by_user_id: string;
  }) {
    return this.supabase
      .from('transaction_attachments')
      .upsert(attachment, { onConflict: 'transaction_id' })
      .select()
      .single();
  }

  async deleteMetadata(attachmentId: string) {
    return this.supabase
      .from('transaction_attachments')
      .delete()
      .eq('id', attachmentId);
  }
}
