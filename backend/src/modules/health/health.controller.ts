import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getStatus() {
    return {
      status: 'ok',
      service: 'metricsflow-api',
    };
  }
}
