import { Module } from '@nestjs/common';

import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { CompaniesModule } from '../companies/companies.module';
import { SupabaseModule } from '../supabase.module';

import { MessageGuardService } from './message-guard.service';
import { MetaService } from './meta.service';
import { ProcessMessageService } from './process-message.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';

import { PendingTransactionsRepository } from './repositories/pending-transactions.repository';
import { WhatsappConnectionsRepository } from './repositories/whatsapp-connections.repository';
import { WhatsappMessagesRepository } from './repositories/whatsapp-messages.repository';

import { MessageContentService } from './services/message-content.service';
import { MessageResponseService } from './services/message-response.service';
import { PendingTransactionService } from './services/pending-transaction.service';

import { CancelTransactionStrategy } from './strategies/cancel-transaction.strategy';
import { ConfirmTransactionStrategy } from './strategies/confirm-transaction.strategy';
import { CorrectTransactionStrategy } from './strategies/correct-transaction.strategy';
import { CreateTransactionStrategy } from './strategies/create-transaction.strategy';
import { MessageIntentResolverService } from './strategies/message-intent-resolver.service';
import { MESSAGE_INTENT_STRATEGIES } from './strategies/message-intent.strategy';

@Module({
  imports: [
    AuthModule,
    CompaniesModule,
    CategoriesModule,
    SupabaseModule,
    AiModule,
  ],
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
    MetaService,
    ProcessMessageService,
    MessageGuardService,

    PendingTransactionsRepository,
    WhatsappConnectionsRepository,
    WhatsappMessagesRepository,

    MessageContentService,
    MessageResponseService,
    PendingTransactionService,

    CancelTransactionStrategy,
    ConfirmTransactionStrategy,
    CorrectTransactionStrategy,
    CreateTransactionStrategy,
    MessageIntentResolverService,
    {
      provide: MESSAGE_INTENT_STRATEGIES,
      useFactory: (
        cancel: CancelTransactionStrategy,
        confirm: ConfirmTransactionStrategy,
        correct: CorrectTransactionStrategy,
        create: CreateTransactionStrategy,
      ) => [cancel, confirm, correct, create],
      inject: [
        CancelTransactionStrategy,
        ConfirmTransactionStrategy,
        CorrectTransactionStrategy,
        CreateTransactionStrategy,
      ],
    },
  ],
  exports: [MetaService],
})
export class WhatsappModule {}

