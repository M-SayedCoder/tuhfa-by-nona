import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      framework: 'NestJS 🦁 + MongoDB 🍃',
      message: '✨ خادم تحفة للفنون يعمل بكفاءة تامة!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
