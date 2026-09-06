import { Module } from '@nestjs/common';

import { SupabaseModule } from '../supabase.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthTestController } from './auth-test.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthTestController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
