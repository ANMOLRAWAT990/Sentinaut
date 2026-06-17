import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export function ManagerDashboard() {
  const [reviews, setReviews] = useState([
    { id: 1, text: "AC was broken in room 302.", sentiment: "Negative", approved: false },
    { id: 2, text: "Loved the breakfast buffet!", sentiment: "Positive", approved: true },
  ]);

  const [actions, setActions] = useState([
    { id: 1, task: "Inspect AC in 302", status: "Pending" },
    { id: 2, task: "Praise kitchen staff", status: "Done" },
  ]);

  const toggleApproval = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, approved: !r.approved } : r));
  };

  const toggleAction = (id) => {
    setActions(actions.map(a => a.id === id ? { ...a, status: a.status === 'Pending' ? 'Done' : 'Pending' } : a));
  };

  return (
    <div className="space-y-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Action Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {actions.map(a => (
                  <li key={a.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0d1117] rounded-md">
                    <span className={`text-sm ${a.status === 'Done' ? 'line-through text-slate-400 dark:text-[#8b949e]' : 'text-slate-800 dark:text-[#e6edf3]'}`}>
                      {a.task}
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => toggleAction(a.id)}>
                      {a.status === 'Pending' ? 'Mark Done' : 'Undo'}
                    </Button>
                  </li>
                ))}
              </ul>
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
                  <Button size="sm" className="mt-3 w-full text-xs">Create Ticket</Button>
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
    </div>
  );
}
