import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  SetMetadata,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, IS_PUBLIC_KEY } from './jwt-auth.guard';

const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/signup
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body()
    body: {
      email?: string;
      name?: string;
      phone?: string;
      password?: string;
      adminCode?: string;
    },
  ) {
    // ✅ FIX: تحقق مبكر في الـ controller قبل الوصول للـ service
    if (!body?.email || !body?.password || !body?.name) {
      throw new BadRequestException('البريد الإلكتروني والاسم وكلمة المرور مطلوبة');
    }

    return this.authService.signup({
      email: body.email,
      name: body.name,
      phone: body.phone || '',
      password: body.password,
      adminCode: body.adminCode,
    });
  }

  // POST /api/auth/login
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { email?: string; password?: string },
  ) {
    // ✅ FIX: تحقق مبكر
    if (!body?.email || !body?.password) {
      throw new BadRequestException('البريد الإلكتروني وكلمة المرور مطلوبان');
    }

    return this.authService.login(body.email, body.password);
  }

  // GET /api/auth/me  (protected)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: any) {
    // ✅ FIX: التحقق من وجود req.user قبل الوصول لـ _id
    if (!req.user?._id) {
      throw new BadRequestException('بيانات المستخدم غير متاحة من الـ token');
    }
    return this.authService.getMe(req.user._id.toString());
  }
}
