import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function FeaturesPage() {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-slate-950 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 px-6 sm:px-8 lg:px-16 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950 pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-slate-900 dark:text-white mb-6">
            Discover SentiNaut
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            The intelligent platform that automatically translates raw guest feedback into precise, actionable operations for your entire team.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 w-full max-w-6xl mx-auto rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-primary-900/20 border border-slate-200 dark:border-slate-800"
        >
          <img src="/images/dashboard_showcase.png" alt="Executive Dashboard" className="w-full h-auto object-cover" />
        </motion.div>
      </section>

      {/* Core Platform Features */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 space-y-32">
          
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium tracking-wide">
                AI Insights
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 dark:text-white leading-tight">
                Operational Intelligence
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                Our Gemini-powered engine automatically scans every guest review, instantly identifying anomalies, sentiment trends, and critical service gaps without any manual reading required.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <img src="/images/manager_showcase.png" alt="Manager Operational Intel" className="w-full h-auto" />
            </motion.div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium tracking-wide">
                Workflow Automation
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 dark:text-white leading-tight">
                Automated Task Routing
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                Stop playing telephone. When a guest mentions a broken AC or a slow check-in, SentiNaut automatically generates a prioritized task and routes it directly to the responsible staff member's workspace.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800"
            >
              <img src="/images/staff_showcase.png" alt="Staff Workspace" className="w-full h-auto" />
            </motion.div>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400 font-light text-lg">A seamless pipeline from guest feedback to operational excellence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xl font-serif text-slate-900 dark:text-white mb-6 border border-slate-200 dark:border-slate-800 shadow-sm z-10">1</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Connect Your Data</h3>
              <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">Link your property's existing review channels or manually upload feedback batches into the system.</p>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="hidden md:block absolute top-8 left-[-50%] w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
              <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-xl font-serif text-primary-600 dark:text-primary-400 mb-6 border border-primary-200 dark:border-primary-800 shadow-sm z-10">2</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">AI Analyzes Feedback</h3>
              <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">SentiNaut's AI engine reads the context of every review, isolating complaints and tagging positive experiences instantly.</p>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="hidden md:block absolute top-8 left-[-50%] w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xl font-serif text-slate-900 dark:text-white mb-6 border border-slate-200 dark:border-slate-800 shadow-sm z-10">3</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Staff Takes Action</h3>
              <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">Categorized issues are routed directly to the appropriate staff dashboard, creating a clear, trackable to-do list.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 dark:bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-serif text-white mb-8 leading-tight">Ready to transform your guest experience?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium tracking-wide transition-colors">
              Get Started Now
            </Link>
            <Link to="/pricing" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-lg font-medium tracking-wide transition-colors">
              View Pricing Plans
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
