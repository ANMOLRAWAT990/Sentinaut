import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-[#30363d] bg-slate-50 dark:bg-[#0d1117] py-8 px-6 mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-slate-500 dark:text-[#8b949e]">
          © {new Date().getFullYear()} SentiNaut. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm text-slate-500 dark:text-[#8b949e]">
          <a href="#" className="hover:text-slate-900 dark:hover:text-[#e6edf3]">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-[#e6edf3]">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
