import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-gray-900">
          Fresh Groceries <br /> Delivered on Schedule
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mb-6 text-gray-600">
          RelaxShopping brings live store prices and scheduled batch delivery to
          estates and hotels across Nigeria. Save time, get the best prices, and
          never miss a delivery window.
        </p>

        {/* MAIN ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shops">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              🛍 Start Shopping
            </Button>
          </Link>

          {/* Customer Signup - top */}
          <Link to="/auth?mode=signup&role=customer">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              🛒 Sign Up as Customer
            </Button>
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="grid gap-12 sm:grid-cols-3 px-6 py-16 max-w-6xl mx-auto">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">🕒 Scheduled Deliveries</h3>
          <p className="text-gray-600">
            Choose from 3 daily time slots. Your orders are batched and delivered right on time.
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">💰 Live Store Prices</h3>
          <p className="text-gray-600">
            See real-time prices from your favourite stores. No hidden fees.
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">🏢 Estate-Focused</h3>
          <p className="text-gray-600">
            Batch deliveries by estate or hotel. Efficient routes mean lower costs and faster service.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">How It Works</h2>

          <div className="space-y-8 text-left">
            <div>
              <h3 className="text-xl font-semibold">1. Browse Live Prices</h3>
              <p className="text-gray-600">
                See current pricing from all partner stores in one place.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">2. Add to Cart & Choose Time Slot</h3>
              <p className="text-gray-600">
                Select items and pick your preferred delivery slot (10AM, 1PM, or 4PM).
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">3. Pay Securely with Paystack</h3>
              <p className="text-gray-600">
                Complete payment using Paystack's secure checkout. Fixed ₦400 delivery fee.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">4. Get Delivered on Time</h3>
              <p className="text-gray-600">
                Orders are batched with other estate residents and delivered in your chosen window.
              </p>
            </div>
          </div>

          {/* Customer Signup - middle */}
          <div className="text-center mt-12">
            <Link to="/auth?mode=signup&role=customer">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                🛍 Join as a Customer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* OTHER ROLES SIGNUP */}
      <section className="bg-gray-100 py-12 border-t mt-12">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Join the RelaxShopping Network
          </h2>
          <p className="text-gray-600 mb-8">
            Are you part of our delivery or management team? Choose your portal below.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth?mode=signup&role=staff">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                👷 Staff Signup
              </Button>
            </Link>

            <Link to="/auth?mode=signup&role=vendor">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                🏪 Vendor Signup
              </Button>
            </Link>

            <Link to="/auth?mode=login&role=admin">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                🧠 Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-auto">
        <p className="text-sm">
          © 2025 <strong>RelaxShopping</strong>. Serving estates and hotels across Nigeria.
          <br />
          Powered by <strong>GAMEUNPAREIL Enterprise</strong>
        </p>
      </footer>
    </div>
  );
      }
