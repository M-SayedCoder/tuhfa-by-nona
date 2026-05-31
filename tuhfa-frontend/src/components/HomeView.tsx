/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Sparkles, Heart, Compass, MessageCircle, Star, Instagram, ArrowRight, ArrowLeft } from "lucide-react";
import { PRODUCTS, TESTIMONIALS } from "../data";

interface HomeViewProps {
  setTab: (tab: string) => void;
}

export default function HomeView({ setTab }: HomeViewProps) {
  // Let's feature 3 top notch products for the home page slider
  const featuredProducts = PRODUCTS.slice(0, 3);

  // Categorized sections
  const categories = [
    {
      id: "mirrors",
      title: "مرايات العرايس",
      description: "نقوش مذهبة ولآلئ دقيقة تلف يومكِ الكبير ببريق دافئ.",
      icon: "✨",
      letter: "M",
      count: "دائرية، مقوسة ومتموجة الشكل",
      bgClass: "from-[#F2C4C4]/20 to-[#FAF0E8]",
    },
    {
      id: "trays",
      title: "صواني الشبكة",
      description: "حوامل الدبل المخملية منسقة بالورد الطبيعي المجفف والتوليب ذو الملمس الطبيعي.",
      icon: "💍",
      letter: "T",
      count: "علب دبل مدمجة راقية",
      bgClass: "from-[#F0D8C8]/30 to-[#FAF0E8]",
    },
    {
      id: "contracts",
      title: "لوحات كتب الكتاب",
      description: "عقود زواج وبصمات تذكارية على قماش الداماسك والكتان المعالج الفاخر يدوياً.",
      icon: "✍️",
      letter: "C",
      count: "مكتوبة بالأسلاك والتطريز الفني",
      bgClass: "from-[#FAF0E8] to-[#F2C4C4]/10",
    },
    {
      id: "accessories",
      title: "اكسسوارات المناسبات",
      description: "قبعات تخرج مطرزة بالورد ومستلزمات الحضور التي تصنع الفارق الجمالي.",
      icon: "🌸",
      letter: "A",
      count: "علب قطيفة عتيقة ومستلزمات التخرج",
      bgClass: "from-[#E8A0A0]/10 to-[#FAF0E8]",
    },
  ];

  // Simulated Instagram feed matching user images layout
  const instagramMockImages = [
    {
      id: 1,
      title: "لوحة كتب كتاب 'مختار وندى' ٢٢ مارس ٢٠٢٦",
      desc: "برواز أبيض دبي مع خرز لؤلؤي متناسق حول كتاب ميثاق زواج فاخر",
      tag: "كتب الكتاب"
    },
    {
      id: 2,
      title: "صينية شبكة 'أحمد وهاجر' الكريستالية",
      desc: "ورد جاف بلون عاجي وعقد الدبل منسقة على ميرور متموج فاخر",
      tag: "صواني تقديم"
    },
    {
      id: 3,
      title: "قبوع تخرج 'سنيور رنا ٢٠٢٥'",
      desc: "ورد وبيرل تطريز يدوي دقيق على مخمل أسود كلاسيكي مميز",
      tag: "تخرج سعيد"
    },
    {
      id: 4,
      title: "مرآة العروسين 'محمد وأميرة' ١٠ يوليو ٢٠٢٥",
      desc: "دائرية مرصعة بالخرز الكامل وقماش ساتين دقيق مع حامل شفاف",
      tag: "مرايات الخطوبة"
    },
    {
      id: 5,
      title: "علب الدبل القطيفة 'ملاك الورد الوردية'",
      desc: "بوكس دبل مزدوج مخملي لؤلؤي ناعم بحليات ذهبية",
      tag: "علب دبل"
    },
    {
      id: 6,
      title: "صينية تقديم شبكة وردية للعروسة شيماء",
      desc: "ورد جوري بري أحمر مع علب دبل رمادي على زجاج مصقول",
      tag: "صواني تقديم"
    }
  ];

  return (
    <div className="relative min-h-screen">
      
      {/* 1️⃣ Luxury Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-20 md:py-28 lg:py-36 bg-gradient-to-b from-[#FAF0E8] via-[#FAF0E8] to-[#F0D8C8]/40">
        
        {/* Soft background radial lights */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2C4C4] opacity-20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E8A0A0] opacity-10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center text-right">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 flex flex-col gap-6 order-last lg:order-first">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-[#F2C4C4] text-[#7B3B2A] text-[10px] uppercase font-bold tracking-[0.2em] px-3.5 py-1.5 rounded-sm w-fit shadow-xs animate-pulse"
              >
                <span>صناعة يدوية فاخرة | HANDMADE WITH LOVE</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-[#7B3B2A] leading-[1.15]"
              >
                فـن التفاصيل في <br />
                <span className="italic text-[#A05030]">أجمل لحظات العمر</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base sm:text-lg text-[#7B3B2A]/80 font-sans font-light leading-relaxed max-w-xl"
              >
                نصمم بكلمات الحب قطعاً فنية تخلد ذكرياتكم السعيدة. من مرايا العرائس الملكية وتجهيز صواني الشبكة الوردية إلى عقود كتب الكتاب بالتطريز العربي الأصيل، كل تفصيل في براند <span className="font-semibold text-[#A05030]">TUHFA by Nona</span> يُصنع بلمسة دافئة تدوم مدى العمر.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="flex flex-wrap items-center gap-5 pt-4 justify-start font-sans"
              >
                <button 
                  onClick={() => setTab("custom-order")}
                  className="px-10 py-4 rounded-full bg-[#7B3B2A] hover:bg-[#A05030] text-[#FAF0E8] font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm hover:scale-102 cursor-pointer"
                >
                  صممي طلبكِ الخاص 🌸
                </button>
                
                <div className="hidden sm:block h-[1px] w-16 bg-[#7B3B2A]/30"></div>

                <button 
                  onClick={() => setTab("collections")}
                  className="text-xs font-sans font-bold uppercase tracking-widest text-[#7B3B2A] hover:text-[#A05030] flex items-center gap-1 cursor-pointer"
                >
                  استعراض المعرض الفني
                  <ArrowLeft className="w-4 h-4 text-[#A05030]" />
                </button>
              </motion.div>

              {/* Small trust factor */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="flex items-center gap-6 pt-3 text-[#A05030]/80 text-xs font-sans font-medium"
              >
                <div className="flex items-center gap-1.5 border-l border-[#F2C4C4] pl-4">
                  <span className="text-[#7B3B2A] font-bold text-lg">٣٥٠+</span>
                  <span>عروسة فرحتها بصينية شبكتنا 💍</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#7B3B2A] font-bold text-lg">١٠٠%</span>
                  <span>شغل يدوي دقيق بالخرز الطبيعي والمخمل 🦪</span>
                </div>
              </motion.div>

            </div>

            {/* Hero Visual Studio Interactive Mockup representing mirrors/trays */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[9/11] rounded-[30px] border-4 border-[#F2C4C4]/50 bg-[#FAF0E8] p-4 shadow-[0_20px_50px_rgba(123,59,42,0.12)] flex flex-col justify-between overflow-hidden"
              >
                
                {/* Floating floral absolute stickers overlaying container to recall user's custom mirrors */}
                <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-[#F2C4C4]/30 blur-xl pointer-events-none" />
                
                {/* Vintage floral lace style frame in card */}
                <div className="absolute inset-2.5 rounded-[22px] border border-[#7B3B2A]/10 pointer-events-none" />

                {/* Top header on virtual preview */}
                <div className="text-center pt-2 font-serif text-[10px] text-[#A05030] tracking-wider relative">
                  DESIGNER INTERACTIVE SHOWCASE
                </div>

                {/* Mirror effect glass simulator styled as an elegant Editorial Arch */}
                <div className="flex-1 my-4 rounded-t-full bg-gradient-to-tr from-[#E8A0A0]/20 via-[#FAF0E8] to-[#F2C4C4]/30 border-[10px] border-white p-4 flex flex-col items-center justify-center relative shadow-lg overflow-hidden">
                  
                  {/* Outer edge white dots simulating user's beautifully glued pearl borders in pictures */}
                  <div className="absolute inset-1 border-2 border-dotted border-white/60 rounded-t-full pointer-events-none" />
                  
                  {/* Realistic White Tulips or Dry Flowers decoration on corner */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full border border-[#F2C4C4]/20 flex items-center justify-center shadow-xs">
                    <span className="text-base">🌸</span>
                  </div>
                  <div className="absolute top-10 right-8 w-7 h-7 bg-white rounded-full flex items-center justify-center text-xs shadow-xs">
                    <span className="text-xs">🌾</span>
                  </div>

                  {/* Ring Boxes - Velvet touch simulation in center */}
                  <div className="flex gap-4 justify-center py-2 z-10 mt-12">
                    <div className="w-10 h-10 rounded-md bg-white border border-[#E8A0A0]/40 shadow-[0_4px_8px_rgba(123,59,42,0.15)] flex items-center justify-center">
                      <Heart className="w-4 h-4 text-[#E8A0A0] fill-[#E8A0A0]" />
                    </div>
                    <div className="w-10 h-10 rounded-md bg-white border border-[#E8A0A0]/40 shadow-[0_4px_8px_rgba(123,59,42,0.15)] flex items-center justify-center">
                      <Heart className="w-4 h-4 text-[#E8A0A0] fill-[#E8A0A0]" />
                    </div>
                  </div>

                  {/* Customizable couple name mockup */}
                  <div className="text-center mt-3 z-10">
                    <p className="font-marhey text-[#7B3B2A] text-lg font-bold">محمد & أميرة</p>
                    <p className="font-serif text-[11px] text-[#A05030]/80 tracking-widest mt-1">10.07.2026</p>
                    <p className="text-[10px] text-[#7B3B2A]/90 font-sans font-semibold mt-2.5 bg-white/80 px-2 py-0.5 rounded-full border border-[#F2C4C4]/40">
                      بُورِكَتْ فَاتِحَةُ العُمْرِ مَعَك 🤍
                    </p>
                  </div>

                </div>

                {/* Subtitle bottom */}
                <div className="flex justify-between items-center text-[10px] text-[#A05030]/80 font-sans z-10">
                  <span>✨ مقتنيات يدوية راقية</span>
                  <span>طقم صينية لؤلؤ رقيق 💍</span>
                </div>

              </motion.div>
            </div>

          </div>
        </div>

      </section>

      {/* 2️⃣ Brand Motto Card - Elegant Feminine Feel */}
      <section className="py-12 bg-[#FAF0E8]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 rounded-[30px] bg-[#F2C4C4]/10 border border-[#FAF0E8] shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-2 left-6 text-6xl text-[#E8A0A0]/20 font-serif">“</div>
            <p className="font-marhey text-xl sm:text-2xl text-[#7B3B2A] leading-9 relative z-10">
              "البداية تبدأ بلمسة فنية رقيقة.. <br />
              وكل مقتنى تشتريها من 'تحفة' محاكة بالدعاء والحب لتضيف لفرحتك بريقاً لا ينسى أبداً."
            </p>
            <p className="text-sm font-sans text-[#A05030] mt-4 font-semibold">الفنانة نونا - مؤسسة البراند</p>
            <div className="absolute bottom-2 right-6 text-6xl text-[#E8A0A0]/20 font-serif">”</div>
          </motion.div>
        </div>
      </section>

      {/* 3️⃣ Categories Preview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest block mb-2 font-sans font-bold text-[#A05030]">عوالم تصميم تحفة</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#7B3B2A]">تشكيلـة مـن السـحر اليـدوي</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => setTab("collections")}
              className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#7B3B2A]/10 shadow-xs cursor-pointer hover:shadow-md transition-all text-right flex flex-col justify-between h-[230px]"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-[#F0D8C8]/60 rounded-lg shrink-0 flex items-center justify-center text-xl font-serif italic text-[#7B3B2A] font-bold">
                  {cat.letter}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#7B3B2A]">{cat.title}</h4>
                  <p className="text-[10px] text-[#7B3B2A]/60 font-sans">{cat.count}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-[#7B3B2A]/80 font-sans font-light leading-relaxed">{cat.description}</p>
              </div>
              <div className="flex items-center justify-between mt-3 border-t border-[#7B3B2A]/5 pt-3 text-[10px] font-sans font-bold text-[#A05030]/90 uppercase tracking-widest leading-none">
                <span>تصفح المجموعة</span>
                <span className="text-base text-[#7B3B2A]">←</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚇 Dedicated Gorgeous Metro Delivery Branded Info Section */}
      <section className="py-12 bg-[#FAF0E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[35px] border-2 border-[#F2C4C4]/40 bg-white p-8 md:p-10 shadow-sm text-right flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          >
            {/* Visual background decor element */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#F2C4C4]/10 rounded-br-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#E8A0A0]/5 rounded-tl-full pointer-events-none" />

            {/* Left/Right Text and Icon block */}
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A05030] bg-[#FAF0E8] border border-[#F2C4C4]/40 px-3 py-1 rounded-full w-fit">
                شروط التوصيل والاستلام 🚇
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#7B3B2A] mt-3">التوصيـل عـبر أقـرب محطـة متـرو</h3>
              <p className="text-xs sm:text-sm text-[#A05030]/90 leading-relaxed font-sans mt-3 max-w-2xl">
                بسبب طبيعة القطع اليدوية الفاخرة وحساسيتها العالية، نحرص في براند <strong>تُحفة</strong> على تسليم القطعة يداً بيد لضمان سلامتها الكاملة. نوفر خدمة التوصيل المباشر <strong>داخل محافظتي القاهرة والجيزة فقط</strong> حصرياً من خلال <strong>أقرب محطة مترو</strong> مناسبة لكِ.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-5 text-right justify-start">
                <span className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#7B3B2A]">
                  <span className="w-2 h-2 rounded-full bg-[#E8A0A0]"></span>
                  تغطية كاملة لمحطات خطوط القاهرة والجيزة 🚇
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[#7B3B2A]">
                  <span className="w-2 h-2 rounded-full bg-[#E8A0A0]"></span>
                  تسليم آمن وموثوق يداً بيد 🤝
                </span>
              </div>
            </div>

            {/* Right Interactive/Static badge */}
            <div className="shrink-0 bg-[#FAF0E8] border border-[#F2C4C4]/50 p-6 rounded-[24px] text-center w-full md:w-auto">
              <span className="text-2xl block mb-2">📍</span>
              <span className="text-xs font-bold text-[#7B3B2A] block uppercase tracking-wider">نطاق الخدمة الحالي:</span>
              <span className="text-lg font-marhey text-[#A05030] font-bold block mt-1.5">القاهرة والجيزة فقط</span>
              <span className="text-[10px] text-stone-500 font-sans block mt-1">التسليم عبر محطات المترو</span>
            </div>

          </motion.div>
        </div>
      </section>

      {/* 4️⃣ Featured Products Slider / Visual Card */}
      <section className="py-16 bg-[#FAF0E8]/50 border-y border-[#F2C4C4]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-10 gap-3 text-right">
            <div>
              <span className="text-xs uppercase tracking-widest block mb-2 font-sans font-bold text-[#A05030]">تفاصيل يعشقها القلب</span>
              <h2 className="font-serif text-3xl font-bold text-[#7B3B2A]">مختارات يدوية مميزة</h2>
            </div>
            <button 
              onClick={() => setTab("collections")}
              className="text-[#7B3B2A] hover:text-[#E8A0A0] text-sm font-semibold flex items-center gap-1.5 font-sans"
            >
              تصفحي كل المجموعات
              <ArrowLeft className="w-4 h-4 cursor-pointer" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((p) => (
              <div 
                key={p.id}
                className="group rounded-[30px] bg-[#FAF0E8] border border-[#F2C4C4]/30 overflow-hidden shadow-sm hover:shadow-lg transition-all text-right flex flex-col justify-between"
              >
                
                {/* Image container with custom badges */}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <span className="absolute top-4 right-4 bg-[#7B3B2A] text-[#FAF0E8] text-xs px-3 py-1 rounded-full font-serif font-semibold tracking-wider z-10">
                    {p.categoryAr}
                  </span>
                  
                  <img 
                    src={p.imageUrl} 
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle luxurious overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#7B3B2A]/20 to-transparent pointer-events-none" />
                </div>

                {/* Content body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans font-bold text-base text-[#7B3B2A] line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-[#7B3B2A]/85 mt-2 font-sans font-light leading-relaxed mb-4">{p.description}</p>
                    
                    {/* List components */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.features.slice(0, 2).map((feat, i) => (
                        <span key={i} className="text-[10px] bg-[#FAF0E8] text-[#A05030] px-2 py-0.5 rounded-full border border-[#F2C4C4]/40 font-sans">
                          ✦ {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#F2C4C4]/20 pt-4">
                    <span className="text-xs text-[#A05030] font-sans font-semibold">{p.price}</span>
                    <button 
                      onClick={() => setTab("custom-order")}
                      className="text-xs bg-[#E8A0A0] text-white px-3.5 py-1.5 rounded-full hover:bg-[#7B3B2A] transition-colors font-sans font-semibold flex items-center gap-1"
                    >
                      طلب خاص 💬
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5️⃣ Gallery / Creative Instagram Showcase representing actual attached wedding mirror items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="mb-10">
            <span className="text-xs text-[#A05030] font-sans font-bold tracking-[0.2em] uppercase block mb-1">تغطيات واقعية من مجتمعنا | SOCIAL SHOWCASE</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#7B3B2A]">لحظـات مكللة بروح تُحفة ✨</h2>
            <p className="text-sm text-[#A05030]/80 mt-2 max-w-xl mx-auto font-sans">
              تفاصيل واقعية مشغولة بالحب، كأطقم صواني الدبل ومرايا العرائس المكلومة باللؤلؤ كما تظهر في حسابات عرايسنا.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instagramMockImages.map((img) => (
              <motion.div
                key={img.id}
                whileHover={{ scale: 1.02 }}
                className="group relative rounded-2xl bg-[#FAE0D3]/30 border border-[#F2C4C4]/40 p-4 shadow-sm text-right overflow-hidden flex flex-col justify-between min-h-[170px]"
              >
                {/* Ribbon decoration */}
                <div className="absolute top-2 left-2 rotate-12 text-[#E8A0A0] text-lg font-serif opacity-30">✿</div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] bg-[#7B3B2A] text-white px-2 py-0.5 rounded-full font-sans font-semibold">
                      {img.tag}
                    </span>
                    <Instagram className="w-4 h-4 text-[#E8A0A0]" />
                  </div>
                  <h4 className="font-sans font-bold text-sm text-[#7B3B2A]">{img.title}</h4>
                  <p className="text-xs text-[#7B3B2A]/80 font-sans font-light leading-relaxed mt-2">{img.desc}</p>
                </div>

                <div className="border-t border-[#F2C4C4]/40 pt-2 flex justify-between items-center mt-3">
                  <span className="text-[11px] text-[#A05030] font-serif">@tuhfa_bynona</span>
                  <a 
                    href="https://www.instagram.com/tuhfa_bynona" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#7B3B2A] font-sans font-bold hover:underline"
                  >
                    شاهد التفاصيل ➔
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="https://www.instagram.com/tuhfa_bynona"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#7B3B2A] font-bold border-b border-[#7B3B2A] hover:text-[#E8A0A0] hover:border-[#E8A0A0] transition-colors font-sans pb-1"
            >
              شاركينا فرحتك على إنستغرام لتوثيق التحفة 🌸
            </a>
          </div>

        </div>
      </section>

      {/* 6️⃣ Warm Customer Testimonials Section */}
      <section className="py-16 bg-gradient-to-b from-[#FAF0E8] to-[#FAF0E8]/70 border-t border-[#F2C4C4]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="mb-12">
            <span className="text-xs uppercase tracking-widest block mb-2 font-sans font-bold text-[#A05030]">سعادة عرايسنا | REVIEWS</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#7B3B2A]">آراء مكللـة بالـرضا والجمـال 🤍</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id}
                className="p-6 rounded-3xl bg-[#FAF0E8] border border-[#F2C4C4]/40 shadow-sm text-right flex flex-col justify-between h-[230px]"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3 text-right">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#E8A0A0] fill-[#E8A0A0]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#7B3B2A]/90 font-sans font-light leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#F2C4C4]/20 pt-4 mt-4">
                  <div>
                    <p className="text-sm font-sans font-bold text-[#7B3B2A]">{t.name}</p>
                    <p className="text-[10px] text-[#A05030]/80 font-sans">{t.role}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-sans">{t.date}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
