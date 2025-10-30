// ✅ src/pages/AdminDashboard.tsx

import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

import { toast } from "sonner";

export default function AdminDashboard() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [stats, setStats] = useState({

    // Add to AdminDashboard.tsx (Admin-only area)
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

async function createStateAdmin(email:string, state:string) {
  // Find user by email (simple approach: use Firestore users collection)
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const snap = await getDocs(q);
  if (snap.empty) {
    alert("User not found. The person must sign up first.");
    return;
  }
  const userDoc = snap.docs[0];
  await updateDoc(doc(db, "users", userDoc.id), { role: "admin", state });
  alert(`User promoted to admin for ${state}.`);
}
  
    vendors: 0,

    customers: 0,

    staff: 0,

    orders: 0,

  });

  useEffect(() => {

    if (!user) {

      navigate("/login");

    } else if (user.role !== "admin") {

      toast.error("Unauthorized access");

      navigate("/");

    } else {

      // Placeholder: replace with real backend data later

      setStats({ vendors: 8, customers: 120, staff: 4, orders: 67 });

    }

  }, [user, navigate]);

  const handleLogout = async () => {

    await logout();

    navigate("/");

  };

  return (

    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex justify-between items-center">

          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>

          <Button variant="outline" onClick={handleLogout}>Logout</Button>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <Card className="p-4 text-center shadow-sm">

            <h2 className="text-lg font-semibold">Vendors</h2>

            <p className="text-2xl font-bold text-primary">{stats.vendors}</p>

          </Card>

          <Card className="p-4 text-center shadow-sm">

            <h2 className="text-lg font-semibold">Customers</h2>

            <p className="text-2xl font-bold text-primary">{stats.customers}</p>

          </Card>

          <Card className="p-4 text-center shadow-sm">

            <h2 className="text-lg font-semibold">Staff</h2>

            <p className="text-2xl font-bold text-primary">{stats.staff}</p>

          </Card>

          <Card className="p-4 text-center shadow-sm">

            <h2 className="text-lg font-semibold">Orders</h2>

            <p className="text-2xl font-bold text-primary">{stats.orders}</p>

          </Card>

        </div>

        <Card className="p-6 mt-4">

          <h2 className="text-xl font-semibold mb-2">Manage Vendors</h2>

          <p className="text-muted-foreground mb-4">

            Add or verify vendors to appear on RelaxShopping.

          </p>

          <Button onClick={() => navigate("/vendor-dashboard")}>Go to Vendor Dashboard</Button>

        </Card>

      </div>

    </div>

  );

}
