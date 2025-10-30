// ✅ src/App.tsx (final stable)
import AdminDashboard from "@/pages/AdminDashboard";
import Login from "@/pages/Login";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Shops from "./pages/Shops";
import AdminPayments from "@/pages/AdminPayments";
import ChatPanel from "@/pages/ChatPanel";
import NotFound from "./pages/NotFound";
import Signup from "@/pages/Signup";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import StaffDashboard from "@/pages/StaffDashboard";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import VendorDashboard from "@/pages/VendorDashboard";
import VendorProducts from "@/pages/VendorProducts";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: any) {
  const { profile, loading } = useAuth();
  if (loading) return null;
  if (!profile) return <Navigate to="/auth" replace />;
  if (!allowedRoles.includes(profile.role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <Routes>
                {/* 🌍 Public */}
                <Route path="/" element={<Index />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<Auth />} />

                {/* 🛍 Shopping */}
                <Route path="/shops" element={<Shops />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />

                {/* 👤 Profile */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />

                {/* 💬 Chat */}
                <Route path="/chat" element={<ChatPanel />} />

                {/* 🧑‍💼 Dashboards */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["staff"]}>
                      <StaffDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["vendor"]}>
                      <VendorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor-products"
                  element={
                    <ProtectedRoute allowedRoles={["vendor"]}>
                      <VendorProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/payments"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminPayments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/super-admin"
                  element={
                    <ProtectedRoute allowedRoles={["superadmin"]}>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
export default App;
