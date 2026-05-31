import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { User } from "../types";

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    username: string,
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        setReady(true);
        return;
      }

      try {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setCurrentUser(snap.data() as User);
        } else {
          const fallback: User = {
            id: firebaseUser.uid,
            username: firebaseUser.email?.split("@")[0] || "user",
            name: "User",
            phone: "",
            isAdmin: false,
          };

          setCurrentUser(fallback);
        }
      } catch (err) {
        console.log("Auth error:", err);
        setCurrentUser(null);
      }

      setReady(true);
    });

    return () => unsub();
  }, []);

  // LOGIN
  const login = async (username: string, password: string) => {
    try {
      const email = username.includes("@")
        ? username
        : `${username.trim().toLowerCase()}@tuhfa.com`;

      await signInWithEmailAndPassword(auth, email, password);

      return { success: true };
    } catch (err: any) {
      console.log(err);

      return {
        success: false,
        error: "اسم المستخدم أو كلمة المرور غير صحيحة",
      };
    }
  };

  // SIGNUP
  const signup = async (
    username: string,
    name: string,
    phone: string,
    password: string,
    isAdminCode?: string
  ) => {
    try {
      const email = `${username.trim().toLowerCase()}@tuhfa.com`;

      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      const isAdmin =
        isAdminCode?.trim() === "1234" ||
        username.toLowerCase() === "nona";

      const newUser: User = {
        id: userCred.user.uid,
        username: username.toLowerCase(),
        name,
        phone,
        isAdmin,
      };

      await setDoc(doc(db, "users", userCred.user.uid), newUser);

      setCurrentUser(newUser);

      return { success: true };
    } catch (err: any) {
      console.log("SIGNUP ERROR:", err.code, err.message);

      if (err.code === "auth/email-already-in-use") {
        return {
          success: false,
          error: "اسم المستخدم مستخدم بالفعل",
        };
      }

      if (err.code === "auth/operation-not-allowed") {
        return {
          success: false,
          error: "فعّل Email/Password من Firebase Console",
        };
      }

      return {
        success: false,
        error: "فشل إنشاء الحساب، حاول مرة أخرى",
      };
    }
  };

  // LOGOUT
  const logout = async () => {
    await signOut(auth);
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