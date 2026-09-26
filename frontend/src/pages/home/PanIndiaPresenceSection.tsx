import React from 'react';
import { 
  MapPin, 
  Building2, 
  Globe, 
  Laptop, 
  Users, 
  ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const PanIndiaPresenceSection = () => {
  return (
    <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start" style={{ perspective: 1200 }}>
          
          {/* LEFT SIDE: Heading & Description */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="lg:col-span-4 text-left"
          >
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3 shadow-2xs hover:scale-105 transition-transform">
              <MapPin size={14} className="text-blue-600 animate-bounce" />
              <span className="text-[11px] font-black text-blue-700 tracking-wider uppercase">
                PAN-INDIA PRESENCE TODAY
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0b192c] tracking-tight mb-3 leading-snug">
              Physical Campus in 10+ Cities & <br className="hidden sm:inline" />
              Virtual Coverage Pan-India
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Whether candidates are located in Tier 1 metros, Tier 2 capitals, or regional towns; FAST Careers enables seamless interview opportunities with top corporate employers through physical venues and high-tech virtual interview rooms.
            </p>
          </motion.div>

          {/* RIGHT SIDE: Regional & Virtual Location Cards */}
          <div className="lg:col-span-8 space-y-3.5">
            
            {/* Top Row: North, West, South */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* North Region */}
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: 0.04 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white hover:bg-blue-50/50 rounded-2xl p-4 border-2 border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-lg transition-all duration-200 flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={13} className="text-blue-600 shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">
                      NORTH REGION
                    </span>
                  </div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    New Delhi NCR • Jaipur
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 ml-2 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs group-hover:scale-110">
                  <Building2 size={16} />
                </div>
              </motion.div>

              {/* West Region */}
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: 0.08 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white hover:bg-blue-50/50 rounded-2xl p-4 border-2 border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-lg transition-all duration-200 flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={13} className="text-blue-600 shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">
                      WEST REGION
                    </span>
                  </div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    Mumbai • Pune • Ahmedabad • Indore
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 ml-2 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs group-hover:scale-110">
                  <Building2 size={16} />
                </div>
              </motion.div>

              {/* South Region */}
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: 0.12 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white hover:bg-blue-50/50 rounded-2xl p-4 border-2 border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-lg transition-all duration-200 flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={13} className="text-blue-600 shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">
                      SOUTH REGION
                    </span>
                  </div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    Bengaluru • Chennai • Hyderabad
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 ml-2 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs group-hover:scale-110">
                  <Building2 size={16} />
                </div>
              </motion.div>

            </div>

            {/* Bottom Row: East, Virtual Campus, 100% Pan-India */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              
              {/* East Region */}
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: 0.16 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="sm:col-span-3 bg-white hover:bg-blue-50/50 rounded-2xl p-4 border-2 border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-lg transition-all duration-200 flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={13} className="text-blue-600 shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">
                      EAST REGION
                    </span>
                  </div>
                  <div className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    Kolkata
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 ml-2 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs group-hover:scale-110">
                  <Building2 size={16} />
                </div>
              </motion.div>

              {/* All-India Virtual Campus */}
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="sm:col-span-6 bg-white hover:bg-blue-50/50 rounded-2xl p-4 border-2 border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-lg transition-all duration-200 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs group-hover:scale-110">
                    <Globe size={16} className="group-hover:rotate-45 transition-transform duration-500" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-blue-700 uppercase tracking-wider mb-0.5">
                      ALL-INDIA VIRTUAL CAMPUS
                    </div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      Centrally Managed Virtual Drives across all 28 States & UTs
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 shrink-0 ml-2 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-2xs">
                  <Laptop size={16} />
                </div>
              </motion.div>

              {/* Green 100% Pan-India Digital Reach Card */}
              <Link to="/placement-results" className="sm:col-span-3 block">
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.3, delay: 0.24 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full bg-emerald-50 hover:bg-emerald-100/90 border-2 border-emerald-300 hover:border-emerald-500 rounded-2xl p-3.5 shadow-xs hover:shadow-lg flex items-center justify-between text-emerald-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-115 transition-transform">
                      <Users size={14} />
                    </div>
                    <span className="text-xs font-black leading-tight">
                      100% Pan-India Digital Reach
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-emerald-700 shrink-0 group-hover:translate-x-1.5 transition-transform" />
                </motion.div>
              </Link>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
