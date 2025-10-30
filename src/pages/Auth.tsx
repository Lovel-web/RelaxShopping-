import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Store } from "lucide-react";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup" | "reset">(initialMode);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [estate, setEstate] = useState("");
  const [lgas, setLgas] = useState([]);
  const [estates, setEstates] = useState([]);

  useEffect(() => {
    if (user) {
      navigate("/shops");
    }
  }, [user]);

  useEffect(() => {
    const fetchLgas = async () => {
      if (state) {
        const q = query(collection(db, "lgas"), where("state", "==", state));
        const snap = await getDocs(q);
        setLgas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    };
    fetchLgas();
  }, [state]);

  useEffect(() => {
    const fetchEstates = async () => {
      if (lga) {
        const q = query(collection(db, "estates"), where("lgaId", "==", lga));
        const snap = await getDocs(q);
        setEstates(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">RelaxShopping</h1>

        {mode === "signup" ? (
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
                <SelectItem value="admin">Admin (state)</SelectItem>
              </SelectContent>
            </Select>

            <Label>State</Label>
            <Input value={state} onChange={(e) => setState(e.target.value)} required />

            {(role !== "admin") && (
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
          </form>
        ) : (
          <p>Login form coming soon</p>
        )}
      </Card>
    </div>
  );
}
