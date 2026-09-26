import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const allCorporateRecruiters = [
  {
    name: 'ADITYA BIRLA',
    industry: 'Conglomerate',
    logoColor: 'text-[#d32f2f]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white font-black text-xs shadow-2xs">
        AB
      </div>
    )
  },
  {
    name: 'J&J Healthcare',
    industry: 'Healthcare',
    logoColor: 'text-[#d50000]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-serif font-black text-xs italic shadow-2xs">
        J&J
      </div>
    )
  },
  {
    name: 'vodafone',
    industry: 'Telecom',
    logoColor: 'text-[#e60000]',
    symbol: (
      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-sm shadow-2xs">
        “
      </div>
    )
  },
  {
    name: 'JM FINANCIAL',
    industry: 'Investment Bank',
    logoColor: 'text-[#0f3057]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-blue-400 font-black text-xs shadow-2xs">
        JM
      </div>
    )
  },
  {
    name: 'MOTILAL OSWAL',
    industry: 'Securities',
    logoColor: 'text-[#ea580c]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-black text-xs shadow-2xs">
        MO
      </div>
    )
  },
  {
    name: 'AMBIT',
    industry: 'Capital Markets',
    logoColor: 'text-[#1e3a8a]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white font-black text-xs tracking-wider shadow-2xs">
        AM
      </div>
    )
  },
  {
    name: 'ITC Limited',
    industry: 'FMCG Giant',
    logoColor: 'text-[#0B2865]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#E31B23] font-black text-xs shadow-2xs">
        ITC
      </div>
    )
  },
  {
    name: 'Deloitte',
    industry: 'Big 4 Advisory',
    logoColor: 'text-slate-900',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-2xs relative">
        <span>D</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-1 right-1" />
      </div>
    )
  },
  {
    name: 'KPMG',
    industry: 'Big 4 Advisory',
    logoColor: 'text-[#00338D]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-[#00338D] flex items-center justify-center text-white font-black text-[10px] tracking-tight shadow-2xs">
        KPMG
      </div>
    )
  },
  {
    name: 'EY (Ernst & Young)',
    industry: 'Big 4 Advisory',
    logoColor: 'text-slate-900',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-slate-900 font-black text-xs shadow-2xs">
        EY
      </div>
    )
  },
  {
    name: 'ICICI Bank',
    industry: 'Leading Bank',
    logoColor: 'text-[#B02A30]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-[#B02A30] flex items-center justify-center text-white font-black text-[10px] shadow-2xs">
        ICICI
      </div>
    )
  },
  {
    name: 'Kotak Bank',
    industry: 'Banking & NBFC',
    logoColor: 'text-[#003366]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-[#ED1C24] flex items-center justify-center text-white font-black text-xs shadow-2xs">
        K
      </div>
    )
  },
  {
    name: 'Vedanta',
    industry: 'Natural Resources',
    logoColor: 'text-[#002B49]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-[#00875A] flex items-center justify-center text-white font-black text-xs shadow-2xs">
        V
      </div>
    )
  },
  {
    name: 'NSE India',
    industry: 'Stock Exchange',
    logoColor: 'text-[#EF4123]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EF4123] font-black text-xs shadow-2xs">
        NSE
      </div>
    )
  },
  {
    name: 'Citibank',
    industry: 'Global Banking',
    logoColor: 'text-[#003B70]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-[#003B70] flex items-center justify-center text-white font-black text-[10px] shadow-2xs">
        CITI
      </div>
    )
  },
  {
    name: 'Genpact',
    industry: 'Global Services',
    logoColor: 'text-[#0072CE]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-[#0072CE] flex items-center justify-center text-white font-black text-xs shadow-2xs">
        G
      </div>
    )
  },
  {
    name: 'RPG Group',
    industry: 'Conglomerate',
    logoColor: 'text-[#0B2F64]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-[#0B2F64] flex items-center justify-center text-white font-black text-xs shadow-2xs">
        RPG
      </div>
    )
  },
  {
    name: 'IndiGo (InterGlobe)',
    industry: 'Aviation',
    logoColor: 'text-[#001D6E]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-[#001D6E] flex items-center justify-center text-white font-black text-[10px] shadow-2xs">
        6E
      </div>
    )
  },
  {
    name: 'Protiviti',
    industry: 'Consulting',
    logoColor: 'text-[#005B94]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-[#005B94] flex items-center justify-center text-white font-black text-xs shadow-2xs">
        P
      </div>
    )
  },
  {
    name: 'YES BANK',
    industry: 'Commercial Bank',
    logoColor: 'text-[#004A8D]',
    symbol: (
      <div className="w-8 h-8 rounded-lg bg-[#004A8D] flex items-center justify-center text-white font-black text-[10px] shadow-2xs">
        YES
      </div>
    )
  }
];

export const CorporateRecruitersSection = () => {
  // Duplicate array for infinite seamless looping
  const marqueeList = [...allCorporateRecruiters, ...allCorporateRecruiters];

  return (
    <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 bg-[#edf4ff] border-b border-blue-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Heading & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 text-left z-10 shrink-0"
          >
            <div className="inline-flex items-center gap-2 bg-white border border-blue-200 px-3 py-1 rounded-full mb-2.5 shadow-2xs hover:scale-105 transition-transform">
              <Briefcase size={14} className="text-blue-600 animate-pulse" />
              <span className="text-[11px] font-black text-blue-700 tracking-wider uppercase">
                PAST CORPORATE RECRUITERS
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0b192c] tracking-tight mb-2.5">
              60+ Top-Notch Corporates of India
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 font-normal">
              India’s No.1 FMCG giants, Big 4 advisory firms, premier private banks, and industrial conglomerates recruit CAs through FAST Careers.
            </p>

            <Link to="/placement-drive">
              <motion.button 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm hover:shadow-lg"
              >
                <span>Join as Recruiter</span>
                <ArrowRight size={15} />
              </motion.button>
            </Link>
          </motion.div>

          {/* RIGHT SIDE: Smooth Animated Infinite Scrolling Line of Recruiter Cards */}
          <div className="lg:col-span-8 overflow-hidden relative">
            
            {/* Edge Fade Gradients */}
            <div className="absolute left-0 top-0 bottom-12 w-12 sm:w-16 z-20 pointer-events-none bg-gradient-to-r from-[#edf4ff] to-transparent" />
            <div className="absolute right-0 top-0 bottom-12 w-12 sm:w-16 z-20 pointer-events-none bg-gradient-to-l from-[#edf4ff] to-transparent" />

            {/* Continuous Infinite Scrolling Row with Pause on Hover */}
            <div className="flex overflow-hidden py-1 mb-3.5 group/marquee">
              <div className="animate-marquee group-hover/marquee:[animation-play-state:paused] flex items-center gap-3">
                {marqueeList.map((item, idx) => (
                  <motion.div
                    key={`recruiter-${idx}`}
                    whileHover={{ y: -6, scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-blue-400 transition-all text-center flex flex-col items-center justify-between w-[130px] sm:w-[145px] h-[100px] shrink-0 cursor-pointer"
                  >
                    <div className="mb-1 flex items-center justify-center transform transition-transform group-hover:scale-110">
                      {item.symbol}
                    </div>
                    <div>
                      <div className={`text-[11px] font-black tracking-tight leading-tight truncate max-w-[125px] ${item.logoColor}`}>
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5 truncate max-w-[125px]">
                        {item.industry}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Wide Outlined Action Bar below the animated line */}
            <Link to="/placement-results">
              <motion.div 
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white hover:bg-blue-50 border border-blue-200/90 rounded-2xl py-2.5 px-5 text-center text-blue-700 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                <span>Why FAST Careers Only, for CA Recruitments?</span>
                <ChevronRight size={15} className="shrink-0 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
};
