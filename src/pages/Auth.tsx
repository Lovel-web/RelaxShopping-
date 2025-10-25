import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Store } from 'lucide-react';
import { NIGERIAN_STATES, SAMPLE_LGAS, validateNigerianPhone } from '@/lib/utils';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const initialRole = searchParams.get('role') || 'customer';
  const [role, setRole] = useState(initialRole);
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [estateOrHotel, setEstateOrHotel] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/shops');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } else {
      toast.success('Welcome back!');
      navigate('/shops');
    }

    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!validateNigerianPhone(phone)) {
      toast.error('Please enter a valid Nigerian phone number (e.g., 08012345678)');
      return;
    }

    if (!state) {
      toast.error('Please select your state');
      return;
    }

    if (!lga) {
      toast.error('Please select your LGA');
      return;
    }

    if (!estateOrHotel.trim()) {
      toast.error('Please enter your estate or hotel name');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, {
  fullName: fullName.trim(),
  phone,
  state,
  lga,
  estateOrHotel: estateOrHotel.trim(),
  role
});
    if (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('An account with this email already exists');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak');
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } else {
      toast.success('Account created successfully!');
      navigate('/shops');
    }

    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      toast.error('Failed to send reset email. Please check the email address.');
    } else {
      toast.success('Password reset email sent! Check your inbox.');
      setMode('login');
    }

    setLoading(false);
  };

  const availableLgas = state ? (SAMPLE_LGAS[state] || []) : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light mb-4">
            <Store className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-gradient-primary">RelaxShopping</h1>
          <p className="text-muted-foreground text-center mt-2">
            {mode === 'login' && 'Welcome back! Sign in to continue'}
            {mode === 'signup' && 'Create your account to get started'}
            {mode === 'reset' && 'Reset your password'}
          </p>
        </div>

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08012345678"
                required
              />
              <p className="text-xs text-muted-foreground">Format: 080XXXXXXXX or +234XXXXXXXXXX</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select value={state} onValueChange={(value) => { setState(value); setLga(''); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lga">LGA *</Label>
              <Select value={lga} onValueChange={setLga} disabled={!state || availableLgas.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={state ? "Select LGA" : "Select state first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableLgas.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estate">Estate / Hotel Name *</Label>
              <Input
                id="estate"
                value={estateOrHotel}
                onChange={(e) => setEstateOrHotel(e.target.value)}
                placeholder="e.g., Palm View Estate"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Email'}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
