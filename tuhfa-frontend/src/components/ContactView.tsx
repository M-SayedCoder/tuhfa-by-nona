/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageCircle, Heart, Instagram, MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";

export default function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("تنسيق صينية خطوبة وتفصيل");
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
      }, 3000);
    }, 1200);
  };

  const socialLinks = [
    {
      name: "إنستغرام تحفة الرسمى",
      link: "https://www.instagram.com/tuhfa_bynona",
      handle: "@tuhfa_bynona",
      icon: <Instagram className="w-5 h-5 text-[#E8A0A0]" />
    },
    {
      name: "فيسبوك براند نونا",
      link: "https://www.facebook.com/share/1F6hsGKMfp",
      handle: "Tuhfa by Nona",
      icon: <span className="font-bold text-[#E8A0A0] text-sm">FB</span>
    },
    {
      name: "قناة واتساب الحبيبة",
      link: "https://whatsapp.com/channel/0029VbC5XdW05MUd01jgQg2U",
      handle: "قناة عالم تحفة الوردي",
      icon: <span className="font-bold text-[#E8A0A0] text-sm">WA</span>
    },
    {
      name: "تيك توك الفيديوهات الحية",
      link: "https://www.tiktok.com/@tuhfa_bynona",
      handle: "@tuhfa_bynona_shorts",
      icon: <span className="font-bold text-[#E8A0A0] text-sm">TT</span>
    }
  ];

  const contactOptions = [
    {
      title: "مراسلة مباشرة للطلبات السريعة:",
      text: "01223633880 (واتساب نونا المعتمد)",
      icon: <Phone className="w-5 h-5 text-[#E8A0A0]" />,
      action: "https://wa.me/201223633880?text=%D8%A3%D9%87%D9%84%D8%A7%D9%8B%20%D9%86%D9%88%D9%86%D8%A7%D8%8C%2520%D8%AD%D8%A7%D8%A8%D9%80%D8%A9%2520%D8%A3%D8%B3%D9%81%D8%AA%D8%B3%D8%B1%2520%D8%B9%D9%86%2520%D8%AC%D9%84%D9%83%D8%A9%2520%D8%AA%D8%B5%D9%85%D9%8A%D9%85%2520%D9%88%D8%AA%D9%81%D8%B5%D9%8A%D9%84%2520%D8%B5%D9%8A%D9%86%D9%8A%D8%A9"
    },
    {
      title: "شروط التوصيل والاستلام الرسمية:",
      text: "التوصيل متاح من خلال أقرب محطة مترو (نعمل داخل القاهرة والجيزة فقط) 🚇",
      icon: <span className="text-lg">🚇</span>,
      action: null
    },
    {
      title: "مقر الاستوديو الفني والتصنيع اليدوي:",
      text: "جمهورية مصر العربية، القاهرة والجيزة (التسليم عبر المترو حصراً)",
      icon: <MapPin className="w-5 h-5 text-[#E8A0A0]" />,
      action: null
    }
  ];

  // Specific whatsapp pre-fill message
  const whatsappContactUrl = `https://wa.me/201223633880?text=${encodeURIComponent(
    `أهلاً نونا! حابة أتواصل معك بخصوص "${subject}" وأنا الأخت ${name || "متابعة معجبة"}، رسالتي لكِ: ${message || "استفسار دافئ عن أسعار حياكة المرايات"}`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-right font-sans">
      
      {/* Title block */}
      <div className="text-center mb-16 max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center gap-1.5 bg-[#F2C4C4]/30 px-3.5 py-1 rounded-sm text-[10px] uppercase tracking-widest text-[#7B3B2A] font-bold"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E8A0A0]" />
          <span>تواصل دائم مكلل بـ مودة لقاءات العيلة السعيدة | SAY HELLO</span>
        </motion.div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#7B3B2A] mt-3">تواصلـي مـع الفنـانة نونـا</h1>
        <p className="text-sm text-[#A05030]/80 mt-2">
          نستقبل رسائلكم على مدار ٢٤ ساعة! لا تترددي في إرسال أي استفسار حول تفصيل صينية خطوبتك، أسعار مرايات كتب الكتاب أو خامات المخمل واللؤلؤ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side: Contact details & official handles */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#FAF0E8] rounded-[32px] border border-[#F2C4C4]/30 p-6 sm:p-8 text-right shadow-sm">
          
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs text-[#A05030] font-bold tracking-widest uppercase">مكتب التنسيق الفوري</span>
              <h3 className="font-serif text-[#7B3B2A] text-lg font-bold mt-1">تواصل مريح ومباشر</h3>
            </div>

            {/* List options */}
            <div className="flex flex-col gap-5">
              {contactOptions.map((opt, i) => (
                <div key={i} className="flex gap-4 items-start bg-white p-4.5 rounded-2xl border border-[#F2C4C4]/20 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0E8] flex items-center justify-center shrink-0">
                    {opt.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#7B3B2A] font-sans">{opt.title}</h4>
                    {opt.action ? (
                      <a 
                        href={opt.action} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-[#A05030] hover:text-[#7B3B2A] font-sans font-semibold underline mt-1 block"
                      >
                        {opt.text}
                      </a>
                    ) : (
                      <p className="text-xs text-stone-500 font-sans mt-1">{opt.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Social connections cards */}
          <div className="mt-8 border-t border-[#F2C4C4]/40 pt-6">
            <span className="text-xs text-[#A05030] font-bold block mb-4">قنواتنا وتغطياتنا الرسمية:</span>
            
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((s, idx) => (
                <a
                  key={idx}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-1 p-3 rounded-xl bg-white border border-[#F2C4C4]/25 hover:border-[#E8A0A0] transition-colors shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#7B3B2A] font-bold truncate max-w-[100px]">{s.name}</span>
                    {s.icon}
                  </div>
                  <span className="text-[9px] text-[#A05030]/80 font-mono leading-relaxed">{s.handle}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Contact Send Inquiry Form */}
        <div className="lg:col-span-7">
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="contact-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-[32px] border border-[#F2C4C4]/35 p-6 sm:p-8 shadow-sm flex flex-col gap-5 w-full h-full justify-between"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-xs text-[#A05030] font-bold tracking-widest uppercase block">بريد الاستفسارات السريع</span>
                    <h3 className="font-marhey text-[#7B3B2A] text-lg font-bold mt-1">شاركينا فكرتك أو سؤالكِ</h3>
                  </div>

                  <div className="flex flex-col gap-1.5 text-right mt-1">
                    <label className="text-xs font-bold text-[#7B3B2A] font-sans">الاسم الكريم أو كنية العروس *</label>
                    <input 
                      type="text" 
                      placeholder="الأستاذة: منى سليم"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF0E8]/40 border border-[#F2C4C4]/20 focus:outline-none focus:bg-[#FAF0E8] focus:border-[#E8A0A0] text-sm font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-right">
                    <label className="text-xs font-bold text-[#7B3B2A] font-sans">بريدك الإلكتروني للتواصل (اختياري)</label>
                    <input 
                      type="email" 
                      placeholder="mona@test.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF0E8]/40 border border-[#F2C4C4]/20 focus:outline-none focus:bg-[#FAF0E8] focus:border-[#E8A0A0] text-sm font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-right">
                    <label className="text-xs font-bold text-[#7B3B2A] font-sans">موضوع التنسيق المالي والفني</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF0E8]/40 border border-[#F2C4C4]/20 focus:outline-none focus:bg-[#FAF0E8] focus:border-[#E8A0A0] text-xs sm:text-sm font-sans cursor-pointer"
                    >
                      <option value="تنسيق صينية خطوبة وتفصيل">استفسار عن حياكة صينية دبل مناسبة</option>
                      <option value="برواز كتب كتاب مذهب">سعر وتفصيل برواز تذكار كتب الكتاب لؤلؤ</option>
                      <option value="بصمة العرائس">لوحة بصمة أفراح وحفلة حضور متميزة</option>
                      <option value="تنسيق كاب تخرج باللؤلؤ والورد">كاب وقبعة تخرج مطرزة بالورد ناعم</option>
                      <option value="اخر">موضوع أو استفسار عام آخر</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 text-right">
                    <label className="text-xs font-bold text-[#7B3B2A] font-sans">تفاصيل سؤالك وفكرتك لنونا *</label>
                    <textarea 
                      placeholder="مثال: حابة أسأل لو متاح الشحن لمحافظة الإسكندرية وهل تفصيل صينية التوليب بياخد أكتر من أسبوع؟"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF0E8]/40 border border-[#F2C4C4]/20 focus:outline-none focus:bg-[#FAF0E8] focus:border-[#E8A0A0] text-sm font-sans resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3.5 mt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#7B3B2A] text-white py-3.5 px-6 rounded-full font-sans font-semibold text-sm hover:bg-[#A05030] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>جاري إرسال الرسالة...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#F2C4C4]" />
                        <span>أرسلي الرسالة فوراً للاستفتاء 🤍</span>
                      </>
                    )}
                  </button>

                  <a
                    href={whatsappContactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-2 text-sm shadow-sm transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4.5 h-4.5 fill-white text-emerald-500 animate-pulse" />
                    استشيري نونا مباشرة عبر واتساب الفرح 🌸
                  </a>
                </div>

              </motion.form>
            ) : (
              <motion.div
                key="submitted-contact"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[32px] border border-emerald-100 p-8 shadow-sm text-center flex flex-col items-center justify-center gap-5 w-full h-full min-h-[450px]"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-150">
                  <CheckCircle className="w-8 h-8" />
                </div>
                
                <h2 className="font-marhey text-[#7B3B2A] text-xl font-bold">تم إرسال بريدك وملاحظتكِ بنجاح!</h2>
                <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed max-w-sm">
                  بإذن الله، ستقوم الفنانة نونا بقراءة رسالتك الوردية والتواصل معكِ على رقم الهاتف أو البريد المرفق لتوفير أفضل تفصيل.
                </p>

                <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
                  <a
                    href={whatsappContactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white font-semibold py-2.5 rounded-full text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    توجيه المضمون لواتساب لسرعة الرد 🌸
                  </a>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#7B3B2A] font-bold underline cursor-pointer"
                  >
                    إرسال استفسار آخر
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
