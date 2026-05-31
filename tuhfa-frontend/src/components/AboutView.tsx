/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Sparkles, Heart, Gift, Award, CheckCircle, ShieldAlert, HeartHandshake } from "lucide-react";
import { TIMELINE_STEPS } from "../data";

export default function AboutView() {
  
  // Custom helper to render matching Lucide icons dynamically
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles": return <Sparkles className="w-5 h-5 text-[#FAF0E8]" />;
      case "Gift": return <Gift className="w-5 h-5 text-[#FAF0E8]" />;
      case "Heart": return <Heart className="w-5 h-5 text-[#FAF0E8]" />;
      case "HeartHandshake": return <HeartHandshake className="w-5 h-5 text-[#FAF0E8]" />;
      default: return <Sparkles className="w-5 h-5 text-[#FAF0E8]" />;
    }
  };

  const usps = [
    {
      title: "دقة الحياكة والتثبيت الثنائي",
      desc: "نستخدم أفضل أنواع غراء المجوهرات الأصلي والتطريز بالخيط المقوى، مما يضمن ثبات حبات اللؤلؤ والورود الحريرية لعشرات السنين دون تساقط.",
      icon: <Award className="w-6 h-6 text-[#E8A0A0]" />
    },
    {
      title: "مرآة فضية صقيلة عالية النقاء",
      desc: "جميع المرايا المستخدمة في صواني الشبكة حقيقية خالية من التشوهات والانكسارات، لن تبهت أو تصدأ وبسمك متميز يتحمل ثقل دبل الزواج الثمينة.",
      icon: <CheckCircle className="w-6 h-6 text-[#E8A0A0]" />
    },
    {
      title: "تخصيص بنسبة ١٠٠%",
      desc: "نرفض تماماً تكرار التصاميم بصورة آلية. كل عروسة تتواصل مع نونا تحصل على جلسة رسم رقمية مجانية للأسماء والتخطيط المبدئي قبل بدء التفصيل الحقيقي.",
      icon: <Heart className="w-6 h-6 text-[#E8A0A0]" />
    }
  ];

  const processSteps = [
    {
      step: "٠١",
      title: "التصور والاستشارة الرقمية",
      desc: "نستمع لأحلامك، مناسبتك، حجم الصينية أو المرآة، تدرج الألوان المتماشى مع فستانك، ونقش الأسماء."
    },
    {
      step: "٠٢",
      title: "تجهيز القاعدة والخامات",
      desc: "قص المرآة بالليزر للأشكال المتموجة وغسلها بمحاليل خاصة، وتجهيز المخمل والأقمشة الإمبراطورية للأطراف."
    },
    {
      step: "٠٣",
      title: "التطريز وتثبيت الدانتيل",
      desc: "حياكة الخيوط الفضية وخز حبات اللؤلؤ حبة حبة يدوياً، مع تنسيق أزهار الجبسوفيليا والورد بالتناسق المناسب."
    },
    {
      step: "٠٤",
      title: "التعبئة والهدية الوردية",
      desc: "تغليف القطعة بصحون كرتونية واقية، تعطيرها بمسك العروس الفاخر، وتضمين كارت تهنئة هاندميد يعيش مع ذكرياتك."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-right font-sans">
      
      {/* 1️⃣ Intro brand header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center gap-1.5 bg-[#F2C4C4]/30 px-3.5 py-1 rounded-sm text-[10px] uppercase tracking-widest text-[#7B3B2A] font-bold"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E8A0A0]" />
          <span>بريد الشاعرية والخطوات اليدوية الفريدة | STATED HERITAGE</span>
        </motion.div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#7B3B2A] mt-3">حكــاية تُحفـة مـع نونــا</h1>
        <p className="text-sm text-[#A05030]/80 mt-2 leading-relaxed">
          نتقاسم الحب والنقاوة في كنف المشغولات اليدوية الفخمة. تعرفي على فلسفة البراند، خطوات العمل الفني، والخط الزمني لرحلتنا لقلوب آلاف العرائس.
        </p>
      </div>

      {/* 2️⃣ Detailed Artist & Brand Story */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20 bg-white p-6 sm:p-10 rounded-[40px] border border-[#F2C4C4]/20 shadow-sm">
        
        {/* Artistic Illustration Side representing the Handmade Vibe */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[350px] aspect-square rounded-[30px] overflow-hidden border-4 border-[#FAF0E8] shadow-md bg-stone-100">
            <img 
              src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800" 
              alt="Handmade work in progress"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Soft text overlay displaying warm artistic touch */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#7B3B2A]/40 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-[11px] font-sans font-medium tracking-wide">
                أنامل الفنانة نونا وهي تضع فصوص اللؤلؤ الدقيقة لبريق الفرح 🌸
              </span>
            </div>
          </div>
        </div>

        {/* Text Story Side */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <span className="text-xs text-[#E8A0A0] font-bold tracking-widest uppercase">قصة البداية الفنية</span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#7B3B2A] font-bold">بدأت بمرآة فرح رقيقة لصديقة العمر..</h2>
          
          <p className="text-sm text-[#7B3B2A]/90 leading-relaxed font-light font-sans">
            لطالما آمنت الفنانة نونا أن ليلة الفرح ليست مجرد حدث تجاري عابر، بل ميثاق مقدس وأثر يعيش في الذاكرة والمنزل. عندما لم تجد صديقتها مرآة وصينية تليق برقة فستان فرحها وتوزيعات الورد الأنيقة، قررت نونا تصميمها بنفسها كهدية محاكة بالدعاء واللآلئ.
          </p>

          <p className="text-sm text-[#7B3B2A]/90 leading-relaxed font-light font-sans">
            صنعت يدها تلك القطعة المدهشة وسط دهشة وتصفيق الحضور؛ وبدأت العرائس تتوافد لطلب تصاميم مشابهة تحمل روحهن الخاصة. هكذا ولد براند <strong className="font-semibold text-[#A05030]">✨ TUHFA by Nona</strong> في قنا وصحاري مصر، ليتحول باستمراره وشغف العمل اليدوي إلى أيقونة الجودة المعتمدة لتجهيزات الخطوبة وكتب الكتاب في قاطبة المحافظات.
          </p>

          <div className="flex items-center gap-4 bg-[#FAF0E8] p-4 rounded-2xl border border-[#F2C4C4]/30 mt-2">
            <div className="w-10 h-10 rounded-full bg-[#E8A0A0] flex items-center justify-center text-[#FAF0E8] text-lg">
              📜
            </div>
            <div>
              <p className="text-xs font-bold text-[#7B3B2A]">رؤيتنا الأساسية:</p>
              <p className="text-[11px] text-gray-500 mt-0.5 font-sans">أن تمتد تفاصيل تحفة اليدوية الدافئة لتزين مدخل كل بيت للزوجية بلمسة دلال عصرية فخمة.</p>
            </div>
          </div>
        </div>

      </section>

      {/* 3️⃣ Unique Selling Points (لماذا نحن؟) */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl font-bold text-[#7B3B2A]">لماذا يختار العرائس براند 'تحفة'؟</h2>
          <p className="text-sm text-[#A05030] mt-1">نسعى دائماً لتقديم الجودة الفنية والعيارية التي تستحق ثقتك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {usps.map((usp, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-[24px] bg-[#FAF0E8] border border-[#F2C4C4]/30 shadow-sm text-right flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                {usp.icon}
              </div>
              <h3 className="font-sans font-bold text-base text-[#7B3B2A]">{usp.title}</h3>
              <p className="text-xs text-[#7B3B2A]/85 font-sans leading-relaxed font-light">{usp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4️⃣ Creative Handmade Process Steps */}
      <section className="mb-20 py-12 border-y border-[#F2C4C4]/20 bg-[#FAF0E8]/40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-marhey text-2xl font-bold text-[#7B3B2A]">خطوات حياكة تفاصيل تحفتكِ</h2>
            <p className="text-sm text-[#A05030] mt-1">رحلة الفكرة من الاستديو التفاعلي وحتى باب شقتكم السعيدة</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((stp) => (
              <div 
                key={stp.step}
                className="p-5.5 rounded-2xl bg-white border border-[#F2C4C4]/20 shadow-sm flex flex-col justify-start relative overflow-hidden"
              >
                <span className="absolute -top-3 -left-3 text-5xl font-serif font-black text-[#F2C4C4]/20 select-none">
                  {stp.step}
                </span>
                
                <span className="text-xs bg-[#E8A0A0] text-white px-2 py-0.5 rounded-md font-sans font-bold w-fit mb-4">
                  المرحلة {stp.step}
                </span>

                <h3 className="font-sans font-bold text-sm text-[#7B3B2A] mb-2">{stp.title}</h3>
                <p className="text-xs text-gray-500 font-sans leading-relaxed font-light h-[80px] overflow-hidden">{stp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ Elegant Historic Timeline */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-marhey text-2xl font-bold text-[#7B3B2A]">خرائط الفرح - خط زمني ملهم</h2>
          <p className="text-sm text-[#A05030] mt-1">تتبعي محطات نجاح أعمال نونا الفنية وخطوات نموها الممتد</p>
        </div>

        {/* Real vertical timeline layout */}
        <div className="relative border-r-2 border-[#E8A0A0] pr-6 md:pr-8 mr-4 sm:mr-8 space-y-10 py-2 text-right">
          
          {TIMELINE_STEPS.map((step, idx) => (
            <motion.div 
              key={step.year}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex flex-col gap-2 bg-white p-5 rounded-2xl border border-[#F2C4C4]/25 shadow-sm"
            >
              {/* Floating year bubble */}
              <div className="absolute top-1/2 -translate-y-1/2 -right-[43px] w-10.5 h-10.5 rounded-full bg-[#7B3B2A] border-4 border-[#FAF0E8] shadow-sm flex items-center justify-center">
                {getIcon(step.iconName)}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#E8A0A0] text-[#FAF0E8] font-serif font-extrabold px-3 py-0.5 rounded-full">
                  {step.year}
                </span>
                <h4 className="font-sans font-bold text-sm text-[#7B3B2A]">{step.title}</h4>
              </div>

              <p className="text-xs text-[#7B3B2A]/85 font-sans font-light leading-relaxed mt-1">
                {step.description}
              </p>
            </motion.div>
          ))}

        </div>
      </section>

    </div>
  );
}
