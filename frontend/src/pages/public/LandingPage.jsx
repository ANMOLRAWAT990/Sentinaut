import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, ShieldCheck } from 'lucide-react';
import { Hero } from '../../components/ui/Hero';
import { Card, CardContent } from '../../components/ui/Card';

// Animation variants
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

export function LandingPage() {
  return (
    <div className="flex flex-col">
      <Hero />

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-[#161b22] border-y border-slate-100 dark:border-[#30363d] relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.dl 
            className="grid grid-cols-1 gap-x-8 gap-y-12 text-center md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex flex-col gap-y-2 pt-8 md:pt-0">
              <dt className="text-base font-medium text-slate-500 dark:text-[#8b949e]">Reviews Analyzed Daily</dt>
              <dd className="order-first text-4xl font-bold tracking-tight text-slate-900 dark:text-[#e6edf3] sm:text-5xl">100k+</dd>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col gap-y-2 pt-8 md:pt-0">
              <dt className="text-base font-medium text-slate-500 dark:text-[#8b949e]">Classification Accuracy</dt>
              <dd className="order-first text-4xl font-bold tracking-tight text-blue-600 sm:text-5xl">98%</dd>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-col gap-y-2 pt-8 md:pt-0">
              <dt className="text-base font-medium text-slate-500 dark:text-[#8b949e]">Partner Properties</dt>
              <dd className="order-first text-4xl font-bold tracking-tight text-slate-900 dark:text-[#e6edf3] sm:text-5xl">500+</dd>
            </motion.div>
          </motion.dl>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#0d1117]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-wider">Intelligent Engine</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-[#e6edf3] sm:text-4xl">Everything you need to manage your reputation</p>
          </motion.div>
          
          <motion.div 
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  title: 'Real-time Sentiment',
                  desc: 'Instantly classify reviews into positive, negative, and neutral sentiments with deep context understanding via Google Gemini.',
                  icon: <MessageSquare className="h-6 w-6 text-blue-600" />
                },
                {
                  title: 'Actionable Insights',
                  desc: 'Don\'t just read complaints—generate actionable operational tasks based on recurring themes like Food, Cleanliness, or Location.',
                  icon: <TrendingUp className="h-6 w-6 text-blue-600" />
                },
                {
                  title: 'Role-based Dashboards',
                  desc: 'Tailored views for Staff, Managers, and Owners. Everyone sees exactly the data and tasks they need to drive results.',
                  icon: <ShieldCheck className="h-6 w-6 text-blue-600" />
                }
              ].map((feature, idx) => (
                <motion.div key={idx} variants={fadeInUp} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
                  <Card className="h-full hover:shadow-xl transition-shadow">
                    <CardContent className="p-8 flex flex-col h-full">
                      <dt className="flex items-center gap-x-4 text-lg font-bold leading-7 text-slate-900 dark:text-[#e6edf3]">
                        <div className="h-12 w-12 flex shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100">
                          {feature.icon}
                        </div>
                        {feature.title}
                      </dt>
                      <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-[#8b949e]">
                        <p className="flex-auto">{feature.desc}</p>
                      </dd>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>

      {/* Resort Strip Section */}
      <section className="py-20 bg-slate-900 dark:bg-[#161b22] text-center relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <p className="text-sm font-semibold leading-8 text-slate-400 dark:text-[#8b949e] mb-10 tracking-widest uppercase">Trusted by top eco-resorts & homestays</p>
          <motion.div 
            className="flex flex-wrap justify-center gap-x-16 gap-y-10 opacity-70"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
             {['OCEANVIEW', 'THE RETREAT', 'ALPINE LODGE', 'CITY STAY'].map((brand, i) => (
                <motion.div 
                  key={i}
                  variants={fadeInUp}
                  className="text-white/80 hover:text-white transition-colors text-2xl font-bold tracking-widest"
                >
                  {brand}
                </motion.div>
             ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
