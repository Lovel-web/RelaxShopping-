// ✅ src/pages/Index.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, UserCog, Users } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to RelaxShopping</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Join the future of shopping — sign up to get started as a customer, vendor, staff, or admin.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {/* Customer */}
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center p-6 space-y-2 h-32"
          onClick={() => navigate("/auth?mode=signup&role=customer")}
        >
          <Users className="w-6 h-6 text-primary" />
          <span>Customer</span>
        </Button>

        {/* Vendor */}
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center p-6 space-y-2 h-32"
          onClick={() => navigate("/auth?mode=signup&role=vendor")}
        >
          <Store className="w-6 h-6 text-primary" />
          <span>Vendor</span>
        </Button>

        {/* Staff */}
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center p-6 space-y-2 h-32"
          onClick={() => navigate("/auth?mode=signup&role=staff")}
        >
          <UserCog className="w-6 h-6 text-primary" />
          <span>Staff</span>
        </Button>

        {/* Admin */}
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center p-6 space-y-2 h-32"
          onClick={() => navigate("/login?role=admin")}
        >
          <ShoppingBag className="w-6 h-6 text-primary" />
          <span>Admin</span>
        </Button>
      </div>
    </div>
  );
}
