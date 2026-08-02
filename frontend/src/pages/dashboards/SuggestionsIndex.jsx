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
    document.title = "Strategic Insights — SentiNaut";
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
        <h3 className="text-[14px] font-semibold text-slate-900 dark:text-slate-200">Your Tasks</h3>
        <p className="text-[13px] text-[#666666] dark:text-[#a1a1aa] mt-1">Please complete the following tasks generated from recent guest feedback.</p>
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

  const [triageIndex, setTriageIndex] = React.useState(0);

  const handleTriageAccept = async (anomaly, task) => {
    try {
      const propName = activeProperty || user?.property || 'Unassigned';
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: task?.task || anomaly.title,
          property: propName,
          status: 'Pending',
          priority: anomaly.severity
        })
      });
      if (res.ok) {
        addToast('Task created from insight!', 'success');
        fetchActions();
        
        // Remove from insights DB
        await fetch(`${API_URL}/api/insights/dismiss?property=${encodeURIComponent(propName)}&anomaly_title=${encodeURIComponent(anomaly.title)}`, { method: 'PUT' });
      }
    } catch (e) {
      addToast('Failed to create task.', 'error');
    }
    setTriageIndex(prev => prev + 1);
  };

  const handleTriageDismiss = async (anomaly) => {
    try {
      const propName = activeProperty || user?.property || 'Unassigned';
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      await fetch(`${API_URL}/api/insights/dismiss?property=${encodeURIComponent(propName)}&anomaly_title=${encodeURIComponent(anomaly.title)}`, { method: 'PUT' });
    } catch (e) {
      // ignore
    }
    setTriageIndex(prev => prev + 1);
  };

  const renderManagerView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-200 tracking-tight">Operational Intelligence</h2>
          <p className="text-[13px] text-[#666666] dark:text-[#a1a1aa] mt-1">{insights.summary || 'Algorithmic deductions based on review volume anomalies.'}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => { setTriageIndex(0); generateInsights(); }} isLoading={isGenerating}>Force AI Re-index</Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-xl shadow-sm overflow-hidden p-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-2"><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-24" /></div>
          </div>
        ) : insights.anomalies && triageIndex < insights.anomalies.length ? (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="mb-4">
              <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Insight {triageIndex + 1} of {insights.anomalies.length}</div>
              <div className={`text-[14px] font-medium font-mono mb-2 ${insights.anomalies[triageIndex].severity === 'High' ? 'text-red-500' : 'text-yellow-500'}`}>[{insights.anomalies[triageIndex].severity.toUpperCase()} SEVERITY]</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">{insights.anomalies[triageIndex].title}</h3>
              {insights.tasks[triageIndex] && (
                <p className="text-[14px] text-slate-600 dark:text-slate-400 mt-2">Recommended Action: {insights.tasks[triageIndex].task}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button size="sm" onClick={() => handleTriageAccept(insights.anomalies[triageIndex], insights.tasks[triageIndex])}>Accept & Create Task</Button>
              <Button size="sm" variant="secondary" onClick={() => handleTriageDismiss(insights.anomalies[triageIndex])}>Dismiss</Button>
            </div>
          </div>
        ) : (
          <EmptyState 
            title={insights.anomalies?.length > 0 ? "All Insights Triaged!" : "Operational Harmony"}
            description={insights.anomalies?.length > 0 ? "You've reviewed all AI-generated insights for now." : "No critical anomalies detected in recent guest feedback."}
          />
        )}
      </div>
    </div>
  );

  const renderOwnerView = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-200 tracking-tight">Strategic Insights</h2>
          <p className="text-[13px] text-[#666666] dark:text-[#a1a1aa] mt-1">AI-generated strategic analysis based on your review data.</p>
        </div>
        <Button size="sm" variant="secondary" onClick={generateInsights} isLoading={isGenerating}>Generate AI Insights</Button>
      </div>

      {/* Executive Summary */}
      {insights.summary && insights.summary !== 'No insights available yet.' && (
        <div className="bg-gradient-to-r from-primary-50/50 to-teal-50/50 dark:from-primary-900/10 dark:to-teal-900/10 border border-primary-100 dark:border-primary-800/30 rounded-xl p-5 shadow-sm">
          <div className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">Executive Summary</div>
          <p className="text-[14px] text-slate-800 dark:text-slate-200 leading-relaxed">{insights.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Anomalies & Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-[11px] font-semibold text-[#666666] dark:text-[#a1a1aa] uppercase tracking-wider">
              <div className="col-span-3">Severity</div>
              <div className="col-span-9">Finding & Recommended Action</div>
            </div>
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-start">
                    <div className="md:col-span-3"><Skeleton className="h-5 w-16" /></div>
                    <div className="md:col-span-9 space-y-2 w-full">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))
              ) : insights.anomalies.length > 0 ? insights.anomalies.map((s, i) => (
                <div key={i} className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-start group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                  <div className="md:col-span-3">
                    <div className={`text-[13px] font-medium font-mono ${s.severity === 'High' ? 'text-red-500' : s.severity === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>[{s.severity.toUpperCase()}]</div>
                  </div>
                  <div className="md:col-span-9 md:pr-8">
                    <div className="text-[14px] font-medium text-slate-900 dark:text-slate-200 mb-1">{s.title}</div>
                    {insights.tasks[i] && <div className="text-[13px] text-[#666666] dark:text-[#a1a1aa] leading-relaxed">Suggested: {insights.tasks[i].task}</div>}
                  </div>
                </div>
              )) : (
                <EmptyState 
                  title="No Insights Generated Yet"
                  description="Click 'Generate AI Insights' to analyze your review data and surface strategic findings."
                />
              )}
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="bg-black/[0.03] dark:bg-white/[0.03] rounded-xl p-6 border border-black/5 dark:border-white/5 space-y-6">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Anomalies Detected</div>
            <div className="text-[16px] font-medium text-slate-900 dark:text-slate-200">{insights.anomalies.length}</div>
            <div className="text-[12px] text-[#666666] dark:text-[#a1a1aa] mt-0.5">{insights.anomalies.filter(a => a.severity === 'High').length} High severity</div>
          </div>
          <div className="w-full h-px bg-black/10 dark:bg-white/10" />
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Action Items</div>
            <div className="text-[16px] font-medium text-slate-900 dark:text-slate-200">{insights.tasks.length}</div>
            <div className="text-[12px] text-[#666666] dark:text-[#a1a1aa] mt-0.5">AI-recommended tasks</div>
          </div>
          <div className="w-full h-px bg-black/10 dark:bg-white/10" />
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Pending Actions</div>
            <div className="text-[16px] font-medium text-slate-900 dark:text-slate-200">{actions.filter(a => a.status !== 'Done').length}</div>
            <div className="text-[12px] text-[#666666] dark:text-[#a1a1aa] mt-0.5">Across all operational tasks</div>
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
