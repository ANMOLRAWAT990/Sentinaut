import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

function OnboardingTour() {
  const [step, setStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const completed = localStorage.getItem('sentinaut_onboarding_completed');
    if (!completed) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
    const handleReset = () => {
      setStep(0);
      setIsOpen(true);
    };
    window.addEventListener('sentinaut:restart_tour', handleReset);
    return () => window.removeEventListener('sentinaut:restart_tour', handleReset);
  }, []);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to SentiNaut Command Center! 🚀",
      desc: "We transform your guest reviews into autonomous operational intelligence and revenue growth. Let's take a 30-second tour of your new workspace."
    },
    {
      title: "Real-Time AI Processing & SLA Tracking ⚡",
      desc: "Your guest reviews are automatically analyzed for sentiment and categorized into operational departments. Use the queues to track SLAs in real-time."
    },
    {
      title: "Strategic Insights & Benchmarking 📈",
      desc: "Our AI continuously identifies market opportunities and operational bottlenecks. Check the Strategic Insights tab daily for automated action items."
    }
  ];

  const handleComplete = () => {
    localStorage.setItem('sentinaut_onboarding_completed', 'true');
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-primary-600 transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }}></div>
        <div className="flex justify-between items-center mb-4 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">Step {step + 1} of {steps.length}</span>
          <button onClick={handleComplete} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">Skip Tour</button>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{steps[step].title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{steps[step].desc}</p>
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            disabled={step === 0}
            onClick={() => setStep(s => Math.max(0, s - 1))}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 ${step === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            ← Back
          </button>
          {step < steps.length - 1 ? (
            <button 
              onClick={() => setStep(s => s + 1)}
              className="text-xs font-semibold px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition-all"
            >
              Next →
            </button>
          ) : (
            <button 
              onClick={handleComplete}
              className="text-xs font-semibold px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-all"
            >
              Get Started ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden">
      <Navbar />
      <OnboardingTour />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex flex-col pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="mx-auto max-w-7xl p-6 lg:p-8 flex-1 w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
