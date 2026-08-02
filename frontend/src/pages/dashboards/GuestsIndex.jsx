import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Skeleton } from '../../components/ui/Skeleton';

export function GuestsIndex() {
  const { user, activeProperty } = useAuth();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    document.title = "Guest CRM — SentiNaut";
    if (!user) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const propQuery = activeProperty || user.property || 'Unassigned';
    const encodedProp = encodeURIComponent(propQuery);
    
    Promise.all([
      fetch(`${API_URL}/api/checkouts?property=${encodedProp}`).then(res => res.json()),
      fetch(`${API_URL}/api/reviews?property=${encodedProp}`).then(res => res.json())
    ]).then(([checkouts, reviews]) => {
       const guestMap = {};
       checkouts.forEach(c => {
         guestMap[c.guestName] = { phone: c.phone, checkouts: [c], reviews: [] };
       });
       reviews.forEach(r => {
         if (!guestMap[r.guestName]) guestMap[r.guestName] = { phone: 'Unknown', checkouts: [], reviews: [] };
         guestMap[r.guestName].reviews.push(r);
       });
       setGuests(Object.entries(guestMap).map(([name, data]) => ({ name, ...data })));
       setLoading(false);
    });
  }, [user, activeProperty]);

  const handleFollowup = async (phone) => {
    if (phone === 'Unknown') return addToast("No phone number available.", "error");
    addToast("Opening WhatsApp...", "default");
    
    const message = encodeURIComponent("Hi there! Thank you for staying with us. We hope you had a great experience. Could you please take a moment to rate us on Google? It would mean the world to our team! [Insert Google Link]");
    // Clean phone number: remove all non-digits
    const cleanPhone = phone.replace(/\\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-9 w-48 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-slate-900 dark:text-slate-200">Guest CRM</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light text-sm mt-2">Manage profiles, stay history, and automated follow-ups.</p>
      </div>

      <div className="grid gap-4">
        {guests.map((g, idx) => (
          <Card key={idx}>
            <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-200 text-lg">{g.name}</h3>
                <p className="text-sm text-slate-500">Phone: {g.phone}</p>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  <span>Stays: {g.checkouts.length}</span> | <span>Reviews: {g.reviews.length}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleFollowup(g.phone)}>Send WhatsApp Follow-up</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {guests.length === 0 && (
           <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
             <p className="text-slate-500">No guests found for this property.</p>
           </div>
        )}
      </div>
    </div>
  );
}
