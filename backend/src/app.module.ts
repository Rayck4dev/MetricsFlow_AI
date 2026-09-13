import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseTestController } from './modules/supabase-test.controller';

import { HealthModule } from './modules/health/health.module';
import { SupabaseModule } from './modules/supabase.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    SupabaseModule,
    CompaniesModule,
    AuthModule,
    TransactionsModule,
    CategoriesModule,
    WhatsappModule,
    AiModule,
  ],
  controllers: [AppController, SupabaseTestController],
  providers: [AppService],
})
export class AppModule {}
