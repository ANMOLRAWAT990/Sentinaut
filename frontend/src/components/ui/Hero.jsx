import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from './Button';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function Hero() {
  return (
    <section className="relative px-6 py-24 md:py-32 lg:px-8 bg-gradient-to-b from-blue-50 to-white dark:from-[#0d1117] dark:to-[#0d1117] overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100 dark:bg-[#1f6feb] rounded-full blur-[100px] opacity-50 dark:opacity-20 -z-10 pointer-events-none"></div>

      <motion.div 
        className="mx-auto max-w-4xl text-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-[#161b22] dark:text-[#58a6ff] dark:border dark:border-[#30363d] text-sm font-medium">
            <Zap size={16} className="text-blue-600 dark:text-[#58a6ff]" />
            AI-Powered Feedback Engine
          </span>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#e6edf3] sm:text-7xl leading-tight">
          Turn guest reviews into <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#58a6ff] dark:to-[#1f6feb]">actionable operations</span>
        </motion.h1>
        
        <motion.p variants={fadeInUp} className="mt-8 text-lg md:text-xl leading-8 text-slate-600 dark:text-[#8b949e] max-w-2xl mx-auto">
          SentiNaut classifies sentiment, tags themes, and benchmarks competitors to help homestays and mountain resorts drive more bookings.
        </motion.p>
        
        <motion.div variants={fadeInUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login">
            <Button size="lg" className="px-8 shadow-lg shadow-blue-500/30 dark:shadow-none hover:shadow-blue-500/50 transition-all flex items-center gap-2 group">
              Go to Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/about" className="text-sm font-semibold leading-6 text-slate-700 hover:text-blue-600 dark:text-[#e6edf3] dark:hover:text-[#58a6ff] transition-colors flex items-center gap-2 px-6 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-[#21262d]">
            See how it works
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
