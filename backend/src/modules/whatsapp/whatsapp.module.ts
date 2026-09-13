import { Module } from '@nestjs/common';

import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { CompaniesModule } from '../companies/companies.module';
import { SupabaseModule } from '../supabase.module';

import { MetaService } from './meta.service';
import { ProcessMessageService } from './process-message.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { MessageGuardService } from './message-guard.service';

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
  ],
  exports: [MetaService],
})
export class WhatsappModule {}
