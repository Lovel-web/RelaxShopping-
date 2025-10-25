// ✅ src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: any;
  loading: boolean;
  signUp: (email: string, password: string, data: any) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Watch for user login/logout
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = { uid: firebaseUser.uid, ...docSnap.data() };
          setUser(userData);

          // ✅ Auto-redirect based on role
          switch (userData.role) {
            case "admin":
              navigate("/admin");
              break;
            case "vendor":
              navigate("/vendor-dashboard");
              break;
            case "staff":
              navigate("/staff-dashboard");
              break;
            default:
              navigate("/shops");
          }
        } else {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [navigate]);

  // ✅ Sign Up
  async function signUp(email: string, password: string, data: any) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        ...data,
        createdAt: new Date(),
      });
      return {};
    } catch (error) {
      return { error };
    }
  }

  // ✅ Sign In
  async function signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return {};
    } catch (error) {
      return { error };
    }
  }

  // ✅ Logout
  async function logout() {
    await signOut(auth);
    navigate("/");
  }

  // ✅ Password Reset
  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {};
    } catch (error) {
      return { error };
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
