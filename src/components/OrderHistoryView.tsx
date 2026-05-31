import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Hammer, 
  XCircle, 
  CornerDownRight, 
  Hourglass,
  HelpCircle,
  TrendingUp,
  CreditCard,
  Search,
  Filter,
  Bell,
  BellOff
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { CustomOrder } from "../types";

export default function OrderHistoryView({ setTab }: { setTab: (tab: string) => void }) {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [occasionFilter, setOccasionFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");

  // Web Notification Permission State
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "denied";
  });

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "orders"), 
      where("userId", "==", currentUser.id),
      orderBy("createdAtRaw", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList: CustomOrder[] = [];
      snapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() } as CustomOrder);
      });

      setOrders(ordersList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "orders");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Request browser Notification permission
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("للأسف، متصفحك الحالي لا يدعم التنبيهات الفورية بالنظام.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        new Notification("🌸 تم تفعيل تنبيهات تحفة بنجاح", {
          body: "تهانينا! ستتلقين الآن تفاعلات وتنبيهات فورية عند تحديث نونا لحالة تفصيل اللوحات الفاخرة الخاصة بكِ.",
          dir: "rtl"
        });
      }
    } catch (err) {
      console.error("Error setting notification permissions:", err);
    }
  };

  // Helper metrics for month extractions
  const getMonthsList = () => {
    const list = new Set<string>();
    orders.forEach((ord) => {
      if (ord.createdAtRaw) {
        list.add(ord.createdAtRaw.substring(0, 7)); // "YYYY-MM"
      }
    });
    return Array.from(list).sort().reverse();
  };

  const formatYearMonth = (ym: string) => {
    const [y, m] = ym.split("-");
    const monthNamesAr: { [key: string]: string } = {
      "01": "يناير", "02": "فبراير", "03": "مارس", "04": "أبريل",
      "05": "مايو", "06": "يونيو", "07": "يوليو", "08": "أغسطس",
      "09": "سبتمبر", "10": "أكتوبر", "11": "نوفمبر", "12": "ديسمبر"
    };
    return `${monthNamesAr[m] || m} ${y}`;
  };

  // Immediate filtering on client side
  const filteredOrders = orders.filter((order) => {
    if (searchQuery.trim()) {
      const queryStr = searchQuery.toLowerCase().trim();
      const matchId = order.id.toLowerCase().includes(queryStr);
      const matchText = order.customText.toLowerCase().includes(queryStr);
      const matchStation = (order.metroStation || "").toLowerCase().includes(queryStr);
      const matchDetails = (order.details || "").toLowerCase().includes(queryStr);
      const matchName = (order.customerName || "").toLowerCase().includes(queryStr);

      if (!matchId && !matchText && !matchStation && !matchDetails && !matchName) {
        return false;
      }
    }

    if (occasionFilter !== "all" && order.occasionType !== occasionFilter) {
      return false;
    }

    if (monthFilter !== "all") {
      const orderMonth = order.createdAtRaw ? order.createdAtRaw.substring(0, 7) : "";
      if (orderMonth !== monthFilter) {
        return false;
      }
    }

    return true;
  });

  const getStatusDetails = (status: CustomOrder["status"]) => {
    switch (status) {
      case "pending":
        return {
          text: "قيد المراجعة الفنية",
          color: "text-amber-700 bg-amber-50 border-amber-200",
          icon: <Hourglass className="w-4 h-4 text-amber-500 animate-spin" />,
          step: 0
        };
      case "confirmed":
        return {
          text: "تم التأكيد والمطابقة",
          color: "text-blue-700 bg-blue-50 border-blue-200",
          icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />,
          step: 1
        };
      case "preparing":
        return {
          text: "قيد الحياكة والاصطناع",
          color: "text-pink-700 bg-pink-50 border-pink-200",
          icon: <Hammer className="w-4 h-4 text-pink-500 animate-pulse" />,
          step: 2
        };
      case "delivered":
        return {
          text: "تم التسليم يداً بيد بنجاح",
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
          step: 3
        };
      case "canceled":
        return {
          text: "مُلغى",
          color: "text-stone-500 bg-stone-50 border-stone-200",
          icon: <XCircle className="w-4 h-4 text-stone-400" />,
          step: -1
        };
      default:
        return {
          text: "تحت المراجعة",
          color: "text-stone-700 bg-stone-50 border-stone-200",
          icon: <Hourglass className="w-4 h-4 text-stone-500" />,
          step: 0
        };
    }
  };

  const getOccasionAr = (occ: string) => {
    switch (occ) {
      case "marriage": return "قران وزفاف 💍";
      case "engagement": return "خطوبة وقراءة فاتحة 🌸";
      case "graduation": return "تخرج ونجاح 🎓";
      case "newborn": return "استقبال مولود جديد 👶";
      default: return occ;
    }
  };

  const getColorThemeAr = (color: string) => {
    switch (color) {
      case "rose-gold": return "روز جولد فاخر (Rose Gold)";
      case "silver": return "فضي لامع ملكي (Silver)";
      case "shiny-gold": return "ذهبي لامع مميز (Shiny Gold)";
      case "royal-red": return "أحمر قطيفة ملكي (Royal Red)";
      case "warm-white": return "أوف وايت دافئ (Warm White)";
      default: return color;
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center select-none font-sans">
        <div className="w-20 h-20 rounded-full bg-[#FAF0E8] border border-[#F2C4C4] flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10 text-[#7B3B2A]" />
        </div>
        <h2 className="text-2xl font-black text-[#7B3B2A] tracking-tight mb-3">سجل الطلبات مخصص للعملاء</h2>
        <p className="text-stone-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          يرجى تسجيل الدخول أو إنشاء حسابك الراقي بشكل آمن في متجر تحفة لتتمكن من تتبع طلباتك وتصميماتك المخصصة لحظة بلحظة وبشكل فوري.
        </p>
        <button
          onClick={() => setTab("auth")}
          className="px-8 py-3 bg-[#7B3B2A] text-white text-sm font-semibold rounded-xl hover:bg-[#A05030] shadow-md transition-all duration-300"
        >
          تسجيل الدخول / إنشاء حساب 👤
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-sans">
      <div className="text-right mb-8">
        <h1 className="text-3xl font-black text-[#7B3B2A] tracking-tight mb-2">سجل تصميماتي وطلباتي 🌸</h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
          كوني مطمئنة! جميع كولكشن وتصميماتك المخصصة التي تطلبينها تُحفظ وترتبط برقم حسابك السحابي الفريد لسهولة الإدارة والتسليم الفوري من قِبل نونا.
        </p>
      </div>

      {/* 🛎️ System Push Notification Permission Requester Card */}
      {notificationPermission !== "granted" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-gradient-to-r from-[#FAF0E8] to-white border-2 border-[#F2C4C4]/50 rounded-[24px] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-right"
        >
          <div className="flex items-center gap-3.5 flex-row-reverse">
            <div className="w-12 h-12 rounded-full bg-[#7B3B2A]/5 flex items-center justify-center border border-[#7B3B2A]/10 animate-bounce">
              <Bell className="w-6 h-6 text-[#7B3B2A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#7B3B2A] mb-0.5">تفعيل التنبيهات الفورية الفخمة 🔔</h4>
              <p className="text-[11px] text-stone-500 leading-normal max-w-md">
                فعّلي إشعارات المتصفح لتلقي تنبيه فوري ومباشر على جهازكِ بنغمة عذبة فور قيام "نونا" بتجهيز طلبكِ أو وصوله لتسليم المترو.
              </p>
            </div>
          </div>
          <button
            onClick={requestNotificationPermission}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#7B3B2A] text-white text-xs font-bold rounded-xl hover:bg-[#A05030] shadow-sm transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>تمكين التنبيهات الآن ✨</span>
          </button>
        </motion.div>
      )}

      {/* 🔍 Instant Search & Luxury Filters Deck */}
      {orders.length > 0 && (
        <div className="mb-8 p-5 bg-white border border-[#F2C4C4]/30 rounded-3xl shadow-[0_4px_20px_-4px_rgba(123,59,42,0.02)] space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search Input */}
            <div className="w-full md:flex-grow relative font-sans">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحثي برقم تتبع الطلب، الأسماء المطرزة، أو محطة المترو..."
                className="w-full pr-10 pl-4 py-2 bg-[#FAF0E8]/30 border border-[#F2C4C4]/40 focus:border-[#E8A0A0] text-xs text-right focus:bg-white rounded-xl focus:outline-none transition-all placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-2.5" />
            </div>

            {/* Occasion Option Filter */}
            <div className="w-full sm:w-auto flex items-center gap-2 justify-end font-sans">
              <select
                value={occasionFilter}
                onChange={(e) => setOccasionFilter(e.target.value)}
                className="px-3.5 py-1.5 bg-white border border-[#F2C4C4]/40 rounded-xl text-xs text-right text-[#7B3B2A] font-bold focus:outline-none focus:border-[#E8A0A0] cursor-pointer"
              >
                <option value="all">كل المناسبات</option>
                <option value="marriage">صينية كَتْب كِتاب 💍</option>
                <option value="engagement">صينية تقديم الشبكة 🌸</option>
                <option value="graduation">قبعة تخرج وردية مخصصة 🎓</option>
                <option value="newborn">تذكارات استقبال المواليد 👶</option>
              </select>
              <label className="text-xs font-bold text-stone-400 whitespace-nowrap">المناسبة:</label>
            </div>

            {/* Month Filter */}
            {getMonthsList().length > 0 && (
              <div className="w-full sm:w-auto flex items-center gap-2 justify-end font-sans">
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="px-3.5 py-1.5 bg-white border border-[#F2C4C4]/40 rounded-xl text-xs text-right text-[#7B3B2A] font-bold focus:outline-none focus:border-[#E8A0A0] cursor-pointer"
                >
                  <option value="all">كل الأشهر</option>
                  {getMonthsList().map((ym) => (
                    <option key={ym} value={ym}>
                      {formatYearMonth(ym)}
                    </option>
                  ))}
                </select>
                <label className="text-xs font-bold text-stone-400 whitespace-nowrap">الفترة:</label>
              </div>
            )}

          </div>

          {/* Quick Clear Filter Button helper */}
          {(searchQuery || occasionFilter !== "all" || monthFilter !== "all") && (
            <div className="flex justify-start text-[11px]">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setOccasionFilter("all");
                  setMonthFilter("all");
                }}
                className="text-[#7B3B2A] hover:underline font-bold cursor-pointer"
              >
                ✕ مسح فلاتر البحث وإعادتها للافتراضي
              </button>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-2 border-[#7B3B2A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-stone-400 font-mono">جاري جلب سجل طلباتكِ الآمنة...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-10 border-2 border-dashed border-[#F2C4C4]/60 bg-white rounded-3xl text-center">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4 border border-[#F2C4C4]/30">
            <ShoppingBag className="w-8 h-8 text-[#A05030]" />
          </div>
          <p className="text-base font-bold text-[#7B3B2A] mb-1">لا توجد طلبات سابقة مسجلة حالياً</p>
          <p className="text-xs text-stone-450 mb-6 max-w-xs mx-auto">عند قيامك بملء نموذج طلب مخصص، ستظهر تفاصيل وحالة طلبك فوراً هنا.</p>
          <button
            onClick={() => setTab("custom-order")}
            className="px-6 py-2 bg-[#7B3B2A] text-white text-xs font-bold rounded-xl hover:bg-[#A05030] shadow-sm transition-all"
          >
            طلب تصميم مخصص الآن 🎨
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 border border-dashed border-stone-200 bg-white rounded-3xl text-center font-sans select-none">
          <p className="text-sm font-bold text-stone-500 mb-1">لا توجد نتائج مطابقة لبحثكِ الحالي</p>
          <p className="text-xs text-stone-400">تأكدي من صحة الحروف المكتوبة أو حاولي تصفية المناسبات بشكل مختلف.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusDetails(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#F2C4C4]/30 rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(123,59,42,0.03)] hover:shadow-md transition-all relative overflow-hidden text-right leading-relaxed"
              >
                {/* Visual Accent Ribbon based on status */}
                <div className={`absolute top-0 right-0 left-0 h-1.5 ${
                  order.status === "pending" ? "bg-amber-400" :
                  order.status === "confirmed" ? "bg-blue-400" :
                  order.status === "preparing" ? "bg-pink-400" :
                  order.status === "delivered" ? "bg-emerald-400" : "bg-stone-300"
                }`} />

                {/* Top Row: Order ID and State Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-mono text-stone-400 block uppercase">رقم تتبع التصميم</span>
                    <h3 className="text-sm font-black text-[#7B3B2A] inline-flex items-center gap-1.5 font-mono">
                      #{order.id}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold border ${statusInfo.color} flex items-center gap-1.5`}>
                      {statusInfo.icon}
                      {statusInfo.text}
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Timeline Indicators */}
                {statusInfo.step >= 0 && (
                  <div className="py-6 border-b border-stone-50">
                    <span className="text-[11px] font-bold text-stone-400 block mb-5">مراحل تفصيل وتسليم تحفتك الفنية:</span>
                    <div className="grid grid-cols-4 relative text-center text-xs select-none">
                      {/* Connection track lines */}
                      <div className="absolute top-4 right-1/8 left-1/8 h-0.5 bg-stone-100 z-0" />
                      
                      {/* Active green/gold progress fill */}
                      <div 
                        className="absolute top-4 right-1/8 h-0.5 bg-[#E8A0A0] transition-all duration-500 z-0"
                        style={{ 
                          width: `${(statusInfo.step / 3) * 75}%`,
                          left: "auto"
                        }}
                      />

                      {/* Steps */}
                      {[
                        { label: "مراجعة نونا", labelSub: "تحت المراجعة" },
                        { label: "تم المراجعة", labelSub: "تأكيد السعر ومطابقته" },
                        { label: "حياكة وتفريغ", labelSub: "بدء العمل الفني" },
                        { label: "تسليم وجاهزية", labelSub: "تسليم محطة المترو" }
                      ].map((stp, idx) => {
                        const isDone = idx <= statusInfo.step;
                        const isCurrent = idx === statusInfo.step;
                        return (
                          <div key={idx} className="flex flex-col items-center relative z-10">
                            <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center border font-bold text-xs shadow-sm transition-colors ${
                              isCurrent 
                                ? "bg-[#7B3B2A] text-white border-[#7B3B2A]" 
                                : isDone 
                                  ? "bg-[#E8A0A0] text-white border-[#E8A0A0]" 
                                  : "bg-white text-stone-300 border-stone-200"
                            }`}>
                              {idx + 1}
                            </div>
                            <span className={`text-[10px] sm:text-xs mt-2.5 font-bold block ${isDone ? "text-[#7B3B2A]" : "text-stone-300"}`}>
                              {stp.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Core Specs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 pt-4 text-xs">
                  <div className="space-y-2">
                    <p className="text-stone-600 block leading-relaxed">
                      💍 <strong className="text-stone-700">نوع الطلب والمناسبة:</strong> {getOccasionAr(order.occasionType)}
                    </p>
                    <p className="text-stone-600 block leading-relaxed">
                      🎨 <strong className="text-stone-700">درجة اللون الأساسية:</strong> {getColorThemeAr(order.mainColor)}
                    </p>
                    <p className="text-stone-600 block leading-relaxed">
                      🖊️ <strong className="text-stone-700">الكتابة المطلوبة تفريغها:</strong> <span className="font-bold underline text-[#7B3B2A]">"{order.customText}"</span>
                    </p>
                    {order.details && (
                      <p className="p-3 bg-stone-50 rounded-2xl text-[11px] text-stone-500 italic border border-stone-100 mt-2 block">
                        📝 ملاحظات وتفاصيل إضافية: {order.details}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:border-r border-stone-100 md:pr-4.5">
                    <p className="text-stone-600 flex items-center gap-1.5 leading-relaxed">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span><strong className="text-stone-700">تاريخ إرسال التصميم:</strong> {order.createdAt}</span>
                    </p>
                    <p className="text-stone-600 flex items-center gap-1.5 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[#E8A0A0]" />
                      <span><strong className="text-stone-700">محطة مترو التسليم المفضلة:</strong> <strong className="text-[#7B3B2A] bg-orange-50/50 px-2 py-0.5 rounded-lg border border-orange-100">{order.metroStation || "لم تحدد بعد"}</strong></span>
                    </p>
                    <div className="p-3 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-between text-stone-600 mt-2">
                       <div className="flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                        <strong className="text-stone-700">سعر التصميم الإجمالي:</strong>
                      </div>
                      <span className="font-black text-[#7B3B2A] text-sm">
                        {order.priceEGP ? `${order.priceEGP} ج.م` : "سيتم احتسابه وتحديثه قريباً 💸"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions banner */}
                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-stone-400">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span>تحديث لحظي من خادم السحاب ☁️</span>
                  </div>
                  <a
                    href={`https://wa.me/201223633880?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%86%D9%88%D9%86%D8%A7!%20%D8%AD%D8%A7%D8%A8%D8%A9%20%D8%A3%D8%B3%D9%80%D8%AA%D9%81%D8%B3%D9%80%D8%B1%20%D8%B9%D9%86%20%D8%B7%D9%84%D8%A8%D9%80%D9%8I%20%D8%B1%D9%82%D9%85%20%23${order.id}%20%F0%9F%8C%B8`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#7B3B2A] hover:text-[#A05030] font-bold underline cursor-pointer"
                  >
                    استفسار عبر الواتساب المباشر 💬
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
