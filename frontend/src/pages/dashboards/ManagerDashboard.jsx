import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';

export function ManagerDashboard() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [staffList, setStaffList] = useState([]);
  
  const [selectedAction, setSelectedAction] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  const handleActionClick = (action) => setSelectedAction(action);
  
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote) return;
    
    const updatedNotes = [...(selectedAction.notes || []), newNote];
    const updatedAction = { ...selectedAction, notes: updatedNotes };
    
    setActions(actions.map(a => a.id === selectedAction.id ? updatedAction : a));
    setSelectedAction(updatedAction);
    setNewNote('');
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/actions/${selectedAction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAction)
      });
      if (!res.ok) throw new Error("Failed to add note");
    } catch (err) {
      addToast('Failed to add note. Changes reverted.', 'error');
      // Rollback
      setActions(actions.map(a => a.id === selectedAction.id ? selectedAction : a));
      setSelectedAction(selectedAction);
    }
  };

  const handleArchive = async (id) => {
    const actionToUpdate = actions.find(a => a.id === id);
    if (!actionToUpdate) return;
    const updatedAction = { ...actionToUpdate, is_archived: true };
    
    setActions(actions.map(a => a.id === id ? updatedAction : a));
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/actions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAction)
      });
      if (!res.ok) throw new Error("Failed to archive");
    } catch (err) {
      addToast('Failed to archive action. Changes reverted.', 'error');
      setActions(actions.map(a => a.id === id ? actionToUpdate : a));
    }
  };

  const handleAssign = async (id, staffName) => {
    const actionToUpdate = actions.find(a => a.id === id);
    if (!actionToUpdate) return;
    const updatedAction = { ...actionToUpdate, assigned_to: staffName };
    setActions(actions.map(a => a.id === id ? updatedAction : a));
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/actions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAction)
      });
      if (!res.ok) throw new Error("Failed to assign staff");
    } catch (err) {
      addToast('Failed to assign staff. Changes reverted.', 'error');
      setActions(actions.map(a => a.id === id ? actionToUpdate : a));
    }
  };
  
  const handleSetPriority = async (id, priority) => {
    const actionToUpdate = actions.find(a => a.id === id);
    if (!actionToUpdate) return;
    const updatedAction = { ...actionToUpdate, priority };
    setActions(actions.map(a => a.id === id ? updatedAction : a));
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/actions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAction)
      });
      if (!res.ok) throw new Error("Failed to set priority");
    } catch (err) {
      addToast('Failed to set priority. Changes reverted.', 'error');
      setActions(actions.map(a => a.id === id ? actionToUpdate : a));
    }
  };

  const handleInviteStaff = async (e) => {
    e.preventDefault();
    setIsInviteModalOpen(false);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Invited Staff', email: inviteEmail, password: 'password123', role: 'staff', property: user?.property || 'Unassigned' })
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
    document.title = "Command Center · SentiNaut";
    if (!user) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    Promise.all([
      fetch(`${API_URL}/api/reviews?property=${user.property}`).then(res => res.json()),
      fetch(`${API_URL}/api/actions?property=${user.property}`).then(res => res.json()),
      fetch(`${API_URL}/api/users?role=staff&property=${user.property}`).then(res => res.json())
    ]).then(([reviewsData, actionsData, staffData]) => {
      const fetchedReviews = reviewsData.reverse().map(r => ({
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
      const res = await fetch(`http://localhost:8000/api/reviews/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewToUpdate.fullData, status: !reviewToUpdate.approved ? "Done" : "Pending" })
      });
      if (!res.ok) throw new Error("Failed to toggle approval");
    } catch(err) {
      addToast('Failed to change authorization. Changes reverted.', 'error');
      setReviews(reviews.map(r => r.id === id ? reviewToUpdate : r));
    }
  };

  const handleDeleteReview = (id) => {
    if (String(id).startsWith('mock-')) {
      setReviews(reviews.filter(r => r.id !== id));
      return;
    }
    setDeleteReviewId(id);
  };

  const confirmDeleteReview = async () => {
    if (!deleteReviewId) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/reviews/${deleteReviewId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      setReviews(reviews.filter(r => r.id !== deleteReviewId));
      addToast("Review deleted permanently.", "success");
    } catch (err) {
      addToast("Failed to delete review.", "error");
    } finally {
      setDeleteReviewId(null);
    }
  };

  const toggleAction = async (id) => {
    const actionToUpdate = actions.find(a => a.id === id);
    if (!actionToUpdate) return;
    const newStatus = actionToUpdate.status === 'Pending' ? 'Done' : 'Pending';
    setActions(actions.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (String(id).startsWith('mock-')) return; 
    try {
      const res = await fetch(`http://localhost:8000/api/actions/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...actionToUpdate, status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to execute action");
    } catch(err) {
      addToast('Failed to update action status. Changes reverted.', 'error');
      setActions(actions.map(a => a.id === id ? actionToUpdate : a));
    }
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

      <div className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
          <h2 className="text-[14px] font-semibold text-slate-900 dark:text-slate-200">Ingestion Queue</h2>
          <span className="text-[12px] font-medium text-slate-400">{reviews.length} pending items</span>
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
                <div className="flex flex-col gap-2 shrink-0">
                  <Button variant={r.approved ? "ghost" : "primary"} size="sm" onClick={() => toggleApproval(r.id)} className="h-8 text-[12px] w-full">
                    {r.approved ? "Revert" : "Authorize"}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteReview(r.id)} className="h-8 text-[12px] w-full bg-red-500/10 text-red-600 hover:bg-red-500/20 border-none">
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-200 tracking-tight">Active Operations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Pending', 'In Progress', 'Done', 'Verified'].map(column => (
            <div key={column} className="flex flex-col gap-3 min-h-[400px]">
              <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                <h3 className="text-[12px] font-semibold text-slate-900 dark:text-slate-200 tracking-tight">{column}</h3>
                <span className="text-[11px] font-medium text-[#666666] dark:text-[#a1a1aa]">
                  {actions.filter(a => !a.is_archived && (column === 'Done' ? a.status === 'Done' : column === 'Pending' ? a.status === 'Pending' : false)).length}
                </span>
              </div>
              <div className="space-y-3">
                {loading ? (
                  Array(2).fill(0).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-lg p-3 shadow-sm h-[94px] flex flex-col">
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-2/3 mb-auto" />
                      <div className="flex items-center justify-between mt-auto">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-6 w-14 rounded-md" />
                      </div>
                    </div>
                  ))
                ) : (
                  actions.filter(a => !a.is_archived && (column === 'Done' ? a.status === 'Done' : column === 'Pending' ? a.status === 'Pending' : false)).map(a => (
                    <div key={a.id} className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-lg p-3 shadow-sm hover:border-black/20 dark:hover:border-white/20 transition-all flex flex-col min-h-[94px]">
                      <div className="flex justify-between items-start mb-2">
                        <select 
                          className="text-[10px] uppercase font-bold bg-transparent cursor-pointer outline-none"
                          value={a.priority || 'Medium'}
                          onChange={(e) => handleSetPriority(a.id, e.target.value)}
                        >
                          <option value="High" className="text-red-500">High</option>
                          <option value="Medium" className="text-yellow-500">Medium</option>
                          <option value="Low" className="text-green-500">Low</option>
                        </select>
                        <select
                          className="text-[10px] bg-slate-100 dark:bg-slate-800 rounded px-1 max-w-[60px] truncate"
                          value={a.assigned_to || ''}
                          onChange={(e) => handleAssign(a.id, e.target.value)}
                        >
                          <option value="">Assign</option>
                          {staffList.map(s => <option key={s.name} value={s.name}>{s.initials}</option>)}
                        </select>
                      </div>
                      <h4 className="text-[13px] font-medium text-slate-900 dark:text-slate-200 mb-2 leading-snug line-clamp-2 cursor-pointer hover:underline" onClick={() => handleActionClick(a)}>{a.task}</h4>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[11px] font-mono text-slate-400 cursor-pointer" onClick={() => handleActionClick(a)}>TSK-{String(a.id).slice(-4).toUpperCase()}</span>
                        {column !== 'Done' && (
                          <Button size="sm" variant="secondary" className="h-6 px-2 text-[11px]" onClick={() => toggleAction(a.id)}>Execute</Button>
                        )}
                        {column === 'Done' && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px]" onClick={() => toggleAction(a.id)}>Revert</Button>
                            <Button size="sm" variant="primary" className="h-6 px-2 text-[11px] bg-primary-600 hover:bg-primary-700" onClick={() => handleArchive(a.id)}>Archive</Button>
                          </div>
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
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-200 tracking-tight mb-6">Staff Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map(staff => (
            <div key={staff.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-lg border border-black/10 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">{staff.initials || 'S'}</div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">{staff.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">{staff.property || 'Unassigned'}</p>
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center justify-center h-[74px] border-2 border-dashed border-black/10 dark:border-white/10 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
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

      <Modal isOpen={!!selectedAction} onClose={() => setSelectedAction(null)} title="Action Details">
        {selectedAction && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Task</h4>
              <p className="text-sm text-slate-700 dark:text-[#a1a1aa]">{selectedAction.task}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Notes</h4>
              {selectedAction.notes?.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {selectedAction.notes.map((note, i) => (
                    <li key={i} className="text-sm bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">{note}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 mb-4">No notes yet.</p>
              )}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <Input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." />
                <Button type="submit">Add</Button>
              </form>
            </div>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={!!deleteReviewId} 
        onClose={() => setDeleteReviewId(null)}
        title="Delete Review?"
        destructive
        confirmText="Delete Permanently"
        onConfirm={confirmDeleteReview}
      >
        <p className="text-sm">Are you sure you want to completely delete this review? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
