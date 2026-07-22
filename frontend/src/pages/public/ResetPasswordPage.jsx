import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { PublicLayout } from "../../components/layout/PublicLayout";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    if (password.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      
      const data = await res.json();
      if (res.ok) {
        addToast(data.message || 'Password updated successfully.', 'success');
        navigate('/login');
      } else {
        addToast(data.detail || 'Failed to reset password. The link may be expired.', 'error');
      }
    } catch (err) {
      addToast('Network error while resetting password.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <main className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-500">
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create New Password
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
              Please enter your new password below.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleReset}>
            <div className="space-y-4">
              <Input
                label="New Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Input
                label="Confirm Password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Reset Password
            </Button>
          </form>
        </div>
      </main>
    </PublicLayout>
  );
}

export default ResetPasswordPage;
