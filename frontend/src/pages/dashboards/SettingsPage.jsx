import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export function SettingsPage() {
  const { user, login } = useAuth();
  const { addToast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(user?.dark_mode || false);
  const [loading, setLoading] = useState(false);
  const { activeProperty } = useAuth();
  const [activePropObj, setActivePropObj] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    document.title = "Settings — SentiNaut";
    if (!user || user.role !== 'owner') return;
      const propQuery = activeProperty || user?.property || 'Unassigned';
      fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/properties?owner_email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const matched = data.find(p => p.name === propQuery) || data[0];
            setActivePropObj(matched);
          }
        }).catch(err => console.error(err));
  }, [user, activeProperty]);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag || !activePropObj) return;
    const updatedTags = [...(activePropObj.custom_tags || []), newTag];
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/properties/${activePropObj.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custom_tags: updatedTags })
      });
      if (res.ok) {
        setActivePropObj({...activePropObj, custom_tags: updatedTags});
        setNewTag('');
        addToast('Tag added successfully', 'success');
      } else { throw new Error("Failed"); }
    } catch (err) {
      addToast('Failed to add tag', 'error');
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    if (!activePropObj) return;
    const updatedTags = (activePropObj.custom_tags || []).filter(t => t !== tagToRemove);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/properties/${activePropObj.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custom_tags: updatedTags })
      });
      if (res.ok) {
        setActivePropObj({...activePropObj, custom_tags: updatedTags});
        addToast('Tag removed', 'success');
      } else { throw new Error("Failed"); }
    } catch (err) {
      addToast('Failed to remove tag', 'error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const payload = { name, email, dark_mode: darkMode };
      if (password) payload.password = password;

      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        login({ ...user, dark_mode: darkMode, name, email }, localStorage.getItem('sentiNautToken'));
        setPassword('');
        addToast('Profile updated successfully', 'success');
      } else {
        const errorData = await res.json();
        addToast(errorData.detail || 'Failed to update profile', 'error');
      }
    } catch (err) {
      addToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/users/${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        login(null);
        window.location.href = '/';
      }
    } catch (err) {
      addToast('Failed to delete account', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-200 tracking-tight">Profile Manager</h1>
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
            <Input 
              label="Update Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Leave blank to keep current password"
            />
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <label className="text-[13px] font-medium text-slate-900 dark:text-slate-200">Dark Mode</label>
                <p className="text-[11px] text-slate-500">Enable dark theme across the application.</p>
              </div>
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
            </div>
            
            <div className="space-y-1.5 pt-2">
              <label className="text-[13px] font-medium text-slate-900 dark:text-slate-200">Authorization Scope</label>
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
      
      {user?.role === 'owner' && (
        <Card>
          <CardHeader>
            <CardTitle>Property Configuration ({activePropObj?.name || 'Loading...'})</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[13px] text-slate-500 mb-4">Manage custom review tags used by the AI ingestion engine.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {(activePropObj?.custom_tags || []).map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-blue-900 dark:hover:text-blue-200 ml-1">×</button>
                </span>
              ))}
              {(!activePropObj?.custom_tags || activePropObj.custom_tags.length === 0) && (
                <span className="text-xs text-slate-500 italic">No custom tags defined.</span>
              )}
            </div>
            <form onSubmit={handleAddTag} className="flex gap-2">
              <Input label="" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="e.g. Cleanliness, WiFi" />
              <Button type="submit" disabled={!activePropObj}>Add Tag</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Onboarding & Walkthroughs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Workspace Tour</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">Replay the 3-step interactive onboarding walkthrough of the SentiNaut command center.</p>
            </div>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => {
                localStorage.removeItem('sentinaut_onboarding_completed');
                window.dispatchEvent(new CustomEvent('sentinaut:restart_tour'));
                addToast('Onboarding tour restarted!', 'success');
              }}
            >
              Restart Tour
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-100 dark:border-red-900/30">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Delete Account</p>
              <p className="text-xs text-[#666666] dark:text-[#a1a1aa] max-w-sm mt-1">Permanently remove your account and all associated operational data. This action is irreversible.</p>
            </div>
            <Button type="button" variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20" onClick={() => setDeleteModalOpen(true)}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Account?"
        destructive
        confirmText="Permanently Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      >
        <p>This action will permanently remove your account, associated properties, and all historical data from the SentiNaut platform. This cannot be undone.</p>
      </Modal>
    </div>
  );
}
