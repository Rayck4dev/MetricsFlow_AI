import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import { AuthGuard } from './auth.guard';

@Controller('auth/test')
export class AuthTestController {
  @UseGuards(AuthGuard)
  @Get()
  test(@Request() request: any) {
    return {
      authenticated: true,
      user: {
        id: request.user.id,
        email: request.user.email,
      },
    };
  }
}
