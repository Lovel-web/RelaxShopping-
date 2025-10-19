import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, Clock, MapPin, ShoppingBag, CheckCircle2, Truck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <section className="container px-4 py-20 mx-auto">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary-light">
            <Store className="w-12 h-12 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient-primary">Fresh Groceries</span>
            <br />
            Delivered on Schedule
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            RelaxShopping brings live store prices and scheduled batch delivery to estates and hotels across Nigeria. 
            Save time, get the best prices, and never miss a delivery window.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/shops">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16 mx-auto">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Scheduled Deliveries</h3>
            <p className="text-muted-foreground">
              Choose from 5 daily time slots. Your orders are batched and delivered right on time.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-border">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Live Store Prices</h3>
            <p className="text-muted-foreground">
              See real-time prices from Chowdeck, Shoprite, and partner stores. No hidden fees.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Estate-Focused</h3>
            <p className="text-muted-foreground">
              Batch deliveries by estate or hotel. Efficient routes mean lower costs and faster service.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container px-4 py-16 mx-auto bg-muted/30 rounded-3xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Browse Live Prices</h4>
                <p className="text-muted-foreground">
                  See current pricing from all partner stores in one place
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Add to Cart & Choose Time Slot</h4>
                <p className="text-muted-foreground">
                  Select items and pick your preferred delivery slot (8AM, 10AM, 12PM, 3PM, or 5PM)
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Pay Securely with Paystack</h4>
                <p className="text-muted-foreground">
                  Complete payment using Paystack's secure checkout. Fixed ₦400 delivery fee.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Get Delivered on Time</h4>
                <p className="text-muted-foreground">
                  Orders are batched with other estate residents and delivered in your chosen window
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="container px-4 py-20 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Save Time and Money?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join estates and hotels across Nigeria who trust RelaxShopping for their grocery needs
          </p>
          <Link to="/auth?mode=signup">
            <Button variant="hero" size="lg">
              <MapPin className="mr-2 h-5 w-5" />
              Create Your Account
            </Button>
          </Link>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Store className="w-6 h-6 text-primary" />
              <span className="font-bold text-gradient-primary">RelaxShopping</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 RelaxShopping. Serving estates and hotels across Nigeria.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
