import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signup(data: {
    email: string;
    name: string;
    phone: string;
    password: string;
    adminCode?: string;
  }) {
    // ✅ FIX: optional chaining قبل كل .includes() أو string method
    const email = data.email?.trim() ?? '';
    const name  = data.name?.trim()  ?? '';

    if (!email || !email.includes('@')) {
      throw new BadRequestException('بريد إلكتروني غير صالح');
    }

    if (!data.password || data.password.length < 6) {
      throw new BadRequestException('كلمة المرور ضعيفة، يجب أن تكون 6 خانات على الأقل');
    }

    if (!name || name.length < 2) {
      throw new BadRequestException('الاسم قصير جداً');
    }

    const adminSecret = this.config.get<string>('ADMIN_SECRET_CODE', '');
    // ✅ FIX: optional chaining على adminCode قبل .trim()
    const isAdmin =
      adminSecret !== '' && (data.adminCode?.trim() ?? '') === adminSecret;

    try {
      const user = await this.usersService.create({
        email: email.toLowerCase(),
        name,
        phone: data.phone?.trim() || '',
        password: data.password,
        isAdmin,
      });

      const token = this.generateToken(user._id.toString(), user.email);

      return {
        success: true,
        token,
        user: user.toJSON(),
      };
    } catch (err: any) {
      // إعادة رمي الأخطاء المتوقعة كما هي
      if (err instanceof ConflictException) throw err;
      if (err instanceof BadRequestException) throw err;

      // ✅ FIX: أي خطأ غير متوقع يُسجَّل ويُرمى كـ 500 واضح
      console.error('[AuthService.signup] Unexpected error:', err);
      throw new InternalServerErrorException('فشل إنشاء الحساب، يرجى المحاولة لاحقاً');
    }
  }

  async login(email: string, password: string) {
    // ✅ FIX: حماية كاملة من undefined/null قبل أي string method
    if (!email || !password) {
      throw new BadRequestException('البريد الإلكتروني وكلمة المرور مطلوبان');
    }

    const safeEmail = email.trim().toLowerCase();

    if (!safeEmail) {
      throw new BadRequestException('البريد الإلكتروني لا يمكن أن يكون فارغاً');
    }

    // ✅ FIX: .includes() بعد التحقق من أن safeEmail ليس undefined
    const loginEmail = safeEmail.includes('@')
      ? safeEmail
      : `${safeEmail}@tuhfa.com`;

    try {
      const user = await this.usersService.findByEmail(loginEmail);

      if (!user) {
        throw new UnauthorizedException('بيانات الدخول غير صحيحة');
      }

      const isValid = await this.usersService.validatePassword(user, password);

      if (!isValid) {
        throw new UnauthorizedException('بيانات الدخول غير صحيحة');
      }

      const token = this.generateToken(user._id.toString(), user.email);

      return {
        success: true,
        token,
        user: user.toJSON(),
      };
    } catch (err: any) {
      if (err instanceof UnauthorizedException) throw err;
      if (err instanceof BadRequestException) throw err;

      // ✅ FIX: تسجيل الخطأ غير المتوقع قبل رميه
      console.error('[AuthService.login] Unexpected error:', err);
      throw new InternalServerErrorException('خطأ أثناء تسجيل الدخول، يرجى المحاولة لاحقاً');
    }
  }

  async getMe(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('معرّف المستخدم مفقود');
    }

    try {
      const user = await this.usersService.findById(userId);
      if (!user) throw new UnauthorizedException('المستخدم غير موجود');
      return user.toJSON();
    } catch (err: any) {
      if (err instanceof UnauthorizedException) throw err;

      console.error('[AuthService.getMe] Unexpected error:', err);
      throw new InternalServerErrorException('خطأ أثناء جلب بيانات المستخدم');
    }
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.config.get<string>('JWT_SECRET', 'fallback-secret'),
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '7d'),
      },
    );
  }
}
