import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Store, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Badge } from './ui/badge';

export const Navbar = () => {
  const location = useLocation();
  const { user, userProfile, signOut } = useAuth();
  const { itemCount } = useCart();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light">
            <Store className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gradient-primary">Zeezy Pro</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/shops">
                <Button 
                  variant={location.pathname === '/shops' ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Store className="h-4 w-4 mr-2" />
                  Shops
                </Button>
              </Link>

              <Link to="/cart" className="relative">
                <Button 
                  variant={location.pathname === '/cart' ? 'default' : 'ghost'}
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {itemCount > 0 && (
                    <Badge className="ml-2 px-1.5 py-0.5 min-w-[20px] h-5 bg-secondary text-secondary-foreground">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {userProfile?.role === 'admin' && (
                <Link to="/admin">
                  <Button 
                    variant={location.pathname.startsWith('/admin') ? 'default' : 'ghost'}
                    size="sm"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}

              <Link to="/profile">
                <Button 
                  variant={location.pathname === '/profile' ? 'default' : 'ghost'}
                  size="sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="default" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
