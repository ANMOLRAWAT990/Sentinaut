import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, MessageSquare, Lightbulb, ClipboardList, BarChart3, Users, Settings } from 'lucide-react';

export function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = React.useState('trial');

  React.useEffect(() => {
    const fetchPlan = () => {
      if (!user) return;
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const endpoint = user.role === 'owner' 
        ? `${API_URL}/api/properties?owner_email=${encodeURIComponent(user.email)}`
        : `${API_URL}/api/properties`;
      fetch(endpoint)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            if (user.role === 'owner') {
              const upgraded = data.find(p => p.plan && p.plan !== 'trial');
              setCurrentPlan(upgraded ? upgraded.plan : (data[0]?.plan || 'trial'));
            } else {
              const prop = data.find(p => p.name === user.property);
              setCurrentPlan(prop?.plan || 'trial');
            }
          }
        }).catch(() => {});
    };
    fetchPlan();
    const interval = setInterval(fetchPlan, 15000);
    return () => clearInterval(interval);
  }, [user]);
  
  const getLinksByRole = () => {
    if (!user) return [];
    switch (user.role) {
      case 'owner':
        return [
          { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
          { name: 'Analytics', path: '/dashboard/reviews', icon: <BarChart3 className="h-4 w-4" /> },
          { name: 'Guest CRM', path: '/dashboard/guests', icon: <Users className="h-4 w-4" /> },
          { name: 'Strategic Insights', path: '/dashboard/suggestions', icon: <Lightbulb className="h-4 w-4" /> },
        ];
      case 'manager':
        return [
          { name: 'Action Board', path: '/dashboard', icon: <ClipboardList className="h-4 w-4" /> },
          { name: 'Review Queue', path: '/dashboard/reviews', icon: <MessageSquare className="h-4 w-4" /> },
          { name: 'Guest CRM', path: '/dashboard/guests', icon: <Users className="h-4 w-4" /> },
          { name: 'Operational Intel', path: '/dashboard/suggestions', icon: <Lightbulb className="h-4 w-4" /> },
        ];
      case 'staff':
      default:
        return [
          { name: 'Review Input', path: '/dashboard', icon: <MessageSquare className="h-4 w-4" /> },
          { name: 'My Tasks', path: '/dashboard/suggestions', icon: <ClipboardList className="h-4 w-4" /> },
          { name: 'My Submissions', path: '/dashboard/reviews', icon: <Users className="h-4 w-4" /> },
        ];
    }
  };

  const links = getLinksByRole();

  return (
    <aside className="w-64 border-r border-black/10 dark:border-white/10 bg-white dark:bg-[#000000] hidden md:flex flex-col h-full shrink-0">
      <div className="flex-1 py-6 px-4">
        {/* Role badge */}
        <div className="mb-8 px-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#666666] dark:text-[#a1a1aa]">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            {user?.role} Access
          </span>
        </div>

        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-md transition-all duration-150 ${
                  isActive
                    ? 'bg-black/5 text-slate-900 dark:bg-white/10 dark:text-slate-200'
                    : 'text-[#666666] hover:text-slate-900 hover:bg-black/5 dark:text-[#a1a1aa] dark:hover:bg-white/5 dark:hover:text-slate-200'
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Plan Chip */}
      <div className="mx-2 mb-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary-600/10 via-blue-600/10 to-indigo-600/10 dark:from-primary-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 border border-primary-600/20 dark:border-primary-500/20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${currentPlan === 'resort' ? 'bg-purple-500 animate-pulse' : currentPlan === 'boutique' ? 'bg-blue-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-800 dark:text-slate-200 truncate">
            {currentPlan === 'resort' ? 'Resort Plan' : currentPlan === 'boutique' ? 'Boutique Plan' : 'Trial Plan'}
          </span>
        </div>
        {user?.role === 'owner' && currentPlan === 'trial' && (
          <button 
            onClick={(e) => { e.stopPropagation(); navigate('/pricing'); }}
            className="text-[10px] font-extrabold uppercase tracking-wider bg-primary-600 hover:bg-primary-700 text-white px-2 py-0.5 rounded shadow-sm transition-all shrink-0 ml-1"
          >
            Upgrade
          </button>
        )}
      </div>

      {/* User info */}
      <div 
        onClick={() => navigate('/dashboard/settings')}
        className="p-4 border-t border-black/10 dark:border-white/10 mx-2 mb-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group relative"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#111] dark:bg-white flex items-center justify-center text-white dark:text-[#111] font-semibold text-[11px] uppercase border border-black/5 dark:border-white/5">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-[#111] dark:text-[#eee] capitalize truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] font-medium text-[#888] dark:text-[#888] uppercase tracking-wide truncate">{user?.email || 'user@example.com'}</p>
          </div>
          <Settings className="h-4 w-4 text-[#888] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </aside>
  );
}
