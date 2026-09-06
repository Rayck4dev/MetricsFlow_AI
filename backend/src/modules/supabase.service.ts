import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!url) {
      throw new Error('SUPABASE_URL não configurada.');
    }

    if (!secretKey) {
      throw new Error('SUPABASE_SECRET_KEY não configurada.');
    }

    this.client = createClient(url, secretKey);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
