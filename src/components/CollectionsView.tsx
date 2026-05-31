/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, Filter, Info, ShoppingBag, Share2, Copy, Check } from "lucide-react";
import { PRODUCTS, METRO_STATIONS } from "../data";
import { Product } from "../types";

const getProductSpecs = (id: string) => {
  switch (id) {
    case "mr1":
      return { prep: "٤ - ٥ أيام", rating: 5.0, count: 31, complexity: "تطريز لؤلؤي ممتاز 🦪" };
    case "mr2":
      return { prep: "٥ - ٦ أيام", rating: 4.9, count: 24, complexity: "بلورات كريستال براقة ✨" };
    case "mr3":
      return { prep: "٥ - ٦ أيام", rating: 5.0, count: 18, complexity: "علبة غطاء سداسي 💎" };
    case "mr4":
      return { prep: "٦ - ٧ أيام", rating: 4.9, count: 29, complexity: "لؤلؤ دائري ملكي مكرر 👑" };
    case "mr5":
      return { prep: "٤ - ٥ أيام", rating: 4.8, count: 15, complexity: "فيونكة ستان لؤلؤية 🎀" };
    case "m1":
      return { prep: "٧ - ٩ أيام", rating: 5.0, count: 28, complexity: "حياكة دقيقة معقدة 🔥" };
    case "m2":
      return { prep: "٥ - ٦ أيام", rating: 4.8, count: 19, complexity: "حياكة تفصيلية ناعمة ✨" };
    case "t1":
      return { prep: "٦ - ٨ أيام", rating: 4.9, count: 34, complexity: "طوق لؤلؤي مضاعف 💎" };
    case "t2":
      return { prep: "٤ - ٥ أيام", rating: 4.7, count: 12, complexity: "تنسيق توليب واقعي 🌸" };
    case "c1":
      return { prep: "٨ - ١٠ أيام", rating: 5.0, count: 42, complexity: "تطريز يدوي مذهب ثري 👑" };
    case "c2":
      return { prep: "٥ - ٦ أيام", rating: 4.9, count: 21, complexity: "تطريز حريري منسق 🌱" };
    case "a1":
      return { prep: "٣ - ٤ أيام", rating: 4.8, count: 15, complexity: "تطريز مخملي بالورد 🎓" };
    case "a2":
      return { prep: "٢ - ٣ أيام", rating: 4.9, count: 26, complexity: "تبطين قطيفة ناعمة 🎀" };
    default:
      return { prep: "٥ - ٧ أيام", rating: 4.9, count: 18, complexity: "عمل يدوي مخصص 🌸" };
  }
};

const getProductMaterials = (id: string): string[] => {
  if (id.startsWith("mr")) {
    return ["زجاج فضي بلجيكي رائق", "لؤلؤ عاجي مصقول", "زهور مجففة منسقة"];
  } else if (id.startsWith("t")) {
    return ["أكريليك ياباني مقوى", "طوق لؤلؤي مطرز", "ورد حريري فاخر"];
  } else if (id.startsWith("c")) {
    return ["طارة مذهبة غير قابلة للصدأ", "كتان ناصع البياض", "خرز وتطريز يدوياً"];
  } else if (id.startsWith("a")) {
    return ["مخمل ملكي ناعم", "تبطين داخلي فاخر", "إكسسوار مذهب مقاوم للبهتان"];
  } else {
    return ["قاعدة مرآة نقية", "لؤلؤ عاجي فريد", "ورد مجفف يدوم طويلاً"];
  }
};

interface ZoomProps {
  src: string;
  alt: string;
}

function ProductImageWithZoom({ src, alt }: ZoomProps) {
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setCoords({ x, y });
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden cursor-zoom-in"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setCoords({ x: 50, y: 50 });
      }}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-250 ease-out"
        style={{
          transform: isHovering ? "scale(1.35)" : "scale(1)",
          transformOrigin: `${coords.x}% ${coords.y}%`
        }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

interface CollectionsViewProps {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
}

export default function CollectionsView({ wishlist, toggleWishlist }: CollectionsViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedMetro, setSelectedMetro] = useState("الدقي");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get("product");
    if (prodId) {
      const found = PRODUCTS.find((p) => p.id === prodId || p.id === decodeURIComponent(prodId));
      if (found) {
        setSelectedProduct(found);
      }
    }
  }, []);

  useEffect(() => {
    setCopied(false);
  }, [selectedProduct]);

  const handleCopyLink = () => {
    if (!selectedProduct) return;
    const url = `${window.location.origin}${window.location.pathname}?product=${selectedProduct.id}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  const filters = [
    { id: "all", name: "كل المقتنيات" },
    { id: "mirrors", name: "مرايات العرايس" },
    { id: "trays", name: "صواني الشبكة" },
    { id: "contracts", name: "كتب الكتاب وبصماتها" },
    { id: "accessories", name: "اكسسوارات ومستلزمات مناسبات" },
  ];

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = activeFilter === "all" || p.category === activeFilter;
    if (!searchQuery.trim()) return matchesCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.categoryAr.toLowerCase().includes(query) ||
      p.features.some((f) => f.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Header block */}
      <div className="text-center mb-6 max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 bg-[#F2C4C4]/30 px-3.5 py-1 rounded-sm text-[10px] uppercase tracking-widest text-[#7B3B2A] font-bold"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E8A0A0]" />
          <span>مجموعة مختارة بعناية فائقة | CURATED BOUTIQUE</span>
        </motion.div>
        
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#7B3B2A] mt-3 tracking-wide">كوليكشن تُحفــة الراقـي</h1>
        <p className="text-sm text-[#A05030]/80 font-sans mt-2">
          تصفحي أرقى صواني تقديم مجوهرات الزفاف، مرايا كتب الكتاب الملكية، وعقود البصمة المبتكرة المحاكة بالخرز الفاخر.
        </p>
      </div>

      {/* 🔍 Elite Brand Search Bar */}
      <div className="max-w-md mx-auto mb-10 relative">
        <input
          type="text"
          placeholder="ابحثي عن مرآة، صينية شبكة، أو لوحة بصمة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-5 py-3 pr-11 text-right bg-white border border-[#F2C4C4]/40 rounded-full focus:outline-none focus:border-[#7B3B2A] text-xs sm:text-sm font-sans text-[#7B3B2A] placeholder-[#7B3B2A]/40 shadow-xs focus:ring-1 focus:ring-[#7B3B2A] transition-all"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7B3B2A]/50 text-sm">
          🔍
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-sans text-gray-400 hover:text-[#7B3B2A] p-1 rounded-full cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <div className="flex items-center gap-1 text-[#7B3B2A] ml-2 text-xs font-bold font-sans">
          <Filter className="w-3.5 h-3.5" />
          <span>تصفية:</span>
        </div>
        
        {filters.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4.5 py-2 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#7B3B2A] text-white shadow-sm scale-102"
                  : "bg-white text-[#7B3B2A] border border-[#F2C4C4]/40 hover:bg-[#F2C4C4]/10"
              }`}
            >
              {f.name}
            </button>
          );
        })}
      </div>

      {/* Catalog Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((p, index) => {
            const specs = getProductSpecs(p.id);
            // Elegant premium wave motion for subtle organic offset feel
            const waveDuration = 4.2 + (index % 3) * 0.7;
            const waveDelay = (index % 4) * 0.3;

            return (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.9, y: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -4, 0] // Premium luxury gentle floating wave motion
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  y: {
                    duration: waveDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: waveDelay
                  },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
                whileHover={{ 
                  scale: 1.03,
                  y: -6,
                  rotate: [0, -0.4, 0.4, 0],
                  transition: { 
                    scale: { duration: 0.3 },
                    y: { duration: 0.3 },
                    rotate: {
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "easeInOut"
                    }
                  }
                }}
                className="group rounded-[24px] bg-white border border-[#F2C4C4]/30 p-4 shadow-sm hover:shadow-md hover:border-[#7B3B2A]/20 transition-all text-right flex flex-col justify-between cursor-pointer"
                onClick={() => setSelectedProduct(p)}
              >
                
                {/* Product Visual Frame */}
                <div className="relative aspect-square rounded-[18px] overflow-hidden bg-stone-100 mb-4 shadow-inner">
                  {/* Micro Category Tag */}
                  <span className="absolute top-3 right-3 bg-[#FAF0E8]/95 text-[#7B3B2A] text-[10px] font-sans font-bold px-2.5 py-1 rounded-full border border-[#F2C4C4]/30 z-10 shadow-sm">
                    {p.categoryAr}
                  </span>

                  {/* Handmade Certification Badge */}
                  <span className="absolute bottom-3 left-3 bg-[#7B3B2A]/90 text-[#FAF0E8] text-[9px] font-sans font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm z-10 transition-all group-hover:bg-amber-600/90">
                    <span>👑</span>
                    <span>صنعة يدوية فاخرة معتمدة</span>
                  </span>

                  {/* 💖 Live heart bookmark trigger */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/85 shadow-sm flex items-center justify-center z-10 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    title={wishlist.includes(p.id) ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        wishlist.includes(p.id) 
                          ? "fill-rose-500 text-rose-500" 
                          : "text-[#7B3B2A]/70"
                      }`} 
                    />
                  </button>

                  {/* 🔍 Product image with interactive magnifying glass lens */}
                  <ProductImageWithZoom src={p.imageUrl} alt={p.name} />
                  
                  {/* ⭐ Average satisfaction star-rating overlay */}
                  <div className="absolute bottom-3 right-3 bg-white/95 px-2.5 py-1 rounded-full border border-[#F2C4C4]/30 flex items-center gap-1 shadow-sm z-10 text-[10px] sm:text-xs">
                    <span className="text-amber-500 text-sm font-bold">★</span>
                    <span className="font-bold text-[#7B3B2A] font-sans">{specs.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-[9px] font-sans">({specs.count})</span>
                  </div>
                </div>

                {/* Title & Desc */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans font-bold text-sm sm:text-base text-[#7B3B2A] line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-[#7B3B2A]/80 font-sans font-light mt-1.5 line-clamp-2 leading-relaxed h-11">
                      {p.description}
                    </p>

                    {/* Material Composition Section */}
                    <div className="mt-2 text-right">
                      <span className="text-[9px] font-bold text-[#A05030]/80 block mb-1">🔍 تركيب المواد الفنية:</span>
                      <div className="flex flex-wrap gap-1">
                        {getProductMaterials(p.id).map((material, mIdx) => (
                          <span key={mIdx} className="text-[9px] bg-[#FAF0E8] text-[#7B3B2A] border border-[#F2C4C4]/20 px-1.5 py-0.5 rounded-full font-sans transition-all group-hover:border-[#7B3B2A]/20">
                            ✦ {material}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ⏱️ Estimated Preparation Time & Complexity Badge */}
                    <div className="flex justify-between items-center text-[10px] font-sans text-[#7B3B2A]/70 mt-3 mb-2">
                      <span className="flex items-center gap-1 bg-[#F2C4C4]/15 border border-[#F2C4C4]/30 px-2.5 py-0.5 rounded-md">
                        <span>⏱️ التحضير: {specs.prep}</span>
                      </span>
                      <span className="text-[#A05030] font-semibold text-[9px]">{specs.complexity}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-3 border-t border-[#F2C4C4]/20 mt-2">
                    {/* Pulsating WhatsApp Order Call to Action button */}
                    <a
                      href={`https://wa.me/201223633880?text=${encodeURIComponent(
                        `أهلاً نونا، حابة استفسر عن تفصيل وتنسيق قطعة "${p.name}" الفاخرة من كوليكشن تُحفة 🌸`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="relative overflow-hidden w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2 px-3 rounded-xl text-[10px] sm:text-[11px] font-sans font-bold transition-all duration-300 shadow-xs cursor-pointer"
                    >
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                      </span>
                      <span>طلب وتنسيق القطعة بالواتساب 💬</span>
                    </a>

                    {/* Info points */}
                    <div className="flex flex-wrap gap-1">
                      {p.features.slice(0, 2).map((feat, idx) => (
                        <span key={idx} className="text-[9px] bg-[#FAF0E8] text-[#A05030] px-1.5 py-0.5 rounded-md border border-[#F2C4C4]/20 font-sans">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center bg-[#FAF0E8]/50 p-2 rounded-xl border border-[#F2C4C4]/15">
                      <span className="text-[11px] text-[#A05030] font-sans font-bold">{p.price}</span>
                      <span className="text-[10px] font-sans text-[#7B3B2A] font-semibold flex items-center gap-1 underline">
                        تفاصيل الموديل ➔
                      </span>
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
          </AnimatePresence>
        </motion.div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#F2C4C4]/35 max-w-lg mx-auto">
          <p className="text-sm text-[#7B3B2A]/70 font-sans font-medium">عذراً، لا يوجد قطع متوفرة حالياً في هذا التصنيف.</p>
          <button 
            onClick={() => setActiveFilter("all")}
            className="text-xs text-[#7B3B2A] font-bold underline mt-4 font-sans block mx-auto"
          >
            تصفح كل المقتنيات المتوفرة
          </button>
        </div>
      )}

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
                
                {/* Visual quote overlay */}
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
                      className="text-gray-400 hover:text-[#7B3B2A] font-sans text-xs bg-white/60 p-1.5 rounded-full border border-gray-200 cursor-pointer"
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

                  {/* Materials & Customization list */}
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
                  {/* Pricing Info */}
                  <div className="flex items-center justify-between bg-[#F2C4C4]/20 border border-[#FAF0E8] p-3 rounded-2xl mb-3 text-right">
                    <span className="text-xs text-[#7B3B2A]/70 font-sans">قيمة حياكتها بالتفاصيل:</span>
                    <span className="text-sm font-semibold text-[#7B3B2A] font-sans">{selectedProduct.price}</span>
                  </div>

                  {/* Interactive Delivery Terms Selector && Callout */}
                  <div className="bg-[#FAF0E8] border border-[#E8A0A0]/30 rounded-2xl p-4 mb-4 text-right flex flex-col gap-3 shadow-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="text-base mt-0.5 shrink-0">🚇</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#7B3B2A] font-sans">شروط التوصيل والاستلام 🌸</span>
                        <span className="text-[10px] text-[#A05030]/90 leading-relaxed font-sans mt-0.5">
                          التوصيل يكون حصرياً من خلال <strong>أقرب محطة مترو</strong> (الخدمة متاحة داخل **القاهرة والجيزة فقط** يداً بيد لسلامة القطعة).
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-[#7B3B2A] font-sans">حددي محطة الاستلام لتضمينها بالطلب:</label>
                      <select
                        value={selectedMetro}
                        onChange={(e) => setSelectedMetro(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white text-right focus:outline-none border border-[#F2C4C4]/50 text-xs font-sans cursor-pointer focus:border-[#E8A0A0]"
                      >
                        {Array.from(new Set(METRO_STATIONS.map(s => s.line))).map((lineName) => (
                          <optgroup key={lineName} label={lineName} className="font-bold text-[#7B3B2A] bg-[#FAF0E8]/50">
                            {METRO_STATIONS.filter(s => s.line === lineName).map((station, sIdx) => (
                              <option key={sIdx} value={station.name} className="text-stone-800 bg-white font-normal">
                                {station.badge} {station.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex flex-col gap-3">
                    {/* Order via Whatsapp connection */}
                    <a 
                      href={`https://wa.me/201223633880?text=${encodeURIComponent(
                        `أهلاً نونا، أنا حابة أطلب قطعة "${selectedProduct.name}" الفاخرة، ومحطة استلام المترو المفضلة وموقعي المتفق عليه هو محطة: ${selectedMetro} 🚇🌸`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#7B3B2A] hover:bg-[#A05030] text-[#FAF0E8] font-semibold text-sm py-3 px-4 rounded-full transition-colors shadow-sm cursor-pointer text-center"
                    >
                      <ShoppingBag className="w-4.5 h-4.5 text-[#F2C4C4]" />
                      <span>اطلبيها مباشرة عبر الواتســاب 🌸</span>
                    </a>

                    {/* Share Divider */}
                    <div className="flex items-center gap-2 my-1">
                      <div className="flex-1 h-[1px] bg-[#F2C4C4]/40"></div>
                      <span className="text-[10px] text-[#7B3B2A]/60 font-sans font-bold flex items-center gap-1">
                        <Share2 className="w-3 h-3 text-[#E8A0A0]" />
                        شاركي جمال القطعة مع أحبائك
                      </span>
                      <div className="flex-1 h-[1px] bg-[#F2C4C4]/40"></div>
                    </div>

                    {/* Sharing Actions Button Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* 1. Copy Link Option */}
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center gap-1.5 bg-white hover:bg-[#F2C4C4]/10 text-[#7B3B2A] border border-[#F2C4C4]/40 font-semibold text-xs py-2.5 px-3 rounded-full shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600">تم النسخ! 📋</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#E8A0A0]" />
                            <span>نسخ الرابط 🔗</span>
                          </>
                        )}
                      </button>

                      {/* 2. WhatsApp Bride Ready Message */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `يا عروسة قلبي 🌸 شوفـي الموديل السـاحر ده "${selectedProduct.name}" من براند "تُحفـة" هاندميد! بجد تفاصيلها رقيقة وتجنن ومثالية لمناسبتك السعيدة ✨. شوفي تفاصيلها من هنا: ${window.location.origin}${window.location.pathname}?product=${selectedProduct.id}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs py-2.5 px-3 rounded-full shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.6.95 3.1 1.452 4.881 1.453 5.4 0 9.79-4.378 9.793-9.76 0-2.607-1.01-5.057-2.85-6.898s-4.322-2.856-6.93-2.856c-5.4 0-9.79 4.38-9.793 9.762-.001 1.905.5 3.754 1.452 5.356l-.974 3.556 3.65-.957zM17.5 14.3c-.3-.15-1.74-.85-2.01-.95-.27-.1-.47-.15-.67.15-.2.3-.77.95-.94 1.15-.17.2-.34.22-.64.07-1.33-.67-2.18-1.18-3.05-2.67-.1-.17-.1-.28-.08-.4.08-.12.3-.34.45-.5.15-.16.2-.27.3-.45.1-.18.05-.33-.02-.48-.07-.15-.67-1.62-.92-2.2-.25-.6-.53-.5-.72-.5l-.62-.01c-.22 0-.58.08-.88.4-.3.32-1.15 1.12-1.15 2.73s1.17 3.17 1.33 3.39c.17.22 2.3 3.51 5.57 4.92.78.33 1.39.53 1.86.68.78.25 1.49.21 2.05.13.62-.09 1.74-.71 1.99-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35z" />
                        </svg>
                        <span>واتساب العروسة 🌸</span>
                      </a>
                    </div>
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
