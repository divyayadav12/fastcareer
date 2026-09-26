import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  ArrowRight, 
  Building2, 
  UserPlus, 
  MessageCircle, 
  Briefcase,
  ExternalLink,
  Plus,
  Minus,
  Crosshair,
  TrendingUp
} from 'lucide-react';
import { ExecutiveLeadershipCards } from '../../components/ExecutiveLeadershipCards';

export const CTASection = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#EDF5FF]/60 via-[#F8FAFC] to-[#F1F5F9] border-t border-slate-200/80 relative overflow-hidden" id="contact-leaders">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. Top Section: Split Layout (Left Content & Right Corporate Team Graphic) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-10 sm:mb-12">
          
          {/* Left Column: Heading, Subtitle & Fast Registration Buttons */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBF3FE] text-[#1E40AF] text-xs sm:text-sm font-bold mb-4 border border-blue-200/70 shadow-xs">
              <Phone size={13} className="text-[#2563EB] fill-[#2563EB]" />
              <span>We Are Just A Call Away</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] tracking-tight leading-[1.18] mb-4">
              Ready to Partner with <br />
              <span className="text-[#2563EB]">India’s Largest CA Placement <br className="hidden sm:inline" />Company?</span>
            </h2>

            {/* Description Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal mb-6">
              Whether you want to recruit premium CA talent for your organization or register for the upcoming FAST CA Campus Drive — get in touch with our leadership directly.
            </p>

            {/* Top Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/register">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-full shadow-md shadow-blue-600/20 text-xs sm:text-sm flex items-center gap-2 transition-all"
                >
                  <UserPlus size={15} />
                  <span>Register as CA Candidate</span>
                  <ArrowRight size={14} />
                </motion.button>
              </Link>
              <Link to="/placement-drive">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 text-[#2563EB] border border-[#2563EB] font-bold rounded-full shadow-xs text-xs sm:text-sm flex items-center gap-2 transition-all"
                >
                  <Building2 size={15} className="text-[#2563EB]" />
                  <span>Corporate Recruitment Registration</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Corporate Professionals Graphic & Skyline */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5 flex justify-center lg:justify-end relative"
          >
            <div className="relative w-full max-w-[380px] h-[280px] sm:h-[300px] flex items-center justify-center">
              
              {/* Background Skyline Silhouette & Gradient Orb */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-100/70 via-sky-50/50 to-transparent rounded-3xl" />
              
              {/* Abstract Skyline Buildings Outline */}
              <svg viewBox="0 0 300 200" className="absolute bottom-0 w-full text-blue-200/60 fill-current opacity-60">
                <rect x="20" y="70" width="35" height="130" rx="3" />
                <rect x="60" y="40" width="45" height="160" rx="3" />
                <rect x="110" y="80" width="30" height="120" rx="3" />
                <rect x="145" y="20" width="55" height="180" rx="4" />
                <rect x="205" y="60" width="40" height="140" rx="3" />
                <rect x="250" y="90" width="35" height="110" rx="3" />
              </svg>

              {/* Upward Growth Arrow in background */}
              <div className="absolute top-6 right-8 text-blue-400/40 rotate-12">
                <TrendingUp size={70} strokeWidth={2.5} />
              </div>

              {/* Corporate Professionals Photo Cutout */}
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80" 
                alt="Corporate Professionals" 
                className="relative z-10 w-60 sm:w-64 h-auto object-cover rounded-2xl shadow-md border-2 border-white"
              />

              {/* Cursive "Your Career, Our Priority" annotation */}
              <div className="absolute -right-2 top-10 sm:top-12 z-20 flex flex-col items-center rotate-[10deg]">
                <span className="text-[#1E40AF] font-bold text-sm sm:text-base font-serif italic tracking-wide whitespace-nowrap">
                  Your Career,
                </span>
                <span className="text-[#2563EB] font-black text-base sm:text-lg font-serif italic tracking-tight whitespace-nowrap -mt-1">
                  Our Priority
                </span>
                <svg viewBox="0 0 60 10" className="w-16 h-2 text-[#2563EB]">
                  <path d="M 2 7 Q 30 1 58 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

            </div>
          </motion.div>

        </div>

        {/* 2. Middle Section: Two Executive Leadership Cards */}
        <ExecutiveLeadershipCards className="mb-8 sm:mb-10" />

        {/* 3. Bottom Section: Interactive Map Card (FAST Careers Head Office - Indore) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-8 sm:mb-10"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-[#2563EB] fill-[#2563EB]" />
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-[#0F172A]">
                  FAST Careers Corporate Headquarters
                </h4>
                <p className="text-xs text-slate-500 font-normal">
                  Opposite Jain Mandir, Geeta Bhawan Square, Indore, Madhya Pradesh
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBF3FE] text-[#1E40AF] text-xs font-bold self-start sm:self-auto border border-blue-100 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Head Office • Indore (M.P.)</span>
            </div>
          </div>

          {/* Interactive Map Visual with Exact Location */}
          <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200/80 bg-[#E8F0F8]">
            
            {/* Embedded Responsive Google Map Centered on Geeta Bhawan, Indore */}
            <iframe
              title="FAST Careers Head Office - Opposite Jain Mandir Geeta Bhawan Indore"
              src="https://maps.google.com/maps?q=FAST+Education+Opposite+Jain+Mandir+Geeta+Bhawan+Indore&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 filter saturate-[0.95] contrast-[1.05]"
              loading="lazy"
              allowFullScreen
            />

            {/* Floating Top-Left: "Open in Maps ↗" Floating Button */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=FAST+Education+Opposite+Jain+Mandir+Geeta+Bhawan+Indore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute top-3.5 left-3.5 z-20 px-3.5 py-1.5 bg-white/95 backdrop-blur-md hover:bg-blue-600 hover:text-white text-[#0F172A] border border-slate-200/90 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 group"
            >
              <span>Open in Google Maps</span>
              <ExternalLink size={13} className="text-[#2563EB] group-hover:text-white transition-colors" />
            </a>

            {/* Exact Location Tag Overlay in Map */}
            <div className="absolute bottom-3 left-3 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-sm text-xs font-bold text-slate-800">
              <MapPin size={13} className="text-red-600 fill-red-600" />
              <span>FAST Careers, Opp. Jain Mandir, Geeta Bhawan, Indore</span>
            </div>

          </div>
        </motion.div>

        {/* 4. Bottom Centered CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 text-center">
          <Link to="/register">
            <motion.button 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-600/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <UserPlus size={16} />
              <span>Register as CA Candidate</span>
              <ArrowRight size={15} />
            </motion.button>
          </Link>
          <Link to="/placement-drive">
            <motion.button 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-[#2563EB] border border-[#2563EB] font-bold rounded-full shadow-xs text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Building2 size={16} className="text-[#2563EB]" />
              <span>Corporate Recruitment Registration</span>
            </motion.button>
          </Link>
        </div>


      </div>
    </section>
  );
};

