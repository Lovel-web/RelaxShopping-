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
import NotFound from "./pages/NotFound";
import VendorDashboard from "@/pages/VendorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import WorkerDashboard from "@/pages/WorkerDashboard";
import ChatPanel from "@/pages/ChatPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/shops" element={<Shops />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              <Route path="/vendor" element={<VendorDashboard />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/worker" element={<WorkerDashboard />} />
<Route path="/chat/:orderId" element={<ChatPanel />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
