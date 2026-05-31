/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageCircle, Heart, Palette, Calendar, PenTool, CheckCircle, FileText, Trash2, Search, Download, Upload, Filter, TrendingUp, Check, Database, ShieldAlert, GripVertical, CheckCircle2, AlertCircle, RefreshCw, XCircle } from "lucide-react";
import { CustomOrder } from "../types";
import { METRO_STATIONS } from "../data";
import { useAuth } from "../context/AuthContext";
import { ordersApi } from "../lib/api";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from "recharts";

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#F2C4C4]/50 shadow-lg text-right font-sans text-xs">
        <p className="font-bold text-[#7B3B2A] mb-2">{label}</p>
        <p className="text-emerald-700 font-semibold mb-1 flex items-center justify-end gap-1">
          <span>{payload[0].value} ج.م</span>
          <span>الأرباح المسلمة ✓:</span>
        </p>
        {payload[1] && (
          <p className="text-indigo-600 font-semibold flex items-center justify-end gap-1">
            <span>{payload[1].value} ج.م</span>
            <span>قيد التنفيذ والمطرزة ⏳:</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function CustomOrderView() {
  const { currentUser } = useAuth();

  
  // Form fields
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasionType, setOccasionType] = useState("marriage"); // marriage, engagement, graduation, newborn
  const [mainColor, setMainColor] = useState("rose-gold"); // rose-gold, silver, shiny-gold, royal-red, warm-white
  const [customText, setCustomText] = useState("محمد & نادين");
  const [eventDate, setEventDate] = useState("٢٥ يوليو ٢٠٦");
  const [details, setDetails] = useState("");
  const [metroStation, setMetroStation] = useState("حلوان");
  // Admin Dashboard Protection
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPasswordError, setAdminPasswordError] = useState(false);
  
  // File upload simulation (using drag and drop or mock selection)
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [savedOrders, setSavedOrders] = useState<CustomOrder[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Merchant dashboard states
  const [viewMode, setViewMode] = useState<"customer" | "merchant">("customer");
  const [adminMonthFilter, setAdminMonthFilter] = useState<string>("all");
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>("all");
  const [adminSearchQuery, setAdminSearchQuery] = useState<string>("");
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // Admin PIN Protection
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Secret Click counter to unlock admin on clicks
  const [secretClickCount, setSecretClickCount] = useState(0);

  // Drag and drop states
  const [draggingOrderId, setDraggingOrderId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Load orders from NestJS API
  useEffect(() => {
    if (!currentUser) {
      setSavedOrders([]);
      return;
    }

    const loadOrders = async () => {
      try {
        const { orders } = await ordersApi.getAll();

        setSavedOrders(
          Array.isArray(orders)
            ? (orders as CustomOrder[])
            : []
        );
      } catch (err) {
        // Fallback to local storage
        const localOrdersStr = localStorage.getItem("tuhfa_local_orders") || "[]";
        try {
          const localOrders = JSON.parse(localOrdersStr) as CustomOrder[];
          setSavedOrders(
            currentUser.isAdmin
              ? localOrders
              : localOrders.filter(o => o.userId === currentUser.id)
          );
        } catch (e) {
          console.error("Failed to parse local orders:", e);
        }
      }
    };

    loadOrders();

    // Poll every 30 seconds for updates
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Sync admin unlock with URL, stored session OR logged-in user admin state
  useEffect(() => {
  const isUserAdmin = currentUser?.isAdmin === true;

  if (!isUserAdmin) {
    setIsAdminUnlocked(false);
    setViewMode("customer");
  }
}, [currentUser]);

    
  // Auto-prefill form with logged in user details
  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name);
      if (currentUser.phone) {
        setPhone(currentUser.phone);
      }
    }
  }, [currentUser]);

  const handleSecretClick = () => {
    setSecretClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowPinModal(true);
        setPinInput("");
        setPinError(false);
        return 0;
      }
      return next;
    });
  };

  const handleAdminAccess = () => {
  const DASHBOARD_PASSWORD = "NonaDashboard2026"; // غيرها لكلمة السر اللي أنت عاوزها

  if (adminPassword === DASHBOARD_PASSWORD) {
    setIsAdminUnlocked(true);
    setViewMode("merchant");
    setShowAdminPasswordModal(false);
    setAdminPassword("");
    setAdminPasswordError(false);
  } else {
    setAdminPasswordError(true);
  }
};

  const handleDeleteOrder = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSavedOrders(prev => prev.filter(o => o.id !== id));
    try {
      const cachedStr = localStorage.getItem("tuhfa_local_orders") || "[]";
      const cached = JSON.parse(cachedStr) as CustomOrder[];
      localStorage.setItem("tuhfa_local_orders", JSON.stringify(cached.filter(o => o.id !== id)));
    } catch (err) {
      console.error(err);
    }

    try {
      await ordersApi.delete(id);
    } catch (err) {
      console.warn("API delete failed, keeping local delete:", err);
    }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: CustomOrder["status"]) => {
    let titleAr = "تحديث حالة طلبك 🌸";
    let messageAr = `تم تغيير حالة طلبك رقم #${id} إلى: ${newStatus}`;
    if (newStatus === "confirmed") {
      titleAr = "👑 تم تأكيد طلبك الراقي";
      messageAr = `تم مراجعة وتأكيد طلبك رقم #${id} بنجاح ومطابقته للتصميم!`;
    } else if (newStatus === "preparing") {
      titleAr = "🎨 طلبك قيد الحياكة والتنفيذ";
      messageAr = `الفنانة نونا بدأت الآن في حياكة وتفريغ نقوشات تصميمك رقم #${id}!`;
    } else if (newStatus === "delivered") {
      titleAr = "🚇 طلبك جاهز للتسليم";
      messageAr = `يسعدنا إعلامكِ أن تصميمك رقم #${id} جاهز للتسليم وسيكون في انتظارك بالترتيب المتفق عليه!`;
    } else if (newStatus === "canceled") {
      titleAr = "❌ تم إلغاء طلبك";
      messageAr = `للأسف تم إلغاء طلبك المخصص رقم #${id}. يرجى التواصل مع الدعم.`;
    }

    setSavedOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    try {
      const cachedStr = localStorage.getItem("tuhfa_local_orders") || "[]";
      const cached = JSON.parse(cachedStr) as CustomOrder[];
      localStorage.setItem("tuhfa_local_orders", JSON.stringify(
        cached.map(o => o.id === id ? { ...o, status: newStatus } : o)
      ));
    } catch (err) {
      console.error(err);
    }

    try {
      await ordersApi.updateStatus(id, newStatus);
    } catch (err) {
      console.warn("API status update failed, keeping local update:", err);
    }
  };

  const handleUpdateOrderPrice = async (id: string, price: number) => {
    setSavedOrders(prev => prev.map(o => o.id === id ? { ...o, priceEGP: price } : o));
    try {
      const cachedStr = localStorage.getItem("tuhfa_local_orders") || "[]";
      const cached = JSON.parse(cachedStr) as CustomOrder[];
      localStorage.setItem("tuhfa_local_orders", JSON.stringify(
        cached.map(o => o.id === id ? { ...o, priceEGP: price } : o)
      ));
    } catch (err) {
      console.error(err);
    }

    try {
      await ordersApi.update(id, { priceEGP: price });
    } catch (err) {
      console.warn("API price update failed, keeping local update:", err);
    }
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedOrders, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backups_tuhfa_orders_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          const merged = [...parsed, ...savedOrders.filter(o => !parsed.some((p: any) => p.id === o.id))];
          setSavedOrders(merged);
          localStorage.setItem("tuhfa_custom_orders", JSON.stringify(merged));
          setImportMessage(`✓ تم دمج واستيراد عدد ${parsed.length} طلب بقاعدة البيانات المحلية!`);
          setTimeout(() => setImportMessage(null), 5000);
        } else {
          setImportMessage("❌ صيغة الملف غير مطابقة لنسخة التصدير الاحتياطية.");
          setTimeout(() => setImportMessage(null), 4000);
        }
      } catch (err) {
        setImportMessage("❌ فشل قراءة الملف، يرجى التأكد من اختيار ملف JSON صحيح.");
        setTimeout(() => setImportMessage(null), 4000);
      }
    };
    fileReader.readAsText(files[0]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedImageName(files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setUploadedImageName(files[0].name);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !customText) return;

    setSubmitting(true);
    
    try {
      const orderId = "ord_" + Date.now().toString() + "_" + Math.random().toString(36).substring(4);
      const newOrder: CustomOrder & { userId: string } = {
        id: orderId,
        userId: currentUser?.id || "usr_anonymous",
        customerName,
        phone,
        occasionType,
        mainColor,
        customText,
        details,
        status: "pending",
        createdAt: new Date().toLocaleDateString("ar-EG"),
        metroStation,
        createdAtRaw: new Date().toISOString(),
        isVerifiedClient: currentUser?.isVerifiedClient || false
      };

      // Always save to local storage immediately
      try {
        const cachedStr = localStorage.getItem("tuhfa_local_orders") || "[]";
        const cached = JSON.parse(cachedStr) as CustomOrder[];
        cached.unshift(newOrder);
        localStorage.setItem("tuhfa_local_orders", JSON.stringify(cached));
        setSavedOrders(prev => [newOrder, ...prev]);
      } catch (e) {
        console.error("Local order save failed:", e);
      }

      // Save to NestJS backend
      try {
        const { order: savedOrder } = await ordersApi.create({
          customerName: newOrder.customerName,
          phone: newOrder.phone,
          occasionType: newOrder.occasionType,
          mainColor: newOrder.mainColor,
          customText: newOrder.customText,
          details: newOrder.details,
          metroStation: newOrder.metroStation,
        });
        // Replace local entry with the one from backend (real ID)
        setSavedOrders(prev =>
          prev.map(o => o.id === orderId ? savedOrder : o)
        );
      } catch (dbErr) {
        console.warn("Could not save order to backend, captured locally instead:", dbErr);
      }

      setSubmitting(false);
      setSubmitted(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      setSubmitting(false);
      console.error("Order submission error:", err);
    }
  };

  // Printable summary generator
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("يرجى السماح بالنوافذ المنبثقة لطباعة ملخص التصميم");
      return;
    }

    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>ملخص تصميم طلبك المخصص - تُحفة من نونا</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
            body {
              font-family: 'Cairo', sans-serif;
              color: #4A2B20;
              margin: 40px;
              line-height: 1.6;
              background: #FAF0E8;
            }
            .border-wrap {
              border: 3px double #7B3B2A;
              padding: 40px;
              border-radius: 20px;
              max-w: 650px;
              margin: 0 auto;
              background: #ffffff;
              box-shadow: 0 4px 15px rgba(123,59,42,0.05);
            }
            .header-block {
              text-align: center;
              border-bottom: 2px solid #F2C4C4;
              padding-bottom: 25px;
              margin-bottom: 30px;
            }
            .header-block h1 {
              font-size: 32px;
              color: #7B3B2A;
              margin: 0;
              font-weight: 700;
              letter-spacing: 1px;
            }
            .header-block p {
              color: #A05030;
              font-size: 13px;
              margin: 5px 0 0;
              letter-spacing: 2px;
            }
            .badge-row {
              text-align: center;
              margin-bottom: 30px;
            }
            .badge {
              display: inline-block;
              background: #FAF0E8;
              border: 1px solid #7B3B2A;
              padding: 6px 18px;
              border-radius: 12px;
              font-size: 14px;
              font-weight: 700;
              color: #7B3B2A;
            }
            .grid-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 35px;
            }
            .grid-table th, .grid-table td {
              padding: 14px 18px;
              text-align: right;
              border-bottom: 1px solid #FAF0E8;
            }
            .grid-table th {
              color: #7B3B2A;
              font-weight: 750;
              width: 35%;
              background-color: #FAF0E8;
              border-radius: 4px;
            }
            .grid-table td {
              color: #333;
            }
            .signature-block {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              color: #7B3B2A;
              font-weight: 600;
              border-top: 1px solid #FAF0E8;
              padding-top: 20px;
            }
            .credit {
              text-align: center;
              font-size: 11px;
              color: #999;
              margin-top: 35px;
            }
            @media print {
              body { background: #fff; margin: 10px; }
              .no-print-btn { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="border-wrap">
            <div class="header-block">
              <h1>TUHFA BY NONA</h1>
              <p>مقتنيات يدوية فاخرة | CURATED COUTURE INSPIRATIONS</p>
            </div>

            <div class="badge-row">
              <span class="badge">ملخص حياكة قطعة مناسبتك المخصصة</span>
            </div>

            <table class="grid-table">
              <tr>
                <th>اسم العروس/العميل</th>
                <td>${customerName}</td>
              </tr>
              <tr>
                <th>المناسبة السعيدة</th>
                <td>${getOccasionLabel(occasionType)}</td>
              </tr>
              <tr>
                <th>درجات اللون وهيكل الديكور</th>
                <td>${
                  mainColor === "rose-gold" ? "ذهبي وردي باللؤلؤ" :
                  mainColor === "silver" ? "فضي بالكريستال البراق" :
                  mainColor === "shiny-gold" ? "مذهب فاخر وعروق مذهبة" :
                  mainColor === "royal-red" ? "أحمر جوري مخملي ثري" : "أبيض ثلجي باللآلئ"
                }</td>
              </tr>
              <tr>
                <th>الأسماء المطرزة بالحب</th>
                <td style="font-size: 18px; font-weight: bold; color: #7B3B2A;">${customText}</td>
              </tr>
              <tr>
                <th>تاريخ اللوحة التذكاري</th>
                <td>${eventDate}</td>
              </tr>
              <tr>
                <th>تفاصيل وشروط إضافية</th>
                <td>${details || "لا يوجد أي شروط إضافية"}</td>
              </tr>
              <tr>
                <th>محطة استلام المترو (القاهرة/الجيزة) 🚇</th>
                <td style="font-weight: bold; color: #7B3B2A;">محطة ${metroStation || "لم تحدد"} (مؤكدة للتسليم يداً بيد ✓)</td>
              </tr>
              <tr>
                <th>حالة الطلب ومقدار الحجز</th>
                <td style="color: #059669; font-weight: 750;">مؤكد ومحفوظ محلياً ومعد للطباعة</td>
              </tr>
            </table>

            <div class="signature-block">
              <div>تاريخ التقرير: ${new Date().toLocaleDateString("ar-EG")}</div>
              <div>إمضاء وتفويض: الفنانة نونا ✍️</div>
            </div>

            <div class="credit">
              تم التوليد والتصميم التفاعلي بـ منصة تحفةbyNona الإلكترونية
            </div>
          </div>
          <div class="no-print-btn" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print();" style="background: #7B3B2A; color: #fff; border: none; padding: 12px 30px; border-radius: 20px; cursor: pointer; font-size: 14px; font-family: 'Cairo', sans-serif; font-weight: bold; box-shadow: 0 4px 10px rgba(123,59,42,0.25);">طباعة ملخص التصميم 🖨️</button>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
    }, 250);
  };

  const getOccasionLabel = (type: string) => {
    switch (type) {
      case "marriage": return "صينية وقالب كتب كتاب";
      case "engagement": return "صينية تقديم الشبكة";
      case "graduation": return "قبعة تخرج وردية مخصصة";
      case "newborn": return "تذكار المواليد السبوع الجديد";
      default: return "تفصيل مخصص";
    }
  };

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case "rose-gold": return { bg: "bg-gradient-to-tr from-[#F2C4C4]/40 to-[#FAF0E8]", text: "text-[#7B3B2A]", pill: "#FAF0E8", border: "border-[#E8A0A0]/60", flower: "🌸" };
      case "silver": return { bg: "bg-gradient-to-tr from-slate-100 to-slate-200", text: "text-slate-800", pill: "#FFFFFF", border: "border-slate-300", flower: "🤍" };
      case "shiny-gold": return { bg: "bg-gradient-to-tr from-[#f6e0b5] to-[#fcf7ec]", text: "text-[#7B3B2A]", pill: "#F0D8C8", border: "border-amber-400/50", flower: "✨" };
      case "royal-red": return { bg: "bg-gradient-to-tr from-[#901c1c]/15 to-rose-550/10", text: "text-[#901c1c]", pill: "#FAF0E8", border: "border-[#901c1c]/40", flower: "🌹" };
      case "warm-white": return { bg: "bg-white", text: "text-[#7B3B2A]", pill: "#FAF0E8", border: "border-[#F2C4C4]/50", flower: "🌷" };
      default: return { bg: "bg-white", text: "text-stone-700", pill: "#FAF0E8", border: "border-gray-250", flower: "✿" };
    }
  };

  const visualProps = getThemeColors(mainColor);

  // We can write helper expressions to group and filter savedOrders for Nona's view
  const getMonthsList = () => {
    const months = new Set<string>();
    savedOrders.forEach(ord => {
      if (ord.createdAtRaw) {
        months.add(ord.createdAtRaw.substring(0, 7)); // "YYYY-MM"
      } else {
        months.add("2026-05");
      }
    });
    return Array.from(months).sort().reverse();
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

  const getChartData = () => {
    const monthsSet = new Set<string>();
    
    // Always include current month + trailing 5 months timeline
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      monthsSet.add(`${y}-${m}`);
    }

    // Add months from actual user orders
    savedOrders.forEach(ord => {
      if (ord.createdAtRaw) {
        monthsSet.add(ord.createdAtRaw.substring(0, 7)); // "YYYY-MM"
      }
    });

    const sortedMonths = Array.from(monthsSet).sort();
    
    return sortedMonths.map(monthStr => {
      let delivered = 0;
      let inProgress = 0;
      let orderCount = 0;

      savedOrders.forEach(ord => {
        const orderMonth = ord.createdAtRaw ? ord.createdAtRaw.substring(0, 7) : "2026-05";
        if (orderMonth === monthStr) {
          orderCount++;
          const price = ord.priceEGP || 0;
          if (ord.status === "delivered") {
            delivered += price;
          } else if (ord.status === "confirmed" || ord.status === "preparing") {
            inProgress += price;
          }
        }
      });

      return {
        month: monthStr,
        monthLabel: formatYearMonth(monthStr),
        "الأرباح المسلمة ✓": delivered,
        "قيد التنفيذ والمطرزة ⏳": inProgress,
        "عدد الطلبات": orderCount
      };
    });
  };

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    setDraggingOrderId(orderId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", orderId);
  };

  const handleDragEnd = () => {
    setDraggingOrderId(null);
    setDragOverColumn(null);
  };

  const handleDragOverCol = (e: React.DragEvent, colStatus: string) => {
    e.preventDefault();
    setDragOverColumn(colStatus);
  };

  const handleDropOnCol = async (e: React.DragEvent, targetStatus: CustomOrder["status"]) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData("text/plain") || draggingOrderId;
    if (orderId) {
      await handleUpdateOrderStatus(orderId, targetStatus);
    }
    setDraggingOrderId(null);
    setDragOverColumn(null);
  };

  const filteredOrders = savedOrders.filter(ord => {
    if (adminMonthFilter !== "all") {
      const orderMonth = ord.createdAtRaw ? ord.createdAtRaw.substring(0, 7) : "2026-05";
      if (orderMonth !== adminMonthFilter) return false;
    }

    if (adminStatusFilter !== "all") {
      const currentStatus = ord.status || "pending";
      if (currentStatus !== adminStatusFilter) return false;
    }

    if (adminSearchQuery.trim()) {
      const q = adminSearchQuery.trim().toLowerCase();
      const matchName = ord.customerName.toLowerCase().includes(q);
      const matchPhone = ord.phone.toLowerCase().includes(q);
      const matchText = ord.customText.toLowerCase().includes(q);
      const matchMetro = ord.metroStation ? ord.metroStation.toLowerCase().includes(q) : false;
      if (!matchName && !matchPhone && !matchText && !matchMetro) return false;
    }

    return true;
  });

  const statsSelectedMonthOrders = savedOrders.filter(ord => {
    if (adminMonthFilter !== "all") {
      const orderMonth = ord.createdAtRaw ? ord.createdAtRaw.substring(0, 7) : "2026-05";
      return orderMonth === adminMonthFilter;
    }
    return true;
  });

  // Custom pre-filled whatsapp link
  const whatsappMsg = `مرحباً نونا! حابة أطلب تفصيل فريد من مقتنيات تحفة:
الاسم الكريم: ${customerName}
المناسبة: ${getOccasionLabel(occasionType)}
الألوان المطلوبة: ${mainColor === "rose-gold" ? "الوردي العاجي" : mainColor === "silver" ? "الفضي الكامل" : mainColor === "shiny-gold" ? "المذهب البراق" : mainColor === "royal-red" ? "الأحمر الغامق" : "الأبيض العاجي"}
الأسماء المرابطة: ${customText}
تاريخ اللوحة: ${eventDate}
محطة مترو التسليم: محطة ${metroStation || "لم تحدد"} 🚇
تعليمات الحياكة الإضافية: ${details || "لا يوجد شروط"}
هل متاح حجز الفتحة الحالية وتأكيده؟ 🌸`;

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
          <span>استوديو نونا لتفصيل الأفكار اليدوية الحية | COUTURE DESIGN STUDIO</span>
        </motion.div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#7B3B2A] mt-2">اصنـعي تُحفتـكِ الخــاصّة</h1>
        <p className="text-sm text-[#A05030]/80 font-sans mt-2">
          عيشي تجربة المصممة؛ اختاري ألوانك، الأسماء، التواريخ، والمناسبة وشاهدي المحاكاة البصرية مباشرة في الاستوديو التفاعلي ثم أرسليها لنونا للحياكة والتفصيل الفوري.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side: Interactive Customizer Simulator Preview */}
        <div className="lg:col-span-5 flex flex-col justify-start lg:sticky lg:top-28">
          <div className="text-right mb-4">
            <h3 className="font-sans font-bold text-[#7B3B2A] text-lg flex items-center justify-end gap-1.5">
              <span>الاستوديو التفاعلي للمنتج</span>
              <Palette className="w-4.5 h-4.5 text-[#E8A0A0]" />
            </h3>
            <p className="text-xs text-[#A05030]/80 font-sans mt-0.5">محاكاة تفصيلية حية لطلبكِ المختار</p>
          </div>

          <motion.div 
            layout
            className="w-full relative aspect-square rounded-[35px] border-4 border-[#F2C4C4]/50 bg-white shadow-[0_15px_40px_rgba(123,59,42,0.1)] p-6 overflow-hidden flex flex-col justify-between items-center"
          >
            {/* Soft decorative shimmer overlay */}
            <div className="absolute inset-0 bg-radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 80%) pointer-events-none" />

            {/* Vintage inner frame */}
            <div className="absolute inset-3 rounded-[28px] border border-[#7B3B2A]/10 pointer-events-none" />

            {/* Simulated item category name */}
            <span className="bg-[#7B3B2A] text-[#FAF0E8] text-[9px] font-sans font-extrabold px-3 py-1 rounded-full border border-white/20 z-10 select-none">
              مواصفات: {getOccasionLabel(occasionType)}
            </span>

            {/* Dynamic Glass Mirror Surface with color schema */}
            <motion.div 
              layout
              className={`flex-1 w-full my-6 rounded-[24px] ${visualProps.bg} border-2 ${visualProps.border} p-5 flex flex-col items-center justify-center relative shadow-sm overflow-hidden select-none`}
            >
              {/* Double pearl row dots boundary simulated */}
              <div className="absolute inset-1.5 border-2 border-dotted border-white/50 rounded-[18px] pointer-events-none" />

              {/* Theme corner flowers */}
              <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#FAF0E8]/70 flex items-center justify-center text-lg shadow-inner z-10">
                {visualProps.flower}
              </div>
              <div className="absolute bottom-3 left-3 w-7 h-7 rounded-full bg-[#FAF0E8]/60 flex items-center justify-center text-sm shadow-inner z-10">
                {visualProps.flower}
              </div>

              {/* Ring slots if tray */}
              {(occasionType === "marriage" || occasionType === "engagement") && (
                <div className="flex gap-3 justify-center py-2.5 z-10">
                  <div className="w-9 h-9 rounded-md bg-white border border-[#F2C4C4]/40 shadow-sm flex items-center justify-center">
                    <Heart className="w-4.5 h-4.5 text-[#E8A0A0] fill-[#E8A0A0]" />
                  </div>
                  <div className="w-9 h-9 rounded-md bg-white border border-[#F2C4C4]/40 shadow-sm flex items-center justify-center">
                    <Heart className="w-4.5 h-4.5 text-[#E8A0A0] fill-[#E8A0A0]" />
                  </div>
                </div>
              )}

              {/* Dynamic Customer Input Display */}
              <div className="text-center mt-2 z-10 flex flex-col items-center">
                <span className="font-marhey text-xl sm:text-2xl font-bold tracking-tight text-[#7B3B2A] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                  {customText || "اكتبي أسماء الفرح"}
                </span>
                
                <span className="text-xs font-semibold text-[#A05030] mt-1 tracking-widest block">
                  {eventDate || "تاريخ الفرح"}
                </span>

                <span className="text-[10px] text-[#7B3B2A]/90 font-sans font-bold mt-4 bg-[#FAF0E8]/80 border border-[#F2C4C4]/40 px-3 py-1 rounded-full shadow-sm max-w-[200px] truncate leading-5">
                  بُورِكَتْ فَاتِحَةُ العُمْرِ مَعَكِ 💍
                </span>
              </div>

            </motion.div>

            {/* Bottom visual indicator */}
            <div className="flex justify-between w-full text-[9px] font-sans text-[#A05030]/80 z-10">
              <span>✦ محبوكة بالحب هاندميد</span>
              <span>ألوان التصميم: {mainColor === "rose-gold" ? "ذهبي وردي باللؤلؤ" : mainColor === "silver" ? "فضي بالكريستال" : mainColor === "shiny-gold" ? "ذهبي صريح مدهب" : mainColor === "royal-red" ? "أحمر جوري مخملي" : "أبيض ثلجي"}</span>
            </div>

          </motion.div>
        </div>

        {/* Right Side: Professional Customizer Studio Form */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form 
                key="custom-form"
                onSubmit={handleFormSubmit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[32px] border border-[#F2C4C4]/35 p-6 sm:p-8 shadow-sm flex flex-col gap-5 text-right w-full"
              >
                {/* Visual form progress */}
                <span className="text-xs text-[#A05030] font-sans font-bold tracking-widest uppercase mb-1">بيانات حياكة وتفصيل القطعة</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="flex flex-col gap-1 text-right">
                    <label className="text-xs font-bold text-[#7B3B2A] font-sans">الاسم الكريم للعميل *</label>
                    <input 
                      type="text" 
                      placeholder="مثال: ياسمين أحمد"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF0E8]/50 text-right focus:outline-none focus:bg-[#FAF0E8] border border-[#F2C4C4]/20 focus:border-[#E8A0A0] text-sm font-sans"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1 text-right">
                    <label className="text-xs font-bold text-[#7B3B2A] font-sans">رقم الواتساب للتواصل والتاكيد *</label>
                    <input 
                      type="tel" 
                      placeholder="مثال: 01023456789"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF0E8]/50 text-right focus:outline-none focus:bg-[#FAF0E8] border border-[#F2C4C4]/20 focus:border-[#E8A0A0] text-sm font-sans"
                      aria-label="تحميل صورة إلهامية"
                      aria-describedby="customizer-file-desc"
                      title="قم بتحميل صورة إلهامية (JPG, PNG, GIF أقل من 5 ميجا)"
                    />
                  </div>
                    <span id="customizer-file-desc" className="text-[10px] text-[#A05030]/80 font-sans">الامتداد المعتمد: JPG, PNG, GIF أقل من 5 ميجا</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Occasion type */}
                  <div className="flex flex-col gap-1 text-right">
                    <label htmlFor="occasionType" className="text-xs font-bold text-[#7B3B2A] font-sans">نوع المناسبة الديمقراطية</label>
                    <select
                      id="occasionType"
                      aria-label="نوع المناسبة الديمقراطية"
                      value={occasionType}
                      onChange={(e) => setOccasionType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF0E8]/50 text-right focus:outline-none focus:bg-[#FAF0E8] border border-[#F2C4C4]/20 focus:border-[#E8A0A0] text-sm font-sans cursor-pointer"
                    >
                      <option value="marriage">صينية وقالب كتب كتاب الفرح</option>
                      <option value="engagement">صينية تقديم شبكة الخطوبة</option>
                      <option value="graduation">قبعة تخرج مخملية مكللة بالورد</option>
                      <option value="newborn">برواز مقتنيات المواليد (سبوع)</option>
                    </select>
                  </div>

                  {/* Color Scheme selected with beautiful styled pellets */}
                  <div className="flex flex-col gap-1 text-right">
                    <label htmlFor="mainColor" className="text-xs font-bold text-[#7B3B2A] font-sans">تنسيق وهيكل الألوان المطلوب</label>
                    <select
                      id="mainColor"
                      aria-label="تنسيق وهيكل الألوان المطلوب"
                      value={mainColor}
                      onChange={(e) => setMainColor(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF0E8]/50 text-right focus:outline-none focus:bg-[#FAF0E8] border border-[#F2C4C4]/20 focus:border-[#E8A0A0] text-sm font-sans cursor-pointer"
                    >
                      <option value="rose-gold">وردي عاجي ناعم بالورد الجوري</option>
                      <option value="silver">فضي كلاسيكي بالخرز الشفاف</option>
                      <option value="shiny-gold">مذهب فاخر وعروق مذهبة</option>
                      <option value="royal-red">أحمر ملكي ثري وجوري غامق</option>
                      <option value="warm-white">أبيض ثلجي مطعم باللآلئ</option>
                    </select>
                  </div>
                </div>

                {/* Names and texts to parse inside simulator */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1 text-right">
                    <label className="text-xs font-bold text-[#7B3B2A] font-sans">الأسماء المطلوب نقشها بالتطريز *</label>
                    <input 
                      type="text" 
                      placeholder="مثال: مختار & ندى"
                      required
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF0E8]/50 text-right focus:outline-none focus:bg-[#FAF0E8] border border-[#F2C4C4]/20 focus:border-[#E8A0A0] text-sm font-sans"
                    />
                  </div>

                  {/* Event date manually inputted as requested */}
                  <div className="flex flex-col gap-1 text-right">
                    <label className="text-xs font-bold text-[#7B3B2A] font-sans">تاريخ المناسبة المطلوب تدوينه</label>
                    <input 
                      type="text" 
                      placeholder="مثال: ٢٢ مارس ٢٠٢٦"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF0E8]/50 text-right focus:outline-none focus:bg-[#FAF0E8] border border-[#F2C4C4]/20 focus:border-[#E8A0A0] text-sm font-sans"
                    />
                  </div>
                </div>

                {/* Additional instructions and requirements details */}
                <div className="flex flex-col gap-1 text-right">
                  <label className="text-xs font-bold text-[#7B3B2A] font-sans">تفاصيل وشروط إضافية في حياكة القطعة</label>
                  <textarea 
                    placeholder="مثال: حبة لؤلؤ مضاعفة بالزاوية العليا، علب ديب قطيفة بلون كحلي غامق.."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF0E8]/50 text-right focus:outline-none focus:bg-[#FAF0E8] border border-[#F2C4C4]/20 focus:border-[#E8A0A0] text-sm font-sans resize-none"
                  />
                </div>

                {/* Image Upload Drag & Drop Section strictly satisfying standard rules */}
                <div className="flex flex-col gap-1.5 text-right w-full">
                  <label className="text-xs font-bold text-[#7B3B2A] font-sans">أرفقي صورة إلهامية لتصميم مشابه (إختياري)</label>
                  
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-[#F2C4C4] hover:border-[#E8A0A0] rounded-2xl p-6 bg-[#FAF0E8]/20 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center w-full"
                  >
                    <PenTool className="w-8 h-8 text-[#E8A0A0]" />
                    <span className="text-xs text-[#7B3B2A] font-sans font-semibold">اسحبي وأفلتي صورتك هنا أو اختاري يدوياً</span>
                    <span className="text-[10px] text-[#A05030]/80 font-sans">الامتداد المعتمد: JPG, PNG, GIF أقل من 5 ميجا</span>
                    
                    <input 
                      type="file" 
                      id="customizer-file-selector"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      aria-label="Upload inspirational image"
                      title="Upload inspirational image"
                    />
                    
                    <button 
                      type="button"
                      onClick={() => document.getElementById("customizer-file-selector")?.click()}
                      className="mt-1 text-[11px] bg-white text-[#7B3B2A] border border-[#F2C4C4] px-3 py-1.5 rounded-full font-sans font-bold hover:bg-[#FAF0E8] transition-colors"
                    >
                      تصفح الملفات يدوياً 📁
                    </button>

                    {uploadedImageName && (
                      <span className="text-xs text-emerald-600 font-sans font-medium mt-1 bg-white border border-emerald-200 px-3 py-1 rounded-full animate-pulse">
                        ✓ تم إرفاق: {uploadedImageName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Interactive Metro Station Picker & Checker */}
                <div className="bg-[#FAF0E8] border border-[#E8A0A0]/30 rounded-[24px] p-5 text-right flex flex-col gap-3 mt-1 shadow-xs">
                  <div className="flex items-start gap-3">
                    <span className="text-xl bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-xs shrink-0">🚇</span>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-[#7B3B2A] block">مستكشف محطات المترو للتوصيل والاستلام 🌸</span>
                      <p className="text-[10px] text-[#A05030]/90 leading-relaxed mt-0.5">
                        التسليم يتم <strong>يداً بيد</strong> عبر محطات المترو داخل <strong>القاهرة والجيزة فقط</strong> لضمان الحفاظ على سلامة القطع الفنية وحمايتها من التلف.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end mt-1">
                    {/* Station Selector Dropdown with Grouping */}
                    <div className="flex flex-col gap-1 text-right">
                      <label className="text-[10px] font-bold text-[#7B3B2A] font-sans">اختر أقرب محطة تناسبكِ:</label>
                      <select
                        value={metroStation}
                        onChange={(e) => setMetroStation(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white text-right focus:outline-none border border-[#F2C4C4]/40 text-xs font-sans cursor-pointer"
                        title="اختر أقرب محطة تناسبكِ"
                      >
                        {Array.from(new Set(METRO_STATIONS.map(s => s.line))).map((lineName) => (
                          <optgroup key={lineName} label={lineName} className="font-bold text-[#7B3B2A] bg-[#FAF0E8]/50">
                            {METRO_STATIONS.filter(s => s.line === lineName).map((st, idx) => (
                              <option key={idx} value={st.name} className="text-stone-800 bg-white font-normal">
                                {st.badge} {st.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {/* Interactive Confirmation Status badge */}
                    <div className="bg-white/80 border border-[#F2C4C4]/30 rounded-xl p-2.5 text-right flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-sans">تغطية المحطة:</span>
                        <span className="text-[11px] font-sans font-bold text-[#7B3B2A]">
                          ✓ محطة {metroStation}
                        </span>
                      </div>
                      <span className="text-[9px] bg-[#25D366]/10 text-emerald-800 font-bold px-2 py-1 rounded-md border border-[#25D366]/20 uppercase tracking-tight flex items-center gap-1 leading-normal select-none">
                        <span className="text-emerald-500">•</span> مـؤكـدة
                      </span>
                    </div>
                  </div>

                  {/* Informational small warning */}
                  <div className="text-[9px] text-[#A05030]/80 font-sans italic border-r-2 border-[#E8A0A0] pr-2 mt-1">
                    * سنقوم بتأكيد موعد وساعة الالتقاء في محطة <strong>{metroStation}</strong> هاتفياً قبل موعد التسليم بـ 24 ساعة.
                  </div>
                </div>

                {/* Submitting button with delay simulator */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#7B3B2A] text-[#FAF0E8] py-3.5 px-6 rounded-full font-sans font-semibold text-sm hover:bg-[#A05030] transition-colors shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-[#FAF0E8] border-t-transparent animate-spin" />
                      <span>جاري إرفاق وتجهيز اللوحة...</span>
                    </>
                  ) : (
                    <>
                      <span>أرسلي الطلب الآن واستلمي كود تتبع 🤍</span>
                    </>
                  )}
                </button>

              </motion.form>
            ) : (
              <motion.div 
                key="submitted-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-[32px] border border-emerald-100 p-8 shadow-md text-center max-w-lg mx-auto flex flex-col items-center gap-5 w-full"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                  <CheckCircle className="w-9 h-9" />
                </div>
                
                <h2 className="font-marhey text-[#7B3B2A] text-xl font-bold">تهانينا؛ تم حفظ تفاصيل تحفتكِ بنجاح!</h2>
                <p className="text-xs sm:text-sm text-[#7B3B2A]/80 font-sans leading-relaxed">
                  أهلاً {customerName}، لقد سجلنا طلب القطعة المخصصة لـ {getOccasionLabel(occasionType)} بنجاح في سجلات براند تحفة لدينا، كود الطلب الخاص بكِ هو: <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded font-bold">#TF-{Math.floor(Math.random()*9000)+1000}</span>
                </p>

                <div className="bg-[#FAF0E8] border border-[#F2C4C4]/40 p-4 rounded-2xl text-right w-full font-sans text-xs">
                  <span className="font-bold text-[#7B3B2A] mb-2 block">ملخص التخصيص والاستلام:</span>
                  <p>• العميل: {customerName}</p>
                  <p>• الأسماء المنقوشة: {customText}</p>
                  <p>• تدرج الألوان: {mainColor === "rose-gold" ? "ذهبي وردي باللؤلؤ" : "فضي لامع"}</p>
                  <p>• تاريخ اللوحة: {eventDate}</p>
                  <p className="text-emerald-700 font-bold">• محطة استلام المترو: محطة {metroStation || "لم تحدد"}</p>
                </div>

                <div className="flex flex-col gap-2.5 w-full mt-2">
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <a
                      href={`https://wa.me/201223633880?text=${encodeURIComponent(whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-sm cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                      مشاركة عبر واتسـاب نونا 🌸
                    </a>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="flex-1 bg-[#7B3B2A] hover:bg-[#A05030] text-[#FAF0E8] font-semibold py-3 px-4 rounded-full flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-sm cursor-pointer"
                    >
                      <span>طباعة ملخص التصميم 🖨️</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setCustomerName("");
                      setPhone("");
                      setDetails("");
                      setUploadedImageName(null);
                    }}
                    className="text-xs text-[#7B3B2A] font-bold underline cursor-pointer mt-2"
                  >
                    العودة لتصميم مقتنى آخر مخصص
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Elegant Toast Notification Overlay */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="fixed bottom-10 right-6 left-6 sm:left-auto sm:right-6 z-50 max-w-sm bg-[#7B3B2A] text-[#FAF0E8] border border-[#F2C4C4]/40 p-4 rounded-2xl shadow-[0_12px_40px_rgba(123,59,42,0.3)] flex items-center gap-3 text-right font-sans"
              >
                <div className="w-8 h-8 rounded-full bg-amber-50 text-[#7B3B2A] flex items-center justify-center shrink-0 font-bold shadow-xs">
                  ✓
                </div>
                <div className="flex-grow">
                  <span className="font-bold text-xs sm:text-sm block">تم تسجيل تفاصيل التصميم!</span>
                  <span className="text-[10px] text-[#FAF0E8]/70 leading-normal block">جاهز للمشاركة الفورية عبر الواتساب أو الطباعة.</span>
                </div>
                <button 
                  onClick={() => setShowToast(false)} 
                  className="text-white/60 hover:text-white p-1 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Full-Featured Hub: Client History & Merchant Ledger Admin Dashboard */}
      <div className="mt-16 border-t border-[#F2C4C4]/30 pt-10">
        
        {/* Hub Segment Control and Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 text-right">
          
          {isAdminUnlocked ? (
            <div className="flex items-center gap-2 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/50 shadow-inner select-none order-2 md:order-1">
              <button
                type="button"
                onClick={() => setViewMode("customer")}
                className={`px-4.5 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
                  viewMode === "customer" 
                    ? "bg-[#7B3B2A] text-[#FAF0E8] shadow-sm" 
                    : "text-stone-600 hover:text-[#7B3B2A] hover:bg-stone-50"
                }`}
              >
                عرض كـ عميل (مقتنياتي) 🌸
              </button>
              
              
              {currentUser?.isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowAdminPasswordModal(true)}
                  className="px-4.5 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 text-stone-600 hover:text-[#7B3B2A] hover:bg-stone-50"
                >
                  <Database className="w-3.5 h-3.5" />
                  لوحة تحكم نونا 📊
              </button>
            )}
              <button
                type="button"
                onClick={() => {
                  setIsAdminUnlocked(false);
                  setViewMode("customer");
                }}
                title="تسجيل الخروج وقفل لوحة الإدارة تماماً"
                className="px-3 py-2 rounded-xl text-xs font-sans font-bold text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
              >
                خروج 🔒
              </button>
            </div>
          ) : (
            <div className="order-2 md:order-1" />
          )}

          <h3 
            onClick={() => setSecretClickCount(prev => prev + 1)}
            className="font-serif font-bold text-[#7B3B2A] text-xl sm:text-2xl flex items-center gap-2 order-1 md:order-2 cursor-pointer select-none active:opacity-85 active:scale-95 transition-all"
            title="سجل لوحاتي ومقتنياتي"
          >
            {viewMode === "customer" ? (
              <>
                <span>سجل لوحاتي ومقتنياتي المصممة</span>
                <FileText className="w-5 h-5 text-[#E8A0A0]" />
              </>
            ) : (
              <>
                <span>لوحة تحكم الطلبيات والتحليل المالي الشهري ⚖️</span>
                <Database className="w-5 h-5 text-[#7B3B2A]" />
              </>
            )}
          </h3>

        </div>

        {viewMode === "merchant" ? (
          <div className="space-y-8">
            
            {/* 1. Monthly Financial & Delivery Stats Summary Cards */}
            <div className="bg-[#FAF0E8]/50 border-2 border-[#F2C4C4]/40 rounded-[28px] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-4 border-b border-[#F2C4C4]/20 text-right">
                
                {/* Month Dropdown filter */}
                <div className="flex items-center gap-2 justify-end font-sans">
                  <label htmlFor="adminMonthFilterSelect" className="text-xs font-bold text-[#7B3B2A] font-sans">
                    اختر الفترة الحسابية للتقرير:
                  </label>
                  <select
                    id="adminMonthFilterSelect"
                    value={adminMonthFilter}
                    onChange={(e) => setAdminMonthFilter(e.target.value)}
                    className="px-3.5 py-1.5 bg-white border border-[#F2C4C4]/60 rounded-xl text-xs text-right text-[#7B3B2A] font-bold focus:outline-none focus:border-[#E8A0A0] shadow-2xs cursor-pointer"
                  >
                    <option value="all">كل الأشهر السابقة</option>
                    {getMonthsList().map((ym) => (
                      <option key={ym} value={ym}>
                        شهر: {formatYearMonth(ym)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-right">
                  <h4 className="text-sm font-sans font-extrabold text-[#7B3B2A] flex items-center justify-end gap-1.5">
                    <span>حاسبة الإيرادات والإنجاز الشهري للبراند ✦</span>
                    <TrendingUp className="w-4 h-4 text-[#A05030]" />
                  </h4>
                  <p className="text-[10px] text-gray-400 font-sans">حسّابة فورية وإحصائيات مالية تفصيلية وتحليلات الدخل الفخرية</p>
                </div>
              </div>

              {/* Bento Grid Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-right font-sans">
                
                {/* Stat 1: Delivered Profit */}
                <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-2xs flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-emerald-600 font-bold block">إجمالي أرباح التوصيل المسلمة 💸</span>
                    <span className="p-1 px-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs">✓</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-700 mt-2 block">
                    {statsSelectedMonthOrders.filter(o => o.status === "delivered").reduce((sum, o) => sum + (o.priceEGP || 0), 0)} ج.م
                  </span>
                  <span className="text-[8.5px] text-stone-400 block mt-1">من مبيعات وخدمة تسليم القطع المصنوعة</span>
                </div>

                {/* Stat 2: In Production Progress Expected Revenue */}
                <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-indigo-650 font-bold block">أرباح قيد التنفيذ والتحضير ⏳</span>
                    <span className="p-1 px-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs">🧵</span>
                  </div>
                  <span className="text-2xl font-black text-indigo-700 mt-2 block">
                    {statsSelectedMonthOrders.filter(o => o.status === "confirmed" || o.status === "preparing").reduce((sum, o) => sum + (o.priceEGP || 0), 0)} ج.م
                  </span>
                  <span className="text-[8.5px] text-stone-400 block mt-1">قيمة مبيعات نشطة قيد التطريز والحياكة</span>
                </div>

                {/* Stat 3: Potential Active Contract Sum */}
                <div className="bg-[#7B3B2A] text-[#FAF0E8] p-4 rounded-2xl border border-[#E8A0A0]/20 shadow-2xs flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-stone-200 font-bold block">إجمالي الإيرادات الكلية المحتملة ✨</span>
                    <span className="p-1 px-1.5 bg-white/10 text-stone-200 rounded-lg text-xs">✦</span>
                  </div>
                  <span className="text-2xl font-black mt-2 block text-white">
                    {statsSelectedMonthOrders.filter(o => o.status !== "canceled").reduce((sum, o) => sum + (o.priceEGP || 0), 0)} ج.م
                  </span>
                  <span className="text-[8.5px] text-stone-300 block mt-1">المبلغ النهائي بعد الإتمام الفعلي لكافة الطلبات</span>
                </div>

                {/* Stat 4: Efficiency Rating */}
                <div className="bg-white p-4 rounded-2xl border border-[#F2C4C4]/20 shadow-2xs flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gray-500 font-bold block">معدل الإتمام والكفاءة 🌟</span>
                    <span className="p-1 px-1.5 bg-amber-50 text-amber-605 rounded-lg text-xs">%</span>
                  </div>
                  <span className="text-2xl font-black text-[#7B3B2A] mt-2 block">
                    {statsSelectedMonthOrders.length > 0
                      ? Math.round((statsSelectedMonthOrders.filter(o => o.status === "delivered").length / (statsSelectedMonthOrders.filter(o => o.status !== "canceled").length || 1)) * 100)
                      : 0}%
                  </span>
                  <span className="text-[8.5px] text-stone-400 block mt-1">
                    سلمت {statsSelectedMonthOrders.filter(o => o.status === "delivered").length} من أصل {statsSelectedMonthOrders.filter(o => o.status !== "canceled").length} طلبات فعالة
                  </span>
                </div>

              </div>

              {/* recharts Monthly Progress Chart */}
              <div className="mt-6 bg-white rounded-2xl p-5 border border-[#F2C4C4]/30 shadow-2xs">
                <h4 className="text-sm font-sans font-extrabold text-[#7B3B2A] mb-4 flex items-center justify-end gap-1.5">
                  <span>منحنى الحسابات المالية الشهرية ومعدلات نمو الأرباح 📈</span>
                </h4>
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={getChartData()}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#faf0e8" />
                      <XAxis 
                        dataKey="monthLabel" 
                        tick={{ fontSize: 9, fill: '#7C4B3A', fontFamily: 'sans-serif' }}
                        axisLine={{ stroke: '#f2c4c4', strokeWidth: 1 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 9, fill: '#7C4B3A', fontFamily: 'sans-serif' }}
                        axisLine={{ stroke: '#f2c4c4', strokeWidth: 1 }}
                      />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Legend 
                        verticalAlign="top" 
                        height={36} 
                        iconType="circle"
                        wrapperStyle={{ fontFamily: 'sans-serif', fontSize: '10px', color: '#7C4B3A' }}
                      />
                      <Area 
                        type="monotone" 
                        name="الأرباح وعقود التسليم ✓"
                        dataKey="الأرباح المسلمة ✓" 
                        stroke="#10b981" 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#colorDelivered)" 
                      />
                      <Area 
                        type="monotone" 
                        name="قيد الخرز والحياكة ⏳"
                        dataKey="قيد التنفيذ والمطرزة ⏳" 
                        stroke="#818cf8" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorInProgress)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 2. Interactive Filters, Search, and Database Backup Tools */}
            <div className="bg-white border border-[#F2C4C4]/30 rounded-2xl p-5 shadow-xs text-right">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                
                {/* Search query input */}
                <div className="w-full lg:flex-1 relative font-sans">
                  <input
                    type="text"
                    required
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    placeholder="ابحثي يدوياً باسم العروس/العميل، رقم الهاتف، أو محطة المترو المتفق عليها..."
                    className="w-full pr-10 pl-4 py-2 bg-[#FAF0E8]/40 border border-[#F2C4C4]/50 focus:border-[#E8A0A0] text-xs text-right focus:bg-white rounded-xl focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-2.5" />
                </div>

                {/* Import / Export DB backup Buttons */}
                <div className="w-full sm:w-auto flex items-center justify-end gap-2 text-right">
                  
                  {/* Backup export */}
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    title="تنزيل نسخة احتياطية من قاعدة بيانات الطلبات على جهازك لحفظها"
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-sans font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير ملف الحسابات 💾</span>
                  </button>

                  {/* Backup import */}
                  <label className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-sans font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>استيراد قاعدة البيانات 🔄</span>
                    <input
                      type="file"
                      id="db-backup-selector"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>

                </div>

              </div>
              
              <div className="mt-3 text-center sm:text-right">
                <span className="text-[10px] bg-amber-55 text-amber-850 px-2.5 py-1 rounded inline-flex items-center gap-1 border border-amber-200 font-sans">
                  <AlertCircle className="w-3 h-3 text-amber-600 animate-pulse" />
                  <span>اسحبي وأفلتي أي تذكرة أدناه لنقلها وتعديل حالتها فوراً وبث تحديثها للعميل بالخلفية تلقائياً!</span>
                </span>
              </div>
            </div>

            {/* 3. Interactive Trello-like DND Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 items-stretch font-sans">
              
              {[
                { id: "pending", title: "جديد تحت المراجعة", icon: <AlertCircle className="w-4 h-4 text-amber-650" />, bg: "bg-amber-50/40", border: "border-amber-200/60", hoverBorder: "border-amber-450", pill: "bg-amber-100 text-amber-800" },
                { id: "confirmed", title: "مؤكد ومقبول", icon: <CheckCircle className="w-4 h-4 text-blue-650" />, bg: "bg-blue-50/40", border: "border-blue-200/60", hoverBorder: "border-blue-450", pill: "bg-blue-100 text-blue-800" },
                { id: "preparing", title: "قيد الحياكة والتطريز", icon: <PenTool className="w-4 h-4 text-orange-650" />, bg: "bg-amber-50/20", border: "border-orange-200/50", hoverBorder: "border-orange-450", pill: "bg-orange-100 text-orange-850" },
                { id: "delivered", title: "مكتمل ومسلّم يداً بيد", icon: <CheckCircle2 className="w-4 h-4 text-emerald-650" />, bg: "bg-emerald-50/30", border: "border-emerald-200/40", hoverBorder: "border-emerald-450", pill: "bg-emerald-100 text-emerald-800" },
                { id: "canceled", title: "ملغي ومستبعد", icon: <XCircle className="w-4 h-4 text-rose-650" />, bg: "bg-stone-100/40", border: "border-stone-200/40", hoverBorder: "border-stone-450", pill: "bg-stone-200 text-stone-700" }
              ].map(col => {
                const colOrders = filteredOrders.filter(ord => (ord.status || "pending") === col.id);
                const isDragOver = dragOverColumn === col.id;

                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => handleDragOverCol(e, col.id)}
                    onDragLeave={() => setDragOverColumn(null)}
                    onDrop={(e) => handleDropOnCol(e, col.id as any)}
                    className={`rounded-2xl p-4 flex flex-col gap-4 border-2 transition-all min-h-[500px] h-full ${col.bg} ${
                      isDragOver 
                        ? `${col.hoverBorder} bg-white shadow-md scale-[1.01] border-dashed` 
                        : `${col.border} border-solid`
                    }`}
                  >
                    
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200/40 select-none">
                      <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${col.pill}`}>
                        {colOrders.length}
                      </span>
                      <div className="flex items-center gap-1.5 text-right font-sans">
                        <span className="font-bold text-stone-850 text-xs sm:text-sm">{col.title}</span>
                        {col.icon}
                      </div>
                    </div>

                    {/* Column Content */}
                    <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[700px] pr-1">
                      {colOrders.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-stone-200/50 rounded-xl text-center text-stone-400 text-[10.5px]">
                          <span>اسحبي التذاكر إلى هنا 🌸</span>
                        </div>
                      ) : (
                        colOrders.map(ord => {
                          const pricingVal = ord.priceEGP || 0;
                          return (
                            <div
                              key={ord.id}
                              draggable={true}
                              onDragStart={(e) => handleDragStart(e, ord.id)}
                              onDragEnd={handleDragEnd}
                              className={`p-4 rounded-xl bg-white border border-stone-200 hover:border-[#E8A0A0]/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all text-right flex flex-col justify-between font-sans relative cursor-grab active:cursor-grabbing select-none hover:scale-[1.01] ${
                                draggingOrderId === ord.id ? "opacity-40 border-dashed border-stone-450" : ""
                              }`}
                            >
                              
                              {/* Drag handle ribbon */}
                              <div className="absolute top-2.5 left-2 flex items-center gap-1 text-gray-300">
                                <GripVertical className="w-3.5 h-3.5" />
                              </div>

                              {/* Card Header information */}
                              <div className="border-b border-stone-100 pb-2 mb-2">
                                <div className="flex justify-between items-center text-left mb-1.5">
                                  <div className="flex flex-col text-left font-mono">
                                    <span className="text-[8.5px] text-stone-400 block">#TS-{ord.id.slice(-6).toUpperCase()}</span>
                                    <span className="text-[8.5px] text-stone-500 font-semibold">{ord.createdAt}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 flex-wrap pr-4 pb-0.5">
                                  <h5 className="font-bold text-stone-855 text-xs truncate">
                                    {ord.customerName}
                                  </h5>
                                  {ord.isVerifiedClient && (
                                    <span 
                                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[8.5px] font-black"
                                      title="حساب حقيقي تم تفعيل تواصله والتحقق منه برمز OTP"
                                    >
                                      <span className="text-[9px]">✓</span>
                                      <span>موثق بالكامل</span>
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-stone-400 font-semibold mt-0.5 pr-4">{ord.phone}</p>
                              </div>

                              {/* Embroidery and designs details */}
                              <div className="space-y-1.5 text-[10.5px] text-stone-650">
                                <div className="text-stone-700 bg-stone-50 p-2 rounded-lg border border-stone-100 font-bold mb-1.5">
                                  <span className="text-[9px] text-gray-400 block font-normal">نقش الأسماء المطلوب:</span>
                                  <span className="text-stone-900 font-marhey text-[11px] block text-center leading-5">{ord.customText}</span>
                                </div>

                                <p className="text-stone-500">
                                  <strong className="text-stone-700">المناسبة:</strong> {getOccasionLabel(ord.occasionType)}
                                </p>

                                {ord.details && (
                                  <p className="text-[9.5px] text-stone-400 italic font-medium max-h-16 overflow-y-auto leading-relaxed border-r-2 border-[#E8A0A0]/30 pr-1.5 mt-1">
                                    {ord.details}
                                  </p>
                                )}

                                {ord.metroStation && (
                                  <p className="text-emerald-805 text-[9.5px] mt-2 font-bold flex items-center gap-1.5 bg-[#FAF0E8] border border-[#F2C4C4]/20 px-2 py-0.5 rounded-lg w-fit">
                                    <span>🚇 {ord.metroStation}</span>
                                  </p>
                                )}
                              </div>

                              {/* Price input settings on card directly */}
                              <div className="mt-3.5 pt-2.5 border-t border-stone-100 space-y-2">
                                <div className="flex items-center justify-between gap-1.5 bg-stone-50 p-1.5 rounded-lg border border-stone-200/20">
                                  <span className="text-[9.5px] font-bold text-[#7B3B2A] whitespace-nowrap">السعر (ج.م):</span>
                                  <div className="flex items-center gap-1 w-24">
                                    <input
                                      type="number"
                                      min="0"
                                      placeholder="٠"
                                      value={pricingVal || ""}
                                      onChange={(e) => handleUpdateOrderPrice(ord.id, parseFloat(e.target.value) || 0)}
                                      className="w-full px-1.5 py-0.5 bg-white border border-[#F2C4C4]/40 focus:border-[#E8A0A0] text-stone-800 text-xs font-bold text-center rounded focus:outline-none"
                                    />
                                    <span className="text-[8.5px] text-[#7B3B2A] font-bold">ج.م</span>
                                  </div>
                                </div>

                                {/* Manual dropdown as failsafe for mobile */}
                                <div className="flex flex-col gap-0.5">
                                  <select
                                    value={ord.status || "pending"}
                                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                                    title="تحديث حالة الطلب"
                                    className="w-full px-2 py-1 rounded bg-[#FAF0E8] hover:bg-[#FAF0E8]/70 text-[10px] font-bold text-[#7B3B2A] focus:outline-none focus:border-[#E8A0A0] cursor-pointer animate-none"
                                  >
                                    <option value="pending">⏳ الانتظار والمراجعة</option>
                                    <option value="confirmed">✓ تأكيد وحجز</option>
                                    <option value="preparing">🧵 حياكة وتطريز</option>
                                    <option value="delivered">🚇 تم التسليم بأمان</option>
                                    <option value="canceled">❌ ملغي ومستبعد</option>
                                  </select>
                                </div>

                                {/* Quick WhatsApp & Print Action */}
                                <div className="flex gap-1 pt-1 justify-stretch">
                                  <a
                                    href={`https://wa.me/${ord.phone.startsWith("0") ? "2" + ord.phone : ord.phone}?text=${encodeURIComponent(
                                      `أهلاً ${ord.customerName}، معاكي نونا للقطع اليدوية الفاخرة 🌸 حابة ننسق بخصوص طلبك لـ "${getOccasionLabel(ord.occasionType)}" المطرز باسم "${ord.customText}" المقيد لدينا برقم #${ord.id}`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="اتصال مباشر واتساب"
                                    className="flex-1 bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 rounded py-1 text-center font-bold text-[9.5px] block transition-colors leading-relaxed"
                                  >
                                    واتساب 💬
                                  </a>
                                  
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Override customizer states with this card values for PDF preview download
                                      setCustomerName(ord.customerName);
                                      setOccasionType(ord.occasionType);
                                      setMainColor(ord.mainColor);
                                      setCustomText(ord.customText);
                                      setMetroStation(ord.metroStation || "حلوان");
                                      setDetails(ord.details || "");
                                      setTimeout(() => handlePrint(), 100);
                                    }}
                                    className="flex-1 bg-stone-50 hover:bg-[#FAF0E8] text-stone-750 border border-stone-200 rounded py-1 font-bold text-[9.5px] transition-colors"
                                  >
                                    طباعة تذكرة 🖨
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      if (confirm(`هل رغبتكِ في حذف ومسح تذكرة ${ord.customerName} نهائياً ومحو بيانات الحجز؟`)) {
                                        handleDeleteOrder(ord.id, e);
                                      }
                                    }}
                                    title="حذف نهائي للطلب من السجل"
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-1.5 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                              </div>

                            </div>
                          );
                        })
                      )}
                    </div>

                  </div>
                );
              })}

            </div>

          </div>
        ) : (
          
          /* RENDER VIEW: STANDARD CLIENT VIEW */
          <div>
            {savedOrders.length === 0 ? (
              <div className="bg-white border border-[#F2C4C4]/20 rounded-3xl p-10 text-center text-stone-400 text-xs font-sans max-w-md mx-auto">
                <FileText className="w-8 h-8 mx-auto mb-2 text-[#E8A0A0]" />
                <p className="font-bold text-[#7B3B2A]">سجل مقتنياتكِ وتصاميمكِ فارغ حالياً</p>
                <p className="text-[10px] text-stone-400 mt-1">قومي بتصميم لوحتك الأولى الفورية وحفظها أعلاه للتواجد في السجل المحلي والمتابعة مع الفنانة نونا!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-right">
                {savedOrders.filter(Boolean).map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-white border border-[#F2C4C4]/20 shadow-sm text-right flex flex-col justify-between text-xs font-sans min-h-[175px] h-auto">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full border font-bold ${
                          ord.status === "delivered" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                          ord.status === "preparing" ? "bg-orange-50 text-orange-850 border-orange-200 animate-pulse" :
                          ord.status === "canceled" ? "bg-rose-50 text-rose-800 border-rose-200" :
                          ord.status === "confirmed" ? "bg-blue-50 text-blue-800 border-blue-200" :
                          "bg-amber-50 text-amber-805 border-amber-200"
                        }`}>
                          {ord.status === "delivered" ? "مكتمل وتم التسليم ✓" :
                          ord.status === "preparing" ? "قيد الحياكة والتنفيذ 🧵" :
                          ord.status === "canceled" ? "تم الإلغاء ❌" :
                          ord.status === "confirmed" ? "مقبول وحجز مؤكد ✓" :
                          "تحت المراجعة والتأكيد ⏳"}
                        </span>
                        <div className="flex items-center gap-1.5 font-sans">
                          <span className="text-gray-400 text-[10px]">{ord.createdAt}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              if (confirm("هل تريدين إزالة طلب التصميم من السجل الخاص بكِ؟")) {
                                handleDeleteOrder(ord.id, e);
                              }
                            }}
                            title="إلغاء وحذف التصميم من السجل"
                            className="text-stone-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded-md transition-colors cursor-pointer flex items-center justify-center grayscale hover:grayscale-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-[#7B3B2A] text-sm">{getOccasionLabel(ord.occasionType)}</h4>
                      <p className="text-gray-500 mt-1">الأسماء: {ord.customText}</p>
                      {ord.priceEGP ? (
                        <p className="text-[#7B3B2A] font-bold text-[10px] mt-1.5">السعر المتفق عليه: {ord.priceEGP} ج.م</p>
                      ) : null}
                      {ord.metroStation && (
                        <p className="text-emerald-805 text-[10px] mt-1.5 font-bold flex items-center gap-1 bg-[#FAF0E8] border border-[#F2C4C4]/20 px-2.5 py-0.5 rounded-md w-fit">
                          <span>🚇</span>
                          <span>المحطة: {ord.metroStation}</span>
                        </p>
                      )}
                    </div>

                    <a
                      href={`https://wa.me/201223633880?text=${encodeURIComponent(
                        `مرحباً نونا! حابة أراجع طلب التصميم المحفوظ برقم #${ord.id} من الاستوديو التفاعلي باسم "${ord.customText}" وحالته الحالية 🌸`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center font-bold text-[#E8A0A0] hover:text-[#7B3B2A] border-t border-[#FAF0E8] pt-2 mt-2 leading-5 cursor-pointer"
                    >
                      استعلم على واتساب للمضي بها ➔
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Admin PIN Verification Modal Overlay */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] border-2 border-[#F2C4C4]/50 shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center relative font-sans"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => {
                  setShowPinModal(false);
                  setPinInput("");
                  setPinError(false);
                }}
                className="absolute top-4 left-4 text-stone-400 hover:text-[#7B3B2A] p-1 cursor-pointer"
              >
                ✕
              </button>

              <div className="w-12 h-12 bg-[#FAF0E8] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F2C4C4]/40">
                <Database className="w-5 h-5 text-[#7B3B2A]" />
              </div>

              <h3 className="font-serif font-bold text-lg text-[#7B3B2A] mb-1">لوحة تحكم نونا الاستراتيجية ✦</h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-6">
                يرجى إدخال رمز المرور الخاص بالإدارة لحماية خصوصية بيانات واتصالات العملاء والتقرير المالي.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  if (currentUser?.isAdmin === true) {
                    
                    setShowAdminPasswordModal(true);

                    setShowPinModal(false);
                    setPinInput("");
                    setPinError(false);
                } else {
                  setPinError(true);
                }
              }}
              className="space-y-4"
              >
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="أدخلي رمز المرور والاتفاق"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (pinError) setPinError(false);
                    }}
                    className={`w-full px-4 py-2.5 text-center text-sm rounded-xl border-2 bg-stone-50 focus:bg-white text-stone-800 font-bold tracking-widest focus:outline-none transition-all ${
                      pinError 
                        ? "border-rose-300 focus:border-rose-400" 
                        : "border-[#F2C4C4]/40 focus:border-[#E8A0A0]"
                    }`}
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-[11px] text-rose-600 font-bold mt-1 text-center">
                      ❌ رمز المرور غير صحيح! يرجى المحاولة مرة أخرى.
                    </p>
                  )}
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPinModal(false);
                      setPinInput("");
                      setPinError(false);
                    }}
                    className="flex-1 py-2 text-xs rounded-xl border border-stone-200 hover:bg-[#FAF0E8]/40 hover:text-[#7B3B2A] text-stone-600 font-bold cursor-pointer transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs rounded-xl bg-[#7B3B2A] hover:bg-[#A05030] text-[#FAF0E8] font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    دخول الإدارة ➔
                  </button>
                </div>
              </form>

            </motion.div>
          </motion.div>
        )}
        {showAdminPasswordModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
      <h3 className="text-lg font-bold text-center text-[#7B3B2A] mb-4">
        كلمة مرور لوحة الإدارة
      </h3>

      <input
        type="password"
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
        placeholder="أدخل كلمة المرور"
        className="w-full border border-stone-300 rounded-xl p-3 text-center"
      />

      {adminPasswordError && (
        <p className="text-red-500 text-center text-sm mt-2">
          كلمة المرور غير صحيحة
        </p>
      )}

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => {
            setShowAdminPasswordModal(false);
            setAdminPassword("");
            setAdminPasswordError(false);
          }}
          className="flex-1 py-2 rounded-xl border border-stone-300"
        >
          إلغاء
        </button>

        <button
          type="button"
          onClick={handleAdminAccess}
          className="flex-1 py-2 rounded-xl bg-[#7B3B2A] text-white"
        >
          دخول
        </button>
      </div>
    </div>
  </div>
)}
      </AnimatePresence>

    </div>
  );
}
