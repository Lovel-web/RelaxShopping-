// ✅ src/pages/Auth.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [estate, setEstate] = useState("");

  const [lgas, setLgas] = useState<any[]>([]);
  const [estates, setEstates] = useState<any[]>([]);

  useEffect(() => {
    if (user) navigate("/shops");
  }, [user]);

  // Fetch LGAs based on state
  useEffect(() => {
    const fetchLgas = async () => {
      if (!state) return;
      const q = query(collection(db, "lgas"), where("state", "==", state));
      const snap = await getDocs(q);
      setLgas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchLgas();
  }, [state]);

  // Fetch Estates based on LGA
  useEffect(() => {
    const fetchEstates = async () => {
      if (!lga) return;
      const q = query(collection(db, "estates"), where("lgaId", "==", lga));
      const snap = await getDocs(q);
      setEstates(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchEstates();
  }, [lga]);

  // 🟢 Signup handler
  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const { error } = await signUp(email, password, {
      fullName,
      role,
      state,
      lga,
      estate,
      approved: role === "admin" ? false : true,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      toast.success("Account created successfully!");
      setTimeout(() => {
        setSuccess(false);
        redirectBasedOnRole(role);
      }, 1500);
    }
  };

  // 🟢 Login handler
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const { error } = await signIn(email, password);
    if (error) {
      toast.error("Login failed!");
      setLoading(false);
    } else {
      setSuccess(true);
      toast.success("Welcome back!");
      setTimeout(() => {
        setSuccess(false);
        redirectBasedOnRole(role);
      }, 1500);
    }
  };

  // 🧭 Redirect logic by role
  const redirectBasedOnRole = (role: string) => {
    if (role === "admin") navigate("/admin");
    else if (role === "vendor") navigate("/vendor-dashboard");
    else if (role === "staff") navigate("/staff-dashboard");
    else navigate("/shops");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md p-6 shadow-xl relative overflow-hidden">
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm font-medium text-primary">Please wait...</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md z-30"
            >
              <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
              <p className="font-semibold text-green-600">
                Success! Redirecting...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-2xl font-bold text-center mb-4 text-gradient-primary">
          RelaxShopping
        </h1>

        {mode === "signup" ? (
          <form onSubmit={handleSignup} className="space-y-4 relative z-10">
            <Label>Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin (State)</SelectItem>
              </SelectContent>
            </Select>

            <Label>State</Label>
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />

            {role !== "admin" && (
              <>
                <Label>LGA</Label>
                <Select value={lga} onValueChange={setLga}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select LGA" />
                  </SelectTrigger>
                  <SelectContent>
                    {lgas.map((l: any) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {role === "customer" && (
              <>
                <Label>Estate/Hotel</Label>
                <Select value={estate} onValueChange={setEstate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Estate" />
                  </SelectTrigger>
                  <SelectContent>
                    {estates.map((e: any) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm mt-2">
              New here?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setMode("signup")}
              >
                Create Account
              </span>
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
