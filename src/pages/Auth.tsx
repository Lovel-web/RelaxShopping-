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
const roleFromQuery = searchParams.get('role') as UserRole | null;
const [role, setRole] = useState<UserRole>(roleFromQuery || 'customer');

  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

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

  const [role, setRole] = useState<'customer' | 'staff' | 'vendor' | 'admin'>('customer');

  // Redirect if already logged in

  useEffect(() => {

    if (user) navigate('/shops');

  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {

      if (error.code === 'auth/user-not-found') toast.error('No account found with this email');

      else if (error.code === 'auth/wrong-password') toast.error('Incorrect password');

      else if (error.code === 'auth/invalid-email') toast.error('Invalid email address');

      else toast.error('Login failed. Please try again.');

    } else {

      toast.success('Welcome back!');

      if (role === 'admin') navigate('/admin');

      else if (role === 'staff') navigate('/staff-dashboard');

      else if (role === 'vendor') navigate('/vendor-dashboard');

      else navigate('/shops');

    }

    setLoading(false);

  };

  const handleSignup = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!fullName.trim()) return toast.error('Please enter your full name');

    if (!validateNigerianPhone(phone)) return toast.error('Please enter a valid Nigerian phone number');

    if (!state) return toast.error('Please select your state');

    if (!lga) return toast.error('Please select your LGA');

    if (!estateOrHotel.trim()) return toast.error('Please enter your estate or hotel name');

    if (password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);

    const { error } = await signUp(email, password, {
  fullName: fullName.trim(),
  name: fullName.trim(),
  phone,
  state,
  lga,
  estateOrHotel: estateOrHotel.trim(),
  role: 'customer' // or role variable if you allow selecting different role in UI
});

    if (error) {

      if (error.code === 'auth/email-already-in-use') toast.error('Email already exists');

      else if (error.code === 'auth/invalid-email') toast.error('Invalid email address');

      else if (error.code === 'auth/weak-password') toast.error('Password too weak');

      else toast.error('Signup failed. Try again.');

    } else {

      toast.success('Account created successfully!');

      if (role === 'admin') navigate('/admin');

      else if (role === 'staff') navigate('/staff-dashboard');

      else if (role === 'vendor') navigate('/vendor-dashboard');

      else navigate('/shops');

    }

    setLoading(false);

  };

  const handleReset = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) toast.error('Failed to send reset email');

    else {

      toast.success('Reset email sent! Check your inbox.');

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

        {/* LOGIN */}

        {mode === 'login' && (

          <form onSubmit={handleLogin} className="space-y-4">

            <Label>Email</Label>

            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />

            <Label>Password</Label>

            <Input

              type="password"

              value={password}

              onChange={(e) => setPassword(e.target.value)}

              placeholder="••••••••"

              required

            />

            {/* Role selector */}

            <Label>Select Role</Label>

            <Select value={role} onValueChange={(val) => setRole(val as any)}>

              <SelectTrigger>

                <SelectValue placeholder="Select role" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="customer">Customer</SelectItem>

                <SelectItem value="staff">Staff</SelectItem>

                <SelectItem value="vendor">Vendor</SelectItem>

                <SelectItem value="admin">Admin</SelectItem>

              </SelectContent>

            </Select>

            <Button type="submit" className="w-full" disabled={loading}>

              {loading ? 'Signing in...' : 'Sign In'}

            </Button>

            <div className="text-center space-y-2">

              <button type="button" onClick={() => setMode('reset')} className="text-sm text-primary hover:underline">

                Forgot password?

              </button>

              <p className="text-sm text-muted-foreground">

                Don’t have an account?{' '}

                <button type="button" onClick={() => setMode('signup')} className="text-primary hover:underline">

                  Sign up

                </button>

              </p>

            </div>

          </form>

        )}

        {/* SIGNUP */}

        {mode === 'signup' && (

          <form onSubmit={handleSignup} className="space-y-4">

            <Label>Full Name *</Label>

            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required />

            <Label>Email *</Label>

            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <Label>Phone Number *</Label>

            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" required />

            <Label>State *</Label>

            <Select value={state} onValueChange={(v) => { setState(v); setLga(''); }}>

              <SelectTrigger>

                <SelectValue placeholder="Select state" />

              </SelectTrigger>

              <SelectContent>

                {NIGERIAN_STATES.map((s) => (

                  <SelectItem key={s} value={s}>{s}</SelectItem>

                ))}

              </SelectContent>

            </Select>

            <Label>LGA *</Label>

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

            <Label>Estate / Hotel *</Label>

            <Input

              value={estateOrHotel}

              onChange={(e) => setEstateOrHotel(e.target.value)}

              placeholder="e.g., Palm View Estate"

              required

            />

            <Label>Password *</Label>

            <Input

              type="password"

              value={password}

              onChange={(e) => setPassword(e.target.value)}

              placeholder="••••••••"

              minLength={6}

              required

            />

            <Label>Register as *</Label>

            <Select value={role} onValueChange={(val) => setRole(val as any)}>

              <SelectTrigger>

                <SelectValue placeholder="Select role" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="customer">Customer</SelectItem>

                <SelectItem value="staff">Staff</SelectItem>

                <SelectItem value="vendor">Vendor</SelectItem>

                <SelectItem value="admin">Admin</SelectItem>

              </SelectContent>

            </Select>

            <Button type="submit" className="w-full" disabled={loading}>

              {loading ? 'Creating account...' : 'Create Account'}

            </Button>

            <p className="text-sm text-center text-muted-foreground">

              Already have an account?{' '}

              <button type="button" onClick={() => setMode('login')} className="text-primary hover:underline">

                Sign in

              </button>

            </p>

          </form>

        )}

        {/* RESET PASSWORD */}

        {mode === 'reset' && (

          <form onSubmit={handleReset} className="space-y-4">

            <Label>Email</Label>

            <Input

              type="email"

              value={email}

              onChange={(e) => setEmail(e.target.value)}

              placeholder="you@example.com"

              required

            />

            <Button type="submit" className="w-full" disabled={loading}>

              {loading ? 'Sending...' : 'Send Reset Email'}

            </Button>

            <p className="text-sm text-center text-muted-foreground">

              Remember your password?{' '}

              <button type="button" onClick={() => setMode('login')} className="text-primary hover:underline">

                Sign in

              </button>

            </p>

          </form>

        )}

      </Card>

    </div>

  );

}
