import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Filter, Star, CheckCircle2, Circle, MoreHorizontal, MessageSquare } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export function ManagerDashboard() {
  const [reviews, setReviews] = useState([
    { id: "mock-1", text: "AC was broken in room 302.", sentiment: "Negative", approved: false },
    { id: "mock-2", text: "Loved the breakfast buffet!", sentiment: "Positive", approved: true },
  ]);

  const [actions, setActions] = useState([
    { id: 1, task: "Inspect AC in 302", status: "Pending" },
    { id: 2, task: "Praise kitchen staff", status: "Done" },
  ]);

  const { addToast } = useToast();

  const handleComingSoon = () => addToast('This feature is coming soon!', 'info');

  React.useEffect(() => {
    fetch('http://localhost:8000/api/reviews')
      .then(res => res.json())
      .then(data => {
        const fetchedReviews = data.map(r => ({
          id: r.id,
          text: r.text,
          sentiment: r.sentiment,
          approved: r.status === "Done",
          fullData: r // keep full original data to send back
        }));
        setReviews([...fetchedReviews, { id: "mock-1", text: "AC was broken in room 302.", sentiment: "Negative", approved: false }, { id: "mock-2", text: "Loved the breakfast buffet!", sentiment: "Positive", approved: true }]);
      })
      .catch(err => console.error("Failed to fetch reviews:", err));

    fetch('http://localhost:8000/api/actions')
      .then(res => res.json())
      .then(data => setActions(data))
      .catch(err => console.error("Failed to fetch actions:", err));
  }, []);

  const toggleApproval = async (id) => {
    const reviewToUpdate = reviews.find(r => r.id === id);
    if (!reviewToUpdate) return;
    
    // Optimistic update
    setReviews(reviews.map(r => r.id === id ? { ...r, approved: !r.approved } : r));

    if (String(id).startsWith('mock-')) return; 

    try {
      // Send back full data to avoid missing required fields like `tags`
      const apiUpdatePayload = {
        ...reviewToUpdate.fullData,
        status: !reviewToUpdate.approved ? "Done" : "Pending"
      };
      await fetch(`http://localhost:8000/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiUpdatePayload)
      });
    } catch(err) {
      console.error("Failed to update review:", err);
    }
  };

  const toggleAction = async (id) => {
    const actionToUpdate = actions.find(a => a.id === id);
    if (!actionToUpdate) return;

    const newStatus = actionToUpdate.status === 'Pending' ? 'Done' : 'Pending';
    
    // Optimistic update
    setActions(actions.map(a => a.id === id ? { ...a, status: newStatus } : a));

    try {
      await fetch(`http://localhost:8000/api/actions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...actionToUpdate, status: newStatus })
      });
    } catch(err) {
      console.error("Failed to update action:", err);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#e6edf3]">Manager Dashboard</h1>
        <p className="text-slate-500 dark:text-[#8b949e]">Review feedback and manage operational tasks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-[#30363d] rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={r.sentiment === 'Positive' ? 'success' : 'danger'}>{r.sentiment}</Badge>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-[#e6edf3]">{r.text}</p>
                    </div>
                    <div className="ml-4">
                      <Button 
                        variant={r.approved ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => toggleApproval(r.id)}
                      >
                        {r.approved ? "Approved" : "Approve"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Operational Suggestions */}
        <div className="space-y-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900 text-base">AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white dark:bg-[#161b22] p-3 rounded shadow-sm">
                  <h4 className="font-medium text-sm text-slate-900 dark:text-[#e6edf3] mb-1">HVAC Maintenance Needed</h4>
                  <p className="text-xs text-slate-600 dark:text-[#8b949e]">3 negative reviews mention AC issues in the 3rd floor in the last 48 hours.</p>
                  <Button size="sm" onClick={handleComingSoon} className="mt-3 w-full text-xs">Create Ticket</Button>
                </div>
                <div className="bg-white dark:bg-[#161b22] p-3 rounded shadow-sm">
                  <h4 className="font-medium text-sm text-slate-900 dark:text-[#e6edf3] mb-1">Breakfast Peak Overcrowding</h4>
                  <p className="text-xs text-slate-600 dark:text-[#8b949e]">Consider extending breakfast hours or adding staff between 8-9 AM.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Kanban Action Tracker - Full Width */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#e6edf3]">Action Tracker</h2>
          <div className="text-sm text-slate-500 dark:text-[#8b949e]">
            {actions.length} open tasks
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select className="border border-slate-200 dark:border-[#30363d] rounded-md px-3 py-1.5 text-sm text-slate-600 dark:text-[#8b949e] bg-white dark:bg-[#0d1117] focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Status: All</option>
          </select>
          <select className="border border-slate-200 dark:border-[#30363d] rounded-md px-3 py-1.5 text-sm text-slate-600 dark:text-[#8b949e] bg-white dark:bg-[#0d1117] focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Theme: All</option>
          </select>
          <select className="border border-slate-200 dark:border-[#30363d] rounded-md px-3 py-1.5 text-sm text-slate-600 dark:text-[#8b949e] bg-white dark:bg-[#0d1117] focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Assigned: All</option>
          </select>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Pending', 'In Progress', 'Done', 'Verified'].map(column => (
            <div key={column} className="bg-slate-100/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-[#30363d] rounded-xl p-4 min-h-[400px]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-[#30363d]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#8b949e]">{column}</h3>
                <span className="bg-white dark:bg-[#30363d] text-slate-700 dark:text-[#e6edf3] text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm border border-slate-200 dark:border-transparent">
                  {actions.filter(a => (column === 'Done' ? a.status === 'Done' : column === 'Pending' ? a.status === 'Pending' : false)).length}
                </span>
              </div>
              <div className="space-y-4">
                {actions.filter(a => (column === 'Done' ? a.status === 'Done' : column === 'Pending' ? a.status === 'Pending' : false)).map(a => (
                  <div key={a.id} className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow" style={{ borderLeftWidth: '4px', borderLeftColor: a.status === 'Done' ? '#10b981' : '#3b82f6' }}>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-[#e6edf3] mb-1">{a.task}</h4>
                    <div className="text-xs text-slate-500 dark:text-[#8b949e] mb-4 flex items-center gap-2">
                      <span className="bg-slate-100 dark:bg-[#30363d] px-2 py-0.5 rounded">Maintenance</span>
                      <span>• 3 reviews</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-[#30363d]">
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">Unassigned</span>
                      {column !== 'Done' && (
                        <Button size="sm" variant="secondary" className="text-xs h-7 px-3" onClick={() => toggleAction(a.id)}>Mark Done</Button>
                      )}
                      {column === 'Done' && (
                        <Button size="sm" variant="outline" className="text-xs h-7 px-3" onClick={() => toggleAction(a.id)}>Undo</Button>
                      )}
                    </div>
                    {column === 'Verified' && (
                      <div className="mt-2 text-[11px] bg-green-100 text-green-700 px-2 py-1 rounded-full inline-block font-medium">Verified by reviews</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
