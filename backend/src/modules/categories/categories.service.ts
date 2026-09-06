import { ForbiddenException, Injectable } from '@nestjs/common';

import { SupabaseService } from '../supabase.service';
import { CategoryFiltersDto } from './dto/category-filters.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findByCompany(filters: CategoryFiltersDto, userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: membership, error: membershipError } = await supabase
      .from('company_members')
      .select('id')
      .eq('company_id', filters.company_id)
      .eq('user_id', userId)
      .maybeSingle();

    if (membershipError) {
      throw new Error(membershipError.message);
    }

    if (!membership) {
      throw new ForbiddenException('Você não possui acesso a esta empresa.');
    }

    const { data, error } = await supabase
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
      .eq('company_id', filters.company_id)
      .order('sort_order', {
        ascending: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
