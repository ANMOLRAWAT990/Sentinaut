import React from 'react';

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-[#161b22] border border-dashed border-slate-300 dark:border-[#30363d] rounded-xl">
      {icon && <div className="mb-4 text-slate-400 dark:text-[#8b949e]">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-[#e6edf3] mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-[#8b949e] mb-4 max-w-sm">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
