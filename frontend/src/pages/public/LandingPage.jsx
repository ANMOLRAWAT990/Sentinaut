import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, animate, useMotionValue, useSpring } from 'framer-motion';

// --- Subcomponents for 10x features ---

// 4. Dynamic Number Counting
function CountUpStat({ to, suffix = "", duration = 2 }) {
  const nodeRef = useRef();
  
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const controls = animate(0, to, {
          duration: duration,
          ease: "easeOut",
          onUpdate(value) {
            const formatted = to % 1 !== 0 ? value.toFixed(1) : Math.floor(value);
            node.textContent = formatted + suffix;
          }
        });
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    observer.observe(node);
    return () => observer.disconnect();
  }, [to, suffix, duration]);

  return <span ref={nodeRef}>0{suffix}</span>;
}

// 5. Magnetic Button
function MagneticButton({ children, className, onClick, href }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });
  
  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width/2);
    const middleY = clientY - (top + height/2);
    x.set(middleX * 0.2);
    y.set(middleY * 0.2);
  };
  
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  
  const Element = href ? 'a' : 'button';
  
  return (
    <motion.div
      style={{ position: 'relative', x: mouseX, y: mouseY }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className="inline-block"
    >
      <Element href={href} onClick={onClick} className={className}>
        {children}
      </Element>
    </motion.div>
  );
}

export function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // 2. Interactive Image Swapping state
  const [activeFeature, setActiveFeature] = useState(0);
  const featureImages = [
    "/images/login_resort.png",
    "/images/protocol_inference.png"
  ];

  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#09090b] overflow-hidden">
      
      {/* 1. Hero Section + 3. Floating Dashboard Mockup */}
      <div ref={heroRef} className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden pb-32">
        <motion.div 
          style={{ y: heroY }} 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img src="/images/hero_resort.png" alt="Luxury Resort" className="w-full h-full object-cover" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-0"></div>
        
        {/* Floating Mockup inside Hero */}
        <motion.div
          initial={{ opacity: 0, rotateX: 20, rotateY: -10, y: 100 }}
          animate={{ opacity: 1, rotateX: 0, rotateY: 0, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          style={{ perspective: 1000 }}
          className="absolute right-[-5%] md:right-[5%] lg:right-[15%] top-1/4 hidden md:block w-[400px] h-[250px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden z-0"
        >
          {/* Mockup Header */}
          <div className="w-full h-10 border-b border-white/10 flex items-center px-4 gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></div>
          </div>
          {/* Mockup Content */}
          <div className="p-6 flex flex-col gap-4">
            <div className="h-4 w-32 bg-white/20 rounded-sm"></div>
            <div className="flex gap-4 items-center mt-2">
               <div className="h-16 w-16 rounded-full border-4 border-emerald-400/30 border-t-emerald-400 flex-shrink-0 animate-spin" style={{ animationDuration: '3s' }}></div>
               <div className="flex flex-col gap-3 flex-1 justify-center">
                 <div className="h-2 w-full bg-white/10 rounded-full"></div>
                 <div className="h-2 w-4/5 bg-white/10 rounded-full"></div>
                 <div className="h-2 w-full bg-white/10 rounded-full"></div>
               </div>
            </div>
            <div className="flex gap-2 mt-2">
              <div className="h-8 flex-1 bg-white/10 rounded-sm"></div>
              <div className="h-8 flex-1 bg-white/10 rounded-sm"></div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full px-6 sm:px-8 lg:px-16 max-w-5xl pointer-events-none"
        >
          <h2 className="text-sm font-semibold tracking-[0.2em] text-white/70 uppercase mb-4">SentiNaut Intelligence</h2>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight text-white mb-6 leading-tight">
            Elevating <br className="hidden sm:block"/>
            <span className="italic text-white/90">Exceptional</span> Properties.
          </h1>
          <p className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed font-light mb-8">
            An elegant intersection of artificial intelligence and hospitality. We transform unstructured guest feedback into immediate operational clarity.
          </p>
        </motion.div>
      </div>
      
      {/* Stats Section with Elegant Borders */}
      <section className="relative z-20 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b]">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200 dark:divide-slate-800">
          {[
            { label: 'Data Processing Limit', value: 100, suffix: 'k+ / day' },
            { label: 'Inference Accuracy', value: 98.4, suffix: '%' },
            { label: 'P99 Latency', value: 240, suffix: 'ms' },
            { label: 'Active Deployments', value: 500, suffix: '+' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
              className="px-6 py-12 sm:px-8 lg:px-12 bg-transparent hover:bg-slate-50 dark:hover:bg-[#111115] transition-colors flex flex-col justify-center items-center text-center group"
            >
              <div className="text-3xl sm:text-4xl font-serif text-slate-900 dark:text-white mb-2 group-hover:scale-105 transition-transform duration-500 ease-out">
                <CountUpStat to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Elegant Features Section (Interactive Swapping) */}
      <section className="px-6 sm:px-8 lg:px-16 py-32 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-slate-900 dark:text-white mb-12 leading-tight">
              A symphony of <br/> <span className="italic text-slate-500">discrete</span> operations.
            </h2>
            <div className="space-y-12">
              <div 
                className={`transition-opacity duration-300 cursor-pointer ${activeFeature === 0 ? 'opacity-100' : 'opacity-40'}`}
                onMouseEnter={() => setActiveFeature(0)}
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Deterministic Sentiment</h3>
                <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">High-confidence inputs are resolved via precise rules, while ambiguous payloads are escalated to our inference engine for contextual extraction.</p>
              </div>
              <div className="h-px w-12 bg-slate-200 dark:bg-slate-800"></div>
              <div 
                className={`transition-opacity duration-300 cursor-pointer ${activeFeature === 1 ? 'opacity-100' : 'opacity-40'}`}
                onMouseEnter={() => setActiveFeature(1)}
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Automated Execution</h3>
                <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">Recurring thematic failures automatically instantiate actionable tickets in the management queue, ensuring nothing is lost in translation.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full md:w-1/2 h-[600px] overflow-hidden relative rounded-sm shadow-xl"
          >
            <motion.img 
              key={activeFeature}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8 }}
              src={featureImages[activeFeature]} 
              alt="Feature preview" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
          </motion.div>
        </div>
      </section>

      {/* Pinned Sticky Storytelling Section */}
      <section className="bg-white dark:bg-[#09090b] border-y border-slate-200 dark:border-slate-800 relative">
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row relative">
          
          {/* Sticky Left Column */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-0 h-auto lg:h-screen flex flex-col justify-center px-6 sm:px-8 lg:px-16 py-24">
            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight text-slate-900 dark:text-white mb-6">The Protocol</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg font-light leading-relaxed mb-8">
              A frictionless flow from raw guest sentiment to resolved structural failure, eliminating the noise of traditional management.
            </p>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 hidden lg:block">Scroll to explore &rarr;</p>
          </div>
          
          {/* Scrolling Right Column */}
          <div className="w-full lg:w-1/2 px-6 sm:px-8 lg:px-16 py-12 lg:py-[20vh] space-y-32">
            {[
              { step: '01', title: 'Ingestion', desc: 'Front-desk staff log raw guest feedback via rapid-entry forms or WhatsApp integrations, bypassing manual spreadsheets completely.', img: '/images/protocol_ingestion.png' },
              { step: '02', title: 'Inference', desc: 'The Gemini engine parses sentiment, flags critical anomalies, and instantly generates trackable tickets based on the exact failure vector.', img: '/images/protocol_inference.png' },
              { step: '03', title: 'Execution', desc: 'Managers receive localized action items while ownership monitors macro health metrics from a pristine command center.', img: '/images/protocol_execution.png' }
            ].map((flow, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col gap-8"
              >
                <div className="w-full aspect-[4/3] overflow-hidden rounded-sm shadow-xl">
                  <img src={flow.img} alt={flow.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-mono text-slate-400 mb-2">{flow.step}</div>
                  <h3 className="text-3xl font-serif text-slate-900 dark:text-white mb-4">{flow.title}</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">{flow.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section with Magnetic Button */}
      <section className="py-24 sm:py-32 w-full text-center bg-[#050505]">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className="text-3xl sm:text-5xl font-serif tracking-tight text-white mb-8">Connect Your Ecosystem</h2>
          <p className="text-lg text-white/60 mb-12 font-light leading-relaxed">
            SentiNaut natively ingests data from TripAdvisor, Booking.com, WhatsApp Business API, and your internal property management systems seamlessly.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <MagneticButton 
              href="/about#integrations" 
              className="px-8 py-4 bg-white text-black text-sm uppercase tracking-widest font-semibold hover:bg-slate-200 transition-colors inline-block"
            >
              View Integrations
            </MagneticButton>
          </div>
        </motion.div>
      </section>

      {/* Trusted By Section - Editorial Vibe */}
      <section className="px-6 sm:px-8 lg:px-16 py-32 max-w-7xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 1.5 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] text-slate-400 uppercase mb-16">Selected Deployments</p>
          <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-24 opacity-60">
            <span className="text-2xl sm:text-3xl font-serif text-slate-900 dark:text-white tracking-widest hover:opacity-100 transition-opacity cursor-pointer">TAJ PALACE</span>
            <span className="text-2xl sm:text-3xl font-serif text-slate-900 dark:text-white tracking-widest hover:opacity-100 transition-opacity cursor-pointer">THE OBEROI</span>
            <span className="text-2xl sm:text-3xl font-serif text-slate-900 dark:text-white tracking-widest hover:opacity-100 transition-opacity cursor-pointer">ITC MAURYA</span>
            <span className="text-2xl sm:text-3xl font-serif text-slate-900 dark:text-white tracking-widest hover:opacity-100 transition-opacity cursor-pointer">LEELA PALACE</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
