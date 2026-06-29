import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function SettingsPage() {
  const { user, login } = useAuth();
  const { addToast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay for a polished UX
    setTimeout(() => {
      login({ ...user, name, email });
      addToast('Profile updated successfully', 'success');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-[#111111] dark:text-[#ededed] tracking-tight">Profile Manager</h1>
        <p className="text-[13px] text-[#666666] dark:text-[#a1a1aa] mt-1">Manage your account credentials and role access.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-5">
            <Input 
              label="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            <Input 
              label="Email Address" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            
            <div className="space-y-1.5 pt-2">
              <label className="text-[13px] font-medium text-[#111111] dark:text-[#ededed]">Authorization Scope</label>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-md text-[13px] font-medium capitalize border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300">
                  {user?.role} Access
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Your role tier is locked by your system administrator.</span>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="border-red-100 dark:border-red-900/30">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#111111] dark:text-[#ededed]">Delete Account</p>
              <p className="text-xs text-[#666666] dark:text-[#a1a1aa] max-w-sm mt-1">Permanently remove your account and all associated operational data. This action is irreversible.</p>
            </div>
            <Button type="button" variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20" onClick={() => addToast('Please contact system administrator to delete account.', 'error')}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
