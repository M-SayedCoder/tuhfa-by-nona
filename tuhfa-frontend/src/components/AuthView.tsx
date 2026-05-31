import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  LogIn, 
  UserPlus, 
  Lock, 
  Phone, 
  FileText, 
  ShieldCheck, 
  LogOut, 
  ShoppingBag, 
  Sparkles, 
  Database, 
  CheckCircle,
  HelpCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CustomOrder } from "../types";
import { getErrorMessage } from "../lib/api";

interface AuthViewProps {
  setTab: (tab: string) => void;
}

export default function AuthView({ setTab }: AuthViewProps) {
  const { currentUser, login, signup, logout, ready } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // OTP Verification flow state
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  // NOTE: generatedOtp is NO LONGER stored on the client — OTP is sent via email only
  const [inputOtp, setInputOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSentEmail, setOtpSentEmail] = useState(""); // Track which email OTP was sent to

  // Helper: convert Arabic/Eastern-Arabic numerals to Western Arabic numerals
  const toWesternNumerals = (str: string) =>
    str.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (d) =>
      String(d.charCodeAt(0) & 0xf)
    );
  const [otpTimer, setOtpTimer] = useState(60);

  useEffect(() => {
    let interval: any;
    if (showOtpScreen && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpScreen, otpTimer]);

  const [userOrders, setUserOrders] = useState<CustomOrder[]>(() => {
    const raw = localStorage.getItem("tuhfa_custom_orders");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
    return [];
  });

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-sans">
        <div className="w-8 h-8 rounded-full border-2 border-[#7B3B2A] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Filter orders related to this logged-in account
  const currentAccountOrders = userOrders.filter(o => {
    if (!currentUser) return false;
    // Match by customer name, phone, or custom search if applicable
    const custNameNormalized = o.customerName.trim().toLowerCase();
    const phoneNormalized = o.phone.trim().replace(/\s/g, "");
    const userPhoneNormalized = currentUser.phone?.trim().replace(/\s/g, "") || "";
    
    return (
      custNameNormalized === currentUser.name.trim().toLowerCase() ||
      phoneNormalized === userPhoneNormalized ||
      o.customerName.toLowerCase().includes(currentUser.username)
    );
  });


  // Validate email domain and capture typos or fake email patterns
  const validateEmailTypo = (email: string): { isValid: boolean; error?: string } => {
    const cleanedEmail = email.trim().toLowerCase();
    
    if (!cleanedEmail.includes("@")) {
      return { isValid: false, error: "صيغة البريد الإلكتروني غير صحيحة. يجب أن يحتوي على علامة '@' ومخدّم بريدي كامل (مثلاً: jasmine@gmail.com)." };
    }

    const parts = cleanedEmail.split('@');
    if (parts.length !== 2) {
      return { isValid: false, error: "صيغة البريد الإلكتروني غير صحيحة. يرجى مراجعته." };
    }

    const [_, domain] = parts;

    // Check for bad characters or spaces
    if (/\s/.test(cleanedEmail)) {
      return { isValid: false, error: "عنوان البريد الإلكتروني لا يمكن أن يحتوي على فراغات أو مسافات." };
    }

    // Check for consecutive dots as in gmail..com
    if (cleanedEmail.includes("..")) {
      return { isValid: false, error: "البريد الإلكتروني لا يمكن أن يحتوي على نقطتين متتاليتين (..). يرجى مراجعته وتصحيحه." };
    }

    const gmailTypos = [
      "gmaill.com", "gamil.com", "gmaile.com", "gmal.com", "gmale.com", 
      "gmali.com", "gmaill.co", "gmial.com", "gmeil.com", "gmaul.com", 
      "gmaill.net", "gmll.com", "gmaill.org", "gmall.com", "gmailll.com",
      "gmai.com", "gma.com", "gmil.com", "gimail.com", "gamil.co", "gmal.co",
      "gamil.net", "gmaill.net", "gmail.co", "gmail.comm", "gmail.coom", "gmail.con",
      "gmail.cmo", "gmail.ccom", "gmail.cooom"
    ];
    if (gmailTypos.includes(domain)) {
      return { isValid: false, error: `لقد كتبتِ النطاق (${domain}) بالخطأ الإملائي! البريد الإلكتروني الصحيح ينتهي بـ (gmail.com). يرجى تصحيحه لربط حسابك ببريدك الحقيقي الفعال.` };
    }

    const yahooTypos = [
      "yahooo.com", "yaho.com", "yahu.com", "yahho.com", "yahooo.co", "yaho.co", "yahou.com", "yahoo.cxm", "yahoo.con",
      "yahoo.comm", "yahoo.coom"
    ];
    if (yahooTypos.includes(domain)) {
      return { isValid: false, error: `لقد كتبتِ النطاق (${domain}) بالخطأ! البريد الإلكتروني الصحيح ينتهي بـ (yahoo.com). يرجى تصحيحه لربط حسابك بنجاح.` };
    }

    const hotmailTypos = [
      "hotmale.com", "hotmial.com", "hotml.com", "htmial.com", "hotmai.com", "hotamil.com", "hotmaill.com", "hotmle.com",
      "hotmail.comm", "hotmail.coom"
    ];
    if (hotmailTypos.includes(domain)) {
      return { isValid: false, error: `لقد كتبتِ النطاق (${domain}) بالخطأ الإملائي! البريد الإلكتروني الصحيح ينتهي بـ (hotmail.com).` };
    }

    const outlookTypos = [
      "outlok.com", "outlookk.com", "outclook.com", "outlock.com", "outloo.com", "outlok.co", "outlook.comm"
    ];
    if (outlookTypos.includes(domain)) {
      return { isValid: false, error: `لقد كتبتِ النطاق (${domain}) بالخطأ! البريد الإلكتروني الصحيح ينتهي بـ (outlook.com).` };
    }

    const icloudTypos = [
      "iclouds.com", "icloude.com", "iclud.com", "iclou.com", "icloud.comm"
    ];
    if (icloudTypos.includes(domain)) {
      return { isValid: false, error: `لقد كتبتِ النطاق (${domain}) بالخطأ! البريد الإلكتروني الصحيح هو (icloud.com).` };
    }

    // Block common temporary/disposable fake mail generators
    const blockedDomains = [
      "tempmail.com", "10minutemail.com", "yopmail.com", "mailinator.com", "dispostable.com", 
      "guerrillamail.com", "sharklasers.com", "getairmail.com", "trashmail.com", "temp-mail.org",
      "fakeemail.com", "tempmail.co", "disposable.com", "throwaway.com"
    ];
    if (blockedDomains.some(blo => domain === blo || domain.endsWith("." + blo))) {
      return { isValid: false, error: "عذراً، يرجى التسجيل ببريد إلكتروني حقيقي ونشط (مثل جيميل أو ياهو) وليس بريد مؤقت أو وهمي لضمان حماية واستمرارية حسابك." };
    }

    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
      return { isValid: false, error: "النطاق البريدي غير مكتمل. يرجى التأكد من كتابة (.com) أو النطاق الصحيح في نهاية البريد الإلكتروني." };
    }

    const tld = domainParts[domainParts.length - 1];
    const invalidTlds = ["comm", "coom", "con", "cmo", "ccom", "cooom", "gamil", "gmaill", "nett", "orgm"];
    if (invalidTlds.includes(tld)) {
      return { isValid: false, error: `لقد كتبتِ نهاية البريد الإلكتروني (.${tld}) بشكل خاطئ! البريد الإلكتروني الصحيح يجب أن ينتهي بـ (.com) أو (.net). يرجى كتابته بشكل صحيح.` };
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(cleanedEmail)) {
      return { isValid: false, error: "صيغة البريد الإلكتروني غير صالحة. يرجى إدخال بريد حقيقي مثل name@gmail.com." };
    }

    return { isValid: true };
  };


  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const loginUser = username.trim();

    // If they typed an email address to login, let's validate it for typos to prevent user frustration
    if (loginUser.includes("@")) {
      const check = validateEmailTypo(loginUser);
      if (!check.isValid) {
        setError(check.error || "تأكدي من البريد الإلكتروني المدخل.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await login(loginUser, password);
      if (res.success) {
        setSuccess("تم تسجيل الدخول بنجاح! مرحباً بك في عائلة تحفة 🌸");
        // Clear forms
        setUsername("");
        setPassword("");
        // If they are admin, let's redirect them to custom-order portal
        setTimeout(() => {
          if (currentUser?.isAdmin || localStorage.getItem("tuhfa_admin_session") === "true") {
            setTab("custom-order");
          } else {
            setTab("home");
          }
        }, 1500);
      } else {
        setError(res.error || "فشل تسجيل الدخول");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const signupUser = username.trim();

    // Mandatory real email address check
    const emailCheck = validateEmailTypo(signupUser);
    if (!emailCheck.isValid) {
      setError(emailCheck.error || "البريد الإلكتروني المدخل غير صالح.");
      return;
    }

    // Egyptian active mobile phone check
    const cleanPhone = phone.trim();
    const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;
    if (!egyptianPhoneRegex.test(cleanPhone)) {
      setError("يرجى إدخال رقم هاتف محمول مصري حقيقي ومكون من ١١ رقماً ويبدأ بـ (010، 011، 012، 015) للتواصل الفوري ومتابعة طلبك.");
      return;
    }

    if (password.length < 6) {
      setError("يجب أن تكون كلمة المرور ٦ خانات (أرقام أو حروف) على الأقل لحماية حسابك وللتوافق مع معايير الأمان.");
      return;
    }

    // Send OTP via backend — the code is NEVER exposed to the client
    setLoading(true);
    try {
      const { otpApi } = await import("../lib/api");
      const data = await otpApi.send(signupUser);
      if (!data.success) {
        setError(data.error || "فشل إرسال رمز التحقق، تحقق من البريد الإلكتروني وأعد المحاولة");
        setLoading(false);
        return;
      }
      // OTP sent successfully — show OTP input screen
      setOtpSentEmail(signupUser);
      setInputOtp("");
      setOtpError(null);
      setOtpTimer(60);
      setShowOtpScreen(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setLoading(true);

    // Convert Arabic/Eastern-Arabic digits to Western before verifying
    const normalizedOtp = toWesternNumerals(inputOtp.trim());

    // Verify OTP via backend — never compare locally
    try {
      const { otpApi } = await import("../lib/api");
      const verifyData = await otpApi.verify(otpSentEmail, normalizedOtp);

      if (!verifyData.success) {
        setOtpError(verifyData.error || "رمز التحقق غير صحيح");
        setLoading(false);
        return;
      }
    } catch (err) {
      setOtpError(getErrorMessage(err));
      setLoading(false);
      return;
    }

    // OTP verified — proceed to create account
    try {
      const res = await signup(otpSentEmail, name, phone, password);
      if (res.success) {
        setSuccess("✨ تم التحقق من هويتك وإنشاء حسابك المفعّل بنجاح!");
        setShowOtpScreen(false);
        // Clear forms
        setUsername("");
        setName("");
        setPhone("");
        setPassword("");
        setInputOtp("");
        setOtpSentEmail("");
        setTimeout(() => {
          setTab("custom-order");
        }, 1500);
      } else {
        let errorMsg = res.error || "حدث خطأ أثناء التسجيل";
        setOtpError(errorMsg);
      }
    } catch (err) {
      let errorMsg = "فشل إنشاء حساب جديد.";
      if (err instanceof Error) {
        if (err.message.includes("weak-password") || err.message.toLowerCase().includes("weak")) {
          errorMsg = "كلمة المرور ضعيفة للغاية! يجب أن تتكون من ٦ خانات على الأقل لضمان الأمان.";
        }
      }
      setOtpError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 font-sans text-right" dir="rtl">
      {currentUser ? (
        /* 🌟 LOGGED IN USER PROFILE PORTAL */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Welcome Banner Card */}
          <div className="bg-gradient-to-br from-[#7B3B2A] to-[#4A2015] rounded-[36px] p-8 sm:p-12 text-[#FAF0E8] shadow-xl relative overflow-hidden border border-[#FAF0E8]/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8A0A0]/15 rounded-full blur-3xl -z-0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FAF0E8]/10 rounded-full blur-2xl -z-0 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-[#FAF0E8]/15 px-3 py-1 rounded-full text-xs font-bold text-[#E8A0A0] backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>حساب راقي ومفعّل 👑</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-black">
                    مرحباً بكِ، {currentUser.name} ✦
                  </h2>
                  <p className="text-sm text-stone-300">
                    أهلاً بكِ في مساحتكِ الخاصة لدى "تحفة". هنا نتابع مقتنياتك ومناسباتك الفاخرة أولاً بأول.
                  </p>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setTab("home");
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 text-xs font-bold transition-all border border-rose-300/20 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-stone-300 block text-xs mb-1">اسم الحساب:</span>
                  <strong className="text-white font-mono">{currentUser.username}</strong>
                </div>
                {currentUser.email && !currentUser.email.endsWith("@tuhfa.com") && (
                  <div>
                    <span className="text-stone-300 block text-xs mb-1 font-sans">البريد الإلكتروني المعتمد:</span>
                    <strong className="text-[#FAF0E8] font-sans font-bold bg-white/10 px-2 py-0.5 rounded text-xs">{currentUser.email}</strong>
                  </div>
                )}
                {currentUser.phone && (
                  <div>
                    <span className="text-stone-300 block text-xs mb-1">رقم هاتف التواصل:</span>
                    <strong className="text-white font-mono">{currentUser.phone}</strong>
                  </div>
                )}
                <div>
                  <span className="text-stone-300 block text-xs mb-1 font-sans">صلاحية الحساب الحالي:</span>
                  <strong className="text-[#FAF0E8] bg-[#E8A0A0]/20 px-2 py-0.5 rounded text-xs">
                    {currentUser.isAdmin ? "👑 مدير النظام (نونا)" : "🌸 عميل مميز"}
                  </strong>
                </div>
              </div>

              {/* Secure Admin Portal Access */}
              {currentUser.isAdmin && (
                <motion.div
                  initial={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl p-5 border border-[#F2C4C4]/60 text-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8"
                >
                  <div className="text-right space-y-1">
                    <h4 className="font-serif font-black text-base text-[#7B3B2A] flex items-center gap-1.5">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      لوحة الإشراف والحسابات الكبرى
                    </h4>
                    <p className="text-xs text-stone-500 max-w-lg leading-relaxed">
                      تم تفعيل لوحة تحكم التاجر نيابةً عن إدارة "تحفة للفنون". يمكنك مراجعة طلبات التوصيل، الإحصائيات الشهرية، وتفاصيل محطات المترو المتفق عليها مع العرائس.
                    </p>
                  </div>
                  <button
                    onClick={() => setTab("custom-order")}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#7B3B2A] hover:bg-[#A05030] text-[#FAF0E8] font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Database className="w-4 h-4" />
                    <span>دخول لوحة تحكم نونا ➔</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* User Specific Order Logs */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2C4C4]/30 shadow-xs space-y-6">
            <h3 className="font-serif font-black text-xl text-[#7B3B2A] flex items-center gap-2 pb-4 border-b border-stone-100">
              <ShoppingBag className="w-5 h-5 text-[#E8A0A0]" />
              لوحة متابعة طلبات التصميم الخاصة بكِ ({currentAccountOrders.length})
            </h3>

            {currentAccountOrders.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-stone-50 border border-stone-100 text-stone-500 space-y-4">
                <HelpCircle className="w-12 h-12 mx-auto text-[#E8A0A0]/70" />
                <div className="space-y-1">
                  <p className="font-bold text-stone-800 text-sm">لا توجد طلبات مسجلة تحت اسمكِ أو هاتفكِ في المتصفح حالياً.</p>
                  <p className="text-xs text-stone-400">أي طلب تصميم تقومين بتقديمه باسم {currentUser.name} أو رقم الهاتف ({currentUser.phone}) سيظهر هنا تلقائياً لتتمكني من متابعة مدى تجهيزه وتسليمه.</p>
                </div>
                <button
                  onClick={() => setTab("custom-order")}
                  className="px-5 py-2 rounded-xl bg-[#FAF0E8] border border-[#F2C4C4]/40 hover:bg-[#FAF0E8]/70 text-[#7B3B2A] text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>اطلبي تصميمك المخصص الأول الآن</span>
                  <span>✨</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {currentAccountOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="p-5 rounded-2xl border-2 border-[#FAF0E8] bg-stone-50/70 hover:bg-white hover:border-[#F2C4C4]/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-2 text-right">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-stone-400">#TS-{order.id.slice(-6).toUpperCase()}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === "delivered" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          order.status === "preparing" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                          order.status === "confirmed" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                          order.status === "canceled" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                          "bg-stone-100 text-stone-600 border border-stone-200"
                        }`}>
                          {order.status === "delivered" ? "تم التسليم بنجاح ✓" :
                           order.status === "preparing" ? "قيد تجهيز الطارة والتفريغ 🎨" :
                           order.status === "confirmed" ? "تم تأكيد الموعد 📅" :
                           order.status === "canceled" ? "مُلغى ✕" : "بانتظار المراجعة والاتفاق ⏳"}
                        </span>
                        
                        <span className="text-[11px] text-[#A05030] bg-[#FAF0E8] px-2 py-0.5 rounded font-medium">
                          📅 {order.createdAt}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-sm text-[#7B3B2A]">
                        لوحة تطريز مخصصة لمناسبة {
                          order.occasionType === "marriage" ? "زفاف ملكي سعيد" :
                          order.occasionType === "engagement" ? "خطوبة وربط قلوب" :
                          order.occasionType === "graduation" ? "تخرج وتفوق بهيج" :
                          "مولود جديد مبارك"
                        }
                      </h4>

                      <p className="text-xs text-stone-500 max-w-xl">
                        <strong>نص اللوحة المطلوبة:</strong> "{order.customText}" ✦ <strong>تفاصيل إضافية:</strong> {order.details || "لا توجد طلبات إضافية."}
                      </p>
                    </div>

                    <div className="w-full md:w-auto p-3.5 bg-white rounded-xl border border-stone-100 flex items-center justify-between md:justify-end gap-6 text-left shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block">محطة مترو التسليم:</span>
                        <strong className="text-xs text-[#7B3B2A] block mt-0.5">🟢 محطة {order.metroStation || "حلوان"}</strong>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-stone-400 block">تكلفة الاتفاق المتوقعة:</span>
                        <strong className="text-sm font-mono font-black text-[#7B3B2A] block mt-0.5">
                          {order.priceEGP ? `${order.priceEGP} ج.م` : "سعر تسعيري للإشراف"}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        /* 🔒 ANONYMOUS STATS: SIGN IN & SIGN UP SCREENS */
        <div className="max-w-md mx-auto relative z-10">
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border-2 border-[#F2C4C4]/40 shadow-xl space-y-8">
            {/* Upper Logo Vibe */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-[#FAF0E8] rounded-full border border-[#F2C4C4]/50 flex items-center justify-center mx-auto shadow-xs text-[#7B3B2A]">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="font-serif font-black text-2xl text-[#7B3B2A]">
                {mode === "login" ? "بوابة مقتنيات تحفة ✦" : "عضوية تحفة الراقية ✨"}
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
                {mode === "login" 
                  ? "سجلي دخولك الآمن لتتمكني من حفظ ومتابعة فواتيرك وطلباتك المصنوعة يدوياً." 
                  : "انضمي لعائلتنا لتجربة تنسيق لوني وحفظ طلباتك بـ رمز مرور خاص بكِ."}
              </p>
            </div>

            {/* Response Alerts */}
            {error && !showOtpScreen && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold leading-relaxed"
              >
                ⚠️ {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold leading-relaxed"
              >
                ✓ {success}
              </motion.div>
            )}

            {/* FORM CONTAINER */}
            {showOtpScreen ? (
              /* OTP VERIFICATION VIEW */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key="otp-screen"
                className="space-y-5 text-right font-sans"
              >
                <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 text-xs text-[#7B3B2A] leading-relaxed flex items-start gap-2">
                  <span className="text-sm">🔑</span>
                  <div className="space-y-1">
                    <p className="font-bold">نظام تأكيد الهوية:</p>
                    <p className="text-stone-600">
                      تم إرسال رمز التحقق المكوّن من 6 أرقام إلى بريدك الإلكتروني. يُرجى التحقق من صندوق الوارد (أو البريد العشوائي) وإدخال الرمز أدناه خلال 5 دقائق.
                    </p>
                  </div>
                </div>

                {/* Confirmation badge — shows email address only, NOT the code */}
                <div className="bg-gradient-to-br from-[#FAF0E8] to-[#F2C4C4]/20 border-2 border-dashed border-[#E8A0A0]/60 rounded-2xl p-5 text-center space-y-2">
                  <span className="text-[11px] text-[#7B3B2A] font-bold block">📩 تم إرسال الرمز إلى:</span>
                  <div className="font-mono text-sm font-bold text-[#7B3B2A] break-all">
                    {otpSentEmail}
                  </div>
                  <p className="text-[10px] text-stone-500 leading-relaxed max-w-xs mx-auto">
                    تحقق من صندوق الوارد أو مجلد Spam — الرمز صالح لمدة 5 دقائق فقط
                  </p>
                </div>

                {otpError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold leading-relaxed">
                    ⚠️ {otpError}
                  </div>
                )}

                <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600 block">أدخلي رمز التحقق المُرسَل لبريدك:</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="● ● ● ● ● ●"
                        value={inputOtp}
                        onChange={(e) =>
                          setInputOtp(
                            toWesternNumerals(e.target.value).replace(/\D/g, "")
                          )
                        }
                        className="w-full text-center py-2.5 text-stone-800 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#E8A0A0] transition-all bg-stone-50 focus:bg-white font-mono font-bold tracking-[0.2em]"
                      />
                      <ShieldCheck className="w-4 h-4 text-[#E8A0A0] absolute top-3.5 right-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-[#7B3B2A] hover:bg-[#A05030] disabled:bg-stone-300 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm mt-4 flex items-center justify-center gap-1.5"
                  >
                    {loading ? (
                      <div className="w-4 h-4 rounded-full border border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>تفعيل الحساب ومزامنة البيانات ✓</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center justify-between text-[11px] pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    disabled={otpTimer > 0 || loading}
                    onClick={async () => {
                      setLoading(true);
                      setOtpError(null);
                      try {
                        const { otpApi } = await import("../lib/api");
                        const data = await otpApi.send(otpSentEmail);
                        if (data.success) {
                          setInputOtp("");
                          setOtpTimer(60);
                        } else {
                          setOtpError(data.error || "فشل إعادة الإرسال");
                        }
                      } catch (err) {
                        setOtpError(getErrorMessage(err));
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className={`font-bold transition-colors ${
                      otpTimer > 0
                        ? "text-stone-400 cursor-not-allowed"
                        : "text-[#7B3B2A] hover:underline cursor-pointer"
                    }`}
                  >
                    {otpTimer > 0 ? (
                      <span>إعادة الإرسال خلال {otpTimer} ثانية ⏳</span>
                    ) : (
                      <span>إعادة إرسال الرمز 🔄</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpScreen(false);
                      setOtpError(null);
                    }}
                    className="text-stone-400 hover:text-[#7B3B2A] hover:underline"
                  >
                    تعديل الهاتف/البريد ➔
                  </button>
                </div>
              </motion.div>
            ) : (
              /* STANDARD LOGIN / SIGNUP FORMS */
              <form onSubmit={mode === "login" ? handleLoginSubmit : handleSignupSubmit} className="space-y-4">
                
                {mode === "signup" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-600 block">الاسم الحقيقي بالكامل (للتسليم يداً بيد)</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="مثال: ياسمين محمد صبري"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pr-10 pl-4 py-2 text-stone-800 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#E8A0A0] transition-all bg-stone-50 focus:bg-white"
                        />
                        <User className="w-4 h-4 text-stone-400 absolute top-3 right-3.5" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-600 block">رقم هاتف المحمول (لالتأكيد والتواصل بالمترو)</label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          placeholder="مثال: 01223633880"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pr-10 pl-4 py-2 text-stone-800 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#E8A0A0] transition-all bg-stone-50 focus:bg-white font-mono"
                        />
                        <Phone className="w-4 h-4 text-stone-400 absolute top-3 right-3.5" />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 block">
                    {mode === "signup" ? "البريد الإلكتروني الحقيقي النشط (لتلقي تفاصيل طلبياتك)" : "البريد الإلكتروني الحقيقي (أو اسم حسابك)"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={mode === "login" ? "مثال: sara@gmail.com أو اسم حسابك" : "اكتبي بريدك للتواصل الرسمي مثلاً: jasmine@gmail.com"}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 text-stone-800 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#E8A0A0] transition-all bg-stone-50 focus:bg-white font-mono"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute top-3 right-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 block">رمز المرور الخاص بكِ</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pr-10 pl-10 py-2 text-stone-800 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#E8A0A0] transition-all bg-stone-50 focus:bg-white ${
                        !showPassword ? "tracking-widest" : ""
                      }`}
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute top-3 right-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 hover:text-[#7B3B2A] transition-colors focus:outline-none"
                      title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#7B3B2A] hover:bg-[#A05030] disabled:bg-stone-300 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm mt-4 flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border border-white border-t-transparent animate-spin" />
                  ) : mode === "login" ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>دخول آمن ➔</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>إنشاء وتفعيل الحساب ➔</span>
                    </>
                  )}
                </button>

              </form>
            )}

            <div className="text-center pt-4 border-t border-stone-100 text-xs">
              {mode === "login" ? (
                <p className="text-stone-500">
                  انضمي إلينا وسجلي حساباً جديداً بالكامل؟{" "}
                  <button
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                    }}
                    className="text-[#7B3B2A] hover:underline font-black cursor-pointer"
                  >
                    إنشاء حساب جديد 🌸
                  </button>
                </p>
              ) : (
                <p className="text-stone-500">
                  هل لديكِ حساب بالفعل؟{" "}
                  <button
                    onClick={() => {
                      setMode("login");
                      setError(null);
                    }}
                    className="text-[#7B3B2A] hover:underline font-black cursor-pointer"
                  >
                    تسجيل دخولكِ ➔
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
