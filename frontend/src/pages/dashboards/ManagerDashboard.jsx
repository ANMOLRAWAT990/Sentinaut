import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';

export function ManagerDashboard() {
  const [reviews, setReviews] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [staffList, setStaffList] = useState([]);

  const handleInviteStaff = async (e) => {
    e.preventDefault();
    setIsInviteModalOpen(false);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Invited Staff', email: inviteEmail, password: 'password123', role: 'staff' })
      });
      
      if (res.ok) {
        addToast(`Staff account created! They can login with password: password123`, 'success');
      } else {
        const data = await res.json();
        addToast(data.detail || 'Failed to create staff account.', 'error');
      }
    } catch (err) {
      addToast('Network error while inviting staff.', 'error');
    }
    
    setInviteEmail('');
  };

  React.useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    Promise.all([
      fetch(`${API_URL}/api/reviews`).then(res => res.json()),
      fetch(`${API_URL}/api/actions`).then(res => res.json()),
      fetch(`${API_URL}/api/users?role=staff`).then(res => res.json())
    ]).then(([reviewsData, actionsData, staffData]) => {
      const fetchedReviews = reviewsData.map(r => ({
        id: r.id, text: r.text, sentiment: r.sentiment, approved: r.status === "Done", fullData: r
      }));
      setReviews(fetchedReviews);
      setActions(actionsData);
      setStaffList(Array.isArray(staffData) ? staffData : []);
    }).catch(err => console.error(err))
      .finally(() => {
        setTimeout(() => setLoading(false), 800);
      });
  }, []);

  const toggleApproval = async (id) => {
    const reviewToUpdate = reviews.find(r => r.id === id);
    if (!reviewToUpdate) return;
    setReviews(reviews.map(r => r.id === id ? { ...r, approved: !r.approved } : r));
    if (String(id).startsWith('mock-')) return; 
    try {
      await fetch(`http://localhost:8000/api/reviews/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewToUpdate.fullData, status: !reviewToUpdate.approved ? "Done" : "Pending" })
      });
    } catch(err) {}
  };

  const toggleAction = async (id) => {
    const actionToUpdate = actions.find(a => a.id === id);
    if (!actionToUpdate) return;
    const newStatus = actionToUpdate.status === 'Pending' ? 'Done' : 'Pending';
    setActions(actions.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (String(id).startsWith('mock-')) return; 
    try {
      await fetch(`http://localhost:8000/api/actions/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...actionToUpdate, status: newStatus })
      });
    } catch(err) {}
  };

  return (
    <div className="space-y-10 w-full animate-in fade-in duration-500">
      <div className="relative w-full h-32 rounded-xl overflow-hidden shrink-0 shadow-sm flex items-end p-6 border border-black/10 dark:border-white/10">
        <img src="/images/manager_header.png" alt="Command Center" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity dark:opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-[13px] text-white/80 mt-1">Orchestrate approvals and track active operational flows.</p>
        </div>
      </div>

      <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#111111] shadow-sm">
        <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
          <h2 className="text-[14px] font-semibold text-[#111111] dark:text-[#ededed]">Ingestion Queue</h2>
          <span className="text-[12px] font-medium text-[#888888]">{reviews.length} pending items</span>
        </div>
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="p-5 flex items-start justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-4 w-full max-w-lg" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md shrink-0" />
              </div>
            ))
          ) : (
            reviews.slice(0, 4).map(r => (
              <div key={r.id} className="p-5 flex items-start justify-between gap-6 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                <div className="flex-1 space-y-2">
                  <Badge variant={r.sentiment === 'Positive' ? 'success' : 'danger'}>{r.sentiment}</Badge>
                  <p className="text-[14px] text-[#444444] dark:text-[#cccccc]">{r.text}</p>
                </div>
                <Button variant={r.approved ? "ghost" : "primary"} size="sm" onClick={() => toggleApproval(r.id)} className="h-8 text-[12px] shrink-0">
                  {r.approved ? "Revert" : "Authorize"}
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#111111] dark:text-[#ededed] tracking-tight">Active Operations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Pending', 'In Progress', 'Done', 'Verified'].map(column => (
            <div key={column} className="flex flex-col gap-3 min-h-[400px]">
              <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                <h3 className="text-[12px] font-semibold text-[#111111] dark:text-[#ededed] tracking-tight">{column}</h3>
                <span className="text-[11px] font-medium text-[#666666] dark:text-[#a1a1aa]">
                  {actions.filter(a => (column === 'Done' ? a.status === 'Done' : column === 'Pending' ? a.status === 'Pending' : false)).length}
                </span>
              </div>
              <div className="space-y-3">
                {loading ? (
                  Array(2).fill(0).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-lg p-3 shadow-sm h-[94px] flex flex-col">
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-2/3 mb-auto" />
                      <div className="flex items-center justify-between mt-auto">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-6 w-14 rounded-md" />
                      </div>
                    </div>
                  ))
                ) : (
                  actions.filter(a => (column === 'Done' ? a.status === 'Done' : column === 'Pending' ? a.status === 'Pending' : false)).map(a => (
                    <div key={a.id} className="bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-lg p-3 shadow-sm hover:border-black/20 dark:hover:border-white/20 transition-all flex flex-col h-[94px]">
                      <h4 className="text-[13px] font-medium text-[#111111] dark:text-[#ededed] mb-3 leading-snug line-clamp-2">{a.task}</h4>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[11px] font-mono text-[#888888]">TSK-{String(a.id).slice(-4).toUpperCase()}</span>
                        {column !== 'Done' && (
                          <Button size="sm" variant="secondary" className="h-6 px-2 text-[11px]" onClick={() => toggleAction(a.id)}>Execute</Button>
                        )}
                        {column === 'Done' && (
                          <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px]" onClick={() => toggleAction(a.id)}>Revert</Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-black/10 dark:border-white/10">
        <h2 className="text-xl font-bold text-[#111111] dark:text-[#ededed] tracking-tight mb-6">Staff Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map(staff => (
            <div key={staff.id} className="flex items-center justify-between bg-white dark:bg-[#111111] p-4 rounded-lg border border-black/10 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">{staff.initials || 'S'}</div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-[#ededed]">{staff.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">{staff.property || 'Unassigned'}</p>
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center justify-center h-[74px] border-2 border-dashed border-black/10 dark:border-white/10 rounded-lg text-sm font-medium text-slate-500 dark:text-[#8b949e] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            + Invite Staff Member
          </button>
        </div>
      </div>

      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Staff Member">
        <form onSubmit={handleInviteStaff} className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Send an invitation to a new staff member to join your property team.
          </p>
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="staff@taj.com" 
            required 
            value={inviteEmail} 
            onChange={(e) => setInviteEmail(e.target.value)} 
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
            <Button type="submit">Send Invite</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
