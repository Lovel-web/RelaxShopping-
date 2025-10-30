import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Users, Store, Shield, Truck, Clock, CreditCard, MapPin } from "lucide-react";
import RoleCard from "@/components/RoleCard";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-white to-primary/10">
      {/* 🏠 HERO SECTION */}
      <section className="relative text-center py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/20 opacity-80"></div>
        <div className="relative z-10 container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
            Shop Smarter.  
            <span className="text-primary"> Live Better.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Nigeria’s first estate-based eCommerce platform — real-time store prices, scheduled deliveries, and vendor management all in one place.
          </p>
          <Button
            onClick={() => navigate("/auth?mode=signup&role=customer")}
            className="bg-primary text-white text-lg px-10 py-5 rounded-xl hover:bg-primary/90 transition"
          >
            Start Shopping
          </Button>
        </div>
      </section>

      {/* ⚙️ FEATURES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          {[
            { icon: <Clock className="w-12 h-12 text-primary mx-auto mb-4" />, title: "Scheduled Deliveries", desc: "Pick time slots and relax. We deliver to your estate or hotel on schedule." },
            { icon: <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />, title: "Live Store Prices", desc: "See actual store prices in real time. No inflated costs." },
            { icon: <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />, title: "Estate-Focused Service", desc: "Shop from vendors within your LGA. Fast delivery. Local convenience." }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-xl shadow hover:shadow-xl transition">
              {item.icon}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🧩 HOW IT WORKS */}
      <section className="py-20 bg-gradient-to-br from-secondary/10 via-background to-primary/5 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">How RelaxShopping Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Browse Prices", desc: "Check live product prices from multiple vendors." },
              { step: 2, title: "Add to Cart", desc: "Select your preferred delivery time slot." },
              { step: 3, title: "Pay Securely", desc: "Pay via Paystack with confidence." },
              { step: 4, title: "Relax & Receive", desc: "Your order arrives right on time, every time." },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧑‍💼 JOIN AS ROLES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the RelaxShopping Network</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Whether you’re managing deliveries, selling products, or overseeing your state — pick your role below to get started.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            <RoleCard
              icon={<Users className="mx-auto text-blue-600" />}
              title="Customer"
              description="Shop from your favorite local vendors and receive doorstep delivery."
              color="border-blue-600"
              onClick={() => navigate("/auth?mode=signup&role=customer")}
            />
            <RoleCard
              icon={<Store className="mx-auto text-green-600" />}
              title="Vendor"
              description="Sell to estates and hotels within your LGA. Manage inventory and track sales easily."
              color="border-green-600"
              onClick={() => navigate("/auth?mode=signup&role=vendor")}
            />
            <RoleCard
              icon={<Truck className="mx-auto text-yellow-600" />}
              title="Staff"
              description="Oversee deliveries and ensure every customer in your LGA gets their order on time."
              color="border-yellow-600"
              onClick={() => navigate("/auth?mode=signup&role=staff")}
            />
            <RoleCard
              icon={<Shield className="mx-auto text-gray-700" />}
              title="State Admin"
              description="Manage LGAs, estates, and vendors under your state’s logistics structure."
              color="border-gray-700"
              onClick={() => navigate("/auth?mode=signup&role=admin")}
            />
          </div>
        </div>
      </section>

      {/* ⚡ FOOTER */}
      <footer className="bg-gray-900 text-white py-10 text-center">
        <p className="text-lg font-semibold">© 2025 RelaxShopping</p>
        <p className="text-sm text-gray-400">Empowering communities, one delivery at a time.</p>
        <p className="text-xs text-gray-500 mt-2">Powered by GAMEUNPAREIL Enterprise</p>
      </footer>
    </div>
  );
              }
