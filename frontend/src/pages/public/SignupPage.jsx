import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const role = 'owner';

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
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Provisioning failed.');
        setLoading(false);
        return;
      }
      addToast('Account created successfully. Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      setError('Network failure.');
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
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
  };

  const handleGoogleError = () => {
    setError('Google signup failed.');
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        <div className="w-full max-w-[360px] animate-in slide-in-from-bottom-4 fade-in duration-500 ease-out">
          <div className="mb-10">
            <h1 className="text-[28px] font-semibold tracking-tight text-slate-900 dark:text-slate-200 mb-2">Initialize Workspace</h1>
            <p className="text-[14px] text-[#666666] dark:text-[#a1a1aa]">Create an account to deploy SentiNaut.</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input label="Full Name" type="text" placeholder="Enter your full name" required value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email address" type="email" placeholder="Enter your email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" placeholder="Create a password" required value={password} onChange={(e) => setPassword(e.target.value)} />

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
                  useOneTap
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
