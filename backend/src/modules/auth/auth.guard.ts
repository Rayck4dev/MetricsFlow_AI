import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';

import { AuthService } from './auth.service';

interface AuthenticatedRequest {
  headers: {
    authorization?: string;
  };
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Token não informado.');
    }

    const parts = authorization.trim().split(/\s+/);

    if (
      parts.length !== 2 ||
      parts[0].toLowerCase() !== 'bearer' ||
      !parts[1]
    ) {
      throw new UnauthorizedException('Cabeçalho de autorização inválido.');
    }

    const user = await this.authService.validateToken(parts[1]);

    if (!user) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    request.user = user;

    return true;
  }
}
