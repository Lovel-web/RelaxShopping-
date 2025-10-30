import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [mode, setMode] = useState("signup");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [estate, setEstate] = useState("");

  const [lgas, setLgas] = useState([]);
  const [estates, setEstates] = useState([]);

  useEffect(() => {
    if (user) navigate("/shops");
  }, [user]);

  useEffect(() => {
    const fetchLgas = async () => {
      if (!state) return;
      const q = query(collection(db, "lgas"), where("state", "==", state));
      const snap = await getDocs(q);
      setLgas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchLgas();
  }, [state]);

  useEffect(() => {
    const fetchEstates = async () => {
      if (!lga) return;
      const q = query(collection(db, "estates"), where("lgaId", "==", lga));
      const snap = await getDocs(q);
      setEstates(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchEstates();
  }, [lga]);

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, {
      fullName,
      role,
      state,
      lga,
      estate,
      approved: role === "admin" ? false : true,
    });

    if (error) toast.error(error.message);
    else toast.success("Account created successfully!");
    setLoading(false);
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) toast.error("Login failed!");
    else toast.success("Welcome back!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">RelaxShopping</h1>

        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <Label>Full Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />

            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin (State)</SelectItem>
              </SelectContent>
            </Select>

            <Label>State</Label>
            <Input value={state} onChange={(e) => setState(e.target.value)} required />

            {role !== "admin" && (
              <>
                <Label>LGA</Label>
                <Select value={lga} onValueChange={setLga}>
                  <SelectTrigger><SelectValue placeholder="Select LGA" /></SelectTrigger>
                  <SelectContent>
                    {lgas.map((l: any) => (
                      <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {role === "customer" && (
              <>
                <Label>Estate/Hotel</Label>
                <Select value={estate} onValueChange={setEstate}>
                  <SelectTrigger><SelectValue placeholder="Select Estate" /></SelectTrigger>
                  <SelectContent>
                    {estates.map((e: any) => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
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
              <span className="text-blue-600 cursor-pointer" onClick={() => setMode("login")}>Login</span>
            </p>
          </form>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full">Sign In</Button>
            <p className="text-center text-sm mt-2">
              New here?{" "}
              <span className="text-blue-600 cursor-pointer" onClick={() => setMode("signup")}>Create Account</span>
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
