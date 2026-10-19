import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SupabaseModule } from '../supabase.module';

import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './repositories/transactions.repository';
import { TransactionsService } from './transactions.service';
import { TransactionValidatorService } from './services/transaction-validator.service';

@Module({
  imports: [AuthModule, SupabaseModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionsRepository,
    TransactionValidatorService,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
