import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import * as nodemailer from "nodemailer";

// In-memory OTP store: { email -> { code, expiresAt } }
// NOTE: This resets on server restart. For production use Redis or Firestore.
const otpStore = new Map<string, { code: string; expiresAt: number }>();

@Controller("api/otp")
export class OtpController {

  // POST /api/otp/send
  @Post("send")
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() body: { email: string }) {
    const email = body?.email?.trim()?.toLowerCase();

    if (!email || !email.includes("@")) {
      return { success: false, error: "بريد إلكتروني غير صالح" };
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(email, { code, expiresAt });

    // Build transporter from env variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"تحفة للفنون 🌸" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "🔐 رمز التحقق من تحفة للفنون",
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #FAF0E8; border-radius: 16px; border: 1px solid #E8A0A0;">
            <h2 style="color: #7B3B2A; text-align: center; font-size: 22px; margin-bottom: 8px;">🌸 تحفة للفنون</h2>
            <p style="color: #555; text-align: center; font-size: 14px; margin-bottom: 24px;">رمز التحقق الخاص بكِ لتفعيل حسابك</p>
            <div style="background: #fff; border: 2px dashed #E8A0A0; border-radius: 12px; padding: 24px; text-align: center;">
              <span style="font-size: 40px; font-weight: bold; color: #7B3B2A; letter-spacing: 10px; font-family: monospace;">${code}</span>
            </div>
            <p style="color: #888; text-align: center; font-size: 12px; margin-top: 16px;">هذا الرمز صالح لمدة <strong>5 دقائق</strong> فقط ولا تشاركيه مع أحد.</p>
          </div>
        `,
      });

      return { success: true, message: "تم إرسال الرمز لبريدك الإلكتروني" };
    } catch (err: any) {
      console.error("OTP send error:", err.message);
      return { success: false, error: "فشل إرسال البريد، تحقق من إعدادات SMTP" };
    }
  }

  // POST /api/otp/verify
  @Post("verify")
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() body: { email: string; code: string }) {
    const email = body?.email?.trim()?.toLowerCase();
    const code = body?.code?.trim();

    if (!email || !code) {
      return { success: false, error: "بيانات غير مكتملة" };
    }

    const record = otpStore.get(email);

    if (!record) {
      return { success: false, error: "لم يتم إرسال رمز لهذا البريد، يرجى إعادة الإرسال" };
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return { success: false, error: "انتهت صلاحية الرمز، يرجى طلب رمز جديد" };
    }

    if (record.code !== code) {
      return { success: false, error: "الرمز غير صحيح" };
    }

    // OTP is valid — delete it so it can't be reused
    otpStore.delete(email);
    return { success: true };
  }
}
