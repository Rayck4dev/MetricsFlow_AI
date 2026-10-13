import { Injectable } from '@nestjs/common';

import { SupabaseService } from '../../supabase.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async findMembership(companyId: string, userId: string) {
    return this.supabase
      .from('company_members')
      .select('id')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .maybeSingle();
  }

  async findByCompany(companyId: string) {
    return this.supabase
      .from('categories')
      .select(
        `
        id,
        company_id,
        name,
        type,
        color,
        is_default,
        created_at,
        sort_order
      `,
      )
      .eq('company_id', companyId)
      .order('sort_order', {
        ascending: true,
      });
  }
}
