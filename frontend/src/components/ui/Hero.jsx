import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] border-b border-slate-200 dark:border-slate-800">
      <div className="flex flex-col justify-center px-8 lg:px-16 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.1] max-w-2xl">
          Hospitality intelligence, <br />
          distilled from unstructured feedback.
        </h1>
        <p className="mt-6 text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
          SentiNaut processes raw review data into strict operational primitives. Classify sentiment, track recurring structural failures, and benchmark against market peers.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link to="/signup" className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
            Initialize Workspace
          </Link>
          <Link to="/about" className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            View Architecture
          </Link>
        </div>
      </div>
      <div className="hidden lg:block border-l border-slate-200 dark:border-slate-800 relative bg-black">
        <img 
          src="/images/hero_resort.png" 
          alt="Resort" 
          className="absolute inset-0 w-full h-full object-cover opacity-90" 
        />
      </div>
    </section>
  );
}
