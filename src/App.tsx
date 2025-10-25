// ✅ src/App.tsx

import AdminDashboard from "@/pages/AdminDashboard";

import Login from "@/pages/Login";

import { Toaster } from "@/components/ui/toaster";

import { Toaster as Sonner } from "@/components/ui/sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";

import { CartProvider } from "@/contexts/CartContext";

import Index from "./pages/Index";

import Auth from "./pages/Auth";

import Shops from "./pages/Shops";

import AdminPayments from "@/pages/AdminPayments";

import ChatPanel from "@/pages/ChatPanel";

import NotFound from "./pages/NotFound";

import Signup from "@/pages/Signup";

import StaffDashboard from "@/pages/StaffDashboard";

import Checkout from "@/pages/Checkout";

import OrderSuccess from "@/pages/OrderSuccess";

import VendorDashboard from "@/pages/VendorDashboard";

const queryClient = new QueryClient();

function App() {

  return (

    <QueryClientProvider client={queryClient}>

      <TooltipProvider>

        <AuthProvider>

          <CartProvider>

            <BrowserRouter>

              <Routes>

                {/* Landing + Auth */}

                <Route path="/" element={<Index />} />

                <Route path="/signup" element={<Signup />} />

                <Route path="/login" element={<Login />} />

                <Route path="/auth" element={<Auth />} />

                {/* Shopping flow */}

                <Route path="/shops" element={<Shops />} />

                <Route path="/checkout" element={<Checkout />} />

                <Route path="/order-success" element={<OrderSuccess />} />

                {/* Dashboards */}

                <Route path="/admin" element={<AdminDashboard />} />

                <Route path="/admin/payments" element={<AdminPayments />} />

                <Route path="/staff-dashboard" element={<StaffDashboard />} />

                <Route path="/vendor-dashboard" element={<VendorDashboard />} />

                {/* Chat */}

                <Route path="/chat" element={<ChatPanel />} />

                {/* Catch all */}

                <Route path="*" element={<NotFound />} />

              </Routes>

              {/* Toast Notifications */}

              <Toaster />

              <Sonner />

            </BrowserRouter>

          </CartProvider>

        </AuthProvider>

      </TooltipProvider>

    </QueryClientProvider>

  );

}

export default App;