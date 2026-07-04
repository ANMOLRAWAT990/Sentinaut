import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = React.forwardRef(({ label, error, className = '', id, type = 'text', ...props }, ref) => {
  const inputId = id || React.useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordInput = type === 'password';
  const inputType = isPasswordInput ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label htmlFor={inputId} className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={`h-12 w-full rounded-none bg-transparent border-b border-black/20 dark:border-white/20 px-0 text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 focus:border-black dark:focus:border-white ${error ? '!border-red-500' : ''} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${isPasswordInput ? 'pr-10' : ''}`}
          {...props}
        />
        {isPasswordInput && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <span className="text-[12px] text-red-500">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
