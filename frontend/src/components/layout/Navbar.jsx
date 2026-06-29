import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ui';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => `text-sm font-medium transition-colors ${isActive(path) ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`;

  return (
    <nav className="w-full h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] flex items-center px-6 lg:px-8 justify-between shrink-0">
      <div className="flex items-center gap-8">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <img src="/images/logo_emblem.png" alt="Logo" className="w-5 h-5 object-contain" />
          <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">SentiNaut</span>
        </Link>
        {!user && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className={linkClass('/about')}>About Us</Link>
          </div>
        )}
      </div>
      <div className="flex items-center gap-6">
        {user ? (
          <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Sign out</button>
        ) : (
          <Link to="/login" className={linkClass('/login')}>Authenticate</Link>
        )}
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
