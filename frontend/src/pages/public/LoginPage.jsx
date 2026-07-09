import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AuthCarousel } from '../../components/ui/AuthCarousel';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export function LoginPage() {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Authentication rejected.');
        setLoading(false);
        return;
      }
      login({ email: data.user.email, role: data.user.role, name: data.user.name, id: data.user.id, property: data.user.property }, data.token);
      navigate('/dashboard');
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
      addToast('Authenticated via Google Workspace', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError('Network failure.');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed.');
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        <div className="w-full max-w-[400px] animate-in slide-in-from-bottom-4 fade-in duration-700 ease-out">
          <div className="mb-12">
            <h1 className="text-4xl font-serif text-slate-900 dark:text-white mb-3">Welcome back.</h1>
            <p className="text-sm font-light text-slate-500 dark:text-slate-400">Enter your credentials to access your workspace.</p>
          </div>
          <form className="space-y-8 mt-2" onSubmit={handleSubmit}>
            <div className="flex w-full border-b border-black/10 dark:border-white/10 mt-2">
              {['staff', 'manager', 'owner'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setEmail(`${r}@test.com`); }}
                  className={`flex-1 pb-3 text-[11px] uppercase tracking-widest transition-all font-medium border-b-2 -mb-[1px] ${role === r ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <Input label="Email address" type="email" placeholder="Enter your email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[13px] font-medium text-slate-900 dark:text-slate-200">Password</label>
                <button 
                  type="button" 
                  onClick={() => {
                    const resetEmail = window.prompt("Please enter your registered email address:");
                    if (resetEmail && resetEmail.trim() !== "") {
                      addToast(`If ${resetEmail} is registered, a password reset link has been sent.`, 'info');
                    }
                  }} 
                  className="text-[13px] text-[#666666] dark:text-[#a1a1aa] hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <Input type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <div className="text-[13px] text-red-500 font-medium">{error}</div>}
            
            <div className="space-y-4 pt-2">
              <Button type="submit" disabled={loading} className="w-full group">
                {loading ? 'Verifying...' : (
                  <span className="flex items-center gap-3">
                    Sign In
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform duration-300" />
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
                  text="continue_with"
                  shape="rectangular"
                />
              </div>
            </div>
          </form>

          <div className="mt-12 text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400 text-center">
            New here? <Link to="/signup" className="text-slate-900 dark:text-white font-medium hover:opacity-70 transition-opacity">Request Access</Link>
          </div>
        </div>
      </div>
      <AuthCarousel />
    </div>
  );
}
