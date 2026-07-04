import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, Filter, MessageSquare, Star, ArrowUpRight, Trash2, CheckCircle, Globe, MapPin, Building2, Download, Languages, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export function ReviewsIndex() {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [filterSentiment, setFilterSentiment] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [translationMap, setTranslationMap] = useState({});
  const [drafts, setDrafts] = useState({});
  const [isDrafting, setIsDrafting] = useState({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/reviews');
      if(res.ok) {
        const data = await res.json();
        setReviews(data.reverse());
      }
    } catch (err) {
      addToast('Failed to load reviews from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/reviews/${id}`, { method: 'DELETE' });
      if(res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
        addToast('Review deleted successfully', 'success');
      }
    } catch (err) {
      addToast('Failed to delete review', 'error');
    }
  };

  const approveReview = async (review) => {
    try {
      const res = await fetch(`http://localhost:8000/api/reviews/${review.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review, status: 'Approved' })
      });
      if (res.ok) {
        addToast('Review approved successfully', 'success');
      } else {
        throw new Error("Failed to approve");
      }
    } catch (err) {
      addToast('Failed to approve review. Reverting...', 'error');
      setReviews(reviews.map(r => r.id === review.id ? review : r));
    }
  };

  const toggleReplied = async (review) => {
    const newRepliedStatus = !review.replied;
    try {
      const res = await fetch(`http://localhost:8000/api/reviews/${review.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review, replied: newRepliedStatus })
      });
      if (res.ok) {
        setReviews(reviews.map(r => r.id === review.id ? { ...r, replied: newRepliedStatus } : r));
        addToast(newRepliedStatus ? 'Marked as replied' : 'Unmarked as replied', 'success');
      } else {
        throw new Error("Failed to update replied status");
      }
    } catch (err) {
      addToast('Failed to update replied status.', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if(!window.confirm("Delete selected reviews?")) return;
    for (const id of selectedReviews) {
      await fetch(`http://localhost:8000/api/reviews/${id}`, { method: 'DELETE' });
    }
    setReviews(reviews.filter(r => !selectedReviews.includes(r.id)));
    setSelectedReviews([]);
    addToast('Bulk delete completed', 'success');
  };

  const handleBulkApprove = async () => {
    for (const id of selectedReviews) {
      const review = reviews.find(r => r.id === id);
      if(review && review.status !== 'Approved') {
        await fetch(`http://localhost:8000/api/reviews/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...review, status: 'Approved' })
        });
      }
    }
    setReviews(reviews.map(r => selectedReviews.includes(r.id) ? { ...r, status: 'Approved' } : r));
    setSelectedReviews([]);
    addToast('Bulk approve completed', 'success');
  };

  const toggleSelection = (id) => {
    setSelectedReviews(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleTranslate = async (id, text) => {
    if (translationMap[id]) {
      setTranslationMap(prev => ({ ...prev, [id]: null }));
      return;
    }
    addToast('Translating...', 'info');
    try {
      const res = await fetch(`http://localhost:8000/api/reviews/${id}/translate`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTranslationMap(prev => ({ ...prev, [id]: `[Translated] ${data.translated_text}` }));
      } else throw new Error();
    } catch (e) {
      addToast('Translation failed. Service unavailable.', 'error');
    }
  };

  const handleDraftReply = async (id) => {
    setIsDrafting(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`http://localhost:8000/api/reviews/${id}/draft-reply`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setDrafts(prev => ({ ...prev, [id]: data.draft }));
      } else throw new Error();
    } catch (e) {
      addToast('AI Draft failed. Please draft manually.', 'error');
    } finally {
      setIsDrafting(prev => ({ ...prev, [id]: false }));
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,GuestName,Platform,Sentiment,Status,Text\n"
      + reviews.map(r => `${r.id},${r.guestName},${r.platform},${r.sentiment},${r.status},"${r.text.replace(/"/g, '""')}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sentinaut_reviews.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const PlatformIcon = ({ platform }) => {
    if (platform?.toLowerCase().includes('google')) return <MapPin className="h-4 w-4 text-red-500" />;
    if (platform?.toLowerCase().includes('internal')) return <Building2 className="h-4 w-4 text-blue-500" />;
    return <Globe className="h-4 w-4 text-green-500" />;
  };

  // Pagination & Filtering
  const filteredReviews = reviews.filter(r => filterSentiment === 'All' || r.sentiment === filterSentiment)
                                 .sort((a, b) => sortOrder === 'Newest' ? -1 : 1);
  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const toggleAll = () => {
    if (selectedReviews.length === currentReviews.length) setSelectedReviews([]);
    else setSelectedReviews(currentReviews.map(r => r.id));
  };

  const renderTableView = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-[#e6edf3]">
          {user?.role === 'owner' ? 'Review Analytics Directory' : user?.role === 'staff' ? 'My Processed Reviews' : 'Review Moderation Queue'}
        </h2>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          <select value={filterSentiment} onChange={e => { setFilterSentiment(e.target.value); setCurrentPage(1); }} className="border border-slate-200 dark:border-[#30363d] rounded-md px-3 py-2 text-sm text-slate-700 dark:text-[#e6edf3] bg-white dark:bg-[#161b22]">
            <option value="All">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>
          <select value={sortOrder} onChange={e => { setSortOrder(e.target.value); setCurrentPage(1); }} className="border border-slate-200 dark:border-[#30363d] rounded-md px-3 py-2 text-sm text-slate-700 dark:text-[#e6edf3] bg-white dark:bg-[#161b22]">
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
          </select>
          <Button variant="secondary" onClick={exportCSV} className="gap-2"><Download className="h-4 w-4" /> Export</Button>
        </div>
      </div>
      
      {user?.role === 'owner' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'All Reviews', count: reviews.length },
            { label: 'Positive', count: reviews.filter(r => r.sentiment === 'Positive').length },
            { label: 'Neutral', count: reviews.filter(r => r.sentiment === 'Neutral').length },
            { label: 'Negative', count: reviews.filter(r => r.sentiment === 'Negative').length }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg p-4 text-center shadow-sm">
              <div className="text-sm font-medium text-slate-600 dark:text-[#8b949e]">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-[#e6edf3] mt-1">{loading ? '...' : stat.count}</div>
            </div>
          ))}
        </div>
      )}

      {user?.role === 'manager' && selectedReviews.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-3 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-300">{selectedReviews.length} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleBulkDelete} className="text-red-500 hover:text-red-700">Delete Selected</Button>
            <Button size="sm" onClick={handleBulkApprove} className="bg-green-600 hover:bg-green-700 text-white">Approve Selected</Button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? <div className="p-8 text-center text-slate-500 bg-white dark:bg-[#161b22] rounded-lg">Loading from database...</div> : currentReviews.map((r, i) => (
          <Card key={r.id} className={selectedReviews.includes(r.id) ? 'ring-2 ring-blue-500' : ''}>
            <CardContent className="p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex items-center gap-3">
                {user?.role === 'manager' && <input type="checkbox" checked={selectedReviews.includes(r.id)} onChange={() => toggleSelection(r.id)} className="w-4 h-4 rounded border-slate-300" />}
                <PlatformIcon platform={r.platform} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900 dark:text-[#e6edf3]">{r.guestName}</span>
                  <Badge variant={r.sentiment === 'Negative' ? 'danger' : r.sentiment === 'Positive' ? 'success' : 'warning'}>{r.sentiment}</Badge>
                  <span className="text-xs font-medium text-slate-500 dark:text-[#8b949e] uppercase px-2 py-0.5 bg-slate-100 dark:bg-[#30363d] rounded-full">{r.platform}</span>
                </div>
                <p className="text-slate-700 dark:text-[#e6edf3] text-sm">
                  {translationMap[r.id] || r.text}
                </p>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-[#8b949e] uppercase tracking-wider">
                  <span>Themes: {r.tags.length > 0 ? r.tags.join(", ") : "None"}</span>
                  <span>|</span>
                  <span>Status: {r.status}</span>
                  <span>|</span>
                  <label className="flex items-center gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                    <input type="checkbox" checked={r.replied || false} onChange={() => toggleReplied(r)} className="rounded border-slate-300 w-3 h-3 cursor-pointer" /> Replied
                  </label>
                  <span>|</span>
                  <button onClick={() => handleTranslate(r.id, r.text)} className="flex items-center gap-1 text-blue-500 hover:underline"><Languages className="h-3 w-3"/> Translate</button>
                  <span>|</span>
                  <button onClick={() => handleDraftReply(r.id)} disabled={isDrafting[r.id]} className="flex items-center gap-1 text-purple-500 hover:underline disabled:opacity-50">
                    <MessageSquare className="h-3 w-3"/> {isDrafting[r.id] ? 'Drafting...' : 'AI Draft Reply'}
                  </button>
                </div>
                {drafts[r.id] && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-[#0d1117] rounded-md border border-slate-200 dark:border-[#30363d]">
                    <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center justify-between">
                      AI Suggested Reply:
                      <button onClick={() => setDrafts(prev => ({...prev, [r.id]: null}))} className="text-red-400 hover:text-red-500">Dismiss</button>
                    </p>
                    <textarea 
                      defaultValue={drafts[r.id]} 
                      className="w-full text-sm p-2 bg-transparent border border-slate-300 dark:border-[#30363d] rounded resize-y min-h-[80px]"
                    />
                  </div>
                )}
              </div>
              {user?.role === 'manager' && (
                <div className="flex gap-2 w-full md:w-auto">
                  <Button variant="secondary" size="sm" onClick={() => deleteReview(r.id)} className="flex-1 md:flex-none text-red-500 hover:text-red-700 hover:bg-red-50">Delete</Button>
                  {r.status !== 'Approved' && (
                    <Button size="sm" onClick={() => approveReview(r)} className="flex-1 md:flex-none gap-2 bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-4 h-4"/>Approve</Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {/* Pagination Controls */}
        {!loading && filteredReviews.length > 0 && (
          <div className="flex items-center justify-between bg-white dark:bg-[#161b22] px-4 py-3 border border-slate-200 dark:border-[#30363d] rounded-lg">
            <div className="flex items-center gap-2">
              {user?.role === 'manager' && <input type="checkbox" onChange={toggleAll} checked={selectedReviews.length === currentReviews.length && currentReviews.length > 0} className="w-4 h-4 rounded border-slate-300" />}
              <span className="text-sm text-slate-600 dark:text-[#8b949e]">Select Page</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-[#8b949e]">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2"><ChevronLeft className="h-4 w-4"/></Button>
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2"><ChevronRight className="h-4 w-4"/></Button>
              </div>
            </div>
          </div>
        )}

        {!loading && filteredReviews.length === 0 && (
          <div className="relative w-full h-64 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 flex items-center justify-center shadow-sm">
            <div className="relative z-10 text-center animate-in slide-in-from-bottom-2 fade-in duration-500">
              <MessageSquare className="h-8 w-8 text-[#888] mx-auto mb-3" />
              <h3 className="text-[16px] font-semibold text-[#111] dark:text-[#eee]">No Reviews Found</h3>
              <p className="text-[13px] text-[#666] dark:text-[#aaa] mt-1 max-w-sm">Try adjusting your filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-slate-900 dark:text-[#e6edf3]">Guest Intelligence</h1>
        <p className="text-slate-500 dark:text-[#8b949e] font-light text-sm mt-2">Manage, filter, and export guest feedback data.</p>
      </div>
      {renderTableView()}
    </div>
  );
}
