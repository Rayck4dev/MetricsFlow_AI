import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async validateToken(token: string) {
    if (!token || !token.trim()) {
      return null;
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.getUser(token);

      if (error || !data.user) {
        return null;
      }

      return data.user;
    } catch {
      return null;
    }
  }
}
