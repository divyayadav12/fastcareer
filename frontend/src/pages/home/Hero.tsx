import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  ArrowRight, 
  Building2, 
  User, 
  Calendar, 
  ArrowUpRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

const timelineMilestones = [
  {
    year: '2008',
    badgeBg: 'bg-[#1d64f2] text-white',
    dotBg: 'bg-[#1d64f2]',
    title: 'Indore Inception & 1st CA Campus',
    desc: 'Founded in Indore; pioneered India’s first private off-campus recruitment for fresh CAs.'
  },
  {
    year: '2010',
    badgeBg: 'bg-[#10b981] text-white',
    dotBg: 'bg-[#10b981]',
    title: 'Delhi NCR Campus Expansion',
    desc: 'Expanded to National Capital Region partnering with Big 4 advisory & top corporates.'
  },
  {
    year: '2012',
    badgeBg: 'bg-[#7c3aed] text-white',
    dotBg: 'bg-[#7c3aed]',
    title: '4+ Metro Cities & Bengaluru Hub',
    desc: 'Multi-city drives across Mumbai, Bengaluru, Chennai, Kolkata & corporate hubs.'
  },
  {
    year: '2020+',
    badgeBg: 'bg-[#0f172a] text-white',
    dotBg: 'bg-[#0f172a]',
    title: '10+ Cities & Pan-India Virtual Campus',
    desc: '10+ physical cities + Centralized All-India Virtual Campus connecting all 28 states & UTs.'
  }
];

export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#eaf3fd] via-[#f5f9fe] to-white pt-[74px] pb-2 sm:pt-[80px] sm:pb-3 lg:pt-[84px] lg:pb-3 border-b border-slate-200/80 overflow-hidden">
      
      {/* Background Soft Glow with Subtle Breathing Motion */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" 
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-2 items-end">
          
          {/* 1. LEFT COLUMN: Heading, Description & CTAs (col-span-5) */}
          <div className="lg:col-span-5 text-left z-10 py-1 pb-4 sm:pb-6">
            
            {/* Top Trophy Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#eaf3ff] border border-[#bcd7ff] px-3.5 py-1.5 rounded-full mb-3.5 shadow-2xs w-fit hover:scale-105 transition-transform"
            >
              <Trophy size={14} className="text-[#1d64f2] fill-[#1d64f2] shrink-0 animate-bounce" />
              <span className="text-[11px] font-black text-[#1d64f2] tracking-wider uppercase">
                INDIA'S LARGEST CA PLACEMENT COMPANY • SINCE 2008
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[45px] font-black text-[#0b192c] leading-[1.12] tracking-tight mb-3.5"
            >
              Recruit CAs <br />
              <span className="text-[#1d64f2]">(Experienced & Freshers)</span> <br />
              From India’s Largest CA <br />
              Placement Company
            </motion.h1>

            {/* Description Paragraph */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs sm:text-sm text-slate-600 mb-5 max-w-md leading-relaxed font-medium"
            >
              <strong className="text-slate-900 font-bold">Fast Career Consultants Private Limited</strong> connects <strong className="text-[#1d64f2] font-bold">60+</strong> top-notch corporates with India's largest talent pool of <strong className="text-[#1d64f2] font-bold">125,000+</strong> registered Chartered Accountants, All India Rankers (AIRs), and seasoned finance leaders.
            </motion.p>

            {/* Two Action Buttons in Single Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <Link to="/register" className="shrink-0">
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-5 py-3.5 bg-[#1d64f2] hover:bg-[#1554cf] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap hover:shadow-lg"
                >
                  <User size={16} className="shrink-0" />
                  <span>Register as CA Candidate</span>
                  <ArrowRight size={15} className="shrink-0" />
                </motion.button>
              </Link>
              
              <Link to="/placement-drive" className="shrink-0">
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-50 text-[#0b192c] border-2 border-[#cfdff5] hover:border-[#1d64f2] font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap hover:shadow-md"
                >
                  <Building2 size={16} className="text-[#1d64f2] shrink-0" />
                  <span>Hire CAs / Corporate Drive</span>
                </motion.button>
              </Link>
            </motion.div>

          </div>

          {/* 2. MIDDLE COLUMN: Clean Seamless CA Hero Artwork (col-span-4) with Gentle Floating Animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{ 
              opacity: { duration: 0.7, delay: 0.2 },
              scale: { duration: 0.7, delay: 0.2 },
              y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" }
            }}
            className="lg:col-span-4 flex items-end justify-center relative min-h-[380px] lg:min-h-[460px] overflow-visible"
          >
            <img 
              src="/ca_hero_perfect_text.png" 
              alt="Fast Careers CA Candidate - Your CA Career Our Priority" 
              className="w-full h-auto max-h-[480px] object-contain object-bottom pointer-events-none select-none transition-transform hover:scale-105 duration-500"
            />
          </motion.div>

          {/* 3. RIGHT COLUMN: Placement Journey Timeline Card (col-span-3) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-3 z-10 py-1 pb-4 sm:pb-6"
          >
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#eaf3ff] border border-[#bcd7ff] flex items-center justify-center text-[#1d64f2] shrink-0">
                    <Calendar size={15} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#1d64f2] block leading-none">
                      OUR PLACEMENT JOURNEY
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-1 leading-tight">
                      18+ Years Milestone Timeline
                    </h3>
                  </div>
                </div>
                
                <Link 
                  to="/placement-results" 
                  className="w-7 h-7 rounded-full bg-[#eaf3ff] hover:bg-[#d5e7ff] text-[#1d64f2] flex items-center justify-center shrink-0 transition-all hover:scale-110 shadow-2xs"
                  aria-label="View Milestones"
                >
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* Connected Timeline Milestones */}
              <div className="relative pl-3.5 space-y-2 border-l-2 border-slate-200 ml-1.5">
                {timelineMilestones.map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 3 }}
                    className="relative group cursor-pointer"
                  >
                    
                    {/* Bullet Dot on Line */}
                    <div className={`absolute -left-[20px] top-3 w-2.5 h-2.5 rounded-full border-2 border-white ${item.dotBg} shadow-2xs group-hover:scale-125 transition-transform`} />
                    
                    {/* Milestone Box */}
                    <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70 group-hover:bg-[#f0f6ff] group-hover:border-blue-300 transition-all">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded leading-none ${item.badgeBg}`}>
                          {item.year}
                        </span>
                        <span className="font-extrabold text-[11px] text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-normal pl-0.5">
                        {item.desc}
                      </p>
                    </div>

                  </motion.div>
                ))}
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
