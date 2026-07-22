import React, { useState } from 'react';
import { useToast } from '../ui/Toast';
import { Modal } from '../ui/Modal';

export function Footer() {
  const [activeModal, setActiveModal] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message, 'success');
        setEmail('');
      } else {
        addToast(data.message || 'Subscription failed', 'error');
      }
    } catch (err) {
      addToast('Network error while subscribing', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pt-16 pb-8 mt-auto">
      <div className="mx-auto max-w-7xl px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <img src="/images/logo_emblem.png" alt="SentiNaut Logo" className="w-6 h-6 object-contain" />
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">SentiNaut</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              Weaponized hospitality intelligence for premium hotel operators and general managers.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="/about#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a></li>
              <li><a href="/about#integrations" className="hover:text-slate-900 dark:hover:text-white transition-colors">Integrations</a></li>
              <li><a href="/about#enterprise" className="hover:text-slate-900 dark:hover:text-white transition-colors">Enterprise</a></li>
              <li><a href="/about#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About Us</a></li>
              <li><a href="/about#careers" className="hover:text-slate-900 dark:hover:text-white transition-colors">Careers</a></li>
              <li><a href="/about#blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">Blog</a></li>
              <li><a href="/about#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Subscribe to our newsletter</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Get the latest news on AI in hospitality.</p>
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribing}
              />
              <button 
                type="submit" 
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
                disabled={isSubscribing}
              >
                {isSubscribing ? '...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} SentiNaut. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>

      <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Privacy Policy">
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
          <p><strong>1. Data Collection:</strong> We collect review text, metadata, and user information strictly for the purpose of analyzing sentiment and improving operations.</p>
          <p><strong>2. AI Processing:</strong> Your data is securely processed via Google Gemini APIs. No guest data is used to train public models.</p>
          <p><strong>3. Security:</strong> We implement industry-standard security measures to protect your property's reputation data.</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title="Terms of Service">
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
          <p><strong>1. Usage:</strong> SentiNaut is provided "as is". We are not responsible for automated decisions or AI hallucinations that may impact your business.</p>
          <p><strong>2. Intellectual Property:</strong> All dashboards, analysis structures, and code logic are the intellectual property of SentiNaut.</p>
          <p><strong>3. Termination:</strong> We reserve the right to suspend accounts that abuse our API rate limits or violate these terms.</p>
        </div>
      </Modal>
    </footer>
  );
}
