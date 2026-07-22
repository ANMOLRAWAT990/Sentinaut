import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function AboutPage() {
  const [toast, setToast] = useState(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage
        })
      });
      if (res.ok) {
        showToast('Message sent! We will be in touch soon.');
        setContactName('');
        setContactEmail('');
        setContactMessage('');
      } else {
        const data = await res.json();
        showToast(data.detail || 'Failed to send message.');
      }
    } catch (err) {
      showToast('An error occurred while sending the message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white dark:bg-slate-950 min-h-screen relative">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-md shadow-2xl z-50 font-medium tracking-wide border border-slate-700 dark:border-slate-200"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive fluid header with cinematic luxury feel */}
      <div className="relative w-full min-h-[60vh] flex flex-col justify-end overflow-hidden pb-16">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src="/images/auth_side.png" alt="Resort Architecture" className="w-full h-full object-cover" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="relative z-10 px-6 sm:px-8 lg:px-16 max-w-5xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-white mb-6">About SentiNaut</h1>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed font-light">
            SentiNaut is a full-stack passion project built to explore the intersection of LLM inference and modern hospitality operations. 
            Designed as a high-fidelity prototype during my software engineering journey.
          </p>
        </motion.div>
      </div>

      <section className="border-y border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1 }}
            className="p-8 sm:p-16 lg:p-24 bg-slate-50 dark:bg-slate-950 flex flex-col justify-center"
          >
            <h3 className="text-xl sm:text-2xl font-serif text-slate-900 dark:text-white mb-6">The Legacy Fault</h3>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">
              <p>Market legacy solutions rely on manual review parsing, resulting in high latency between guest experience and operational correction.</p>
              <ul className="list-disc pl-4 space-y-2 marker:text-slate-400">
                <li>Stochastic sentiment interpretation by rushed staff.</li>
                <li>Actionable insights trapped in unstructured text blobs.</li>
                <li>Siloed data access between field staff and ownership.</li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="p-8 sm:p-16 lg:p-24 flex flex-col justify-center"
          >
            <h3 className="text-xl sm:text-2xl font-serif text-slate-900 dark:text-white mb-6">The Resolution</h3>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>An automated pipeline leveraging deterministic routing and LLM inference for high-fidelity data categorization.</p>
              <ul className="list-disc pl-4 space-y-2 marker:text-slate-400">
                <li>Automated thematic tagging via Gemini Flash inference.</li>
                <li>Discrete task generation linked directly to review vectors.</li>
                <li>Strict Role-Based Access Control enforcing data discipline.</li>
              </ul>
            </div>
          </motion.div>
          
        </div>
      </section>

      <section className="flex-1 bg-white dark:bg-slate-950">
        <div className="px-6 sm:px-8 lg:px-16 py-16 sm:py-24 max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-8 sm:mb-12 uppercase tracking-widest"
          >
            Infrastructure Stack
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { label: 'Client', val: 'React 19, Tailwind CSS' },
              { label: 'Server', val: 'FastAPI, Python 3' },
              { label: 'Inference', val: 'Google Gemini' },
              { label: 'Persistence', val: 'MongoDB' },
            ].map((stack, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-[11px] sm:text-xs text-slate-500 mb-1 sm:mb-2">{stack.label}</div>
                <div className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">{stack.val}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page Cinematic Banner */}
      <section className="relative w-full h-[60vh] overflow-hidden border-y border-slate-200 dark:border-slate-800">
        <motion.div 
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src="/images/auth_side_3.png" alt="Luxury Lounge" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white max-w-4xl leading-tight">
            "Design is not just what it looks like and feels like. Design is how it works."
          </h2>
        </div>
      </section>

      {/* Product Sections */}
      <section id="features" className="bg-white dark:bg-slate-950">
        <div className="px-6 sm:px-8 lg:px-16 py-24 sm:py-32 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white mb-10 leading-tight">Platform Features</h2>
            <div className="space-y-8 text-slate-600 dark:text-slate-400 font-light text-lg">
              <div className="pb-8 border-b border-slate-200 dark:border-slate-800">
                <p className="text-sm font-mono text-slate-400 mb-2">01</p>
                <p className="text-slate-900 dark:text-slate-200 text-xl font-serif mb-2">Deterministic Sentiment</p>
                <p>Precise sentiment extraction using Google Gemini inference for all guest interactions.</p>
              </div>
              <div className="pb-8 border-b border-slate-200 dark:border-slate-800">
                <p className="text-sm font-mono text-slate-400 mb-2">02</p>
                <p className="text-slate-900 dark:text-slate-200 text-xl font-serif mb-2">Automated Execution</p>
                <p>Converts generic complaints into actionable, tracked staff duties.</p>
              </div>
              <div>
                <p className="text-sm font-mono text-slate-400 mb-2">03</p>
                <p className="text-slate-900 dark:text-slate-200 text-xl font-serif mb-2">Strict RBAC</p>
                <p>Securely segment data between field staff, unit managers, and group owners.</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-[600px] overflow-hidden">
             <img src="/images/login_resort.png" alt="Platform Features" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3000ms]" />
          </div>
        </div>
      </section>

      <section id="integrations" className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="px-6 sm:px-8 lg:px-16 py-24 sm:py-32 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white mb-8">System Integrations</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            SentiNaut natively interfaces with your existing hospitality stack, ensuring zero operational downtime.
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-70 grayscale">
            <a href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer" className="text-xl font-serif tracking-widest text-slate-900 dark:text-white hover:text-primary-600 transition-colors">TripAdvisor</a>
            <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer" className="text-xl font-serif tracking-widest text-slate-900 dark:text-white hover:text-primary-600 transition-colors">Booking.com</a>
            <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-xl font-serif tracking-widest text-slate-900 dark:text-white hover:text-primary-600 transition-colors">WhatsApp</a>
            <a href="https://www.oracle.com/hospitality/opera" target="_blank" rel="noopener noreferrer" className="text-xl font-serif tracking-widest text-slate-900 dark:text-white hover:text-primary-600 transition-colors">Opera PMS</a>
          </div>
        </div>
      </section>



      {/* Project Status Section */}
      <section id="careers" className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="px-6 sm:px-8 lg:px-16 py-16 sm:py-24 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">About the Developer</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">This platform was designed and developed as a comprehensive side project to demonstrate proficiency in React, FastAPI, MongoDB, and AI integrations.</p>
          <div className="space-y-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">Anmol Rawat</h4>
                <p className="text-sm text-slate-500">Software Engineering Intern</p>
              </div>
              <a href="https://github.com/ANMOLRAWAT990" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors inline-block text-center">View GitHub</a>
            </div>
          </div>
        </div>
      </section>

      <section id="blog" className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="px-6 sm:px-8 lg:px-16 py-16 sm:py-24 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">Development Log</h2>
          <p className="text-slate-600 dark:text-slate-400 italic">I regularly document the architecture decisions and state management patterns used in this project on my personal blog.</p>
        </div>
      </section>

      <section id="contact" className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="px-6 sm:px-8 lg:px-16 py-24 sm:py-32 max-w-5xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white mb-6">Let's Connect</h2>
          <p className="text-slate-500 font-light mb-12 text-center max-w-xl">Whether you're interested in deploying SentiNaut or just want to discuss hospitality engineering, I'd love to hear from you.</p>
          <form className="w-full max-w-md space-y-8" onSubmit={handleContactSubmit}>
            <div>
              <input type="text" placeholder="Full Name" value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full px-0 py-3 border-b border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:outline-none transition-colors rounded-none placeholder:text-slate-400 font-light" required disabled={isSubmitting}/>
            </div>
            <div>
              <input type="email" placeholder="Email Address" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-0 py-3 border-b border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:outline-none transition-colors rounded-none placeholder:text-slate-400 font-light" required disabled={isSubmitting}/>
            </div>
            <div>
              <textarea placeholder="Message" rows="3" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} className="w-full px-0 py-3 border-b border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:outline-none transition-colors rounded-none placeholder:text-slate-400 font-light resize-none" required disabled={isSubmitting}></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-4 border border-slate-900 dark:border-white text-slate-900 dark:text-white font-medium uppercase tracking-widest text-sm hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50">
              {isSubmitting ? 'Sending...' : 'Send Transmission'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
