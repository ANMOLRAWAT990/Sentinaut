import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export function LandingPage() {
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="flex flex-col w-full bg-white dark:bg-slate-950 overflow-hidden relative">
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
      
      {/* Dynamic Cinematic Hero Section */}
      <div ref={heroRef} className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden pb-32">
        <motion.div 
          style={{ y }} 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src="/images/hero_resort.png" alt="Luxury Resort" className="w-full h-full object-cover" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-0"></div>
        
        <motion.div 
          style={{ opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full px-6 sm:px-8 lg:px-16 max-w-5xl"
        >
          <h2 className="text-sm font-semibold tracking-[0.2em] text-white/70 uppercase mb-4">SentiNaut Intelligence</h2>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight text-white mb-6 leading-tight">
            Elevating <br className="hidden sm:block"/>
            <span className="italic text-white/90">Exceptional</span> Properties.
          </h1>
          <p className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed font-light">
            Smart AI for modern hospitality. We automatically turn messy guest reviews into clear, actionable tasks for your staff.
          </p>
        </motion.div>
      </div>
      
      {/* Stats Section with Elegant Borders */}
      <section className="relative z-20 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200 dark:divide-slate-800">
          {[
            { label: 'Real-time Insights', value: 'Instant' },
            { label: 'Platform Reliability', value: 'Always-On' },
            { label: 'Data Security', value: 'Encrypted' },
            { label: 'Actionable Workflows', value: 'Automated' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
              className="px-6 py-12 sm:px-8 lg:px-12 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex flex-col justify-center items-center text-center group"
            >
              <div className="text-3xl sm:text-4xl font-serif text-slate-900 dark:text-white mb-2 group-hover:scale-105 transition-transform duration-500 ease-out">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trusted By Section - Infinite Marquee */}
      <section className="py-24 w-full text-center overflow-hidden relative bg-white dark:bg-slate-950">
        <p className="text-xs font-mono tracking-[0.3em] text-slate-400 uppercase mb-16">Trusted by Top Properties</p>
        
        {/* Gradient fades for the edges of the marquee */}
        <div className="absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
        
        <div className="relative flex w-full">
          <motion.div
            className="flex whitespace-nowrap gap-16 sm:gap-32 w-max opacity-50 hover:opacity-100 transition-opacity duration-700"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          >
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="text-2xl sm:text-3xl font-serif text-slate-900 dark:text-white tracking-widest cursor-pointer hover:text-blue-500 transition-colors duration-300">GRAND ROYALE</span>
                <span className="text-2xl sm:text-3xl font-serif text-slate-900 dark:text-white tracking-widest cursor-pointer hover:text-blue-500 transition-colors duration-300">THE OASIS</span>
                <span className="text-2xl sm:text-3xl font-serif text-slate-900 dark:text-white tracking-widest cursor-pointer hover:text-blue-500 transition-colors duration-300">ALPINE RETREAT</span>
                <span className="text-2xl sm:text-3xl font-serif text-slate-900 dark:text-white tracking-widest cursor-pointer hover:text-blue-500 transition-colors duration-300">COASTAL HAVEN</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Elegant Features Section */}
      <section className="px-6 sm:px-8 lg:px-16 py-32 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
              Seamless <br/> <span className="italic text-slate-500">Background</span> Operations.
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Smart Sentiment Analysis</h3>
                <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">We instantly detect if a review is positive or negative. For complex reviews, our advanced AI reads between the lines to extract the real meaning.</p>
              </div>
              <div className="h-px w-12 bg-slate-200 dark:bg-slate-800"></div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Automated Task Creation</h3>
                <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">When guests repeatedly complain about an issue, our system automatically creates a task ticket for your staff so nothing is missed.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full md:w-1/2 h-[600px] overflow-hidden"
          >
            <img src="/images/login_resort.png" alt="Luxury Architecture" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3000ms]" />
          </motion.div>
        </div>
      </section>



      {/* Elegant Staggered Workflow Section */}
      <section className="bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
        <div className="px-6 sm:px-8 lg:px-16 py-24 sm:py-32 max-w-7xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1 }}
            className="text-center mb-24"
          >
            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight text-slate-900 dark:text-white mb-6">The Protocol</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              A frictionless flow from raw guest sentiment to resolved structural failure, eliminating the noise of traditional management.
            </p>
          </motion.div>
          
          <div className="space-y-24 md:space-y-32">
            {[
              { step: '01', title: 'Ingestion', desc: 'Front-desk staff log raw guest feedback via rapid-entry forms or WhatsApp integrations, bypassing manual spreadsheets completely.', img: '/images/protocol_ingestion.png' },
              { step: '02', title: 'Inference', desc: 'The Gemini engine parses sentiment, flags critical anomalies, and instantly generates trackable tickets based on the exact failure vector.', img: '/images/protocol_inference.png' },
              { step: '03', title: 'Execution', desc: 'Managers receive localized action items while ownership monitors macro health metrics from a pristine command center.', img: '/images/protocol_execution.png' }
            ].map((flow, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24`}>
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 1 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="w-full md:w-1/2"
                >
                  <div className="text-sm font-mono text-slate-400 mb-4">{flow.step}</div>
                  <h3 className="text-3xl font-serif text-slate-900 dark:text-white mb-6">{flow.title}</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-md">{flow.desc}</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="w-full md:w-1/2 aspect-[4/3] md:aspect-[3/4] lg:aspect-square overflow-hidden rounded-sm"
                >
                  <img src={flow.img} alt={flow.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3000ms]" />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 sm:py-32 w-full text-center bg-slate-950 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" 
             style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-6 relative z-10"
        >
          <h2 className="text-3xl sm:text-5xl font-serif tracking-tight text-white mb-8">Connect Your Ecosystem</h2>
          <p className="text-lg text-white/60 mb-12 font-light leading-relaxed">
            SentiNaut natively ingests data from TripAdvisor, Booking.com, WhatsApp Business API, and your internal property management systems seamlessly.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button onClick={() => navigate('/about')} className="px-8 py-4 bg-white text-black text-sm uppercase tracking-widest font-semibold hover:bg-slate-200 hover:scale-105 transition-all inline-block duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">View Integrations</button>
          </div>
        </motion.div>
      </section>


    </div>
  );
}
