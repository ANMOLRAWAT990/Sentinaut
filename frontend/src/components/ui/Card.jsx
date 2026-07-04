import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-600 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-8 pt-8 pb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-xl font-serif text-slate-900 dark:text-white tracking-tight ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}
