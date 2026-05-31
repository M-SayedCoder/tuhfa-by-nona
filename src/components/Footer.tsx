/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Instagram, ThumbsUp, Send, Check } from "lucide-react";

interface FooterProps {
  setTab: (tab: string) => void;
}

export default function Footer({ setTab }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== "") {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="relative bg-[#7B3B2A] text-[#FAF0E8] overflow-hidden pt-16 pb-12 rounded-t-[40px] md:rounded-t-[60px] shadow-[0_-15px_30px_rgba(123,59,42,0.1)]">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#FAF0E8]/5 rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#E8A0A0]/5 rounded-tr-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-[#FAF0E8]/10 text-right">
          
          {/* Brand Col */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTab("home")}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FAF0E8]">
                <Sparkles className="w-5 h-5 text-[#7B3B2A]" />
              </div>
              <span className="font-marhey text-2xl font-bold tracking-tight">
                TUHFA <span className="text-[#F2C4C4] text-xs font-sans mr-1">by Nona</span>
              </span>
            </div>
            
            <p className="text-sm text-[#FAF0E8]/80 leading-relaxed font-sans font-light">
              قطع فنية يدوية ملهمة تُحاك بالحب والشغف لترافق أيامكم السعيدة وخطواتكم الأولى نحو الميثاق الغليظ والتخرج الفاخر. كل تفصيل في 'تحفة' يُصمم كقصيدة حب تليق بكِ وبمن تحبين.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.instagram.com/tuhfa_bynona" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FAF0E8]/10 hover:bg-[#E8A0A0] text-[#FAF0E8] hover:scale-110 transition-all shadow-sm"
                title="إنستغرام تحفة"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a 
                href="https://www.facebook.com/share/1F6hsGKMfp" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FAF0E8]/10 hover:bg-[#E8A0A0] text-[#FAF0E8] hover:scale-110 transition-all shadow-sm"
                title="فيسبوك تحفة"
              >
                <ThumbsUp className="w-4.5 h-4.5" />
              </a>
              <a 
                href="https://whatsapp.com/channel/0029VbC5XdW05MUd01jgQg2U" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FAF0E8]/10 hover:bg-[#E8A0A0] text-[#FAF0E8] hover:scale-110 transition-all shadow-sm"
                title="قناة واتساب"
              >
                <span className="font-bold text-xs">WA</span>
              </a>
              <a 
                href="https://www.tiktok.com/@tuhfa_bynona" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FAF0E8]/10 hover:bg-[#E8A0A0] text-[#FAF0E8] hover:scale-110 transition-all shadow-sm"
                title="تيك توك تحفة"
              >
                <span className="font-bold text-xs">TT</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-12 sm:col-span-6 md:col-span-2">
            <h4 className="text-[#F2C4C4] font-semibold text-sm tracking-wider uppercase mb-5 font-sans">تصفح الصفحات</h4>
            <ul className="space-y-3 font-sans text-sm">
              <li>
                <button onClick={() => setTab("home")} className="hover:text-[#F2C4C4] transition-colors leading-6">الرئيسية</button>
              </li>
              <li>
                <button onClick={() => setTab("collections")} className="hover:text-[#F2C4C4] transition-colors leading-6">مجموعات كوليكشن</button>
              </li>
              <li>
                <button onClick={() => setTab("gallery")} className="hover:text-[#F2C4C4] transition-colors leading-6">معرض المقتنيات</button>
              </li>
              <li>
                <button onClick={() => setTab("custom-order")} className="hover:text-[#F2C4C4] transition-colors leading-6">صمم طلب مخصص</button>
              </li>
              <li>
                <button onClick={() => setTab("about")} className="hover:text-[#F2C4C4] transition-colors leading-6">قصتنا الفريدة</button>
              </li>
              <li>
                <button onClick={() => setTab("contact")} className="hover:text-[#F2C4C4] transition-colors leading-6">تواصل واتساب</button>
              </li>
            </ul>
          </div>

          {/* Categories Preview Links */}
          <div className="col-span-12 sm:col-span-6 md:col-span-3">
            <h4 className="text-[#F2C4C4] font-semibold text-sm tracking-wider uppercase mb-5 font-sans">التصنيفات الرائجة</h4>
            <ul className="space-y-3 font-sans text-sm text-[#FAF0E8]/80">
              <li>📍 مرايات عرايس فخمة ومطرزة</li>
              <li>📍 صواني تقديم الشبكة الممتازة</li>
              <li>📍 برواز كتب كتاب وميثاق الزواج</li>
              <li>📍 بصمات أفراح وتذكارات الحضور</li>
              <li>📍 قبعات تخرج مخملية مكللة بالورد</li>
              <li>📍 كماليات واكسسوارات حفل الزفاف</li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
            <h4 className="text-[#F2C4C4] font-semibold text-sm tracking-wider uppercase mb-2 font-sans">النشرة الوردية الصيفية</h4>
            <p className="text-xs text-[#FAF0E8]/70 leading-relaxed font-sans font-light">
              امسحي بريدك هنا لتصلك أحدث تصاميم صواني الورد واللؤلؤ الحصرية ودروس تطريز كتب الكتاب من نونا.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex mt-2 w-full">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني الدافئ" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-2.5 rounded-full bg-[#FAF0E8]/10 text-sm text-[#FAF0E8] placeholder-[#FAF0E8]/50 border border-[#FAF0E8]/20 focus:outline-none focus:border-[#F2C4C4] focus:ring-1 focus:ring-[#F2C4C4] text-right font-sans"
              />
              <button 
                type="submit" 
                className="absolute left-1 top-1 w-9 h-9 rounded-full bg-[#FAF0E8] hover:bg-[#F2C4C4] text-[#7B3B2A] flex items-center justify-center transition-all shadow-sm cursor-pointer"
              >
                {subscribed ? <Check className="w-4 h-4 text-emerald-600 animate-pulse" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            {subscribed && (
              <span className="text-[11px] text-[#F2C4C4] font-sans text-right animate-pulse">
                تم الاشتراك بنجاح! شكراً لإنضمامك لعالمنا ✨
              </span>
            )}
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row-reverse items-center justify-between text-xs text-[#FAF0E8]/60 gap-4">
          <p className="font-sans">
            © {new Date().getFullYear()} تحفة من أعمال نونا الفنية. كل الحقوق محفوظة.
          </p>
          <div className="flex gap-4 font-sans font-light">
            <a href="#privacy" className="hover:text-[#FAF0E8] transition-colors">سياسة الخصوصية الوردية</a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#FAF0E8] transition-colors">شروط التفصيل والشحن</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
