import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    document.title = "SentiNaut";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-slate-200 dark:selection:bg-slate-800 transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-32">
        <div className="px-6 sm:px-8 lg:px-16 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white mb-6">Pricing Plans</h2>
            <p className="text-slate-500 font-light text-lg">Simple, transparent, and built for scale.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y md:border-x border-slate-200 dark:border-slate-800 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950">
            <div className="p-12 sm:p-16 text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-2">Boutique</h3>
              <p className="text-sm text-slate-500 mb-8 font-light">Up to 1,000 reviews/mo</p>
              <p className="text-5xl font-serif text-slate-900 dark:text-white mb-8">₹24,999<span className="text-lg font-light text-slate-500">/mo</span></p>
              <button onClick={() => navigate(user ? '/dashboard' : '/signup')} className="px-6 py-3 border border-slate-900 dark:border-white text-slate-900 dark:text-white text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">Select</button>
            </div>
            
            <div className="p-12 sm:p-16 text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 relative">
              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest uppercase opacity-70">Popular</div>
              <h3 className="font-serif text-2xl mb-2 mt-4">Resort</h3>
              <p className="text-sm opacity-70 mb-8 font-light">Unlimited reviews & managers</p>
              <p className="text-5xl font-serif mb-8">₹49,999<span className="text-lg font-light opacity-70">/mo</span></p>
              <button onClick={() => navigate(user ? '/dashboard' : '/signup')} className="px-6 py-3 border border-white dark:border-slate-900 text-white dark:text-slate-900 text-sm uppercase tracking-widest hover:bg-white hover:text-black dark:hover:bg-slate-900 dark:hover:text-white transition-colors">Select</button>
            </div>

            <div className="p-12 sm:p-16 text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-2">Enterprise</h3>
              <p className="text-sm text-slate-500 mb-8 font-light">Custom SLA deployment</p>
              <p className="text-5xl font-serif text-slate-900 dark:text-white mb-8">POA</p>
              <button onClick={() => navigate('/signup')} className="px-6 py-3 border border-slate-900 dark:border-white text-slate-900 dark:text-white text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
