import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter, MessageSquare, Star, ArrowUpRight, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export function ReviewsIndex() {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read: Fetch real reviews from MongoDB backend
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/reviews');
      if(res.ok) {
        const data = await res.json();
        setReviews(data.reverse()); // Show newest first
      }
    } catch (err) {
      addToast('Failed to load reviews from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete: Remove review from MongoDB
  const deleteReview = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/reviews/${id}`, { method: 'DELETE' });
      if(res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
        addToast('Review deleted successfully', 'success');
      }
    } catch (err) {
      addToast('Failed to delete review', 'error');
    }
  };

  // Update: Modify review status in MongoDB
  const approveReview = async (review) => {
    try {
      const res = await fetch(`http://localhost:8000/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review, status: 'Approved' })
      });
      if(res.ok) {
        const updated = await res.json();
        setReviews(reviews.map(r => r.id === review.id ? updated : r));
        addToast('Review approved successfully', 'success');
      }
    } catch (err) {
      addToast('Failed to approve review', 'error');
    }
  };

  const handleComingSoon = () => addToast('This feature is coming soon!', 'info');

  const renderStaffView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-[#e6edf3]">My Processed Reviews</h2>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? <div className="p-8 text-center text-slate-500">Loading reviews from database...</div> : 
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-[#8b949e] bg-slate-50 dark:bg-[#0d1117] border-b border-slate-100 dark:border-[#30363d]">
                <tr>
                  <th className="px-6 py-4 font-medium">Guest & Platform</th>
                  <th className="px-6 py-4 font-medium">Review Snippet</th>
                  <th className="px-6 py-4 font-medium">Theme</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#30363d]">
                {reviews.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:bg-[#0d1117]/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-[#e6edf3]">{r.guestName}</div>
                      <div className="text-slate-500 dark:text-[#8b949e] text-xs">{r.platform}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-[#8b949e] max-w-xs truncate">{r.text}</td>
                    <td className="px-6 py-4 flex gap-1 flex-wrap">
                      {r.tags.map(t => <Badge key={t}>{t}</Badge>)}
                      {r.tags.length === 0 && <span className="text-slate-400">None</span>}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={r.status === 'Approved' ? 'success' : 'warning'}>{r.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                       <Button variant="ghost" size="sm" onClick={() => deleteReview(r.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto"><Trash2 className="h-4 w-4"/></Button>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && <tr><td colSpan="5" className="p-12 text-center text-slate-500 font-light">No recent feedback available. Operations are normal.</td></tr>}
              </tbody>
            </table>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderManagerView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-[#e6edf3]">Review Moderation Queue</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-[#8b949e]" />
            <input type="text" placeholder="Search reviews..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <Button variant="secondary" size="md" onClick={handleComingSoon} className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
        </div>
      </div>
      <div className="grid gap-4">
        {loading ? <div className="p-8 text-center text-slate-500 bg-white dark:bg-[#161b22] rounded-lg">Loading from database...</div> : reviews.map((r, i) => (
          <Card key={i}>
            <CardContent className="p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900 dark:text-[#e6edf3]">{r.guestName}</span>
                  <Badge variant={r.sentiment === 'Negative' ? 'danger' : r.sentiment === 'Positive' ? 'success' : 'warning'}>{r.sentiment}</Badge>
                  <span className="text-xs font-medium text-slate-500 dark:text-[#8b949e] uppercase px-2 py-0.5 bg-slate-100 dark:bg-[#30363d] rounded-full">{r.platform}</span>
                </div>
                <p className="text-slate-700 dark:text-[#e6edf3] text-sm">{r.text}</p>
                <div className="text-xs font-medium text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">Themes: {r.tags.length > 0 ? r.tags.join(", ") : "None"} | Status: {r.status}</div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="secondary" size="sm" onClick={() => deleteReview(r.id)} className="flex-1 md:flex-none text-red-500 hover:text-red-700 hover:bg-red-50">Delete</Button>
                {r.status !== 'Approved' && (
                  <Button size="sm" onClick={() => approveReview(r)} className="flex-1 md:flex-none gap-2 bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-4 h-4"/>Approve</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && reviews.length === 0 && (
          <div className="relative w-full h-64 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 flex items-center justify-center shadow-sm">
            <img src="/images/empty_state.png" alt="Empty Lobby" className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40" />
            <div className="absolute inset-0 bg-white/70 dark:bg-black/60 backdrop-blur-[2px]"></div>
            <div className="relative z-10 text-center animate-in slide-in-from-bottom-2 fade-in duration-500">
              <div className="w-12 h-12 bg-white dark:bg-[#111] rounded-full shadow-md flex items-center justify-center mx-auto mb-4 border border-black/5 dark:border-white/5">
                <MessageSquare className="h-5 w-5 text-[#888]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#111] dark:text-[#eee]">Awaiting Feedback Data</h3>
              <p className="text-[13px] text-[#666] dark:text-[#aaa] mt-1 max-w-sm">The ingestion pipeline is active but empty. Field staff must process incoming reviews.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderOwnerView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-[#e6edf3]">Review Analytics Directory</h2>
        <Button variant="secondary" size="sm" onClick={handleComingSoon} className="gap-2">Export CSV <ArrowUpRight className="h-4 w-4" /></Button>
      </div>
      
      {/* Real Data Aggregation for Owner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'All Reviews', count: reviews.length },
          { label: 'Positive', count: reviews.filter(r => r.sentiment === 'Positive').length },
          { label: 'Neutral', count: reviews.filter(r => r.sentiment === 'Neutral').length },
          { label: 'Negative', count: reviews.filter(r => r.sentiment === 'Negative').length }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors shadow-sm">
            <div className="text-sm font-medium text-slate-600 dark:text-[#8b949e]">{stat.label}</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-[#e6edf3] mt-1">{loading ? '...' : stat.count}</div>
          </div>
        ))}
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="p-8 text-center text-slate-500 dark:text-[#8b949e]">
            <MessageSquare className="h-8 w-8 mx-auto text-slate-300 mb-3" />
            <p className="font-medium text-slate-700 dark:text-[#e6edf3] mb-1">Detailed View</p>
            <p className="text-sm font-light">Metrics are currently aggregated across all properties.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-slate-900 dark:text-[#e6edf3]">Guest Intelligence</h1>
        <p className="text-slate-500 dark:text-[#8b949e] font-light text-sm mt-2">Real-time guest feedback stream</p>
      </div>
      {user?.role === 'staff' && renderStaffView()}
      {user?.role === 'manager' && renderManagerView()}
      {user?.role === 'owner' && renderOwnerView()}
      {!['staff', 'manager', 'owner'].includes(user?.role) && <p>Invalid role.</p>}
    </div>
  );
}
