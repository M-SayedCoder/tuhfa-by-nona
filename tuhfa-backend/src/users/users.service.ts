import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: {
    email: string;
    name: string;
    phone: string;
    password: string;
    isAdmin?: boolean;
  }): Promise<UserDocument> {
    // ✅ FIX: التحقق من email قبل .toLowerCase() أو .split()
    if (!data?.email) {
      throw new BadRequestException('البريد الإلكتروني مطلوب');
    }

    const normalizedEmail = data.email.trim().toLowerCase();

    try {
      const existing = await this.userModel.findOne({ email: normalizedEmail });
      if (existing) {
        throw new ConflictException('هذا البريد الإلكتروني مسجّل بالفعل');
      }

      const passwordHash = await bcrypt.hash(data.password, 12);

      // ✅ FIX: .split('@') آمن بعد التحقق من وجود @ في email
      const username = normalizedEmail.includes('@')
        ? normalizedEmail.split('@')[0]
        : normalizedEmail;

      const user = new this.userModel({
        email: normalizedEmail,
        name: data.name?.trim() || '',
        phone: data.phone?.trim() || '',
        passwordHash,
        username,
        isAdmin: data.isAdmin ?? false,
      });

      return await user.save();
    } catch (err: any) {
      if (err instanceof ConflictException) throw err;
      if (err instanceof BadRequestException) throw err;
      console.error('[UsersService.create] Unexpected error:', err);
      throw new InternalServerErrorException('فشل إنشاء المستخدم');
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    if (!email) return null;

    try {
      return await this.userModel
        .findOne({ email: email.trim().toLowerCase() })
        .exec();
    } catch (err: any) {
      console.error('[UsersService.findByEmail] Unexpected error:', err);
      throw new InternalServerErrorException('فشل البحث عن المستخدم');
    }
  }

  async findById(id: string): Promise<UserDocument | null> {
    if (!id) return null;

    try {
      return await this.userModel.findById(id).exec();
    } catch (err: any) {
      // ✅ FIX: CastError يعني id مش صالح - نرجع null بدل crash
      if (err?.name === 'CastError') return null;
      console.error('[UsersService.findById] Unexpected error:', err);
      throw new InternalServerErrorException('فشل جلب بيانات المستخدم');
    }
  }

  async validatePassword(user: UserDocument, password: string): Promise<boolean> {
    // ✅ FIX: التحقق من وجود user.passwordHash قبل bcrypt.compare
    if (!user?.passwordHash || !password) return false;

    try {
      return await bcrypt.compare(password, user.passwordHash);
    } catch (err: any) {
      console.error('[UsersService.validatePassword] Unexpected error:', err);
      return false;
    }
  }

  async updateProfile(
    userId: string,
    updates: Partial<{ name: string; phone: string; isVerifiedClient: boolean }>,
  ): Promise<UserDocument> {
    if (!userId) throw new BadRequestException('معرّف المستخدم مطلوب');

    try {
      const user = await this.userModel
        .findByIdAndUpdate(userId, updates, { new: true })
        .exec();
      if (!user) throw new NotFoundException('المستخدم غير موجود');
      return user;
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      console.error('[UsersService.updateProfile] Unexpected error:', err);
      throw new InternalServerErrorException('فشل تحديث الملف الشخصي');
    }
  }

  async findAll(): Promise<UserDocument[]> {
    try {
      return await this.userModel.find().exec();
    } catch (err: any) {
      console.error('[UsersService.findAll] Unexpected error:', err);
      throw new InternalServerErrorException('فشل جلب قائمة المستخدمين');
    }
  }
}
