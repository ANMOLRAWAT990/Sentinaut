import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, Lightbulb, AlertCircle, TrendingUp } from 'lucide-react';

export function SuggestionsIndex() {
  const { user } = useAuth();

  const renderStaffView = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-4">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-blue-900">Your Action Items</h3>
          <p className="text-sm text-blue-800 mt-1">These tasks were generated from recent guest feedback and assigned to you by the manager.</p>
        </div>
      </div>
      <div className="grid gap-4">
        {[
          { task: 'Check AC unit filter in Room 302', priority: 'High', due: 'Today' },
          { task: 'Restock extra towels in pool area', priority: 'Medium', due: 'Tomorrow' }
        ].map((t, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-[#e6edf3]">{t.task}</p>
                <div className="flex gap-3 mt-2 text-xs font-medium">
                  <span className={t.priority === 'High' ? 'text-red-600' : 'text-yellow-600'}>{t.priority} Priority</span>
                  <span className="text-slate-500 dark:text-[#8b949e]">Due: {t.due}</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="gap-2"><CheckCircle2 className="h-4 w-4" /> Mark Done</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderManagerView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-[#e6edf3]">AI Operational Suggestions</h2>
        <Button size="sm" variant="secondary">Run Batch Analysis</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: 'HVAC Maintenance Pattern', desc: '3 negative reviews mention AC issues on the 3rd floor. Suggestion: Schedule preventative maintenance for rooms 301-310.', type: 'Maintenance' },
          { title: 'Breakfast Peak Overcrowding', desc: 'Guests report long waits between 8:30-9:00 AM. Suggestion: Stagger breakfast slots or add one temporary staff member during this window.', type: 'Operations' },
          { title: 'Pillow Comfort', desc: 'Multiple guests praised the new memory foam pillows. Suggestion: Highlight this feature in the listing description.', type: 'Marketing' }
        ].map((s, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-base">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-sm text-slate-600 dark:text-[#8b949e] mb-6 leading-relaxed">{s.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#8b949e]">{s.type}</span>
                <Button size="sm">Convert to Task</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOwnerView = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-[#e6edf3]">Strategic Insights</h2>
      <Card className="bg-slate-900 dark:bg-[#161b22] text-white border-0">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white dark:bg-[#161b22]/10 rounded-lg"><TrendingUp className="h-6 w-6 text-white" /></div>
            <div>
              <h3 className="text-lg font-bold">Q3 Opportunity Report</h3>
              <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                Based on aggregate analysis of 1,248 reviews across your property and 3 competitors, your biggest opportunity lies in <strong>Family Activities</strong>. 
                Competitors are consistently losing points for poor entertainment options. Investing in a small play area or guided family tours could increase your booking rate by an estimated 12%.
              </p>
              <Button className="mt-6 bg-white dark:bg-[#161b22] text-slate-900 dark:text-[#e6edf3] hover:bg-slate-100 dark:bg-[#21262d] border-0">Download Full Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
         <Card><CardContent className="p-5"><h4 className="font-bold mb-2">Top Praised Theme</h4><p className="text-3xl font-bold text-green-600">Cleanliness</p><p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1">Mentioned in 42% of positive reviews</p></CardContent></Card>
         <Card><CardContent className="p-5"><h4 className="font-bold mb-2">Top Complaint Theme</h4><p className="text-3xl font-bold text-red-600">Noise</p><p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1">Mentioned in 18% of negative reviews</p></CardContent></Card>
         <Card><CardContent className="p-5"><h4 className="font-bold mb-2">ROI on Tasks</h4><p className="text-3xl font-bold text-blue-600">84%</p><p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1">Resolved issues leading to higher scores</p></CardContent></Card>
      </div>
    </div>
  );

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#e6edf3]">AI Suggestions</h1>
        <p className="text-slate-500 dark:text-[#8b949e] text-sm mt-1">Actionable insights generated from guest feedback patterns.</p>
      </div>
      {user?.role === 'staff' && renderStaffView()}
      {user?.role === 'manager' && renderManagerView()}
      {user?.role === 'owner' && renderOwnerView()}
      {!['staff', 'manager', 'owner'].includes(user?.role) && <p>Invalid role.</p>}
    </div>
  );
}
