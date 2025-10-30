// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type User as FirebaseUser
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { app } from "@/lib/firebase"; // your firebase init that exports `app`

const auth = getAuth(app);
const db = getFirestore(app);

type UserProfile = {
  uid: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: "customer" | "vendor" | "staff" | "admin";
  state?: string;
  lga?: string;
  estateOrHotel?: string;
  shopName?: string;
  bankAccount?: string;
};

type AuthContextValue = {
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, profile: Partial<UserProfile>) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // load profile from Firestore users/{uid}
        try {
          const ref = doc(db, "users", user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data() as any;
            setProfile({
              uid: user.uid,
              name: data.name || "",
              email: data.email || user.email || "",
              phone: data.phone || "",
              role: data.role || "customer",
              state: data.state || "",
              lga: data.lga || "",
              estateOrHotel: data.estateOrHotel || "",
              shopName: data.shopName || "",
              bankAccount: data.bankAccount || ""
            });
          } else {
            // if no profile doc, create a basic one (role=customer by default)
            await setDoc(ref, {
              uid: user.uid,
              email: user.email,
              role: "customer",
              createdAt: serverTimestamp()
            }, { merge: true });
            setProfile({
              uid: user.uid,
              email: user.email || "",
              role: "customer"
            });
          }
        } catch (err) {
          console.error("Failed to load profile", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // signUp — stores profile in users/{uid}
  async function signUp(email: string, password: string, profileData: Partial<UserProfile>) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const ref = doc(db, "users", uid);
      await setDoc(ref, {
        uid,
        email,
        name: profileData.name || "",
        phone: profileData.phone || "",
        role: profileData.role || "customer",
        state: profileData.state || "",
        lga: profileData.lga || "",
        estateOrHotel: profileData.estateOrHotel || "",
        shopName: profileData.shopName || "",
        bankAccount: profileData.bankAccount || "",
        createdAt: serverTimestamp()
      });
      // profile will be loaded automatically by onAuthStateChanged listener
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }

  async function signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  }

  async function logout() {
    await signOut(auth);
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, loading, signUp, signIn, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
