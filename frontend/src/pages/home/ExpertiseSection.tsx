import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Landmark, 
  Calculator, 
  FileCheck, 
  Briefcase, 
  Award, 
  Scale, 
  Cpu, 
  Crown, 
  Network,
  Users,
  ArrowRight,
  Building,
  Star,
  Zap,
  Navigation,
  ExternalLink
} from 'lucide-react';

const campusCities = [
  { 
    id: 'mumbai',
    name: 'Mumbai', 
    desc: 'Financial Capital Campus Drives', 
    tag: 'Flagship Venue',
    tagType: 'flagship',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 'delhi',
    name: 'Delhi NCR', 
    desc: 'North India Premier Hub', 
    tag: 'Major Venue',
    tagType: 'major',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 'bengaluru',
    name: 'Bengaluru', 
    desc: 'Corporate & Tech Finance Hub', 
    tag: 'High Demand',
    tagType: 'high_demand',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 'chennai',
    name: 'Chennai', 
    desc: 'South India Campus Hub', 
    tag: 'Regional Hub',
    tagType: 'regional',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 'kolkata',
    name: 'Kolkata', 
    desc: 'East India CA Network', 
    tag: 'Regional Hub',
    tagType: 'regional_active',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 'pune',
    name: 'Pune', 
    desc: 'Industrial & Shared Services', 
    tag: 'Active Hub',
    tagType: 'active',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 'ahmedabad',
    name: 'Ahmedabad', 
    desc: 'Commercial & Manufacturing', 
    tag: 'Active Hub',
    tagType: 'active',
    image: 'https://images.unsplash.com/photo-1597047084897-51e81819a499?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 'hyderabad',
    name: 'Hyderabad', 
    desc: 'Global Services & IT Hub', 
    tag: 'Active Hub',
    tagType: 'active',
    image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&auto=format&fit=crop&q=80'
  },
];

const coreExpertise = [
  { name: 'Finance', icon: Landmark },
  { name: 'Accounting', icon: Calculator },
  { name: 'Compliance', icon: FileCheck },
  { name: 'Management', icon: Briefcase },
  { name: 'CA, CS & CMA', icon: Award },
  { name: 'CFA, CPA & CFO', icon: Scale },
  { name: 'MBA & Engineers', icon: Cpu },
  { name: 'C-Level Executives', icon: Crown },
];

export const ExpertiseSection = () => {
  const [selectedCity, setSelectedCity] = useState('kolkata');

  return (
    <div id="expertise" className="overflow-hidden bg-[#F8FAFC]">
      
      {/* 1. Our Core Expertise - Dark Themed Section */}
      <section className="py-12 sm:py-16 bg-[#0B1528] text-white relative overflow-hidden border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-center max-w-2xl mx-auto mb-8 sm:mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Our Core Expertise
            </h2>
            <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-4" />
            <p className="text-slate-300/90 text-sm sm:text-base font-normal">
              Specialized recruitment across key business functions.
            </p>
          </motion.div>

          {/* 8 Compact Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 max-w-5xl mx-auto">
            {coreExpertise.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.28, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-[#132238]/90 hover:bg-[#192b47] border border-slate-700/70 hover:border-blue-500/80 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-lg transition-all duration-200 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-200 mb-2.5">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-white font-bold text-sm sm:text-base tracking-wide group-hover:text-blue-300 transition-colors">
                    {item.name}
                  </h3>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. Major Physical Campus Venues across 8+ Cities */}
      <section className="py-8 sm:py-10 bg-gradient-to-b from-[#EDF5FF]/70 via-[#F8FAFC] to-white relative overflow-hidden">
        
        {/* Subtle background ambient glow */}
        <div className="absolute top-6 left-1/4 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Split Section: Left Info & Right India Map Graphic */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mb-6 sm:mb-8">
            
            {/* Left Header Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="lg:col-span-6 text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3FE] text-[#1E40AF] text-xs font-bold mb-3 shadow-xs border border-blue-200/60">
                <MapPin size={13} className="text-[#2563EB] fill-[#2563EB]" />
                <span>Pan-India Infrastructure & Venues</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-[#0F172A] tracking-tight leading-[1.2] mb-3">
                Conducted at the Best Venues <br className="hidden sm:inline" />
                across <span className="text-[#2563EB]">8+ Cities</span>
              </h2>

              {/* Subtitle */}
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl font-normal">
                FAST Careers conducts physical and virtual recruitment drives for leading corporates of India, packed with premier talent.
              </p>
            </motion.div>

            {/* Right India Map: Interactive Real Map with Highlighted Campus Cities */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="lg:col-span-6 w-full relative"
            >
              <div className="relative w-full h-[280px] sm:h-[310px] bg-white rounded-2xl p-2.5 border border-blue-100/90 shadow-[0_4px_20px_rgba(37,99,235,0.06)] overflow-hidden flex flex-col justify-between">
                
                {/* Map Header Overlay */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-blue-200/80 shadow-xs flex items-center gap-1.5 pointer-events-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-3.5" />
                    <span className="text-[10px] font-black text-slate-900">8+ Active Venues</span>
                  </div>

                  <a
                    href="https://maps.google.com/?q=India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/95 backdrop-blur-md hover:bg-blue-600 hover:text-white px-2.5 py-1 rounded-full border border-blue-200 text-[#2563EB] text-[10px] font-bold shadow-xs transition-colors pointer-events-auto flex items-center gap-1"
                  >
                    <span>Open Map</span>
                    <Navigation size={9} className="rotate-45" />
                  </a>
                </div>

                {/* Real Interactive Google Map Container */}
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-200/80 bg-[#E8F0F8]">
                  <iframe
                    title="FAST Careers 8+ Campus Cities Map"
                    src="https://maps.google.com/maps?q=India&t=&z=5&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0 filter saturate-[0.9] contrast-[1.05]"
                    loading="lazy"
                    allowFullScreen
                  />

                  {/* Highlighted Campus Drive City Pins Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    
                    {/* Delhi NCR */}
                    <div className="absolute top-[24%] left-[45%] flex flex-col items-center group pointer-events-auto cursor-pointer">
                      <div className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black shadow-md border border-white whitespace-nowrap animate-bounce">
                        Delhi NCR
                      </div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full border-2 border-white shadow-xs -mt-0.5" />
                    </div>

                    {/* Ahmedabad */}
                    <div className="absolute top-[44%] left-[26%] flex flex-col items-center group pointer-events-auto cursor-pointer">
                      <div className="px-1 py-0.5 bg-indigo-700 text-white rounded text-[7.5px] font-bold shadow-md border border-white whitespace-nowrap">
                        Ahmedabad
                      </div>
                      <div className="w-1.5 h-1.5 bg-indigo-700 rounded-full border border-white shadow-xs" />
                    </div>

                    {/* Mumbai */}
                    <div className="absolute top-[56%] left-[30%] flex flex-col items-center group pointer-events-auto cursor-pointer">
                      <div className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black shadow-md border border-white whitespace-nowrap animate-pulse">
                        Mumbai ★
                      </div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full border-2 border-white shadow-xs -mt-0.5" />
                    </div>

                    {/* Pune */}
                    <div className="absolute top-[63%] left-[36%] flex flex-col items-center group pointer-events-auto cursor-pointer">
                      <div className="px-1 py-0.5 bg-slate-900 text-white rounded text-[7.5px] font-bold shadow-md border border-white whitespace-nowrap">
                        Pune
                      </div>
                      <div className="w-1.5 h-1.5 bg-slate-900 rounded-full border border-white shadow-xs" />
                    </div>

                    {/* Kolkata */}
                    <div className="absolute top-[43%] left-[76%] flex flex-col items-center group pointer-events-auto cursor-pointer">
                      <div className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black shadow-md border border-white whitespace-nowrap animate-bounce">
                        Kolkata
                      </div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full border-2 border-white shadow-xs -mt-0.5" />
                    </div>

                    {/* Hyderabad */}
                    <div className="absolute top-[59%] left-[48%] flex flex-col items-center group pointer-events-auto cursor-pointer">
                      <div className="px-1 py-0.5 bg-indigo-700 text-white rounded text-[7.5px] font-bold shadow-md border border-white whitespace-nowrap">
                        Hyderabad
                      </div>
                      <div className="w-1.5 h-1.5 bg-indigo-700 rounded-full border border-white shadow-xs" />
                    </div>

                    {/* Bengaluru */}
                    <div className="absolute top-[74%] left-[43%] flex flex-col items-center group pointer-events-auto cursor-pointer">
                      <div className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black shadow-md border border-white whitespace-nowrap animate-pulse">
                        Bengaluru ⚡
                      </div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full border-2 border-white shadow-xs -mt-0.5" />
                    </div>

                    {/* Chennai */}
                    <div className="absolute top-[78%] left-[54%] flex flex-col items-center group pointer-events-auto cursor-pointer">
                      <div className="px-1 py-0.5 bg-indigo-700 text-white rounded text-[7.5px] font-bold shadow-md border border-white whitespace-nowrap">
                        Chennai
                      </div>
                      <div className="w-1.5 h-1.5 bg-indigo-700 rounded-full border border-white shadow-xs" />
                    </div>

                  </div>

                </div>

                {/* Bottom Bar: Quick Cities Ticker */}
                <div className="mt-1.5 px-0.5 flex items-center justify-between text-[9.5px] font-bold text-slate-500">
                  <span className="flex items-center gap-1 text-[#2563EB]">
                    <MapPin size={10} className="fill-current" />
                    <span>Physical Drives: Mumbai • Delhi • Bengaluru • Kolkata • Pune • Hyderabad</span>
                  </span>
                  <span className="text-slate-400 hidden sm:inline">+2 more</span>
                </div>

              </div>
            </motion.div>

          </div>

          {/* Unified Metrics Bar Card */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="bg-white rounded-2xl p-2.5 sm:p-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-slate-100 mb-6 sm:mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* Metric 1 */}
              <div className="flex items-center gap-3 py-2 px-3 sm:px-4">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FE] flex items-center justify-center text-[#2563EB] shrink-0">
                  <MapPin size={18} className="fill-[#2563EB]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg sm:text-xl font-extrabold text-[#0F172A]">8+</span>
                    <span className="text-xs sm:text-sm font-bold text-[#0F172A]">Cities</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Top cities, top talent, across India.
                  </p>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-center gap-3 py-2 px-3 sm:px-4">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FE] flex items-center justify-center text-[#2563EB] shrink-0">
                  <Network size={18} />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg sm:text-xl font-extrabold text-[#0F172A]">Pan-India</span>
                    <span className="text-xs sm:text-sm font-bold text-[#0F172A]">Reach</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Bringing opportunities to every corner.
                  </p>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex items-center gap-3 py-2 px-3 sm:px-4">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FE] flex items-center justify-center text-[#2563EB] shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg sm:text-xl font-extrabold text-[#0F172A]">Physical + Virtual</span>
                    <span className="text-xs sm:text-sm font-bold text-[#0F172A]">Drives</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Flexible, accessible, future-ready.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Subheader: Major Physical Campus Venues */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-4 sm:mb-5"
          >
            <MapPin size={18} className="text-[#2563EB] fill-[#2563EB]" />
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
              Major Physical Campus Venues:
            </h3>
          </motion.div>
          
          {/* 4 Cards Per Row Grid with Prominent Scroll Stagger Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {campusCities.map((city, index) => {
              const isSelected = selectedCity === city.id;
              
              return (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 40, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => setSelectedCity(city.id)}
                  transition={{ 
                    duration: 0.55, 
                    delay: (index % 4) * 0.1 + Math.floor(index / 4) * 0.15,
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className={`bg-white rounded-2xl p-3 sm:p-3.5 transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                    isSelected 
                      ? 'border-2 border-[#2563EB] shadow-[0_8px_25px_rgba(37,99,235,0.14)]' 
                      : 'border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-blue-300'
                  }`}
                >
                  <div>
                    {/* Top Row: Landmark Thumbnail + Content + Tag */}
                    <div className="flex items-start gap-3 mb-2.5">
                      
                      {/* Landmark Image Thumbnail */}
                      <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-xl overflow-hidden shrink-0 shadow-2xs border border-slate-100 bg-slate-100">
                        <img 
                          src={city.image} 
                          alt={city.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      {/* City Name & Description */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="font-extrabold text-sm sm:text-[15px] text-[#0F172A] truncate">
                            {city.name}
                          </h4>
                        </div>

                        {/* Tag Badge */}
                        <div className="mb-1">
                          <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                            city.tagType === 'flagship'
                              ? 'bg-[#EBF3FE] text-[#2563EB]'
                              : city.tagType === 'major'
                              ? 'bg-[#EBF3FE] text-[#2563EB]'
                              : city.tagType === 'high_demand'
                              ? 'bg-emerald-50 text-emerald-600'
                              : city.tagType === 'regional_active'
                              ? 'bg-[#2563EB] text-white shadow-2xs'
                              : city.tagType === 'regional'
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'bg-sky-50 text-sky-600'
                          }`}>
                            {city.tagType === 'high_demand' ? (
                              <Zap size={8} className="fill-emerald-500 text-emerald-500" />
                            ) : city.tagType !== 'regional_active' ? (
                              <Star size={8} className="fill-current text-current" />
                            ) : null}
                            <span>{city.tag}</span>
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 font-normal leading-tight line-clamp-1">
                          {city.desc}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Card Bottom: Hub Label + Round Arrow Button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#2563EB]">
                      <Building size={12} className="text-[#2563EB]" />
                      <span>FAST CA Campus</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5 ${
                      isSelected 
                        ? 'bg-[#EBF3FE] text-[#2563EB]' 
                        : 'bg-[#F1F5F9] text-slate-500 hover:bg-[#EBF3FE] hover:text-[#2563EB]'
                    }`}>
                      <ArrowRight size={10} />
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
};


