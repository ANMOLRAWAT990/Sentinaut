import React from 'react';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover dark:bg-[#1f6feb] dark:text-[#ffffff] dark:hover:bg-[#1f6feb]/90',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-transparent dark:border dark:border-[#30363d] dark:text-[#8b949e] dark:hover:bg-[#21262d] dark:hover:text-[#e6edf3]',
  outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-[#30363d] dark:text-[#e6edf3] dark:hover:bg-[#21262d]'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
