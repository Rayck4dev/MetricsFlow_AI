import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('supabase/test')
export class SupabaseTestController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async testConnection() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('companies')
      .select('id')
      .limit(1);

    if (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }

    return {
      status: 'ok',
      connected: true,
      data,
    };
  }
}
