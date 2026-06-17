import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
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
          Sign in to access your dashboard.
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
              
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                error={error}
              />

              <div>
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
