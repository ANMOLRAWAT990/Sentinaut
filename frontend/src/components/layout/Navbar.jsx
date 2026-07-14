import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { Bell, MapPin } from 'lucide-react';

export function Navbar() {
  const { user, logout, activeProperty, setActiveProperty } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  
  const notifRef = useRef(null);

  useEffect(() => {
    if (user) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      if (user.role === 'owner') {
        fetch(`${API_URL}/api/properties?owner_email=${user.email}`)
          .then(r => r.json())
          .then(data => {
             setProperties(data);
             if (data.length > 0) {
               const propExists = data.some(p => p.name === activeProperty);
               if (!activeProperty || !propExists) {
                 setActiveProperty(data[0].name);
               }
             }
          }).catch(err => console.error(err));
      }
      
      const fetchNotifs = () => {
         const propQuery = activeProperty || user.property || 'Unassigned';
         fetch(`${API_URL}/api/notifications?property=${propQuery}`)
          .then(r => {
            if (!r.ok) throw new Error("Network response was not ok");
            return r.json();
          })
          .then(data => {
            setNotifications(data);
            setIsOffline(false);
          })
          .catch(err => {
            if (!isOffline) {
              console.error("Polling failed:", err);
              setIsOffline(true);
            }
          });
      };
      
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 10000); // 10 seconds for demo
      return () => clearInterval(interval);
    }
  }, [user, activeProperty]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if(notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markRead = async (id) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    await fetch(`${API_URL}/api/notifications/${id}/read`, { method: 'PUT' });
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => `text-sm font-medium transition-colors ${isActive(path) ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`;
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getPageName = () => {
    if (location.pathname === '/dashboard') {
      return user?.role === 'owner' ? 'Executive Dashboard' : user?.role === 'manager' ? 'Command Center' : 'Staff Workspace';
    }
    if (location.pathname === '/suggestions') return 'AI Insights';
    if (location.pathname === '/reviews') return 'Guest Reviews';
    if (location.pathname === '/guests') return 'Guest CRM';
    if (location.pathname === '/settings') return 'Platform Settings';
    return '';
  };
  const pageName = getPageName();

  return (
    <nav className="w-full h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center px-6 lg:px-8 justify-between shrink-0">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <img src="/images/logo_emblem.png" alt="Logo" className="w-5 h-5 object-contain" />
            <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">SentiNaut</span>
          </Link>
          {user && (
            <div className="hidden sm:flex items-center gap-3 text-[13px]">
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {user.role === 'owner' ? (activeProperty || 'Portfolio') : (user.property || 'Property')}
              </span>
              {pageName && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <span className="text-slate-900 dark:text-slate-200 font-medium">{pageName}</span>
                </>
              )}
            </div>
          )}
        </div>
        {!user && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className={linkClass('/about')}>About Us</Link>
          </div>
        )}
      </div>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            {isOffline && (
              <span className="text-xs font-medium text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">Offline</span>
            )}
            {user.role === 'owner' && properties.length > 0 && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <select 
                  value={activeProperty}
                  onChange={(e) => setActiveProperty(e.target.value)}
                  className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                >
                  {properties.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            )}
            
            <div className="relative" ref={notifRef}>
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} onClick={() => !n.is_read && markRead(n.id)} className={`p-3 border-b border-slate-100 dark:border-slate-800/50 cursor-pointer ${n.is_read ? 'opacity-60' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}>
                          <p className="text-sm text-slate-800 dark:text-slate-200">{n.message}</p>
                          <span className="text-xs text-slate-400">{new Date(n.created_at).toLocaleTimeString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Sign out</button>
          </>
        ) : (
          <Link to="/login" className={linkClass('/login')}>Authenticate</Link>
        )}
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
