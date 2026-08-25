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
      
      // Easing function for smoother counter (easeOutQuart)
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

const StatItem = ({ label, value, suffix = '', duration = 2000 }: { label: string, value: number, suffix?: string, duration?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCounter(value, duration, isInView);

  return (
    <div ref={ref} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
        {value === 0 && suffix !== '' ? suffix : <>{count}{suffix}</>}
      </div>
      <div className="text-sm md:text-base font-medium text-gray-600 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
};

export const TrustStats = () => {
  return (
    <section className="py-12 bg-background relative -mt-10 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
        >
          <StatItem label="Years of Experience" value={18} suffix="+" />
          <StatItem label="Candidate Network" value={100} suffix="K+" />
          <StatItem label="Industry Domains" value={0} suffix="Multiple" />
          <StatItem label="Corporate Partners" value={0} suffix="Trusted" />
        </motion.div>
      </div>
    </section>
  );
};
