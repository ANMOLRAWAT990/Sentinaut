import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';

export function SuggestionsIndex() {
  const { user, activeProperty } = useAuth();
  const { addToast } = useToast();
  const [insights, setInsights] = React.useState({ summary: "", anomalies: [], tasks: [] });
  const [actions, setActions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const propName = activeProperty || user?.property || 'Unassigned';
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/insights?property=${encodeURIComponent(propName)}`);
      if(res.ok) setInsights(await res.json());
    } catch(e) {}
    setLoading(false);
  };

  const fetchActions = async () => {
    try {
      const propName = activeProperty || user?.property || 'Unassigned';
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/actions?property=${encodeURIComponent(propName)}`);
      if(res.ok) setActions(await res.json());
    } catch(e) {}
  };

  React.useEffect(() => {
    document.title = "SentiNaut";
    if (user?.role === 'manager' || user?.role === 'owner') {
      fetchInsights();
    }
    fetchActions();
  }, [user, activeProperty]);

  const generateInsights = async () => {
    setIsGenerating(true);
    addToast('Generating insights... this takes a moment', 'info');
    try {
      const propName = activeProperty || user?.property || 'Unassigned';
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/insights/generate?property=${encodeURIComponent(propName)}`, {method: 'POST'});
      if(res.ok) {
        setInsights(await res.json());
        addToast('Insights generated', 'success');
      } else throw new Error();
    } catch(e) { addToast('Failed to generate insights', 'error'); }
    finally { setIsGenerating(false); }
  };

  const handleMarkExecuted = async (action) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/actions/${action.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...action, status: 'Done' })
      });
      if (res.ok) {
        addToast('Task marked as executed!', 'success');
        fetchActions();
      } else {
        addToast('Failed to mark task', 'error');
      }
    } catch(e) {
      addToast('Error marking task', 'error');
    }
  };

  const handleComingSoon = () => addToast('This functionality is currently locked in your environment.', 'info');

  const renderStaffView = () => {
    const pendingActions = actions.filter(a => a.status !== 'Done');
    return (
    <div className="space-y-6">
      <div className="border border-black/10 dark:border-white/10 rounded-xl p-6 bg-black/[0.02] dark:bg-white/[0.02]">
        <h3 className="text-[14px] font-semibold text-slate-900 dark:text-slate-200">Operational Directive</h3>
        <p className="text-[13px] text-[#666666] dark:text-[#a1a1aa] mt-1">Execute the following tasks dispatched by the anomaly engine.</p>
      </div>
      <div className="space-y-2">
        {pendingActions.length === 0 ? (
          <EmptyState 
            title="All Clear"
            description="No pending operational tasks at the moment."
          />
        ) : pendingActions.map((t, i) => (
          <div key={i} className={`bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 ${t.priority === 'High' ? 'border-l-4 border-l-red-500' : t.priority === 'Medium' ? 'border-l-4 border-l-yellow-500' : ''} rounded-lg p-4 flex items-center justify-between group hover:border-black/20 dark:hover:border-white/20 transition-colors`}>
            <div>
              <p className="text-[14px] font-medium text-slate-900 dark:text-slate-200">{t.task}</p>
              <div className="flex gap-3 mt-1 text-[11px] font-mono text-slate-400">
                <span>{t.priority} Priority</span>
                <span>•</span>
                <span>Created: {new Date(t.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => handleMarkExecuted(t)} className="h-8 text-[12px]">Mark Executed</Button>
          </div>
        ))}
      </div>
    </div>
  )};

  const renderManagerView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-200 tracking-tight">Operational Intelligence</h2>
          <p className="text-[13px] text-[#666666] dark:text-[#a1a1aa] mt-1">{insights.summary || 'Algorithmic deductions based on review volume anomalies.'}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={generateInsights} isLoading={isGenerating}>Force AI Re-index</Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-[11px] font-semibold text-[#666666] dark:text-[#a1a1aa] uppercase tracking-wider">
          <div className="col-span-3">Anomaly Status</div>
          <div className="col-span-9">Deduction & Recommended Action</div>
        </div>
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-start">
                <div className="md:col-span-3">
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="md:col-span-9 md:pr-8 space-y-2 w-full">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : insights.anomalies.map((s, i) => (
            <div key={i} className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-start group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
              <div className="md:col-span-3">
                <div className={`text-[13px] font-medium font-mono ${s.severity === 'High' ? 'text-red-500' : 'text-yellow-500'}`}>[{s.severity.toUpperCase()}]</div>
              </div>
              <div className="md:col-span-9 md:pr-8">
                <div className="text-[14px] font-medium text-slate-900 dark:text-slate-200 mb-1">{s.title}</div>
                {insights.tasks[i] && <div className="text-[13px] text-[#666666] dark:text-[#a1a1aa] leading-relaxed mb-3">Suggested Task: {insights.tasks[i].task}</div>}
              </div>
            </div>
          ))}
        </div>
        {!loading && insights.anomalies.length === 0 && (
          <EmptyState 
            title="Operational Harmony"
            description="No critical anomalies detected in recent guest feedback."
          />
        )}
      </div>
    </div>
  );

  const renderOwnerView = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-200 tracking-tight">Strategic Thesis</h2>
        <p className="text-[13px] text-[#666666] dark:text-[#a1a1aa] mt-1">Aggregated market positioning against competitor baselines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[14px] font-semibold text-slate-900 dark:text-slate-200">Q3 Market Opportunity</h3>
          <p className="text-[14px] text-[#444444] dark:text-[#cccccc] leading-relaxed max-w-2xl">
            Based on a continuous ingestion of 1,248 data points across the immediate competitive set, a strict divergence exists in <strong>Family Entertainment</strong>.
          </p>
          <p className="text-[14px] text-[#444444] dark:text-[#cccccc] leading-relaxed max-w-2xl">
            Competitor properties are sustaining a -14% sentiment penalty regarding on-site activities. Allocating CAPEX toward guided family infrastructure represents an asymmetric upside with an estimated +12% conversion impact.
          </p>
          <Button onClick={handleComingSoon} variant="secondary" className="mt-2 text-[13px]">Export Complete Thesis</Button>
        </div>

        <div className="bg-black/[0.03] dark:bg-white/[0.03] rounded-xl p-6 border border-black/5 dark:border-white/5 space-y-6">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Primary Accolade</div>
            <div className="text-[16px] font-medium text-slate-900 dark:text-slate-200">Cleanliness Standard</div>
            <div className="text-[12px] text-[#666666] dark:text-[#a1a1aa] mt-0.5">Present in 42% of positive vectors</div>
          </div>
          <div className="w-full h-px bg-black/10 dark:bg-white/10" />
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Primary Friction</div>
            <div className="text-[16px] font-medium text-slate-900 dark:text-slate-200">Acoustic Bleed</div>
            <div className="text-[12px] text-[#666666] dark:text-[#a1a1aa] mt-0.5">Present in 18% of negative vectors</div>
          </div>
          <div className="w-full h-px bg-black/10 dark:bg-white/10" />
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Task ROI Engine</div>
            <div className="text-[16px] font-medium text-slate-900 dark:text-slate-200">84% Efficiency</div>
            <div className="text-[12px] text-[#666666] dark:text-[#a1a1aa] mt-0.5">Resolution to rating yield ratio</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-8 animate-in fade-in duration-500">
      {user?.role === 'staff' && renderStaffView()}
      {user?.role === 'manager' && renderManagerView()}
      {user?.role === 'owner' && renderOwnerView()}
      {!['staff', 'manager', 'owner'].includes(user?.role) && <p>Invalid role architecture.</p>}
    </div>
  );
}
