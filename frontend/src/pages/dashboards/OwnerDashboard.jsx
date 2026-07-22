import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function OwnerDashboard() {
  const { user, activeProperty } = useAuth();
  const navigate = useNavigate();
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

  // Feature 1: Competitor Benchmark State
  const [competitorScores, setCompetitorScores] = useState({
    own: { name: 'Your Property', rating: 0 }
  });
  const [competitorSummary, setCompetitorSummary] = useState("Loading competitor benchmarking data...");
  const [isRefreshingComps, setIsRefreshingComps] = useState(false);
  const [isAddCompetitorModalOpen, setIsAddCompetitorModalOpen] = useState(false);
  const [competitorName, setCompetitorName] = useState('');
  const [competitorReviewsText, setCompetitorReviewsText] = useState('');
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);

  useEffect(() => {
    document.title = "SentiNaut";
    if (!user) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    
    const fetchData = () => {
      const encodedEmail = encodeURIComponent(user.email);
      const propQuery = activeProperty ? `&property=${encodeURIComponent(activeProperty)}` : '';
      Promise.all([
        fetch(`${API_URL}/api/properties?owner_email=${encodedEmail}`).then(res => res.json()),
        fetch(`${API_URL}/api/users?role=manager&owner_email=${encodedEmail}`).then(res => res.json()),
        fetch(`${API_URL}/api/analytics?owner_email=${encodedEmail}${propQuery}`).then(res => res.json()),
        fetch(`${API_URL}/api/competitors/summary?property=${encodeURIComponent(activeProperty || 'Unassigned')}`).then(res => res.json()).catch(() => ({}))
      ]).then(([propsData, managersData, analyticsRes, compRes]) => {
        if (Array.isArray(propsData)) setProperties(propsData);
        if (Array.isArray(managersData)) setManagers(managersData);
        if (analyticsRes) setAnalyticsData(analyticsRes);
        if (compRes?.summary) {
          setCompetitorSummary(compRes.summary);
          if (compRes.scores) setCompetitorScores(compRes.scores);
        }
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
      const res = await fetch(`${API_URL}/api/auth/register`, {
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
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/competitors/refresh?property=${encodeURIComponent(activeProperty || 'Unassigned')}`, {method: 'POST'});
      if (res.ok) {
        const data = await res.json();
        setCompetitorSummary(data.summary);
        if (data.scores) setCompetitorScores(data.scores);
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

  const handleAddCompetitorData = async (e) => {
    e.preventDefault();
    if (!competitorName.trim() || !competitorReviewsText.trim()) {
      addToast('Please provide both name and review text.', 'error');
      return;
    }
    
    setIsAddingCompetitor(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const reviewsArray = competitorReviewsText.split('\n\n').filter(r => r.trim().length > 10);
      
      const res = await fetch(`${API_URL}/api/reviews/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          property: activeProperty || 'Unassigned',
          batch: reviewsArray,
          is_competitor: true,
          competitor_name: competitorName.trim()
        })
      });
      
      if (res.ok) {
        addToast(`Successfully processed ${reviewsArray.length} competitor reviews.`, 'success');
        setIsAddCompetitorModalOpen(false);
        setCompetitorName('');
        setCompetitorReviewsText('');
        refreshCompetitors(); // refresh summary & scores automatically
      } else {
        addToast('Failed to process competitor data.', 'error');
      }
    } catch (err) {
      addToast('Network error while processing competitor data.', 'error');
    } finally {
      setIsAddingCompetitor(false);
    }
  };

  const activePropertyObj = properties.find(p => p.name === activeProperty) || properties[0] || {};
  const currentPlan = activePropertyObj.plan || 'trial';
  const aiUsage = activePropertyObj.ai_usage_month || 0;

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

      {competitorSummary && competitorSummary !== "Loading competitor benchmarking data..." && (
        <div className="bg-gradient-to-r from-primary-50/50 to-teal-50/50 dark:from-primary-900/10 dark:to-teal-900/10 border border-primary-100 dark:border-primary-800/30 rounded-xl p-5 flex items-start gap-4 shadow-sm animate-in fade-in duration-500">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg shrink-0 mt-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary-900 dark:text-primary-300 tracking-tight flex items-center gap-2">
              Strategic AI Summary
              {isRefreshingComps && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span></span>}
            </h3>
            <p className="text-[13px] leading-relaxed text-primary-800/80 dark:text-primary-200/70 mt-1.5">{competitorSummary}</p>
          </div>
        </div>
      )}

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
          className="border border-slate-200 dark:border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-200 tracking-tighter">{analyticsData?.healthScore || '0.0'}</span>
              <span className={`text-sm font-medium ${analyticsData?.periodOverPeriod >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {analyticsData?.periodOverPeriod > 0 ? '+' : ''}{analyticsData?.periodOverPeriod || 0}% PoP
              </span>
            </div>
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 mt-2">Overall Health Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-200 tracking-tighter">{analyticsData?.totalReviews || 0}</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">SLA: {analyticsData?.managerSLA || '0h'}</span>
            </div>
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 mt-2">Total Reviews Analyzed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-200 tracking-tighter">{analyticsData?.positiveSentimentPct || 0}%</span>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Conv: {analyticsData?.conversionRate || '0%'}</span>
            </div>
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 mt-2">Positive Sentiment</p>
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
                  <Line type="monotone" dataKey="score" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
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
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsAddCompetitorModalOpen(true)}>Add Data</Button>
              <Button size="sm" variant="outline" onClick={refreshCompetitors} isLoading={isRefreshingComps}>Refresh</Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentPlan === 'trial' ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">Competitor Benchmarking is Locked</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">Unlock AI-driven competitor analysis and unlimited review processing.</p>
                </div>
                <Button onClick={() => navigate('/pricing')} className="mt-2">View Pricing Plans</Button>
              </div>
            ) : (
              <div className={`space-y-5 transition-opacity ${isRefreshingComps ? 'opacity-50' : 'opacity-100'}`}>
                {Object.entries(competitorScores).map(([key, data]) => {
                  const colorClass = key === 'own' ? 'bg-primary-600' : 'bg-slate-400';
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={key === 'own' ? 'font-medium text-slate-900 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}>
                          {data.name}
                        </span>
                        <span className={key === 'own' ? 'text-primary-600 font-bold' : 'font-medium text-slate-900 dark:text-slate-200'}>
                          {data.rating}/10
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${(data.rating / 10) * 100}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                <div key={p.id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <img src="/images/resort_thumb.png" alt="Resort" className="w-16 h-16 rounded object-cover" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">{p.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{p.location}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">{p.status}</span>
                </div>
              ))}
              <button 
                onClick={() => setIsPropertyModalOpen(true)}
                className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
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
                <div key={m.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{m.initials}</div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">{m.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{m.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{m.property}</span>
                </div>
              ))}
              <button 
                onClick={() => setIsManagerModalOpen(true)}
                className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
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
            <label className="text-[13px] font-medium text-slate-900 dark:text-slate-200">Assign to Property</label>
            <select 
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="h-10 w-full rounded-md bg-transparent border border-black/10 dark:border-white/10 px-3 text-[14px] text-slate-900 dark:text-slate-200 focus:outline-none focus:border-black/30 dark:focus:border-white/30"
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

      <Modal isOpen={isAddCompetitorModalOpen} onClose={() => setIsAddCompetitorModalOpen(false)} title="Add Competitor Data">
        <form onSubmit={handleAddCompetitorData} className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manually add reviews for a competitor to benchmark against your property. Separate each review with a blank line.
          </p>
          <Input 
            label="Competitor Name" 
            placeholder="e.g. The Rival Resort" 
            required 
            value={competitorName} 
            onChange={(e) => setCompetitorName(e.target.value)} 
          />
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-slate-900 dark:text-slate-200">Competitor Reviews</label>
            <textarea 
              value={competitorReviewsText}
              onChange={(e) => setCompetitorReviewsText(e.target.value)}
              placeholder="Paste raw reviews here...&#10;&#10;Review 1 text...&#10;&#10;Review 2 text..."
              className="w-full h-40 p-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm resize-none focus:outline-none focus:border-primary-500 transition-colors"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddCompetitorModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isAddingCompetitor}>Analyze Competitor Data</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
