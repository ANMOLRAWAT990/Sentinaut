import React from 'react';

export function AboutPage() {
  return (
    <div className="bg-white dark:bg-[#161b22] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#e6edf3] sm:text-4xl">About SentiNaut</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-[#8b949e]">
            SentiNaut is a project developed as part of the TBI SIP 2026 program. Our mission is to empower hospitality businesses to understand and leverage guest feedback at scale.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#e6edf3]">The Problem</h3>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-[#8b949e]">
                Hotels and resorts receive hundreds of reviews daily across multiple platforms. Manually reading, categorizing, and acting on these reviews is time-consuming and often leads to missed opportunities for operational improvement.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#e6edf3]">Our Solution</h3>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-[#8b949e]">
                Using advanced sentiment analysis and natural language processing, our platform automatically classifies reviews, extracts key themes, and routes actionable insights to the appropriate staff members—from frontline workers to hotel managers and owners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
