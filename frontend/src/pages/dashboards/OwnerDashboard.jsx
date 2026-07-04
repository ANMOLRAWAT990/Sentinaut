import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function OwnerDashboard() {
  const { user, activeProperty } = useAuth();
  const [dateRange, setDateRange] = useState('7days');
  const [analyticsData, setAnalyticsData] = useState(null);
  const { addToast } = useToast();
  
  const [properties, setProperties] = useState([]);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [propertyName, setPropertyName] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  
  const [managers, setManagers] = useState([]);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [managerEmail, setManagerEmail] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');

  // Feature 1: Competitor Mock State
  const [competitorScores] = useState({
    own: 8.6,
    compA: 8.2,
    compB: 7.9
  });
  const [competitorSummary, setCompetitorSummary] = useState("Loading competitor benchmarking data...");
  const [isRefreshingComps, setIsRefreshingComps] = useState(false);

  useEffect(() => {
    if (!user) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    
    const fetchData = () => {
      const propQuery = activeProperty ? `&property=${activeProperty}` : '';
      Promise.all([
        fetch(`${API_URL}/api/properties?owner_email=${user.email}`).then(res => res.json()),
        fetch(`${API_URL}/api/users?role=manager&owner_email=${user.email}`).then(res => res.json()),
        fetch(`${API_URL}/api/analytics?owner_email=${user.email}${propQuery}`).then(res => res.json()),
        fetch(`${API_URL}/api/competitors/summary?property=${activeProperty || 'Unassigned'}`).then(res => res.json()).catch(() => ({}))
      ]).then(([propsData, managersData, analyticsRes, compRes]) => {
        if (Array.isArray(propsData)) setProperties(propsData);
        if (Array.isArray(managersData)) setManagers(managersData);
        if (analyticsRes) setAnalyticsData(analyticsRes);
        if (compRes?.summary) setCompetitorSummary(compRes.summary);
      }).catch(err => console.error("Failed to load owner data:", err));
    };

    fetchData();
    // Feature 26: Auto-Polling
    const interval = setInterval(fetchData, 15000); 
    return () => clearInterval(interval);
  }, [user, activeProperty]);

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setIsPropertyModalOpen(false);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: propertyName, location: propertyLocation, status: 'Active', owner_email: user?.email })
      });
      
      if (res.ok) {
        const newProp = await res.json();
        setProperties([...properties, newProp]);
        addToast(`${propertyName} has been registered successfully.`, 'success');
      } else {
        addToast('Failed to register property.', 'error');
      }
    } catch (err) {
      addToast('Network error while registering property.', 'error');
    }
    
    setPropertyName('');
    setPropertyLocation('');
  };

  const handleInviteManager = async (e) => {
    e.preventDefault();
    setIsManagerModalOpen(false);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'Invited Manager', 
          email: managerEmail, 
          password: 'password123', 
          role: 'manager',
          property: selectedProperty || properties[0]?.name || 'Unassigned'
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setManagers([...managers, data.user]);
        addToast(`Manager account created! They can login with password: password123`, 'success');
      } else {
        const data = await res.json();
        addToast(data.detail || 'Failed to create manager account.', 'error');
      }
    } catch (err) {
      addToast('Network error while inviting manager.', 'error');
    }
    
    setManagerEmail('');
    setSelectedProperty('');
  };

  const refreshCompetitors = async () => {
    setIsRefreshingComps(true);
    addToast("Fetching latest OTA scores and generating AI benchmark...", "info");
    try {
      const res = await fetch(`http://localhost:8000/api/competitors/refresh?property=${activeProperty || 'Unassigned'}`, {method: 'POST'});
      if (res.ok) {
        const data = await res.json();
        setCompetitorSummary(data.summary);
        addToast("Competitor benchmark updated.", "success");
      } else {
        const data = await res.json();
        addToast(data.detail || "Failed to refresh", "error");
      }
    } catch(e) {
      addToast("Failed to connect to API", "error");
    } finally {
      setIsRefreshingComps(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6 border border-black/10 dark:border-white/10 shadow-sm animate-in fade-in duration-500">
        <img src="/images/owner_header.png" alt="Resort Header" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
          <h1 className="text-[28px] font-semibold tracking-tight">Executive Dashboard</h1>
          <p className="text-white/80 mt-1 max-w-lg text-[14px]">High-level metrics, trends, and market positioning for {activeProperty || 'All Properties'}.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-sm font-medium text-slate-500">
          <span className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Live Polling Active (15s)
          </span>
        </div>
        <select 
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border border-slate-200 dark:border-[#30363d] rounded-md px-3 py-1.5 text-sm text-slate-700 dark:text-[#e6edf3] bg-white dark:bg-[#161b22] focus:ring-2 focus:ring-blue-500"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 dark:text-[#8b949e]">Overall Health Score</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-[#e6edf3]">{analyticsData?.healthScore || '0.0'}</span>
              <span className={`text-sm ${analyticsData?.periodOverPeriod >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {analyticsData?.periodOverPeriod > 0 ? '+' : ''}{analyticsData?.periodOverPeriod || 0}% PoP
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 dark:text-[#8b949e]">Total Reviews Analyzed</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-[#e6edf3]">{analyticsData?.totalReviews || 0}</span>
              <span className="text-sm text-slate-500 dark:text-[#8b949e]">SLA: {analyticsData?.managerSLA || '0h'}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 dark:text-[#8b949e]">Positive Sentiment</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-[#e6edf3]">{analyticsData?.positiveSentimentPct || 0}%</span>
              <span className="text-sm text-blue-600 dark:text-blue-400">Conv: {analyticsData?.conversionRate || '0%'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sentiment Trend ({dateRange === '7days' ? 'Last 7 Days' : 'Last 30 Days'})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData?.chartData?.[dateRange] || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Competitor Benchmarking */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle>Competitor Benchmark</CardTitle>
            <Button size="sm" variant="outline" onClick={refreshCompetitors} disabled={isRefreshingComps}>Refresh</Button>
          </CardHeader>
          <CardContent>
            <div className={`space-y-5 transition-opacity ${isRefreshingComps ? 'opacity-50' : 'opacity-100'}`}>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-900 dark:text-[#e6edf3]">{activeProperty || 'Your Property'}</span>
                  <span className="text-blue-600 font-bold">{competitorScores.own}/10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#21262d] rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(competitorScores.own / 10) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-[#8b949e]">Competitor A</span>
                  <span className="font-medium text-slate-900 dark:text-[#e6edf3]">{competitorScores.compA}/10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#21262d] rounded-full h-2">
                  <div className="bg-slate-400 h-2 rounded-full" style={{ width: `${(competitorScores.compA / 10) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-[#8b949e]">Competitor B</span>
                  <span className="font-medium text-slate-900 dark:text-[#e6edf3]">{competitorScores.compB}/10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#21262d] rounded-full h-2">
                  <div className="bg-slate-400 h-2 rounded-full" style={{ width: `${(competitorScores.compB / 10) * 100}%` }}></div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-[#30363d] space-y-2">
                <p className="text-sm font-medium text-slate-800 dark:text-[#e6edf3]">AI Strategic Summary:</p>
                <p className="text-xs text-slate-500 dark:text-[#8b949e] leading-relaxed">{competitorSummary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-black/10 dark:border-white/10">
        <Card>
          <CardHeader>
            <CardTitle>Property Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.map(p => (
                <div key={p.id} className="flex items-center gap-4 bg-slate-50 dark:bg-[#161b22] p-3 rounded-lg border border-slate-200 dark:border-[#30363d]">
                  <img src="/images/resort_thumb.png" alt="Resort" className="w-16 h-16 rounded object-cover" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-[#e6edf3]">{p.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-[#8b949e]">{p.location}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">{p.status}</span>
                </div>
              ))}
              <button 
                onClick={() => setIsPropertyModalOpen(true)}
                className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-[#30363d] rounded-lg text-sm font-medium text-slate-500 dark:text-[#8b949e] hover:bg-slate-50 dark:hover:bg-[#161b22] transition-colors"
              >
                + Add New Property
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Management (Managers)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {managers.map(m => (
                <div key={m.id} className="flex items-center justify-between bg-slate-50 dark:bg-[#161b22] p-3 rounded-lg border border-slate-200 dark:border-[#30363d]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{m.initials}</div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-[#e6edf3]">{m.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-[#8b949e]">{m.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{m.property}</span>
                </div>
              ))}
              <button 
                onClick={() => setIsManagerModalOpen(true)}
                className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-[#30363d] rounded-lg text-sm font-medium text-slate-500 dark:text-[#8b949e] hover:bg-slate-50 dark:hover:bg-[#161b22] transition-colors"
              >
                + Invite Manager
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={isPropertyModalOpen} onClose={() => setIsPropertyModalOpen(false)} title="Register New Property">
        <form onSubmit={handleAddProperty} className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Register a new resort or hotel property to your SentiNaut portfolio.
          </p>
          <Input 
            label="Property Name" 
            placeholder="e.g. Taj Lands End" 
            required 
            value={propertyName} 
            onChange={(e) => setPropertyName(e.target.value)} 
          />
          <Input 
            label="Location" 
            placeholder="Mumbai, India" 
            required 
            value={propertyLocation}
            onChange={(e) => setPropertyLocation(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsPropertyModalOpen(false)}>Cancel</Button>
            <Button type="submit">Register Property</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isManagerModalOpen} onClose={() => setIsManagerModalOpen(false)} title="Invite Manager">
        <form onSubmit={handleInviteManager} className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Invite a new General Manager. They will receive an email to create their account and access operational data.
          </p>
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="manager@taj.com" 
            required 
            value={managerEmail} 
            onChange={(e) => setManagerEmail(e.target.value)} 
          />
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#111111] dark:text-[#ededed]">Assign to Property</label>
            <select 
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="h-10 w-full rounded-md bg-transparent border border-black/10 dark:border-white/10 px-3 text-[14px] text-[#111111] dark:text-[#ededed] focus:outline-none focus:border-black/30 dark:focus:border-white/30"
            >
              <option value="">Select a property...</option>
              {properties.map(p => (
                <option key={p.id} value={p.name}>{p.name}, {p.location}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsManagerModalOpen(false)}>Cancel</Button>
            <Button type="submit">Send Invite</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
