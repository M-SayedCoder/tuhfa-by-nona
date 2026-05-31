/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, ShoppingBag, Trash2, ArrowLeft, Info } from "lucide-react";
import { PRODUCTS } from "../data";
import { Product } from "../types";

interface WishlistViewProps {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  setTab: (tab: string) => void;
}

export default function WishlistView({ wishlist, toggleWishlist, setTab }: WishlistViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products that exist in our wishlist state array
  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-right">
      
      {/* Editorial Title Block */}
      <div className="text-center mb-10 max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 bg-[#F2C4C4]/30 px-3.5 py-1 rounded-sm text-[10px] uppercase tracking-widest text-[#7B3B2A] font-bold"
        >
          <Heart className="w-3.5 h-3.5 text-[#E8A0A0] fill-[#E8A0A0]" />
          <span>مقتنياتكِ المفضلة محفوظة | MY SAVED INSPIRATION</span>
        </motion.div>
        
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#7B3B2A] mt-3 tracking-wide">صندوق مقتنياتك السحرية</h1>
        <p className="text-sm text-[#A05030]/80 font-sans mt-2">
          هنا تحتفظين بقطعكِ المفضلة من كوليكشن نونا. يمكنك استكشاف تفاصيلها، أو مشاركتها لتنفيذها ومطابقتها لمناسبتك السعيدة.
        </p>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {savedProducts.length === 0 ? (
          <motion.div
            key="empty-wishlist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-[32px] border border-[#F2C4C4]/35 max-w-lg mx-auto p-8 shadow-sm"
          >
            <div className="w-16 h-16 rounded-full bg-[#FAF0E8] flex items-center justify-center mx-auto mb-4 border border-[#F2C4C4]/20">
              <Heart className="w-7 h-7 text-[#E8A0A0]" />
            </div>
            
            <h3 className="font-serif text-lg font-bold text-[#7B3B2A] mb-2">صندوق المفضلة خالي</h3>
            <p className="text-xs sm:text-sm text-[#7B3B2A]/70 font-sans leading-relaxed max-w-xs mx-auto mb-6">
              لم تقومي بإضافة أي مقتنيات لمفضلتكِ بعد؛ تصفحي الكوليكشن واختاري القطع التي تناسب ذوق مناسبك.
            </p>

            <button
              onClick={() => setTab("collections")}
              className="px-8 py-3 bg-[#7B3B2A] hover:bg-[#A05030] text-[#FAF0E8] font-bold text-xs font-sans tracking-widest uppercase rounded-full shadow-sm cursor-pointer hover:scale-102 transition-all flex items-center gap-2 mx-auto"
            >
              <span>تصفحي كوليكشن تُحفة 🌸</span>
              <ArrowLeft className="w-4 h-4 text-[#F2C4C4]" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="wishlist-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {savedProducts.map((p) => (
              <motion.div
                layout
                key={p.id}
                className="group rounded-[24px] bg-white border border-[#F2C4C4]/30 p-4 shadow-sm hover:shadow-md transition-all text-right flex flex-col justify-between"
              >
                {/* Visual Image Frame */}
                <div className="relative aspect-square rounded-[18px] overflow-hidden bg-stone-100 mb-4 shadow-inner">
                  <span className="absolute top-3 right-3 bg-[#FAF0E8]/90 text-[#7B3B2A] text-[9px] font-sans font-bold px-2 py-0.5 rounded-full border border-[#F2C4C4]/30 z-10">
                    {p.categoryAr}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 text-rose-500 shadow-sm flex items-center justify-center z-10 hover:scale-110 active:scale-90 transition-all cursor-pointer"
                    title="حذف من المفضلة"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </button>

                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onClick={() => setSelectedProduct(p)}
                  />
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info and action bar */}
                <div className="flex-grow flex flex-col justify-between">
                  <div onClick={() => setSelectedProduct(p)} className="cursor-pointer">
                    <h3 className="font-sans font-bold text-sm sm:text-base text-[#7B3B2A] group-hover:text-[#A05030] transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-[#7B3B2A]/80 font-sans font-light mt-1.5 line-clamp-2 leading-relaxed h-11">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-4 border-t border-[#F2C4C4]/20 mt-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#A05030] font-sans">{p.price}</span>
                      <button 
                        onClick={() => setSelectedProduct(p)}
                        className="text-[10px] font-semibold font-sans text-[#7B3B2A]/80 underline cursor-pointer hover:text-[#7B3B2A]"
                      >
                        تفاصيل الموديل ➔
                      </button>
                    </div>

                    {/* Order via Whatsapp option */}
                    <a
                      href={`https://wa.me/201223633880?text=${encodeURIComponent(
                        `أهلاً نونا، أنا معجبة جداً وعثرت في مفضلتي على موديل "${p.name}". حابة استفسر عن البدء بحياكة طقم مشابه ومقاسات شحن المحافظات فرحتي 🌸`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 bg-[#7B3B2A] hover:bg-[#A05030] text-[#FAF0E8] font-bold text-xs py-2 px-3 rounded-full transition-all shadow-xs cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      طلب القطعة عبر واتساب
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔮 Luxury Detail Product Modal Overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-3xl bg-[#FAF0E8] rounded-[35px] border-4 border-[#F2C4C4]/50 shadow-[0_25px_60px_-15px_rgba(123,59,42,0.3)] overflow-hidden text-right relative flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image side */}
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[460px] relative bg-stone-100">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#7B3B2A]/30 to-transparent pointer-events-none" />
                <span className="absolute top-4 right-4 bg-[#7B3B2A] text-white text-xs font-serif font-bold px-3 py-1 rounded-full shadow-sm">
                  {selectedProduct.categoryAr}
                </span>
                
                <div className="absolute bottom-4 left-4 right-4 text-left font-serif text-[11px] text-[#FAF0E8]/90 tracking-wider">
                  HANDMADE ACCENTS BY NONA
                </div>
              </div>

              {/* Detail Info Side */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-[#A05030] font-sans font-bold flex items-center gap-1 border border-[#F2C4C4]/50 px-2 py-0.5 rounded-full bg-[#FAF0E8]">
                      <Info className="w-3 h-3" />
                      مقتنى هاندميد مخصص
                    </span>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="text-gray-400 hover:text-[#7B3B2A] font-sans text-xs bg-white/65 p-1.5 rounded-full border border-gray-200 cursor-pointer"
                    >
                      إغلاق ✕
                    </button>
                  </div>

                  <h2 className="font-marhey text-lg sm:text-xl font-bold text-[#7B3B2A] mb-3 leading-snug">
                    {selectedProduct.name}
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-[#7B3B2A]/90 font-sans font-light leading-relaxed mb-6">
                    {selectedProduct.description}
                  </p>

                  <h4 className="text-xs text-[#A05030] font-bold font-sans mb-2">مميزات وتفاصيل القطعة المعتمدة:</h4>
                  <ul className="space-y-1.5 text-xs text-[#7B3B2A] font-sans font-medium mb-6">
                    {selectedProduct.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-[#E8A0A0]">❀</span>
                        {feat}
                      </li>
                    ))}
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#E8A0A0]">❀</span>
                      مدة إعداد القطعة: تتراوح من ٥ لـ ٧ أيام عمل
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center justify-between bg-[#F2C4C4]/20 border border-[#FAF0E8] p-3 rounded-2xl mb-4 text-right">
                    <span className="text-xs text-[#7B3B2A]/70 font-sans">قيمة حياكتها بالتفاصيل:</span>
                    <span className="text-sm font-semibold text-[#7B3B2A] font-sans">{selectedProduct.price}</span>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/201223633880?text=${encodeURIComponent(
                        `أهلاً نونا، حابة استفسر عن تفصيل قطعة الشبكة/المراية "${selectedProduct.name}" فرحتي 🌸`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow flex items-center justify-center gap-2 bg-[#7B3B2A] hover:bg-[#A05030] text-[#FAF0E8] font-bold text-xs py-3 px-4 rounded-full transition-all shadow-xs cursor-pointer text-center"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      اطلبيها مباشرة عبر الواتســاب
                    </a>
                    
                    <button
                      onClick={() => {
                        toggleWishlist(selectedProduct.id);
                        setSelectedProduct(null);
                      }}
                      className="p-3 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors border border-rose-200 cursor-pointer"
                      title="حذف من المفضلة"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
