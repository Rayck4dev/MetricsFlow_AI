import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('companies')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findByUser(userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
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

    if (error) {
      throw new Error(error.message);
    }

    return data.map((item) => ({
      ...item.companies,
      role: item.role,
    }));
  }

  async create(dto: CreateCompanyDto, userId: string) {
    const { data: existingOwner, error: ownerError } =
      await this.supabaseService
        .getClient()
        .from('company_members')
        .select('id')
        .eq('user_id', userId)
        .eq('role', 'owner')
        .maybeSingle();

    if (ownerError) {
      throw new Error(ownerError.message);
    }

    if (existingOwner) {
      throw new ConflictException(
        'Você já possui uma empresa como proprietário.',
      );
    }

    const { data: company, error: companyError } = await this.supabaseService
      .getClient()
      .from('companies')
      .insert({
        name: dto.name,
        document: dto.document,
        phone_number: dto.phone_number,
      })
      .select()
      .single();

    if (companyError) {
      throw new Error(companyError.message);
    }

    const { error: memberError } = await this.supabaseService
      .getClient()
      .from('company_members')
      .insert({
        company_id: company.id,
        user_id: userId,
        role: 'owner',
      });

    if (memberError) {
      throw new Error(memberError.message);
    }

    return company;
  }

  async findMembers(companyId: string, userId: string) {
    const { data: membership, error: membershipError } =
      await this.supabaseService
        .getClient()
        .from('company_members')
        .select('id')
        .eq('company_id', companyId)
        .eq('user_id', userId)
        .maybeSingle();

    if (membershipError) {
      throw new Error(membershipError.message);
    }

    if (!membership) {
      throw new ForbiddenException('Você não possui acesso a esta empresa.');
    }

    const { data, error } = await this.supabaseService
      .getClient()
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

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
