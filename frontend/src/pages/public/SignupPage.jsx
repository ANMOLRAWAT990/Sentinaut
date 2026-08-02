import React, { useState, useCallback } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AuthCarousel } from '../../components/ui/AuthCarousel';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const ROLES = [
  { value: 'staff', label: 'Staff' },
  { value: 'manager', label: 'Manager' },
  { value: 'owner', label: 'Owner' },
];

export function SignupPage() {
  const { addToast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('token');
  const inviteEmail = searchParams.get('email');

  const [name, setName] = useState('');
  const [email, setEmail] = useState(inviteEmail || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const role = inviteToken ? 'manager' : 'owner'; // The backend will enforce the true role based on the token

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score += 20;
    if (pass.length > 8) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    
    if (pass.length === 0) return { score: 0, label: '', color: 'bg-transparent' };
    if (score <= 40) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 80) return { score, label: 'Good', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = calculateStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Minimum 6 characters required.');
      return;
    }
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, invite_token: inviteToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Provisioning failed.');
        setLoading(false);
        return;
      }
      
      // Auto login after signup
      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      if (loginRes.ok) {
        const loginData = await loginRes.json();
        login({ email: loginData.user.email, role: loginData.user.role, name: loginData.user.name, id: loginData.user.id, property: loginData.user.property }, loginData.token);
        addToast('Account created and logged in automatically.', 'success');
        navigate('/dashboard');
      } else {
        addToast('Account created successfully. Please sign in.', 'success');
        navigate('/login');
      }
    } catch (err) {
      setError('Network failure.');
      setLoading(false);
    }
  };

  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential, role: role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Google Authentication rejected.');
        setLoading(false);
        return;
      }
      login({ email: data.user.email, role: data.user.role, name: data.user.name, id: data.user.id, property: data.user.property }, data.token);
      addToast('Account provisioned via Google Workspace', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError('Network failure.');
      setLoading(false);
    }
  }, [role, login, addToast, navigate]);

  const handleGoogleError = useCallback(() => {
    setError('Google signup failed.');
  }, []);

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        <div className="w-full max-w-[360px] animate-in slide-in-from-bottom-4 fade-in duration-500 ease-out">
          <div className="mb-10">
            <h1 className="text-[28px] font-semibold tracking-tight text-slate-900 dark:text-slate-200 mb-2">Initialize Workspace</h1>
            <p className="text-[14px] text-[#666666] dark:text-[#a1a1aa]">Create an account to deploy SentiNaut.</p>
          </div>
            {inviteToken && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-primary font-medium text-center">
                  You've been invited to join SentiNaut! Complete your registration below.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email address"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!inviteToken}
                required
              />
              <div className="space-y-2">
              <Input label="Password" type="password" placeholder="Create a password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              {password.length > 0 && (
                <div className="space-y-1 mt-1">
                  <div className="flex h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ease-out ${strength.color}`} style={{ width: `${strength.score}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium px-1">
                    <span>{strength.label}</span>
                    {password.length < 6 && <span className="text-red-500">Min 6 chars</span>}
                  </div>
                </div>
              )}
            </div>

            {error && <div className="text-[13px] text-red-500 font-medium">{error}</div>}
            
            <div className="space-y-4 pt-2">
              <Button type="submit" disabled={loading} className="w-full group">
                {loading ? 'Provisioning...' : (
                  <span className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/10 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-widest font-medium">
                  <span className="bg-white dark:bg-slate-950 px-4 text-slate-400">Or continue with</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme={document.documentElement.classList.contains('dark') ? "filled_black" : "outline"}
                  text="signup_with"
                  shape="rectangular"
                />
              </div>
            </div>
          </form>
          <div className="mt-8 text-[13px] text-[#666666] dark:text-[#a1a1aa]">
            Existing user? <Link to="/login" className="text-slate-900 dark:text-slate-200 font-medium hover:underline underline-offset-4">Authenticate</Link>
          </div>
        </div>
      </div>
      <AuthCarousel />
    </div>
  );
}
