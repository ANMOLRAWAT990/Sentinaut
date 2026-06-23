import React from 'react';

export function AboutPage() {
  return (
    <div className="bg-white dark:bg-[#161b22] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#e6edf3] sm:text-4xl">About SentiNaut</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-[#8b949e]">
            SentiNaut is an enterprise-grade reputation management platform. Our mission is to empower hospitality businesses to understand and leverage guest feedback at scale.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold tracking-tight text-red-900 dark:text-red-400">The Problem Statement</h3>
              <p className="mt-4 text-base leading-7 text-red-800 dark:text-red-200/70">
                Hotels and resorts receive hundreds of reviews daily across multiple platforms (Google, TripAdvisor, Booking.com). 
              </p>
              <ul className="mt-6 space-y-3 text-sm text-red-800 dark:text-red-200/70">
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">×</span> Manual categorization is incredibly time-consuming.</li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">×</span> Sentiment is often misunderstood without reading the full text.</li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">×</span> Actionable insights (e.g. "AC is broken") are buried and ignored by operations.</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold tracking-tight text-green-900 dark:text-green-400">The SentiNaut Solution</h3>
              <p className="mt-4 text-base leading-7 text-green-800 dark:text-green-200/70">
                Using advanced Natural Language Processing (Google Gemini), our platform automatically turns unstructured text into an operational roadmap.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-green-800 dark:text-green-200/70">
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> <strong>Automated Classification:</strong> Instantly tags sentiment and core themes.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> <strong>Task Delegation:</strong> Generates actionable tasks for managers to assign.</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> <strong>Strategic Insights:</strong> Gives owners high-level ROI and competitor benchmarking.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mx-auto mt-24 max-w-2xl lg:mx-0">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#e6edf3]">Technology Stack</h2>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-slate-200 dark:border-[#30363d] rounded-xl p-4 text-center">
              <p className="font-bold text-slate-900 dark:text-[#e6edf3]">Frontend</p>
              <p className="text-sm text-slate-500 dark:text-[#8b949e]">React 19 + Tailwind</p>
            </div>
            <div className="border border-slate-200 dark:border-[#30363d] rounded-xl p-4 text-center">
              <p className="font-bold text-slate-900 dark:text-[#e6edf3]">Backend</p>
              <p className="text-sm text-slate-500 dark:text-[#8b949e]">Python FastAPI</p>
            </div>
            <div className="border border-slate-200 dark:border-[#30363d] rounded-xl p-4 text-center">
              <p className="font-bold text-slate-900 dark:text-[#e6edf3]">AI Engine</p>
              <p className="text-sm text-slate-500 dark:text-[#8b949e]">Google Gemini Flash</p>
            </div>
            <div className="border border-slate-200 dark:border-[#30363d] rounded-xl p-4 text-center">
              <p className="font-bold text-slate-900 dark:text-[#e6edf3]">Database</p>
              <p className="text-sm text-slate-500 dark:text-[#8b949e]">MongoDB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
