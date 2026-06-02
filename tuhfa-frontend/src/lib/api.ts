/**
 * API Service - يتصل بـ NestJS Backend + MongoDB
 *
 * التغييرات:
 * 1. API_BASE = "/api"  →  يعتمد على Vite proxy في dev، same-origin في prod
 * 2. ApiError class يحمل status code → frontend يفرق بين 401 / 500 / network
 * 3. apiFetch يرجع data.data أو data مباشرة (backward-compatible)
 */

// ✅ FIX 1: relative URL — يعمل مع Vite proxy في dev وsame-origin في production
// Ensure TypeScript knows about import.meta.env in this file (Vite exposes VITE_* vars)
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

// ── Custom error class يحمل status ─────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  isNetworkError: boolean;

  constructor(message: string, status: number, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

// ── Token helpers ─────────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem('tuhfa_token');
}

function setToken(token: string): void {
  localStorage.setItem('tuhfa_token', token);
}

function removeToken(): void {
  localStorage.removeItem('tuhfa_token');
}

// ── Base fetch helper ─────────────────────────────────────────────────────────

async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;

  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    // ✅ FIX 2: fetch exception = network error (لا يوجد connection للـ server)
    throw new ApiError(
      !navigator.onLine
        ? 'لا يوجد اتصال بالإنترنت'
        : 'تعذّر الوصول للخادم، تحقق من تشغيل الـ Backend',
      0,
      true,
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const rawMessage = data?.message || data?.error || `خطأ ${res.status}`;
    const message = Array.isArray(rawMessage)
      ? rawMessage.join(', ')
      : String(rawMessage);

    // ✅ FIX 3: رمي ApiError بـ status code الفعلي من الـ response
    throw new ApiError(message, res.status);
  }

  // ✅ FIX 4: دعم الشكل الجديد { success, data } والقديم { success, orders/order/... }
  // backward-compatible: لو في data.data نرجعه، لو لأ نرجع data كله
  return (data.data !== undefined ? data.data : data) as T;
}

// ── رسالة خطأ موحدة للـ UI ────────────────────────────────────────────────────

/**
 * تحويل أي error لرسالة عربية واضحة حسب النوع
 *
 * الاستخدام:
 *   } catch (err) {
 *     setError(getErrorMessage(err));
 *   }
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.isNetworkError) return err.message;                          // network
    if (err.status === 401) return 'غير مصرح، يرجى تسجيل الدخول مجدداً';
    if (err.status === 403) return 'غير مصرح لك بهذه العملية';
    if (err.status === 404) return 'البيانات المطلوبة غير موجودة';
    if (err.status === 409) return err.message;                          // conflict (email مكرر)
    if (err.status >= 500)  return 'خطأ في الخادم، يرجى المحاولة لاحقاً';
    if (err.status >= 400)  return err.message;                          // validation errors
  }

  if (err instanceof Error) return err.message;

  return 'حدث خطأ غير متوقع';
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export const authApi = {
  async signup(data: {
    email: string;
    name: string;
    phone: string;
    password: string;
    adminCode?: string;
  }) {
    const result = await apiFetch<{ success: boolean; token: string; user: any }>(
      '/auth/signup',
      { method: 'POST', body: JSON.stringify(data) },
    );
    if (result.token) setToken(result.token);
    return result;
  },

  async login(email: string, password: string) {
    const result = await apiFetch<{ success: boolean; token: string; user: any }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
    );
    if (result.token) setToken(result.token);
    return result;
  },

  async getMe() {
    return apiFetch<any>('/auth/me');
  },

  logout() {
    removeToken();
  },

  isLoggedIn(): boolean {
    return !!getToken();
  },
};

// ── OTP API ───────────────────────────────────────────────────────────────────

export const otpApi = {
  async send(email: string) {
    return apiFetch<{ success: boolean; error?: string }>('/otp/send', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verify(email: string, code: string) {
    return apiFetch<{ success: boolean; error?: string }>('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },
};

// ── Orders API ────────────────────────────────────────────────────────────────

export const ordersApi = {
  async create(data: {
    customerName: string;
    phone: string;
    occasionType: string;
    mainColor: string;
    customText: string;
    details?: string;
    metroStation?: string;
  }) {
    return apiFetch<{ success: boolean; order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getAll(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<{ success: boolean; orders: any[] }>(`/orders${qs}`);
  },

  async getById(id: string) {
    return apiFetch<{ success: boolean; order: any }>(`/orders/${id}`);
  },

  async updateStatus(id: string, status: string, priceEGP?: number) {
    return apiFetch<{ success: boolean; order: any }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, priceEGP }),
    });
  },

  async update(id: string, data: Record<string, any>) {
    return apiFetch<{ success: boolean; order: any }>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return apiFetch<{ success: boolean }>(`/orders/${id}`, {
      method: 'DELETE',
    });
  },

  async getStats() {
    return apiFetch<{ success: boolean; stats: any }>('/orders/stats');
  },
};

// ── Health ────────────────────────────────────────────────────────────────────

export const healthApi = {
  async check() {
    return apiFetch<{ status: string; message: string }>('/health');
  },
};
