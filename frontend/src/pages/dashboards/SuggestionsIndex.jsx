import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export function SuggestionsIndex() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleComingSoon = () => addToast('This functionality is currently locked in your environment.', 'info');

  const renderStaffView = () => (
    <div className="space-y-6">
      <div className="border border-black/10 dark:border-white/10 rounded-xl p-6 bg-black/[0.02] dark:bg-white/[0.02]">
        <h3 className="text-[14px] font-semibold text-[#111111] dark:text-[#ededed]">Operational Directive</h3>
        <p className="text-[13px] text-[#666666] dark:text-[#a1a1aa] mt-1">Execute the following tasks dispatched by the anomaly engine.</p>
      </div>
      <div className="space-y-2">
        {[
          { task: 'Inspect HVAC filter block in Room 302', priority: 'High', due: 'Immediate' },
          { task: 'Restock auxiliary towels in primary pool sector', priority: 'Medium', due: 'Next Shift' }
        ].map((t, i) => (
          <div key={i} className="bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-lg p-4 flex items-center justify-between group hover:border-black/20 dark:hover:border-white/20 transition-colors">
            <div>
              <p className="text-[14px] font-medium text-[#111111] dark:text-[#ededed]">{t.task}</p>
              <div className="flex gap-3 mt-1 text-[11px] font-mono text-[#888888]">
                <span>{t.priority} Priority</span>
                <span>•</span>
                <span>Due: {t.due}</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleComingSoon} className="h-8 text-[12px]">Mark Executed</Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderManagerView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#111111] dark:text-[#ededed] tracking-tight">Operational Intelligence</h2>
          <p className="text-[13px] text-[#666666] dark:text-[#a1a1aa] mt-1">Algorithmic deductions based on review volume anomalies.</p>
        </div>
        <Button size="sm" variant="secondary" onClick={handleComingSoon}>Force Re-index</Button>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-[11px] font-semibold text-[#666666] dark:text-[#a1a1aa] uppercase tracking-wider">
          <div className="col-span-3">Anomaly ID</div>
          <div className="col-span-7">Deduction & Recommended Action</div>
          <div className="col-span-2 text-right">Confidence</div>
        </div>
        
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {[
            { id: 'ANM-492', title: 'HVAC Maintenance Deterioration', desc: '3 negative reviews mention AC issues on the 3rd floor in 48h. Suggest scheduling preventative maintenance for rooms 301-310 immediately.', conf: '94%' },
            { id: 'ANM-481', title: 'Breakfast Peak Overcrowding', desc: 'Sustained complaints regarding wait times between 08:30-09:00. Recommend staggering slots or dynamic staffing.', conf: '88%' },
            { id: 'ANM-477', title: 'Memory Foam Preference', desc: 'Statistically significant praise for new pillows. Recommend highlighting in primary marketing copy.', conf: '96%' }
          ].map((s, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 items-start group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
              <div className="col-span-3">
                <div className="text-[13px] font-medium text-[#111111] dark:text-[#ededed] font-mono">{s.id}</div>
              </div>
              <div className="col-span-7 pr-8">
                <div className="text-[14px] font-medium text-[#111111] dark:text-[#ededed] mb-1">{s.title}</div>
                <div className="text-[13px] text-[#666666] dark:text-[#a1a1aa] leading-relaxed mb-3">{s.desc}</div>
                <Button size="sm" variant="secondary" className="text-[12px] h-7 px-3" onClick={handleComingSoon}>Initialize Task</Button>
              </div>
              <div className="col-span-2 text-right text-[13px] font-mono text-[#666666] dark:text-[#a1a1aa]">{s.conf}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOwnerView = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#111111] dark:text-[#ededed] tracking-tight">Strategic Thesis</h2>
        <p className="text-[13px] text-[#666666] dark:text-[#a1a1aa] mt-1">Aggregated market positioning against competitor baselines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[14px] font-semibold text-[#111111] dark:text-[#ededed]">Q3 Market Opportunity</h3>
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
            <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-1">Primary Accolade</div>
            <div className="text-[16px] font-medium text-[#111111] dark:text-[#ededed]">Cleanliness Standard</div>
            <div className="text-[12px] text-[#666666] dark:text-[#a1a1aa] mt-0.5">Present in 42% of positive vectors</div>
          </div>
          <div className="w-full h-px bg-black/10 dark:bg-white/10" />
          <div>
            <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-1">Primary Friction</div>
            <div className="text-[16px] font-medium text-[#111111] dark:text-[#ededed]">Acoustic Bleed</div>
            <div className="text-[12px] text-[#666666] dark:text-[#a1a1aa] mt-0.5">Present in 18% of negative vectors</div>
          </div>
          <div className="w-full h-px bg-black/10 dark:bg-white/10" />
          <div>
            <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-1">Task ROI Engine</div>
            <div className="text-[16px] font-medium text-[#111111] dark:text-[#ededed]">84% Efficiency</div>
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
