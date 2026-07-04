import React from 'react';
import { Button } from './Button';

export const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction, actionLoading }) => (
  <div className="relative w-full py-16 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 flex items-center justify-center shadow-sm bg-white dark:bg-[#161b22]">
    <div className="relative z-10 text-center animate-in slide-in-from-bottom-2 fade-in duration-500">
      {Icon && <Icon className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-4" />}
      <h3 className="text-base font-semibold text-slate-900 dark:text-[#e6edf3]">{title}</h3>
      {description && <p className="text-[13px] text-slate-500 dark:text-[#8b949e] mt-1.5 max-w-sm mx-auto">{description}</p>}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="secondary" onClick={onAction} isLoading={actionLoading}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  </div>
);
