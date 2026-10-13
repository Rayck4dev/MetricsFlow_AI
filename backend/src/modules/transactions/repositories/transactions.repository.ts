import { Injectable } from '@nestjs/common';

import { SupabaseService } from '../../supabase.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionFiltersDto } from '../dto/transaction-filters.dto';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async findCompanyIdsByUser(userId: string) {
    return this.supabase
      .from('company_members')
      .select('company_id')
      .eq('user_id', userId);
  }
  async findMembership(companyId: string, userId: string) {
    return this.supabase
      .from('company_members')
      .select('id')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .maybeSingle();
  }
  async findCategory(categoryId: string, companyId: string) {
    return this.supabase
      .from('categories')
      .select('id, company_id, type')
      .eq('id', categoryId)
      .eq('company_id', companyId)
      .maybeSingle();
  }
  async findCategoryById(categoryId: string) {
    return this.supabase
      .from('categories')
      .select('id, company_id, type')
      .eq('id', categoryId)
      .maybeSingle();
  }
  async create(dto: CreateTransactionDto, userId: string) {
    return this.supabase
      .from('transactions')
      .insert({
        company_id: dto.company_id,
        category_id: dto.category_id ?? null,
        type: dto.type,
        amount: dto.amount,
        description: dto.description.trim(),
        payment_method: dto.payment_method,
        transaction_date: dto.transaction_date,
        created_by_user_id: userId,
        origin: 'web',
      })
      .select()
      .single();
  }
  async findAll(companyIds: string[], filters: TransactionFiltersDto) {
    let query = this.supabase
      .from('transactions')
      .select(
        `
        id,
        company_id,
        category_id,
        created_by_user_id,
        type,
        amount,
        description,
        payment_method,
        transaction_date,
        origin,
        raw_whatsapp_text,
        created_at,
        updated_at
      `,
      )
      .in('company_id', companyIds);

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.start_date) {
      query = query.gte('transaction_date', filters.start_date);
    }

    if (filters.end_date) {
      query = query.lte('transaction_date', filters.end_date);
    }

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    return query.order('transaction_date', {
      ascending: false,
    });
  }
  async findById(transactionId: string) {
    return this.supabase
      .from('transactions')
      .select('id, company_id, type, category_id')
      .eq('id', transactionId)
      .maybeSingle();
  }
  async update(
    transactionId: string,
    companyId: string,
    updateData: Record<string, unknown>,
  ) {
    return this.supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId)
      .eq('company_id', companyId)
      .select()
      .maybeSingle();
  }
  async delete(transactionId: string, companyId: string) {
    return this.supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)
      .eq('company_id', companyId)
      .select('id')
      .maybeSingle();
  }
}
