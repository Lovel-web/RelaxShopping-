import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Clock, MapPin, CreditCard } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  const handleCustomerSignup = () => navigate("/auth?mode=signup&role=customer");
  const handleAdminSignup = () => navigate("/auth?mode=signup&role=admin");
  const handleVendorSignup = () => navigate("/auth?mode=signup&role=vendor");
  const handleStaffSignup = () => navigate("/auth?mode=signup&role=staff");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Fresh Groceries <br /> Delivered on Schedule
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            RelaxShopping brings live store prices and scheduled batch delivery
            to estates and hotels across Nigeria. Save time, get the best prices,
            and never miss a delivery window.
          </p>
          <Button
            onClick={handleCustomerSignup}
            className="bg-primary text-white px-8 py-4 text-lg rounded-xl hover:bg-primary/90 transition"
          >
            Sign Up as Customer
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div>
            <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Scheduled Deliveries</h3>
            <p className="text-gray-600">
              Choose from 3 daily time slots. Your orders are batched and delivered right on time.
            </p>
          </div>

          <div>
            <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Store Prices</h3>
            <p className="text-gray-600">
              See real-time prices from your favourite stores. No hidden fees.
            </p>
          </div>

          <div>
            <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Estate-Focused</h3>
            <p className="text-gray-600">
              Batch deliveries by estate or hotel. Efficient routes mean lower costs and faster service.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              {
                step: "1",
                title: "Browse Live Prices",
                desc: "See current pricing from all partner stores in one place",
              },
              {
                step: "2",
                title: "Add to Cart & Choose Time Slot",
                desc: "Select items and pick your preferred delivery slot (10AM, 1PM, or 4PM)",
              },
              {
                step: "3",
                title: "Pay Securely with Paystack",
                desc: "Complete payment using Paystack's secure checkout. Fixed ₦400 delivery fee.",
              },
              {
                step: "4",
                title: "Get Delivered on Time",
                desc: "Orders are batched with other estate residents and delivered in your chosen window",
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl shadow p-6">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup Options */}
      <section className="py-16 text-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Join as Staff, Vendor, or Admin</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            If you're part of our logistics, store, or management team — choose your role below to get started.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={handleStaffSignup} className="bg-blue-600 text-white hover:bg-blue-700">
              Staff Signup
            </Button>
            <Button onClick={handleVendorSignup} className="bg-green-600 text-white hover:bg-green-700">
              Vendor Signup
            </Button>
            <Button onClick={handleAdminSignup} className="bg-gray-800 text-white hover:bg-gray-900">
              Admin Signup
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p className="text-sm">© 2025 RelaxShopping. Serving estates and hotels across Nigeria.</p>
        <p className="text-xs text-gray-400 mt-1">Powered by GAMEUNPAREIL Enterprise</p>
      </footer>
    </div>
  );
}
