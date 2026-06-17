import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white dark:bg-[#161b22] rounded-xl border border-slate-200 dark:border-[#30363d] shadow-sm dark:shadow-none overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 py-4 border-b border-slate-100 dark:border-[#30363d] ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg font-semibold text-slate-900 dark:text-[#e6edf3] ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
