import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Basic animated counter hook
const useCounter = (end: number, duration: number, inView: boolean) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, inView]);

  return count;
};

const StatItem = ({ 
  label, 
  subtext, 
  value, 
  suffix = '', 
  duration = 1200, 
  delay = 0,
  index = 0
}: { 
  label: string, 
  subtext: string, 
  value: number, 
  suffix?: string, 
  duration?: number, 
  delay?: number,
  index?: number
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const count = useCounter(value, duration, isInView);

  return (
    <motion.div 
      ref={ref} 
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="text-center p-5 sm:p-6 bg-white rounded-2xl shadow-xs border-2 border-slate-200/90 transition-all duration-200 hover:shadow-xl hover:border-blue-400 relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
      <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-700 mb-1 tracking-tight group-hover:scale-105 transition-transform duration-200">
        {value === 0 && suffix !== '' ? suffix : <>{count.toLocaleString('en-IN')}{suffix}</>}
      </div>
      <div className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight mb-1 group-hover:text-blue-700 transition-colors">
        {label}
      </div>
      <div className="text-xs text-slate-500 font-medium">
        {subtext}
      </div>
    </motion.div>
  );
};

export const TrustStats = () => {
  return (
    <section className="py-8 bg-slate-50 relative z-10 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatItem 
            label="Registered CAs" 
            subtext="Largest private pool in India" 
            value={125000} 
            suffix="+" 
            index={0}
          />
          <StatItem 
            label="Top Corporates" 
            subtext="India's premier recruiters" 
            value={60} 
            suffix="+" 
            index={1}
          />
          <StatItem 
            label="Candidates Per Drive" 
            subtext="All AIRs & CA Freshers" 
            value={5000} 
            suffix="+" 
            index={2}
          />
          <StatItem 
            label="Campus Cities" 
            subtext="Physical Drives & Virtual" 
            value={9} 
            suffix=" Cities" 
            index={3}
          />
        </div>
      </div>
    </section>
  );
};
