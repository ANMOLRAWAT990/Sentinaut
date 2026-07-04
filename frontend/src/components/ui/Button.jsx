import React from 'react';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 border border-transparent shadow-sm',
  secondary: 'bg-transparent border border-black/20 dark:border-white/20 text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 shadow-none',
  ghost: 'bg-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
};

const sizes = {
  sm: 'h-10 px-4 text-[10px]',
  md: 'h-12 px-6 text-[12px]',
  lg: 'h-14 px-8 text-[13px]'
};

export const Button = ({ variant = 'primary', size = 'md', disabled, isLoading, className = '', children, type = 'button', ...props }) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-semibold uppercase tracking-[0.2em] rounded-none transition-all duration-300 ease-out active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};
