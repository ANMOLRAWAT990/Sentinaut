import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ui';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-[#30363d] bg-white/80 dark:bg-[#161b22]/80 px-6 backdrop-blur-md transition-colors">
      <div className="flex items-center gap-2">
        <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#e6edf3]">
          Senti<span className="text-blue-600 dark:text-[#58a6ff]">Naut</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-[#8b949e] hover:text-blue-600 dark:hover:text-[#58a6ff]">About</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="text-sm font-medium text-slate-600 dark:text-[#8b949e] hover:text-blue-600 dark:hover:text-[#58a6ff]">Dashboard</Link>
            <button onClick={handleLogout} className="text-sm font-medium text-blue-600 dark:text-[#58a6ff] hover:text-blue-700 dark:hover:text-[#58a6ff]">Log out</button>
          </>
        ) : (
          <Link to="/login" className="text-sm font-medium text-blue-600 dark:text-[#58a6ff] hover:text-blue-700 dark:hover:text-[#58a6ff]">Log in</Link>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
