import React from 'react';

const variants = {
  primary: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-200 border border-slate-900 dark:border-white shadow-none',
  secondary: 'bg-transparent border border-black/20 dark:border-white/20 text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 shadow-none',
  ghost: 'bg-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
};

const sizes = {
  sm: 'h-10 px-4 text-[10px]',
  md: 'h-12 px-6 text-[12px]',
  lg: 'h-14 px-8 text-[13px]'
};

export const Button = ({ variant = 'primary', size = 'md', disabled, className = '', children, type = 'button', ...props }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold uppercase tracking-[0.2em] rounded-none transition-all duration-300 ease-out active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
