import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

export function StaffDashboard() {
  const [reviewText, setReviewText] = useState('');
  const [results, setResults] = useState([
    { id: 1, guest: 'John D.', text: 'Great pool, but room was dusty.', sentiment: 'Mixed', score: 6.5 }
  ]);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');

  const handleAnalyze = () => {
    if (!reviewText) return;
    const newResult = {
      id: Date.now(),
      guest: 'Unknown',
      text: reviewText,
      sentiment: reviewText.toLowerCase().includes('good') ? 'Positive' : 'Negative',
      score: reviewText.toLowerCase().includes('good') ? 8.5 : 3.2
    };
    setResults([newResult, ...results]);
    setReviewText('');
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    alert(`Review request sent to ${checkoutEmail}`);
    setCheckoutName('');
    setCheckoutEmail('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#e6edf3]">Staff Dashboard</h1>
        <p className="text-slate-500 dark:text-[#8b949e]">Log checkouts and analyze direct guest feedback.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Paste Box */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Review Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="w-full h-32 p-3 border border-slate-300 dark:border-[#30363d] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Paste guest feedback here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
            <Button onClick={handleAnalyze}>Analyze Sentiment</Button>
          </CardContent>
        </Card>

        {/* Checkout Logger */}
        <Card>
          <CardHeader>
            <CardTitle>Checkout & Review Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckout} className="space-y-4">
              <Input
                label="Guest Name"
                placeholder="Jane Smith"
                value={checkoutName}
                onChange={(e) => setCheckoutName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="jane@example.com"
                value={checkoutEmail}
                onChange={(e) => setCheckoutEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="secondary" className="w-full">
                Send Review Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-[#8b949e] uppercase bg-slate-50 dark:bg-[#0d1117]">
                <tr>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Feedback Snippet</th>
                  <th className="px-4 py-3">Sentiment</th>
                  <th className="px-4 py-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 dark:border-[#30363d] last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-[#e6edf3]">{r.guest}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-[#8b949e] truncate max-w-xs">{r.text}</td>
                    <td className="px-4 py-3">
                      <Badge variant={r.sentiment === 'Positive' ? 'success' : r.sentiment === 'Negative' ? 'danger' : 'warning'}>
                        {r.sentiment}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{r.score}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
