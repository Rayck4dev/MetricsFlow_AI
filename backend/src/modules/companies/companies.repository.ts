import { Injectable } from '@nestjs/common';

import { SupabaseService } from '../supabase.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async findAll() {
    return this.supabase.from('companies').select('*');
  }

  async findByUser(userId: string) {
    return this.supabase
      .from('company_members')
      .select(
        `
        role,
        companies (
          id,
          name,
          document,
          phone_number,
          invite_code,
          created_at,
          updated_at
        )
      `,
      )
      .eq('user_id', userId);
  }

  async findOwnerMembership(userId: string) {
    return this.supabase
      .from('company_members')
      .select('id')
      .eq('user_id', userId)
      .eq('role', 'owner')
      .maybeSingle();
  }

  async createCompany(dto: CreateCompanyDto) {
    return this.supabase
      .from('companies')
      .insert({
        name: dto.name,
        document: dto.document,
        phone_number: dto.phone_number,
      })
      .select()
      .single();
  }

  async createMembership(companyId: string, userId: string) {
    return this.supabase.from('company_members').insert({
      company_id: companyId,
      user_id: userId,
      role: 'owner',
    });
  }

  async findMembership(companyId: string, userId: string) {
    return this.supabase
      .from('company_members')
      .select('id')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .maybeSingle();
  }

  async findMembers(companyId: string) {
    return this.supabase
      .from('company_members')
      .select(
        `
        id,
        user_id,
        role,
        created_at
      `,
      )
      .eq('company_id', companyId);
  }
}
