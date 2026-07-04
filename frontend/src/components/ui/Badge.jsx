import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const dots = {
    default: "bg-slate-500",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-500",
    primary: "bg-primary-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide bg-transparent border border-black/10 dark:border-white/10 text-slate-900 dark:text-slate-200 ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[variant] || dots.default}`} />
      {children}
    </span>
  );
}
