import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const dots = {
    default: "bg-[#888888]",
    success: "bg-[#2ea043]",
    warning: "bg-[#d29922]",
    danger: "bg-[#f85149]",
    primary: "bg-[#58a6ff]",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide bg-transparent border border-black/10 dark:border-white/10 text-[#111111] dark:text-[#ededed] ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[variant] || dots.default}`} />
      {children}
    </span>
  );
}
