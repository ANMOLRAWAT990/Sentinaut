import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { Users, Building2, MessageSquare, ChevronDown, Activity, ShieldCheck, Trash2, Edit2, Plus } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export function AdminDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProps, setExpandedProps] = useState({});

  // Modals state
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propertyName, setPropertyName] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userName, setUserName] = useState('');
  
  // Create state for delete confirmation
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deletePropertyId, setDeletePropertyId] = useState(null);

  const fetchAdminData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      
      const [propRes, userRes, revRes] = await Promise.all([
        fetch(`${API_URL}/api/properties`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch(`${API_URL}/api/users`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
        fetch(`${API_URL}/api/reviews`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
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

  useEffect(() => {
    fetchAdminData();
  }, []);

  const toggleProp = (propName) => {
    setExpandedProps(prev => ({ ...prev, [propName]: !prev[propName] }));
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    setIsPropertyModalOpen(false);
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    try {
      if (editingProperty) {
        const res = await fetch(`${API_URL}/api/properties/${editingProperty.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ name: propertyName, location: propertyLocation })
        });
        if (res.ok) {
          const updatedProp = await res.json();
          setProperties(properties.map(p => p.id === updatedProp.id ? updatedProp : p));
          addToast('Property updated.', 'success');
          
          if (editingProperty.name === activeProperty && propertyName !== activeProperty && typeof setActiveProperty === 'function') {
            setActiveProperty(propertyName);
          }
          
          window.dispatchEvent(new Event('propertiesUpdated'));
        } else {
          addToast('Failed to update property.', 'error');
        }
      } else {
        const res = await fetch(`${API_URL}/api/properties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ name: propertyName, location: propertyLocation, status: 'Active', owner_email: 'admin@sentinaut.com' })
        });
        if (res.ok) {
          const newProp = await res.json();
          setProperties([...properties, newProp]);
          addToast('Property created.', 'success');
          window.dispatchEvent(new Event('propertiesUpdated'));
        } else {
          addToast('Failed to create property.', 'error');
        }
      }
    } catch (err) {
      addToast('Network error.', 'error');
    }
  };

  const handleDeleteProperty = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    try {
      const res = await fetch(`${API_URL}/api/properties/${deletePropertyId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (res.ok) {
        setProperties(properties.filter(p => p.id !== deletePropertyId));
        addToast('Property deleted.', 'success');
        window.dispatchEvent(new Event('propertiesUpdated'));
      } else {
        addToast('Failed to delete property.', 'error');
      }
    } catch (err) {
      addToast('Network error.', 'error');
    } finally {
      setDeletePropertyId(null);
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsUserModalOpen(false);
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    try {
      const res = await fetch(`${API_URL}/api/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ name: userName }) 
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        addToast('User updated.', 'success');
      } else {
        addToast('Failed to update user.', 'error');
      }
    } catch (err) {
      addToast('Network error.', 'error');
    }
  };

  const handleDeleteUser = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    try {
      const res = await fetch(`${API_URL}/api/users/${deleteUserId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== deleteUserId));
        addToast('User deleted.', 'success');
      } else {
        addToast('Failed to delete user.', 'error');
      }
    } catch (err) {
      addToast('Network error.', 'error');
    } finally {
      setDeleteUserId(null);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    try {
      const res = await fetch(`${API_URL}/api/reviews/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
        addToast('Review deleted.', 'success');
      } else {
        addToast('Failed to delete review.', 'error');
      }
    } catch (err) {
      addToast('Network error.', 'error');
    }
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
        <Button onClick={() => { setEditingProperty(null); setPropertyName(''); setPropertyLocation(''); setIsPropertyModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
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
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Reviews</p>
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
                    <div className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleProp(prop.name)}>
                        <div className={`p-2 rounded-lg ${prop.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{prop.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant={prop.is_active ? "success" : "secondary"}>
                              {prop.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                              {prop.plan === 'boutique' || prop.plan === 'single' ? 'Single-Property' : prop.plan === 'resort' || prop.plan === 'multi' ? 'Multi-Property' : prop.plan} Plan
                            </span>
                            <span className="text-xs text-slate-400">&bull; {prop.location || 'No Location'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => { setEditingProperty(prop); setPropertyName(prop.name); setPropertyLocation(prop.location); setIsPropertyModalOpen(true); }}>
                            <Edit2 className="w-4 h-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20" onClick={() => setDeletePropertyId(prop.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="text-right mr-2 cursor-pointer" onClick={() => toggleProp(prop.name)}>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{propUsers.length}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wider">Staff</p>
                        </div>
                        <div className={`transition-transform duration-300 cursor-pointer ${isExpanded ? 'rotate-180' : ''}`} onClick={() => toggleProp(prop.name)}>
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
                              <div key={u.id} className="flex items-center justify-between bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 uppercase">
                                    {u.initials || u.name?.charAt(0) || 'U'}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{u.name}</p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                                      <Badge variant={u.role === 'owner' ? 'primary' : u.role === 'manager' ? 'warning' : 'secondary'} className="text-[10px] leading-none py-0.5">
                                        {u.role}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                {u.role !== 'admin' && (
                                  <div className="flex gap-1 shrink-0 ml-2">
                                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 transition-colors" onClick={() => { setEditingUser(u); setUserName(u.name); setIsUserModalOpen(true); }}>
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-400 hover:text-red-600 transition-colors" onClick={() => setDeleteUserId(u.id)}>
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
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
                  <div key={review.id} className="pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0 relative group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {review.property}
                        </span>
                        <span className="text-xs text-slate-400">{review.platform}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDeleteReview(review.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <Badge variant={review.sentiment === 'Positive' ? 'success' : review.sentiment === 'Negative' ? 'danger' : 'secondary'} className="text-[10px]">
                          {review.sentiment}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed mb-2 pr-6">
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

      {/* Modals */}
      <Modal isOpen={isPropertyModalOpen} onClose={() => setIsPropertyModalOpen(false)} title={editingProperty ? "Edit Property" : "Add Property"}>
        <form onSubmit={handleSaveProperty} className="space-y-4">
          <Input label="Property Name" required value={propertyName} onChange={(e) => setPropertyName(e.target.value)} />
          <Input label="Location" required value={propertyLocation} onChange={(e) => setPropertyLocation(e.target.value)} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsPropertyModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Edit User">
        <form onSubmit={handleSaveUser} className="space-y-4">
          <Input label="Full Name" required value={userName} onChange={(e) => setUserName(e.target.value)} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deletePropertyId} onClose={() => setDeletePropertyId(null)} title="Delete Property">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">Are you sure you want to delete this property? This action will hide it from active views.</p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setDeletePropertyId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteProperty}>Delete Property</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteUserId} onClose={() => setDeleteUserId(null)} title="Delete User">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">Are you sure you want to deactivate this user? They will lose access to the system.</p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setDeleteUserId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteUser}>Deactivate User</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
