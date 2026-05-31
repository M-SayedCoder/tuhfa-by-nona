/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Particles from "./components/Particles";
import HomeView from "./components/HomeView";
import CollectionsView from "./components/CollectionsView";
import GalleryView from "./components/GalleryView";
import CustomOrderView from "./components/CustomOrderView";
import AboutView from "./components/AboutView";
import ContactView from "./components/ContactView";
import WishlistView from "./components/WishlistView";
import AuthView from "./components/AuthView";
import OrderHistoryView from "./components/OrderHistoryView";
import { MessageCircle } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { ordersApi } from "./lib/api";
import { CustomOrder } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { currentUser } = useAuth();
  const rawStatusMapRef = useRef<Record<string, CustomOrder["status"]>>({});
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Register Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" })
        .then((reg) => console.log("🌸 Service Worker Registered:", reg.scope))
        .catch((err) => console.error("❌ SW Registration failed:", err));
    }
  }, []);

  const playChimeSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (err) {
      console.warn("Could not play notification sound:", err);
    }
  };

  const triggerPushNotification = async (order: CustomOrder) => {
    const title = "🚇 تحفة: تصميمك المخصص ينتظرك الآن! 🌸";
    const body = `يسعدنا إعلامكِ أن تصميمكِ الفخم رقم #${order.id?.slice(-6)} ("${order.customText}") قد اكتمل وجاهز للتسليم في محطة مترو ${order.metroStation || "المتفق عليها"}!`;

    if ("serviceWorker" in navigator && "Notification" in window && Notification.permission === "granted") {
      try {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification(title, { body, icon: "/assets/logo.png", dir: "rtl", vibrate: [200, 100, 200], requireInteraction: true } as any);
        playChimeSound();
        return;
      } catch (e) {
        console.warn("SW notification failed:", e);
      }
    }
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/assets/logo.png", dir: "rtl", requireInteraction: true });
      playChimeSound();
    }
  };

  // Poll orders for status changes (replaces Firestore real-time listener)
  const pollOrders = useCallback(async () => {
    if (!currentUser) return;
    try {
      const { orders } = await ordersApi.getAll();
      const storedStr = localStorage.getItem("tuhfa_tracked_statuses") || "{}";
      let tracked: Record<string, string> = {};
      try { tracked = JSON.parse(storedStr); } catch { tracked = {}; }

      const updates: Record<string, string> = { ...tracked };

      orders.forEach((order: CustomOrder) => {
        const oId = order.id;
        const currentStatus = order.status;
        const previousStatus = rawStatusMapRef.current[oId] || tracked[oId];

        if (previousStatus && previousStatus === "preparing" && currentStatus === "delivered") {
          triggerPushNotification(order);
        }
        rawStatusMapRef.current[oId] = currentStatus;
        updates[oId] = currentStatus;
      });

      localStorage.setItem("tuhfa_tracked_statuses", JSON.stringify(updates));
    } catch (err) {
      // Silent fail for polling
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      rawStatusMapRef.current = {};
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }

    pollOrders();
    pollingRef.current = setInterval(pollOrders, 30000); // every 30s

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [currentUser, pollOrders]);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("tuhfa_wishlist");
    if (saved) { try { return JSON.parse(saved); } catch { return []; } }
    return [];
  });

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("tuhfa_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [currentTab]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderActiveView = () => {
    switch (currentTab) {
      case "home": return <HomeView setTab={setCurrentTab} />;
      case "collections": return <CollectionsView wishlist={wishlist} toggleWishlist={toggleWishlist} />;
      case "wishlist": return <WishlistView wishlist={wishlist} toggleWishlist={toggleWishlist} setTab={setCurrentTab} />;
      case "gallery": return <GalleryView />;
      case "custom-order": return <CustomOrderView />;
      case "order-history": return <OrderHistoryView setTab={setCurrentTab} />;
      case "auth": return <AuthView setTab={setCurrentTab} />;
      case "about": return <AboutView />;
      case "contact": return <ContactView />;
      default: return <HomeView setTab={setCurrentTab} />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#E8A0A0] selection:text-white bg-[#FAF0E8]">
      <Particles />
      <Header currentTab={currentTab} setTab={setCurrentTab} wishlistCount={wishlist.length} />
      <main className="flex-grow z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer setTab={setCurrentTab} />

      <div className="fixed bottom-6 right-6 z-45 flex flex-col gap-3.5">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-11 h-11 rounded-full bg-white text-[#7B3B2A] border border-[#F2C4C4] flex items-center justify-center cursor-pointer hover:bg-[#FAF0E8] shadow-md transition-colors"
              title="العودة لأعلى الصفحة"
            >▲</motion.button>
          )}
        </AnimatePresence>

        <motion.a
          href="https://wa.me/201223633880?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%80%D8%A7%D9%8B%20%D9%86%D9%88%D9%86%D8%A7!"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg cursor-pointer border-2 border-white relative"
          title="استشارة واتساب فورية"
        >
          <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[#E8A0A0] flex items-center justify-center text-[8px] font-sans font-extrabold text-[#FAF0E8] border border-white">١</span>
          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[#E8A0A0] animate-ping opacity-75 border border-white pointer-events-none" />
        </motion.a>
      </div>
    </div>
  );
}
