/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
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
import { MessageCircle, Sparkles } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { db } from "./lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { CustomOrder } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Register Service Worker and listen globally for order changes
  const { currentUser } = useAuth();
  const rawStatusMapRef = useRef<Record<string, CustomOrder["status"]>>({});

  useEffect(() => {
    // 1. Register Service Worker for true background OS-level notifications
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" })
        .then((reg) => {
          console.log("🌸 Service Worker Registered successfully under scope:", reg.scope);
        })
        .catch((err) => {
          console.error("❌ Service Worker Registration failed:", err);
        });
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
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (err) {
      console.warn("Could not play notification sound:", err);
    }
  };

  const triggerGlobalPushNotification = async (order: CustomOrder) => {
    const title = "🚇 تحفة: تصميمك المخصص ينتظرك الآن! 🌸";
    const body = `يسعدنا إعلامكِ أن تصميمكِ الفخم رقم #${order.id} ("${order.customText}") قد اكتمل وجاهز للتسليم يداً بيد في محطة مترو ${order.metroStation || "المتفق عليها"}!`;

    // Try service worker registration showNotification first!
    if ("serviceWorker" in navigator && "Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification(title, {
            body,
            icon: "/assets/logo.png",
            dir: "rtl",
            vibrate: [200, 100, 200],
            requireInteraction: true
          } as any);
          playChimeSound();
          return;
        } catch (e) {
          console.warn("Service worker notification failed, trying native Notification:", e);
        }
      }
    }

    // Fallback to standard browser Notification inside the window
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/assets/logo.png",
        dir: "rtl",
        requireInteraction: true
      });
      playChimeSound();
    }
  };

  useEffect(() => {
    if (!currentUser) {
      rawStatusMapRef.current = {};
      return;
    }

    // 2. Real-time background listener for order status transitions
    const q = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Load previous statuses from localStorage or fallback to memory
      const storedStatusesStr = localStorage.getItem("tuhfa_tracked_statuses") || "{}";
      let trackedStatuses: Record<string, string> = {};
      try {
        trackedStatuses = JSON.parse(storedStatusesStr);
      } catch (err) {
        trackedStatuses = {};
      }

      const updatesToStore: Record<string, string> = { ...trackedStatuses };

      snapshot.docs.forEach((doc) => {
        const order = { id: doc.id, ...doc.data() } as CustomOrder;
        const oId = order.id;
        const currentStatus = order.status;
        
        // Let's get the previous status
        // Prioritize memory ref (live session), fallback to localStorage (historic transitions)
        const previousStatus = rawStatusMapRef.current[oId] || trackedStatuses[oId];

        // If previousStatus exists, and changed from 'preparing' to 'delivered'
        if (
          previousStatus &&
          previousStatus === "preparing" &&
          currentStatus === "delivered"
        ) {
          triggerGlobalPushNotification(order);
        }

        // Keep local copies updated
        rawStatusMapRef.current[oId] = currentStatus;
        updatesToStore[oId] = currentStatus;
      });

      localStorage.setItem("tuhfa_tracked_statuses", JSON.stringify(updatesToStore));
    }, (error) => {
      console.warn("Firestore background order listener failed:", error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 💖 Wishlist State Sync (persisted locally)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("tuhfa_wishlist");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem("tuhfa_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  // Smooth scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentTab]);

  // Monitor scroll for back-to-top display
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Frame permissions or capabilities (if needed natively, but nice as decor)
  const renderActiveView = () => {
    switch (currentTab) {
      case "home":
        return <HomeView setTab={setCurrentTab} />;
      case "collections":
        return <CollectionsView wishlist={wishlist} toggleWishlist={toggleWishlist} />;
      case "wishlist":
        return <WishlistView wishlist={wishlist} toggleWishlist={toggleWishlist} setTab={setCurrentTab} />;
      case "gallery":
        return <GalleryView />;
      case "custom-order":
        return <CustomOrderView />;
      case "order-history":
        return <OrderHistoryView setTab={setCurrentTab} />;
      case "auth":
        return <AuthView setTab={setCurrentTab} />;
      case "about":
        return <AboutView />;
      case "contact":
        return <ContactView />;
      default:
        return <HomeView setTab={setCurrentTab} />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[#E8A0A0] selection:text-white bg-[#FAF0E8]">
      
      {/* 🔮 Common elegant ambient soft floatings */}
      <Particles />

      {/* 🌸 Main Navigation Header */}
      <Header 
        currentTab={currentTab} 
        setTab={setCurrentTab} 
        wishlistCount={wishlist.length} 
      />

      {/* 🛋️ Main Layout Router with Framer Motion slide-up animations */}
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

      {/* 🏛️ Main Brand Footer */}
      <Footer setTab={setCurrentTab} />

      {/* 💬 Floating Quick Assistance Widgets (Direct Whatsapp Floating CTA) */}
      <div className="fixed bottom-6 right-6 z-45 flex flex-col gap-3.5">
        
        {/* Back to top helper */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-11 h-11 rounded-full bg-white text-[#7B3B2A] border border-[#F2C4C4] flex items-center justify-center cursor-pointer hover:bg-[#FAF0E8] shadow-md transition-colors"
              title="العودة لأعلى الصفحة"
            >
              ▲
            </motion.button>
          )}
        </AnimatePresence>

        {/* WhatsApp direct consultation drawer bubble */}
        <motion.a
          href="https://wa.me/201223633880?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%80%D8%A7%D9%8B%20%D9%86%D9%88%D9%86%D8%A7!%2520%D8%AD%D8%A7%D8%A8%D9%80%D8%A9%20%D8%A3%D8%B3%D8%AA%D9%81%D8%B3%D9%80%D8%B1%20%D8%B9%D9%86%20%D8%AC%D9%84%D8%B3%D9%80%D8%A9%20%D8%A7%D9%84%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D9%88%D8%AA%D9%81%D8%B1%D9%8A%D8%BA%20%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D8%A8%D8%A9%20%F0%9F%8C%B8"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg cursor-pointer border-2 border-white relative"
          title="استشارة واتساب فورية"
        >
          <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
          
          {/* Subtle heartbeat ping */}
          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[#E8A0A0] flex items-center justify-center text-[8px] font-sans font-extrabold text-[#FAF0E8] border border-white">
            ١
          </span>
          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[#E8A0A0] animate-ping opacity-75 border border-white pointer-events-none" />
        </motion.a>

      </div>

    </div>
  );
}
