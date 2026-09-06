import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SupabaseService } from '../supabase.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionFiltersDto } from './dto/transaction-filters.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(dto: CreateTransactionDto, userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: membership, error: membershipError } = await supabase
      .from('company_members')
      .select('id, role')
      .eq('company_id', dto.company_id)
      .eq('user_id', userId)
      .maybeSingle();

    if (membershipError) {
      throw new Error(membershipError.message);
    }

    if (!membership) {
      throw new ForbiddenException('Você não possui acesso a esta empresa.');
    }

    if (dto.category_id) {
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', dto.category_id)
        .eq('company_id', dto.company_id)
        .maybeSingle();

      if (categoryError) {
        throw new Error(categoryError.message);
      }

      if (!category) {
        throw new NotFoundException(
          'Categoria não encontrada para esta empresa.',
        );
      }
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        company_id: dto.company_id,
        category_id: dto.category_id,
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        payment_method: dto.payment_method,
        transaction_date: dto.transaction_date,
        created_by_user_id: userId,
        origin: 'web',
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findByUser(userId: string, filters: TransactionFiltersDto) {
    const supabase = this.supabaseService.getClient();

    const { data: memberships, error: membershipError } = await supabase
      .from('company_members')
      .select('company_id')
      .eq('user_id', userId);

    if (membershipError) {
      throw new Error(membershipError.message);
    }

    const companyIds = memberships.map((membership) => membership.company_id);

    if (companyIds.length === 0) {
      return [];
    }

    const allowedCompanyIds = filters.company_id
      ? companyIds.filter((id) => id === filters.company_id)
      : companyIds;

    if (filters.company_id && allowedCompanyIds.length === 0) {
      throw new ForbiddenException('Você não possui acesso a esta empresa.');
    }

    const query = supabase
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
      .in('company_id', allowedCompanyIds);

    if (filters.type) {
      query.eq('type', filters.type);
    }

    if (filters.start_date) {
      query.gte('transaction_date', filters.start_date);
    }

    if (filters.end_date) {
      query.lte('transaction_date', filters.end_date);
    }

    if (filters.category_id) {
      query.eq('category_id', filters.category_id);
    }

    const { data, error } = await query.order('transaction_date', {
      ascending: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async update(
    transactionId: string,
    dto: UpdateTransactionDto,
    userId: string,
  ) {
    const supabase = this.supabaseService.getClient();

    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('id, company_id')
      .eq('id', transactionId)
      .maybeSingle();

    if (transactionError) {
      throw new Error(transactionError.message);
    }

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    const { data: membership, error: membershipError } = await supabase
      .from('company_members')
      .select('id')
      .eq('company_id', transaction.company_id)
      .eq('user_id', userId)
      .maybeSingle();

    if (membershipError) {
      throw new Error(membershipError.message);
    }

    if (!membership) {
      throw new ForbiddenException('Você não possui acesso a esta empresa.');
    }

    if (dto.category_id) {
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', dto.category_id)
        .eq('company_id', transaction.company_id)
        .maybeSingle();

      if (categoryError) {
        throw new Error(categoryError.message);
      }

      if (!category) {
        throw new NotFoundException(
          'Categoria não encontrada para esta empresa.',
        );
      }
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({
        ...dto,
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async remove(transactionId: string, userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('id, company_id')
      .eq('id', transactionId)
      .maybeSingle();

    if (transactionError) {
      throw new Error(transactionError.message);
    }

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    const { data: membership, error: membershipError } = await supabase
      .from('company_members')
      .select('id')
      .eq('company_id', transaction.company_id)
      .eq('user_id', userId)
      .maybeSingle();

    if (membershipError) {
      throw new Error(membershipError.message);
    }

    if (!membership) {
      throw new ForbiddenException('Você não possui acesso a esta empresa.');
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: 'Transação excluída com sucesso.',
    };
  }
}
