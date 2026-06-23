import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter, MessageSquare, Star, ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export function ReviewsIndex() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleComingSoon = () => addToast('This feature is coming soon!', 'info');

  const renderStaffView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-[#e6edf3]">My Processed Reviews</h2>
        <Button size="sm" onClick={handleComingSoon}>Submit New Review</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-[#8b949e] bg-slate-50 dark:bg-[#0d1117] border-b border-slate-100 dark:border-[#30363d]">
                <tr>
                  <th className="px-6 py-4 font-medium">Guest & Date</th>
                  <th className="px-6 py-4 font-medium">Review Snippet</th>
                  <th className="px-6 py-4 font-medium">Theme</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 dark:bg-[#0d1117]/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-[#e6edf3]">Sarah M.</div>
                    <div className="text-slate-500 dark:text-[#8b949e] text-xs">Today, 10:42 AM</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-[#8b949e] max-w-xs truncate">Room was beautiful but the AC was loud.</td>
                  <td className="px-6 py-4"><Badge>Maintenance</Badge></td>
                  <td className="px-6 py-4"><Badge variant="warning">Pending Manager</Badge></td>
                </tr>
                <tr className="hover:bg-slate-50 dark:bg-[#0d1117]/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-[#e6edf3]">James T.</div>
                    <div className="text-slate-500 dark:text-[#8b949e] text-xs">Yesterday, 4:15 PM</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-[#8b949e] max-w-xs truncate">Absolutely loved the local food cooked by the host!</td>
                  <td className="px-6 py-4"><Badge>Food</Badge></td>
                  <td className="px-6 py-4"><Badge variant="success">Approved</Badge></td>
                </tr>
              </tbody>
            </table>
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
        {[
          { guest: 'Alice W.', text: 'The heater in room 402 is completely broken, we froze!', sentiment: 'Negative', theme: 'HVAC', score: 2 },
          { guest: 'Mark P.', text: 'Breakfast buffet was decent, but could use more vegan options.', sentiment: 'Neutral', theme: 'Food', score: 6 }
        ].map((r, i) => (
          <Card key={i}>
            <CardContent className="p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900 dark:text-[#e6edf3]">{r.guest}</span>
                  <Badge variant={r.sentiment === 'Negative' ? 'danger' : 'warning'}>{r.sentiment}</Badge>
                  <span className="text-xs text-slate-500 dark:text-[#8b949e] flex items-center gap-1"><Star className="h-3 w-3 fill-slate-400 text-slate-400 dark:text-[#8b949e]" /> {r.score}/10</span>
                </div>
                <p className="text-slate-700 dark:text-[#e6edf3] text-sm">{r.text}</p>
                <div className="text-xs font-medium text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">Theme: {r.theme}</div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="secondary" size="sm" onClick={handleComingSoon} className="flex-1 md:flex-none">Edit Tags</Button>
                <Button size="sm" onClick={handleComingSoon} className="flex-1 md:flex-none">Approve</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOwnerView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-[#e6edf3]">Review Analytics Directory</h2>
        <Button variant="secondary" size="sm" onClick={handleComingSoon} className="gap-2">Export CSV <ArrowUpRight className="h-4 w-4" /></Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['All (1,248)', 'Positive (840)', 'Neutral (210)', 'Negative (198)'].map((label, i) => (
          <div key={i} className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors">
            <div className="text-sm font-medium text-slate-600 dark:text-[#8b949e]">{label.split(' ')[0]}</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-[#e6edf3] mt-1">{label.split(' ')[1].replace(/[()]/g, '')}</div>
          </div>
        ))}
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="p-8 text-center text-slate-500 dark:text-[#8b949e]">
            <MessageSquare className="h-8 w-8 mx-auto text-slate-300 mb-3" />
            <p className="font-medium text-slate-700 dark:text-[#e6edf3] mb-1">Detailed View</p>
            <p className="text-sm">Select a category above to view the segmented review data.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#e6edf3]">Reviews</h1>
        <p className="text-slate-500 dark:text-[#8b949e] text-sm mt-1">Manage and view guest feedback.</p>
      </div>
      {user?.role === 'staff' && renderStaffView()}
      {user?.role === 'manager' && renderManagerView()}
      {user?.role === 'owner' && renderOwnerView()}
      {!['staff', 'manager', 'owner'].includes(user?.role) && <p>Invalid role.</p>}
    </div>
  );
}
