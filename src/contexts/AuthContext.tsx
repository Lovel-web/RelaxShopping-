// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "@/lib/firebase";

export const auth = getAuth(app);
export const db = getFirestore(app);

type UserProfile = {
  uid: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: "customer" | "vendor" | "staff" | "admin" | "superadmin";
  state?: string;
  lga?: string;
  estate?: string;
  shopName?: string;
  approved?: boolean;
};

type AuthContextType = {
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    data: Partial<UserProfile>
  ) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        } else {
          await setDoc(ref, {
            uid: user.uid,
            email: user.email,
            role: "customer",
            approved: true,
            createdAt: serverTimestamp(),
          });
          setProfile({
            uid: user.uid,
            email: user.email || "",
            role: "customer",
            approved: true,
          });
        }
      } else setProfile(null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signUp(
    email: string,
    password: string,
    data: Partial<UserProfile>
  ) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        ...data,
        approved: data.role === "admin" ? false : true,
        createdAt: serverTimestamp(),
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async function signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async function logout() {
    await signOut(auth);
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  return (
    <AuthContext.Provider
      value={{ firebaseUser, profile, loading, signUp, signIn, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
