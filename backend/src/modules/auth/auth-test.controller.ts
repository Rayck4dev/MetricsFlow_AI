import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import { AuthGuard } from './auth.guard';

interface AuthenticatedRequest {
  user: {
    id: string;
    email?: string;
  };
}

@Controller('auth/test')
@UseGuards(AuthGuard)
export class AuthTestController {
  @Get()
  test(@Request() request: AuthenticatedRequest) {
    return {
      authenticated: true,
      user: {
        id: request.user.id,
        email: request.user.email ?? null,
      },
    };
  }
}
