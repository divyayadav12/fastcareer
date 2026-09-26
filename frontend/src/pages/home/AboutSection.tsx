import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Users, Target, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section className="py-10 sm:py-12 bg-white border-b border-slate-200 overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold mb-3 hover:scale-105 transition-transform">
            <Shield size={16} className="text-blue-700 animate-pulse" />
            <span>Why FAST Careers Only, for CA Recruitments?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3">
            India’s Premier CA Placement Gateway
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Fast Career Consultants Private Limited has spent over 18 years building India's largest specialized ecosystem for Chartered Accountants and corporate recruiters.
          </p>
        </motion.div>

        {/* 3 Core Pillars with Dynamic Scroll Entrance Animation */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 overflow-hidden">
          
          {/* Pillar 1: Serving The Best (Slides in from Left) */}
          <motion.div
            initial={{ opacity: 0, x: -120, scale: 0.94 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.95, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl p-7 border-2 border-slate-200/80 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white flex items-center justify-center mb-5 shadow-xs transition-all duration-300 group-hover:scale-110">
                <Award size={24} />
              </div>
              <span className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Pillar 01</span>
              <h3 className="text-xl font-black text-slate-900 mb-2.5 group-hover:text-blue-700 transition-colors">Serving The Best</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                <strong className="text-slate-900">60+ Top-notch corporates of India</strong> recruit CAs from FAST Careers. From India’s No.1 FMCG giants and Big 4 advisory firms to leading private banks and multinational conglomerates.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
              <span>ITC, Deloitte, KPMG, EY, ICICI, Kotak</span>
            </div>
          </motion.div>

          {/* Pillar 2: Largest Talent Pool (Floats up from Center with Highlight Glow) */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.95, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl p-7 border-2 border-blue-500 shadow-[0_8px_30px_rgba(37,99,235,0.12)] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/30 transition-all duration-300 group-hover:scale-110">
                <Users size={24} />
              </div>
              <span className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Pillar 02</span>
              <h3 className="text-xl font-black text-[#0F172A] mb-2.5 group-hover:text-blue-700 transition-colors">Largest CA Pool in India</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3 font-normal">
                <strong className="text-slate-900">125,000+ CAs have registered with us</strong> at www.fast-india.com seeking job opportunities — <em>larger than any other private source in India</em>.
              </p>
              <div className="bg-blue-50/90 rounded-2xl p-3 text-xs text-blue-900 font-semibold border border-blue-200/80 mb-3 group-hover:bg-blue-100 transition-colors leading-relaxed">
                <strong>All AIRs & 5000+ candidates</strong> enroll after every ICAI results with us for their first job.
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
              <span>All India Rankers & Pre-screened</span>
            </div>
          </motion.div>

          {/* Pillar 3: Bird's Eye Focus (Slides in from Right) */}
          <motion.div
            initial={{ opacity: 0, x: 120, scale: 0.94 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.95, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl p-7 border-2 border-slate-200/80 hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center mb-5 shadow-xs transition-all duration-300 group-hover:scale-110">
                <Target size={24} />
              </div>
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider block mb-1">Pillar 03</span>
              <h3 className="text-xl font-black text-slate-900 mb-2.5 group-hover:text-emerald-700 transition-colors">Bird’s Eye Focus on Finance</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                We deal and specialise <strong>only in Finance & CA Recruitments</strong>. This dedicated focus attracts the finest talent as well as premier corporates looking for domain expertise.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
              <span>Dedicated Finance Domain Specialists</span>
            </div>
          </motion.div>

        </div>

        {/* Bottom Banner CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.015, y: -4 }}
          className="mt-8 p-6 sm:p-7 bg-slate-50 hover:bg-blue-50/40 border-2 border-slate-200 hover:border-blue-300 rounded-3xl text-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs transition-all"
        >
          <div>
            <h4 className="text-base sm:text-lg font-black text-slate-900">Looking to recruit premier CA talent for your organization?</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-normal">Get custom shortlists or schedule a dedicated recruitment drive with our team.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/placement-drive">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Participate in Drive</span>
                <ArrowRight size={15} />
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
