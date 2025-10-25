// ✅ src/pages/VendorDashboard.jsx
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function VendorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth?mode=login");
    } else if (user.role !== "vendor") {
      navigate("/shops");
    }
  }, [user, navigate]);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">🛍 Vendor Dashboard</h1>
      <p className="text-gray-700 text-center mb-6">
        Welcome, {user?.name || "Vendor"}!  
        This area will soon show your sales, orders, and store analytics.
      </p>

      <div className="border p-6 rounded-lg shadow-sm text-center bg-white">
        <p>Your account role: <strong>{user?.role}</strong></p>
        <p>Email: <strong>{user?.email}</strong></p>
        <p className="mt-4 text-sm text-gray-500">
          More vendor tools will appear here once the system evolves.
        </p>
      </div>
    </div>
  );
}
