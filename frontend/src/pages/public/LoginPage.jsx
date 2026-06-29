import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AuthCarousel } from '../../components/ui/AuthCarousel';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { ArrowRight } from 'lucide-react';

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
    
    // Demo Authentication Bypass
    const validPasswords = ['password', 'passwords', 'passowrds'];
    if (validPasswords.includes(password.toLowerCase())) {
      // Enforce role based on email to prevent cross-role spoofing bugs
      const demoRole = email.toLowerCase().includes('staff') ? 'staff' 
                     : email.toLowerCase().includes('manager') ? 'manager' 
                     : email.toLowerCase().includes('owner') ? 'owner' 
                     : role;
                     
      login({ email: email || `${demoRole}@test.com`, role: demoRole, name: `Demo ${demoRole.charAt(0).toUpperCase() + demoRole.slice(1)}`, id: `demo-${demoRole}` });
      addToast(`Logged in as ${demoRole} (Demo Mode)`, 'success');
      navigate('/dashboard');
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Authentication rejected.');
        setLoading(false);
        return;
      }
      login({ email: data.user.email, role: data.user.role, name: data.user.name, id: data.user.id });
      navigate('/dashboard');
    } catch (err) {
      setError('Network failure.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate OAuth redirect and successful login
    setTimeout(() => {
      login({ email: 'executive@google.com', role: 'owner', name: 'Google Executive', id: 'demo-google' });
      addToast('Authenticated via Google Workspace', 'success');
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#000000]">
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
                <label className="text-[13px] font-medium text-[#111111] dark:text-[#ededed]">Password</label>
                <button type="button" onClick={() => addToast('Password reset link sent to your email.', 'info')} className="text-[13px] text-[#666666] dark:text-[#a1a1aa] hover:text-[#111111] dark:hover:text-[#ededed] transition-colors">Forgot?</button>
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
                  <span className="bg-white dark:bg-[#000000] px-4 text-slate-400">Or continue with</span>
                </div>
              </div>
              
              <Button type="button" variant="secondary" onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white dark:bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#30363d] hover:bg-slate-50 dark:hover:bg-[#161b22]">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google Workspace
              </Button>
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
