import { Module } from '@nestjs/common';

import { TransactionsController } from './transactions.controller';
import { AuthModule } from '../auth/auth.module';
import { TransactionsService } from './transactions.service';
import { SupabaseService } from '../supabase.service';

@Module({
  imports: [AuthModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, SupabaseService],
})
export class TransactionsModule { }
