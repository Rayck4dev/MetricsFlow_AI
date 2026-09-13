import { Module } from '@nestjs/common';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

import { SupabaseModule } from '../supabase.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
