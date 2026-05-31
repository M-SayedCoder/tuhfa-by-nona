import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

// In-memory OTP store
const otpStore = new Map<string, { code: string; expiresAt: number }>();

@Injectable()
export class OtpService {

  async sendOtp(email: string): Promise<{ success: boolean; error?: string }> {
    // ✅ FIX: optional chaining + nullish coalescing قبل كل string operation
    const cleanEmail = (email?.trim() ?? '').toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'بريد إلكتروني غير صالح' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(cleanEmail, { code, expiresAt });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"تحفة للفنون 🌸" <${process.env.SMTP_USER}>`,
        to: cleanEmail,
        subject: '🔐 رمز التحقق من تحفة للفنون',
        html: `
          <div dir="rtl" style="font-family: Arial; max-width: 480px; margin: auto;
               padding: 32px; background: #FAF0E8; border-radius: 16px; border: 1px solid #E8A0A0;">
            <h2 style="color: #7B3B2A; text-align: center;">🌸 تحفة للفنون</h2>
            <p style="text-align:center; color:#555;">رمز التحقق الخاص بك</p>
            <div style="text-align:center; margin:20px 0;">
              <span style="font-size:40px; font-weight:bold; letter-spacing:8px; color:#7B3B2A;">
                ${code}
              </span>
            </div>
            <p style="text-align:center; font-size:12px; color:#888;">صالح لمدة 5 دقائق فقط</p>
          </div>
        `,
      });

      return { success: true };

    } catch (err: any) {
      // ✅ FIX: تسجيل الخطأ الكامل للـ debugging
      console.error('[OtpService.sendOtp] Email send failed:', err?.message ?? err);
      // ✅ FIX: حذف الـ OTP من الـ store إذا فشل الإرسال
      otpStore.delete(cleanEmail);
      return {
        success: false,
        error: 'فشل إرسال البريد، تحقق من إعدادات SMTP',
      };
    }
  }

  verifyOtp(email: string, code: string): { success: boolean; error?: string } {
    // ✅ FIX: optional chaining على email وcode قبل أي string method
    const cleanEmail = (email?.trim() ?? '').toLowerCase();
    const cleanCode  = code?.trim() ?? '';

    if (!cleanEmail || !cleanCode) {
      return { success: false, error: 'بيانات غير مكتملة' };
    }

    // ✅ FIX: التحقق من cleanEmail.includes بعد التأكد أنه ليس فارغاً
    if (!cleanEmail.includes('@')) {
      return { success: false, error: 'بريد إلكتروني غير صالح' };
    }

    const record = otpStore.get(cleanEmail);

    if (!record) {
      return { success: false, error: 'لم يتم إرسال رمز لهذا البريد' };
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanEmail);
      return { success: false, error: 'انتهت صلاحية الرمز، يرجى طلب رمز جديد' };
    }

    if (record.code !== cleanCode) {
      return { success: false, error: 'الرمز غير صحيح' };
    }

    otpStore.delete(cleanEmail);
    return { success: true };
  }
}
