import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { Users, Building2, MessageSquare, ChevronDown, Activity, ShieldCheck } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export function AdminDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProps, setExpandedProps] = useState({});

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        
        const [propRes, userRes, revRes] = await Promise.all([
          fetch(`${API_URL}/api/properties`),
          fetch(`${API_URL}/api/users`),
          fetch(`${API_URL}/api/reviews`)
        ]);

        const [propData, userData, revData] = await Promise.all([
          propRes.json(),
          userRes.json(),
          revRes.json()
        ]);

        setProperties(propData || []);
        setUsers(userData || []);
        setReviews(revData || []);
      } catch (e) {
        console.error("Admin fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const toggleProp = (propName) => {
    setExpandedProps(prev => ({ ...prev, [propName]: !prev[propName] }));
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-[400px] rounded-2xl mt-8" />
      </div>
    );
  }

  const activeProperties = properties.filter(p => p.is_active);
  const totalUsers = users.length;
  const totalReviews = reviews.length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-serif text-slate-900 dark:text-white">System Core</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Global Overview & Access Control</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-100 dark:border-blue-900/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Hotels</p>
              <h2 className="text-4xl font-light text-slate-900 dark:text-white">{activeProperties.length}</h2>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-100 dark:border-emerald-900/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Users</p>
              <h2 className="text-4xl font-light text-slate-900 dark:text-white">{totalUsers}</h2>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20 border-purple-100 dark:border-purple-900/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Reviews Processed</p>
              <h2 className="text-4xl font-light text-slate-900 dark:text-white">{totalReviews}</h2>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
              <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Systematic grouping: Properties and their Users */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-serif text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            Hotel Directory & Personnel
          </h2>
          
          <div className="space-y-4">
            {properties.length === 0 ? (
              <EmptyState icon={<Building2 />} title="No Hotels Found" description="The system currently has no registered properties." />
            ) : (
              properties.map(prop => {
                const propUsers = users.filter(u => u.property === prop.name);
                const isExpanded = expandedProps[prop.name];
                
                return (
                  <Card key={prop.id} className="overflow-hidden transition-all duration-200">
                    <div 
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      onClick={() => toggleProp(prop.name)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${prop.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{prop.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant={prop.is_active ? "success" : "secondary"}>
                              {prop.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{prop.plan} Plan</span>
                            <span className="text-xs text-slate-400">&bull; {prop.location || 'No Location'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{propUsers.length}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wider">Staff</p>
                        </div>
                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 p-5 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Assigned Personnel</h4>
                          <span className="text-xs text-slate-400">{prop.owner_email} (Owner)</span>
                        </div>
                        
                        {propUsers.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {propUsers.map(u => (
                              <div key={u.id} className="flex items-center gap-3 bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 uppercase">
                                  {u.initials || u.name?.charAt(0) || 'U'}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{u.name}</p>
                                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                                </div>
                                <Badge variant={u.role === 'owner' ? 'primary' : u.role === 'manager' ? 'warning' : 'secondary'} className="text-[10px]">
                                  {u.role}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 italic">No users assigned to this property yet.</p>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Global Reviews Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            Global Review Stream
          </h2>
          <Card className="p-5">
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.length === 0 ? (
                <EmptyState icon={<MessageSquare />} title="No Reviews" description="No reviews have been ingested yet." />
              ) : (
                reviews.slice(0, 50).map(review => (
                  <div key={review.id} className="pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {review.property}
                        </span>
                        <span className="text-xs text-slate-400">{review.platform}</span>
                      </div>
                      <Badge variant={review.sentiment === 'Positive' ? 'success' : review.sentiment === 'Negative' ? 'danger' : 'secondary'} className="text-[10px]">
                        {review.sentiment}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed mb-2">
                      "{review.text}"
                    </p>
                    <p className="text-xs text-slate-400">By {review.guestName} &bull; {new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
            {reviews.length > 50 && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Showing 50 most recent</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
