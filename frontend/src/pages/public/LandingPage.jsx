import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

export function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#000000] overflow-hidden selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Dynamic Cinematic Hero Section */}
      <div ref={heroRef} className="relative w-full h-screen flex flex-col justify-center overflow-hidden">
        <motion.div 
          style={{ y }} 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src="/images/hero_resort.png" alt="Luxury Resort" className="w-full h-full object-cover" />
        </motion.div>
        
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-0 opacity-80"></div>
        
        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col items-center text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-8 inline-flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono tracking-widest text-white uppercase">SentiNaut Intelligence v1.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif tracking-tighter text-white mb-6 leading-[0.9]"
          >
            Elevating <br />
            <span className="italic font-light text-white/90">Exceptional</span> Properties.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed font-light mb-12"
          >
            An elegant intersection of artificial intelligence and hospitality. We transform unstructured guest feedback into immediate operational clarity.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <Link to="/login" className="px-8 py-4 bg-white text-black text-sm uppercase tracking-widest font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-3 group">
              Access Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/about" className="px-8 py-4 bg-transparent border border-white/30 text-white text-sm uppercase tracking-widest font-semibold hover:bg-white/10 transition-colors backdrop-blur-sm flex items-center justify-center">
              Explore Protocol
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        >
          <span className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-mono">Scroll</span>
          <div className="w-[1px] h-12 bg-white/20 overflow-hidden relative">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 w-full h-full bg-white"
            ></motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Stats Section with Glassmorphism */}
      <section className="relative z-20 -mt-16 mx-6 sm:mx-12 lg:mx-24 rounded-sm border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-black/10 dark:divide-white/10">
          {[
            { label: 'Data Processing Limit', value: '100k+' },
            { label: 'Inference Accuracy', value: '98.4%' },
            { label: 'P99 Latency', value: '240ms' },
            { label: 'Active Deployments', value: '500+' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
              className="px-6 py-12 flex flex-col justify-center items-center text-center group hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="text-4xl sm:text-5xl font-serif text-slate-900 dark:text-white mb-3 group-hover:scale-105 transition-transform duration-500 ease-out">{stat.value}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-[0.2em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Elegant Features Section */}
      <section className="px-6 sm:px-12 lg:px-24 py-32 sm:py-48 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="absolute -top-12 -left-12 text-9xl font-serif text-slate-100 dark:text-[#111] -z-10 select-none">"</div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]">
              A symphony of <br/> <span className="italic text-slate-400 dark:text-slate-500">discrete</span> operations.
            </h2>
            <div className="space-y-12 mt-16">
              <div className="relative pl-8 border-l border-black/10 dark:border-white/10 group">
                <div className="absolute top-0 left-[-1px] w-[2px] h-0 bg-black dark:bg-white group-hover:h-full transition-all duration-700 ease-out"></div>
                <h3 className="text-xl font-serif tracking-wide text-slate-900 dark:text-white mb-3">Deterministic Sentiment</h3>
                <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">High-confidence inputs are resolved via precise rules, while ambiguous payloads are escalated to our inference engine for contextual extraction.</p>
              </div>
              <div className="relative pl-8 border-l border-black/10 dark:border-white/10 group">
                <div className="absolute top-0 left-[-1px] w-[2px] h-0 bg-black dark:bg-white group-hover:h-full transition-all duration-700 ease-out"></div>
                <h3 className="text-xl font-serif tracking-wide text-slate-900 dark:text-white mb-3">Automated Execution</h3>
                <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">Recurring thematic failures automatically instantiate actionable tickets in the management queue, ensuring nothing is lost in translation.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full lg:w-1/2 aspect-[4/5] overflow-hidden rounded-sm"
          >
            <img src="/images/login_resort.png" alt="Luxury Architecture" className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3000ms] grayscale-[0.2]" />
          </motion.div>
        </div>
      </section>

      {/* Elegant Staggered Workflow Section */}
      <section className="bg-slate-50 dark:bg-[#050505] border-y border-slate-200 dark:border-white/5 py-32 sm:py-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/5 dark:from-white/5 to-transparent pointer-events-none"></div>
        
        <div className="px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="mb-24 sm:mb-32 max-w-2xl"
          >
            <h2 className="text-5xl sm:text-7xl font-serif tracking-tight text-slate-900 dark:text-white mb-8">The Protocol</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-light leading-relaxed">
              A frictionless flow from raw guest sentiment to resolved structural failure, eliminating the noise of traditional management.
            </p>
          </motion.div>
          
          <div className="space-y-32">
            {[
              { step: '01', title: 'Ingestion', desc: 'Front-desk staff log raw guest feedback via rapid-entry forms or WhatsApp integrations, bypassing manual spreadsheets completely.', img: '/images/protocol_ingestion.png' },
              { step: '02', title: 'Inference', desc: 'The Gemini engine parses sentiment, flags critical anomalies, and instantly generates trackable tickets based on the exact failure vector.', img: '/images/protocol_inference.png' },
              { step: '03', title: 'Execution', desc: 'Managers receive localized action items while ownership monitors macro health metrics from a pristine command center.', img: '/images/protocol_execution.png' }
            ].map((flow, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24 relative`}>
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 1 ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="w-full lg:w-5/12 flex flex-col"
                >
                  <div className="text-7xl font-serif text-slate-200 dark:text-white/10 mb-6 select-none">{flow.step}</div>
                  <h3 className="text-4xl font-serif text-slate-900 dark:text-white mb-6 tracking-wide">{flow.title}</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">{flow.desc}</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="w-full lg:w-7/12 aspect-[16/10] overflow-hidden rounded-sm shadow-2xl"
                >
                  <img src={flow.img} alt={flow.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3000ms]" />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-32 sm:py-48 w-full text-center bg-black">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-6"
        >
          <div className="w-px h-24 bg-white/20 mx-auto mb-12"></div>
          <h2 className="text-4xl sm:text-6xl font-serif tracking-tight text-white mb-8">Connect Your Ecosystem</h2>
          <p className="text-xl text-white/60 mb-16 font-light leading-relaxed max-w-2xl mx-auto">
            SentiNaut natively ingests data from TripAdvisor, Booking.com, WhatsApp Business API, and your internal property management systems seamlessly.
          </p>
          <a href="/about#integrations" className="px-10 py-5 border border-white/30 text-white text-sm uppercase tracking-widest font-semibold hover:bg-white hover:text-black transition-all inline-block">
            View Integrations
          </a>
        </motion.div>
      </section>

      {/* Trusted By Section - Editorial Vibe */}
      <section className="px-6 sm:px-12 lg:px-24 py-32 sm:py-48 max-w-7xl mx-auto w-full text-center border-t border-black/10 dark:border-white/10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.5 }}
        >
          <p className="text-xs font-mono tracking-[0.4em] text-slate-400 dark:text-slate-500 uppercase mb-20">Selected Deployments</p>
          <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-24 opacity-50 dark:opacity-40">
            <span className="text-2xl sm:text-4xl font-serif text-slate-900 dark:text-white tracking-widest hover:opacity-100 transition-opacity cursor-pointer">TAJ PALACE</span>
            <span className="text-2xl sm:text-4xl font-serif text-slate-900 dark:text-white tracking-widest hover:opacity-100 transition-opacity cursor-pointer">THE OBEROI</span>
            <span className="text-2xl sm:text-4xl font-serif text-slate-900 dark:text-white tracking-widest hover:opacity-100 transition-opacity cursor-pointer">ITC MAURYA</span>
            <span className="text-2xl sm:text-4xl font-serif text-slate-900 dark:text-white tracking-widest hover:opacity-100 transition-opacity cursor-pointer">LEELA PALACE</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
