import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white dark:bg-[#09090b] border border-black/10 dark:border-white/10 rounded-none shadow-none transition-shadow duration-300 hover:border-black/30 dark:hover:border-white/30 ${className}`} {...props}>
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
