import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

export function LoginPage() {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simulate role-based login
    let role = 'staff';
    if (email.includes('manager')) role = 'manager';
    if (email.includes('owner')) role = 'owner';
    
    if (password) {
      login({ email, role, name: email.split('@')[0] });
      navigate('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50 dark:bg-[#0d1117]">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-slate-900 dark:text-[#e6edf3]">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-[#8b949e]">
          Or <a href="#" onClick={(e) => { e.preventDefault(); addToast('Sign up is currently invite-only.', 'info'); }} className="font-semibold text-blue-600 hover:text-blue-500 dark:text-[#58a6ff]">start your 14-day free trial</a>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Card>
          <CardContent className="pt-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="name@example.com"
              />
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-[#e6edf3]">Password</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); addToast('Password recovery is temporarily unavailable.', 'info'); }} className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-[#58a6ff]">Forgot password?</a>
                </div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  error={error}
                />
              </div>

              <div>
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials Helper */}
        <div className="mt-6 bg-blue-50 dark:bg-[#1f6feb]/10 border border-blue-100 dark:border-[#1f6feb]/20 rounded-lg p-4">
          <h4 className="text-sm font-bold text-blue-900 dark:text-[#58a6ff] mb-2">System Evaluation Access</h4>
          <p className="text-xs text-blue-800 dark:text-[#8b949e] mb-3">
            For evaluation purposes, please use the following access credentials (any password) to test role-based dashboards:
          </p>
          <ul className="text-xs space-y-2 text-blue-900 dark:text-[#e6edf3]">
            <li className="flex justify-between border-b border-blue-200 dark:border-[#30363d] pb-1">
              <span className="font-semibold">staff@example.com</span> <span>Staff View</span>
            </li>
            <li className="flex justify-between border-b border-blue-200 dark:border-[#30363d] pb-1">
              <span className="font-semibold">manager@example.com</span> <span>Manager View</span>
            </li>
            <li className="flex justify-between border-b border-blue-200 dark:border-[#30363d] pb-1 border-transparent">
              <span className="font-semibold">owner@example.com</span> <span>Owner View</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
