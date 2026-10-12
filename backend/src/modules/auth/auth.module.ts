import { Module } from '@nestjs/common';

import { SupabaseModule } from '../supabase.module';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthTestController } from './auth-test.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthTestController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
