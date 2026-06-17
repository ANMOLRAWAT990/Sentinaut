import React from 'react';
import { NavLink } from 'react-router-dom';

export function Sidebar() {
  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Reviews', path: '/dashboard/reviews' },
    { name: 'Suggestions', path: '/dashboard/suggestions' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] hidden md:flex flex-col h-full">
      <div className="flex-1 py-6 px-4">
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-[#1f6feb]/20 dark:text-[#58a6ff]'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-[#8b949e] dark:hover:bg-[#21262d] dark:hover:text-[#e6edf3]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-200 dark:border-[#30363d]">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-[#30363d]"></div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-700 dark:text-[#e6edf3]">User</p>
            <p className="text-xs font-medium text-slate-500 dark:text-[#8b949e] group-hover:text-slate-700 dark:group-hover:text-[#e6edf3]">View profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
