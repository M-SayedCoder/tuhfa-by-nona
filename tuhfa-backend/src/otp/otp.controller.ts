import { Controller, Post, Body, HttpCode, HttpStatus, SetMetadata } from '@nestjs/common';
import { OtpService } from './otp.service';

const Public = () => SetMetadata('isPublic', true);

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  // POST /api/otp/send
  @Public()
  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() body: { email: string }) {
    return this.otpService.sendOtp(body?.email || '');
  }

  // POST /api/otp/verify
  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() body: { email: string; code: string }) {
    return this.otpService.verifyOtp(body?.email || '', body?.code || '');
  }
}
