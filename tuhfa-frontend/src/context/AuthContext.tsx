import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../lib/api";
import { User } from "../types";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    name: string,
    phone: string,
    password: string,
    isAdminCode?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  ready: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Restore session from JWT token on mount
  useEffect(() => {
    const restoreSession = async () => {
      if (!authApi.isLoggedIn()) {
        setReady(true);
        return;
      }
      try {
        const user = await authApi.getMe();
        setCurrentUser(user);
      } catch (err) {
        authApi.logout();
        setCurrentUser(null);
      } finally {
        setReady(true);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await authApi.login(email, password);
      if (result.success && result.user) setCurrentUser(result.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }
  };

  const signup = async (email: string, name: string, phone: string, password: string, isAdminCode?: string) => {
    try {
      const result = await authApi.signup({ email, name, phone, password, adminCode: isAdminCode });
      if (result.success && result.user) setCurrentUser(result.user);
      return { success: true };
    } catch (err: any) {
      const message: string = err.message || "";
      if (message.includes("مسجّل بالفعل")) return { success: false, error: "هذا البريد الإلكتروني مسجّل بالفعل، يمكنك تسجيل الدخول مباشرة" };
      if (message.includes("ضعيفة") || message.includes("6")) return { success: false, error: "كلمة المرور ضعيفة، يجب أن تكون 6 خانات على الأقل" };
      return { success: false, error: message || "فشل إنشاء الحساب، حاول مرة أخرى" };
    }
  };

  const logout = async () => {
    authApi.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
