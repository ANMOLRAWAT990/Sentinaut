import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Loader2, AlertCircle, Search, Copy, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';

export function StaffDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [reviewText, setReviewText] = useState('');
  const [mode, setMode] = useState('single'); // 'single' or 'batch'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [singleResult, setSingleResult] = useState(null);
  const [batchResults, setBatchResults] = useState(null);
  const [copiedRow, setCopiedRow] = useState(null);
  
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');

  const handleAddToTracker = async (taskText) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task: taskText, 
          status: 'Pending', 
          property: user?.property || 'Unassigned',
          priority: 'High'
        })
      });
      if (res.ok) {
        addToast('Action added to tracker', 'success');
      } else {
        addToast('Failed to add action', 'error');
      }
    } catch (err) {
      addToast('Network error', 'error');
    }
  };

  const handleCopy = (text, id = 'single') => {
    navigator.clipboard.writeText(text);
    setCopiedRow(id);
    addToast('Reply copied to clipboard!', 'success');
    setTimeout(() => setCopiedRow(null), 2000);
  };

  // Initial data load to preserve the "table" feeling
  React.useEffect(() => {
    document.title = "SentiNaut";
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    if (user?.property) {
      fetch(`${API_URL}/api/reviews?property=${encodeURIComponent(user.property)}`)
        .then(res => res.json())
        .then(data => {
        // We'll just map this to the batch results structure to populate the left table initially if we wanted to
        // For simplicity, we won't auto-fill unless they click Analyze, or we can just leave it to user interaction
      })
      .catch(err => console.error("Failed to fetch reviews:", err));
    }
  }, []);

  const handleAnalyze = async () => {
    if (!reviewText) return;
    setLoading(true);
    setError(false);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      if (mode === 'single') {
        const res = await fetch(`${API_URL}/api/reviews/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: reviewText, property: user?.property || 'Unassigned' })
        });
        
        if (!res.ok) throw new Error("API call failed");
        const data = await res.json();
        setSingleResult(data);
      } else {
        const rawReviews = reviewText.split(/\n\s*\n/).filter(r => r.trim().length > 0);
        
        const res = await fetch(`${API_URL}/api/reviews/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ batch: rawReviews, property: user?.property || 'Unassigned' })
        });

        if (!res.ok) throw new Error("API call failed");
        const data = await res.json();
        
        setBatchResults({
          reviews: data.reviews.map(r => ({
             id: r.id, text: r.text, sentiment: r.sentiment, theme: r.tags[0] || 'Experience', confidence: "98%", reply: "Thanks for the feedback."
          })),
          rootCauses: data.rootCauses,
          working: data.working,
          actions: data.actions
        });
      }
      
      addToast('Analysis complete and saved to database!', 'success');
    } catch (err) {
      console.error(err);
      setError(true);
      addToast('Failed to analyze reviews.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!checkoutPhone) {
      addToast('Please enter a WhatsApp number', 'error');
      return;
    }
    
    // Generate WhatsApp wa.me link
    const message = encodeURIComponent(`Hi ${checkoutName}, thank you for staying with us! We hope you had a great time. We'd love it if you could leave a review here: https://g.page/r/your-google-link/review`);
    const waUrl = `https://wa.me/${checkoutPhone}?text=${message}`;
    
    window.open(waUrl, '_blank');
    addToast('WhatsApp opened with review template!', 'success');
    
    setCheckoutName('');
    setCheckoutPhone('');
  };

  const PillToggle = () => (
    <div className="flex w-full border-b border-black/10 dark:border-white/10 mb-6">
      <button 
        onClick={() => { setMode('single'); setSingleResult(null); setBatchResults(null); }}
        className={`flex-1 pb-3 text-[11px] uppercase tracking-widest transition-all font-medium border-b-2 -mb-[1px] ${mode === 'single' ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent'}`}
      >
        Single Review
      </button>
      <button 
        onClick={() => { setMode('batch'); setSingleResult(null); setBatchResults(null); }}
        className={`flex-1 pb-3 text-[11px] uppercase tracking-widest transition-all font-medium border-b-2 -mb-[1px] ${mode === 'batch' ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'border-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent'}`}
      >
        Batch Analysis
      </button>
    </div>
  );

  const renderSingleMode = () => (
    <div className="flex flex-col md:flex-row gap-6 mt-4">
      {/* LEFT COLUMN - INPUT (45%) */}
      <div className="w-full md:w-[45%]">
        <div className="mb-4">
          <h3 className="font-bold text-[16px] text-slate-900 dark:text-slate-200">Review Input</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Paste one or more reviews below</p>
        </div>
        <PillToggle />
        <textarea
          className="w-full min-h-[180px] p-3 text-[14px] bg-white dark:bg-slate-950 border border-[#e2e8f0] dark:border-slate-800 rounded-[8px] focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
          placeholder="Paste guest feedback here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
        <Button onClick={handleAnalyze} disabled={loading || !reviewText} className="w-full relative">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Analyze with AI"}
        </Button>
      </div>

      {/* DIVIDER */}
      <div className="hidden md:block w-[1px] bg-slate-200 dark:bg-[#30363d]"></div>

      {/* RIGHT COLUMN - RESULT (55%) */}
      <div className="w-full md:w-[55%] relative">
        <div className="absolute top-0 right-0 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] px-2 py-1 rounded-full border border-slate-200 dark:border-slate-800">
          Powered by Gemini Flash
        </div>
        
        {!singleResult && !loading && (
          <div className="h-full flex items-center justify-center min-h-[250px]">
            <p className="text-[#94a3b8] text-sm">Your analysis will appear here</p>
          </div>
        )}

        {loading && (
          <div className="h-full flex items-center justify-center min-h-[250px]">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        )}

        {singleResult && !loading && (
          <div className="animate-in fade-in duration-500 mt-8">
            <div className="flex gap-3 mb-4">
              <Badge variant={singleResult.sentiment === 'Positive' ? 'success' : singleResult.sentiment === 'Negative' ? 'danger' : 'warning'} className="px-3 py-1 text-sm">
                {singleResult.sentiment}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-900">
                {singleResult.confidence} Confidence
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {singleResult.themes.map(t => (
                <span key={t} className="bg-[#f1f5f9] dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                  {t}
                </span>
              ))}
            </div>
            <div className="h-[1px] bg-slate-200 dark:bg-[#30363d] w-full mb-4"></div>
            <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400 font-semibold mb-2">Suggested Management Reply</div>
            <div className="bg-[#f8fafc] dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-[14px] text-slate-700 dark:text-slate-200 mb-3">
              {singleResult.reply}
            </div>
            <Button variant="outline" size="sm" onClick={() => handleCopy(singleResult.reply)} className="gap-2 text-slate-600">
              {copiedRow === 'single' ? <><CheckCircle2 className="h-4 w-4 text-green-500" /> Copied ✓</> : <><Copy className="h-4 w-4" /> Copy Reply</>}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderBatchMode = () => (
    <div className="mt-4">
      <PillToggle />
      <div className="mb-6 relative">
        <textarea
          className="w-full min-h-[100px] p-3 text-[14px] bg-white dark:bg-slate-950 border border-[#e2e8f0] dark:border-slate-800 rounded-[8px] focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-[#94a3b8]"
          placeholder="Paste multiple reviews here for batch analysis..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-2">
          <Button onClick={handleAnalyze} disabled={loading || !reviewText} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Analyze Reviews
          </Button>
        </div>
      </div>

      {error && (
        <div className="border-2 border-dashed border-[#e2e8f0] dark:border-slate-800 rounded-lg min-h-[200px] flex flex-col items-center justify-center text-center p-6">
          <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-200">Analysis failed</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-4">Something went wrong. Please try again.</p>
          <Button onClick={handleAnalyze}>Retry</Button>
        </div>
      )}

      {!batchResults && !loading && !error && (
        <div className="border-2 border-dashed border-[#e2e8f0] dark:border-slate-800 rounded-lg min-h-[200px] flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 dark:bg-slate-950/50">
          <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-200">No reviews analyzed yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Paste reviews above and click Analyze</p>
        </div>
      )}

      {batchResults && !loading && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT TABLE */}
          <div className="w-full lg:w-2/3">
            <div className="flex gap-2 mb-4">
              <select className="border border-[#e2e8f0] dark:border-slate-800 rounded-[8px] px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950">
                <option>All Sentiments</option>
              </select>
              <select className="border border-[#e2e8f0] dark:border-slate-800 rounded-[8px] px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950">
                <option>All Themes</option>
              </select>
            </div>
            <div className="space-y-3">
              {batchResults.reviews.map(r => (
                <div key={r.id} className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-[8px] p-3 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-200 line-clamp-2 mb-2">{r.text}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${r.sentiment === 'Positive' ? 'bg-green-100 text-green-700' : r.sentiment === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                        {r.sentiment}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-[#30363d] text-slate-600 dark:text-slate-400">
                        {r.theme}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {r.confidence}
                      </span>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3 flex flex-col items-end gap-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate w-full text-right italic">"{r.reply}"</p>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(r.reply, r.id)} className="text-xs h-7 px-2">
                      {copiedRow === r.id ? <><CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> Copied ✓</> : <><Copy className="h-3 w-3 mr-1" /> Copy</>}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT INSIGHT PANEL */}
          <div className="w-full lg:w-1/3 bg-[#f8fafc] dark:bg-slate-950 border-l-2 border-[#e2e8f0] dark:border-slate-800 p-5 rounded-r-lg">
            <h3 className="font-bold text-slate-900 dark:text-slate-200 mb-4">Batch Insights</h3>
            
            <div className="mb-6">
              <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400 font-semibold mb-2">Root Causes</div>
              {batchResults.rootCauses.map((item, i) => (
                <div key={i} className="flex gap-2 items-start mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400 font-semibold mb-2">What Is Working</div>
              {batchResults.working.map((item, i) => (
                <div key={i} className="flex gap-2 items-start mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="text-[11px] uppercase text-slate-500 dark:text-slate-400 font-semibold mb-2">Priority Actions</div>
              {batchResults.actions.map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex flex-col gap-2">
                  <span className="text-sm text-slate-700 dark:text-slate-200">{item}</span>
                  <Button variant="outline" size="sm" className="text-xs w-fit" onClick={() => handleAddToTracker(item)}>Add to Tracker</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const [checkoutPhone, setCheckoutPhone] = useState('');

  return (
    <div className="space-y-6">
      <div className="relative w-full h-32 rounded-xl overflow-hidden shrink-0 shadow-sm flex items-end p-6 border border-black/10 dark:border-white/10 mb-8">
        <img src="/images/staff_header.png" alt="Front Desk Operations" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity dark:opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white tracking-tight">Front Desk Operations</h1>
          <p className="text-[13px] text-white/80 mt-1">Log checkouts and analyze direct guest feedback.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {mode === 'single' ? renderSingleMode() : renderBatchMode()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checkout & WhatsApp Review Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckout} className="space-y-4 max-w-md">
            <Input label="Guest Name" placeholder="Anjali Desai" value={checkoutName} onChange={(e) => setCheckoutName(e.target.value)} required />
            <Input label="WhatsApp Number (with country code)" type="tel" placeholder="+91 98765 43210" value={checkoutPhone} onChange={(e) => setCheckoutPhone(e.target.value)} required />
            <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">Send via WhatsApp</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
