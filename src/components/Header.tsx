/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sparkles, Heart, BellRing, Sun, Moon, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  currentTab: string;
  setTab: (tab: string) => void;
  wishlistCount: number;
}

export default function Header({ currentTab, setTab, wishlistCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  const navigation = [
    { id: "home", name: "الرئيسية" },
    { id: "collections", name: "كوليكشن تحفة" },
    { id: "wishlist", name: "مفضلتي" },
    { id: "gallery", name: "المعرض الفني" },
    { id: "custom-order", name: "طلب تصميم مخصص" },
    ...(currentUser ? [{ id: "order-history", name: "سجل طلباتي 📦" }] : []),
    { id: "about", name: "حكاية تحفة" },
    { id: "auth", name: currentUser ? `حسابي (${currentUser.name.split(" ")[0]}) 👑` : "تسجيل دخول 👤" },
    { id: "contact", name: "اتصل بنا" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF0E8]/90 backdrop-blur-md border-b border-[#F2C4C4]/30 shadow-[0_2px_15px_-3px_rgba(123,59,42,0.05)] transition-all">
      {/* 🚇 Cairo-Giza Custom Metro Delivery Announcement Ribbon */}
      <div className="bg-[#7B3B2A] text-[#FAF0E8] text-[10px] sm:text-xs py-2 px-4 text-center font-sans font-semibold flex items-center justify-center gap-1.5 border-b border-[#E8A0A0]/20 select-none">
        <span className="animate-pulse">🚇</span>
        <span>التوصيل متاح داخل <strong>القاهرة والجيزة فقط</strong> عبر محطات المترو (تسليم آمن يداً بيد لسلامة مقتنياتكِ الفاخرة) 🌸</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          
          {/* Logo Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setTab("home")}>
            <motion.div 
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#7B3B2A] shadow-sm border border-[#E8A0A0]/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-serif italic font-bold text-[#FAF0E8] text-lg">T</span>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#E8A0A0] animate-ping" />
            </motion.div>
            
            <div className="flex flex-col text-right">
              <span className="font-serif text-2xl sm:text-3xl font-black text-[#7B3B2A] tracking-tighter uppercase leading-none">
                TUHFA <span className="text-[#A05030] text-xs font-sans font-bold tracking-widest block text-right mt-0.5">by Nona</span>
              </span>
            </div>
          </div>

          {/* New Live Inquiries indicator for visual interaction */}
          <div className="hidden lg:flex items-center gap-2 bg-[#F2C4C4]/20 border border-[#E8A0A0]/40 px-3 py-1 rounded-full text-xs text-[#7B3B2A] font-medium transition-all hover:bg-[#F2C4C4]/30">
            <BellRing className="w-3.5 h-3.5 text-[#E8A0A0]" />
            <span>نستقبل طلبات أفراح صيف وريد ٢٠٢٦ 🌸</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`relative px-3.5 py-2 rounded-lg font-sans text-sm font-semibold transition-all duration-300 ${
                      isActive 
                        ? "text-[#FAF0E8]" 
                        : "text-[#7B3B2A] hover:text-[#E8A0A0] hover:bg-[#FAF0E8] hover:shadow-[0_4px_10px_-4px_rgba(232,160,160,0.3)]"
                    }`}
                  >
                    {/* Active highlight pill */}
                    {isActive && (
                      <motion.span
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-[#7B3B2A] rounded-lg -z-10 shadow-md"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="flex items-center gap-1">
                      {item.name}
                      {item.id === "wishlist" && wishlistCount > 0 && (
                        <span className="w-4.5 h-4.5 rounded-full bg-[#E8A0A0] text-[#FAF0E8] text-[9px] font-bold flex items-center justify-center animate-pulse">
                          {wishlistCount}
                        </span>
                      )}
                    </span>
                    {item.id === "custom-order" && (
                      <span className="absolute -top-1 -right-1 bg-[#E8A0A0] text-[#FAF0E8] text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm animate-bounce">
                        مخصّص
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2.5 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#7B3B2A] hover:text-[#E8A0A0] p-2 rounded-lg font-sans flex items-center justify-center border border-[#F2C4C4]/30 bg-[#FAF0E8] shadow-sm cursor-pointer"
              aria-label="القائمة الأساسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile nav dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-[#F2C4C4]/30 bg-[#FAF0E8] shadow-inner overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navigation.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`nav-button-mobile flex items-center justify-between w-full px-4 py-3 rounded-lg text-right font-sans text-base font-semibold border transition-all ${
                      isActive
                        ? "bg-[#7B3B2A] text-[#FAF0E8] border-[#7B3B2A] shadow-md"
                        : "text-[#7B3B2A] hover:bg-[#F2C4C4]/10 border-transparent"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive ? (
                      <Heart className="w-4 h-4 text-[#E8A0A0] fill-[#E8A0A0]" />
                    ) : item.id === "custom-order" ? (
                      <span className="bg-[#E8A0A0] text-[#FAF0E8] text-[9px] px-2 py-0.5 rounded-full font-bold">
                        طلب خاص
                      </span>
                    ) : null}
                  </button>
                );
              })}
              
              <div className="pt-4 border-t border-[#F2C4C4]/40 flex flex-col items-center gap-2">
                <span className="text-xs text-[#A05030] font-sans">تواصل مباشر لطلب تفاصيل مناسبتك المفضلة:</span>
                <a
                  href="https://whatsapp.com/channel/0029VbC5XdW05MUd01jgQg2U"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#E8A0A0] text-white py-2 rounded-full text-sm font-semibold shadow-sm hover:bg-[#7B3B2A] transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  قناة واتساب تحفة 🌸
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
