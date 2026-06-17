import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: "bg-slate-100 text-slate-800 dark:bg-[#21262d] dark:text-[#e6edf3] dark:border dark:border-[#30363d]",
    success: "bg-green-100 text-green-800 dark:bg-[#161b22] dark:text-[#3fb950] dark:border dark:border-[#30363d]",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-[#161b22] dark:text-[#d29922] dark:border dark:border-[#30363d]",
    danger: "bg-red-100 text-red-800 dark:bg-[#161b22] dark:text-[#f85149] dark:border dark:border-[#30363d]",
    primary: "bg-blue-100 text-blue-800 dark:bg-[#161b22] dark:text-[#58a6ff] dark:border dark:border-[#30363d]",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
