/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Eye, ArrowLeft, ArrowRight, Compass, X } from "lucide-react";
import { GALLERY_ITEMS } from "../data";
import { GalleryItem } from "../types";

export default function GalleryView() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters = [
    { id: "all", name: "المعرض كاملاً" },
    { id: "mirrors", name: "مراياتنا" },
    { id: "trays", name: "صواني الدبل" },
    { id: "contracts", name: "كتب الكتاب" },
    { id: "accessories", name: "اكسسوارات" },
  ];

  const filteredItems = activeFilter === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? filteredItems.length - 1 : lightboxIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === filteredItems.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  const currentLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-right">
      
      {/* Page Title */}
      <div className="text-center mb-10 max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center gap-1.5 bg-[#F2C4C4]/30 px-3.5 py-1 rounded-sm text-[10px] uppercase tracking-widest text-[#7B3B2A] font-bold"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E8A0A0]" />
          <span>حقيبة ذكريات ومخرجات نونا الفنية | WORK GALLERY</span>
        </motion.div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#7B3B2A] mt-3">معــرض المقتنيات النادرة</h1>
        <p className="text-sm text-[#A05030]/80 font-sans mt-2">
          تلمسي دقة العمل اليدوي في أعمالنا السابقة للعرائس. اضغطي على أي صورة لتفتحي العدسة المكبرة وتفاصيل الموديل والمواد المستخدمة والمقاس الفعلي.
        </p>
      </div>

      {/* Filter Menu */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 font-sans">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setActiveFilter(f.id);
              setLightboxIndex(null);
            }}
            className={`px-4.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeFilter === f.id
                ? "bg-[#7B3B2A] text-white shadow-sm"
                : "bg-white text-[#7B3B2A] border border-[#F2C4C4]/40 hover:bg-[#F2C4C4]/10"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Masonry Layout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
              whileHover={{ y: -6 }}
              className="group relative aspect-square rounded-[22px] overflow-hidden bg-stone-100 border border-[#F2C4C4]/20 shadow-sm hover:shadow-md cursor-pointer"
              onClick={() => setLightboxIndex(idx)}
            >
              
              {/* Product Photo */}
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-108"
                referrerPolicy="no-referrer"
              />

              {/* Overlays / Hover Effects */}
              <div className="absolute inset-0 bg-[#7B3B2A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4.5 text-right z-10" />
              
              {/* Overlay elements rendered natively to stay fully sharp with text shadow in tailwind */}
              <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 pointer-events-none text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="text-left">
                  <span className="bg-[#FAF0E8] text-[#7B3B2A] text-[10px] font-sans font-bold px-2 py-0.5 rounded-full">
                    شرح التفصيل 🔍
                  </span>
                </div>
                
                <div>
                  <h3 className="font-sans font-bold text-sm leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#FAF0E8]/90 font-sans mt-1 line-clamp-1 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    {item.description}
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox / Immersive Fullscreen Slider Overlay */}
      <AnimatePresence>
        {currentLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close button top right */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2.5 rounded-full border border-white/20 bg-black/40 shadow-sm cursor-pointer z-50 flex items-center justify-center"
              title="إغلاق المعرض"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full max-w-4xl flex flex-col md:flex-row bg-[#FAF0E8] rounded-[30px] overflow-hidden shadow-2xl scale-100 max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              
              {/* Image box with arrows */}
              <div className="relative w-full md:w-2/3 aspect-[4/3] md:aspect-auto md:min-h-[480px] bg-stone-900 flex items-center justify-center">
                <img 
                  src={currentLightboxItem.imageUrl} 
                  alt={currentLightboxItem.title}
                  className="max-h-[70vh] w-full object-contain"
                  referrerPolicy="no-referrer"
                />

                {/* Left Arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 border border-white/20 hover:bg-[#E8A0A0] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  title="السابق"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 border border-white/20 hover:bg-[#E8A0A0] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  title="التالي"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Data panel side */}
              <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col justify-between text-right overflow-y-auto max-h-[90vh]">
                <div>
                  <span className="text-[10px] bg-[#7B3B2A] text-white px-2.5 py-0.5 rounded-full font-serif font-semibold tracking-wider">
                    {currentLightboxItem.category === "mirrors" ? "مرآة العروس" : currentLightboxItem.category === "trays" ? "صينية شبكة" : currentLightboxItem.category === "contracts" ? "ميثاق العقد" : "اكسسوارات"}
                  </span>

                  <h3 className="font-marhey text-[#7B3B2A] text-lg font-bold mt-3 leading-snug">
                    {currentLightboxItem.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-[#7B3B2A]/90 font-sans font-light leading-relaxed mt-2.5 h-auto">
                    {currentLightboxItem.description}
                  </p>

                  {/* Size info if available */}
                  {currentLightboxItem.size && (
                    <div className="mt-4 border-t border-[#F2C4C4]/30 pt-3">
                      <span className="text-[11px] text-[#A05030]/80 font-sans font-bold block">المقاس القياسي:</span>
                      <span className="text-xs text-[#7B3B2A] font-sans font-semibold mt-0.5 block">{currentLightboxItem.size}</span>
                    </div>
                  )}

                  {/* Materials list */}
                  {currentLightboxItem.materials && (
                    <div className="mt-4 border-t border-[#F2C4C4]/30 pt-3">
                      <span className="text-[11px] text-[#A05030]/80 font-sans font-bold block">المواد المستخدمة:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {currentLightboxItem.materials.map((mat, i) => (
                          <span key={i} className="text-[10px] bg-[#E8A0A0]/10 text-[#7B3B2A] border border-[#F2C4C4]/30 px-2.5 py-0.5 rounded-full font-sans font-medium">
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <a
                    href={`https://wa.me/201223633880?text=${encodeURIComponent(
                      `مرحباً نونا! لقد أعجبني جداً المقتنى من المعرض باسم "${currentLightboxItem.title}". هل يمكنني طلب تفصيل طقم مشابه له بأسماء مخصصة؟ 🌸`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center bg-[#E8A0A0] hover:bg-[#7B3B2A] text-white font-semibold text-xs py-3 rounded-full transition-colors shadow-sm cursor-pointer"
                  >
                    أريد طلب تصميم مماثل 💬
                  </a>
                  <span className="block text-center text-[10px] text-gray-400 font-sans mt-2">
                    الرقم المعتمد: tuhfa_bynona
                  </span>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
