import React from 'react';

export const Input = React.forwardRef(({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || React.useId();

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-[#e6edf3]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-3 py-2 border rounded-md shadow-sm dark:shadow-none bg-white dark:bg-[#0d1117] text-gray-900 dark:text-[#e6edf3] dark:placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:border-[#30363d] dark:focus:border-[#58a6ff] dark:focus:ring-[#58a6ff]
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-[#f85149] dark:focus:border-[#f85149] dark:focus:ring-[#f85149]' : 'border-gray-300'}
          ${props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-[#161b22]' : ''}
        `}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500 dark:text-[#f85149]">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
