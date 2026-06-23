import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = {
  '7days': [
    { name: 'Mon', score: 8.2 }, { name: 'Tue', score: 8.4 }, { name: 'Wed', score: 8.1 }, 
    { name: 'Thu', score: 8.5 }, { name: 'Fri', score: 8.9 }, { name: 'Sat', score: 9.2 }, { name: 'Sun', score: 9.0 }
  ],
  '30days': [
    { name: 'Week 1', score: 8.0 }, { name: 'Week 2', score: 8.3 }, 
    { name: 'Week 3', score: 8.7 }, { name: 'Week 4', score: 8.9 }
  ]
};

export function OwnerDashboard() {
  const [dateRange, setDateRange] = useState('7days');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-[#e6edf3]">Owner Dashboard</h1>
          <p className="text-slate-500 dark:text-[#8b949e]">High-level metrics, trends, and benchmarking.</p>
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
              <span className="text-4xl font-bold text-slate-900 dark:text-[#e6edf3]">8.6</span>
              <span className="text-sm text-green-600">+0.2 from last week</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 dark:text-[#8b949e]">Total Reviews Analyzed</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-[#e6edf3]">1,248</span>
              <span className="text-sm text-slate-500 dark:text-[#8b949e]">this month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 dark:text-[#8b949e]">Positive Sentiment</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-[#e6edf3]">76%</span>
              <span className="text-sm text-green-600">+4%</span>
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
                <LineChart data={mockData[dateRange]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
          <CardHeader>
            <CardTitle>Competitor Benchmark</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-900 dark:text-[#e6edf3]">Your Property</span>
                  <span className="text-blue-600 font-bold">8.6/10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#21262d] rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '86%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-[#8b949e]">The Grand Resort (Competitor A)</span>
                  <span className="font-medium text-slate-900 dark:text-[#e6edf3]">8.2/10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#21262d] rounded-full h-2">
                  <div className="bg-slate-400 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-[#8b949e]">Oceanview Suites (Competitor B)</span>
                  <span className="font-medium text-slate-900 dark:text-[#e6edf3]">7.9/10</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#21262d] rounded-full h-2">
                  <div className="bg-slate-400 h-2 rounded-full" style={{ width: '79%' }}></div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-[#30363d]">
                <p className="text-xs text-slate-500 dark:text-[#8b949e]">You are currently ranking <strong className="text-slate-900 dark:text-[#e6edf3]">#1</strong> among your selected competitors.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
