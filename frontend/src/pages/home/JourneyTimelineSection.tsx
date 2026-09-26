import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, CheckCircle2, ArrowRight, Building, Award, Users, Sparkles } from 'lucide-react';

interface Milestone {
  year: string;
  title: string;
  city: string;
  badge: string;
  badgeColor: string;
  description: string;
  highlights: string[];
}

const milestones: Milestone[] = [
  {
    year: '2008',
    title: 'Indore Inception & Maiden CA Campus',
    city: 'Indore (MP)',
    badge: 'Foundation Year',
    badgeColor: 'bg-blue-700 text-white',
    description: 'Fast Career Consultants was founded with its very first physical FAST CA Campus Placement Drive in Indore, pioneering specialized private recruitment for Chartered Accountants.',
    highlights: ['First private CA job fair in Central India', '50+ CAs placed in maiden drive', 'Foundation of 125K+ talent network']
  },
  {
    year: '2010',
    title: 'Delhi NCR Expansion & National Foothold',
    city: 'New Delhi & NCR',
    badge: 'North India Hub',
    badgeColor: 'bg-emerald-700 text-white',
    description: 'Expanded campus recruitment drives to the national capital, establishing long-term hiring partnerships with Big 4 firms, FMCG leaders, and central finance institutions.',
    highlights: ['Delhi Campus drives with 15+ corporates', 'Direct tie-ups with leading corporate houses', 'Expansion into CA Lateral hiring']
  },
  {
    year: '2012',
    title: '4+ Metro Cities & Bengaluru Tech-Finance Hub',
    city: 'Bengaluru, Mumbai, Chennai, Kolkata',
    badge: '4+ Metro Presence',
    badgeColor: 'bg-indigo-700 text-white',
    description: 'Scaled physical campus drives across 4+ major metro cities simultaneously, launching our dedicated Bengaluru hub for IT/ITES and Corporate Finance mandates.',
    highlights: ['Multi-city simultaneous campus drives', 'South & East India network established', 'Over 1,000+ CAs placed annually']
  },
  {
    year: '2020+',
    title: '10+ Cities & Centralized All-India Virtual Campus',
    city: 'Pan-India (10+ Physical Hubs & Virtual)',
    badge: 'Pan-India & Virtual',
    badgeColor: 'bg-slate-900 text-white',
    description: 'Operating across 10+ major physical cities (Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Pune, Ahmedabad, Hyderabad, Jaipur, Indore) plus Centralized All-India Virtual Campus Drives.',
    highlights: ['Connecting candidates from all 28 states & UTs', '60+ Corporates participating bi-annually', 'Zero geographical barrier for Freshers & Rankers']
  }
];

export const JourneyTimelineSection = () => {
  const [activeYear, setActiveYear] = useState('2020+');

  return (
    <section className="py-10 sm:py-12 bg-white border-b border-slate-200" id="journey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold mb-3 hover:scale-105 transition-transform">
            <Sparkles size={16} className="text-blue-700 animate-pulse" />
            <span>18+ Years of Placement Heritage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Our Journey & Pan-India Footprint
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            From our first campus in Indore in 2008 to physical drives across 10+ major cities and centralized virtual campus across all of India today.
          </p>
        </motion.div>

        {/* Stacking Wide Horizontal Cards on Scroll */}
        <div className="space-y-6 max-w-5xl mx-auto pb-12 relative">
          {milestones.map((item, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{ top: `calc(90px + ${index * 16}px)` }}
                className="sticky bg-white rounded-3xl p-6 sm:p-8 md:p-9 border-2 border-slate-200/90 shadow-xl hover:shadow-2xl hover:border-blue-400 transition-all duration-200 group cursor-pointer"
              >
                <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-center">
                  
                  {/* Left Column: Year, Badge, Title, City, Description */}
                  <div className="md:col-span-7">
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="text-3xl sm:text-4xl font-black text-blue-700 tracking-tight group-hover:scale-105 transition-transform duration-200">
                        {item.year}
                      </span>
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${item.badgeColor} shadow-2xs`}>
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-3">
                      <MapPin size={14} className="text-blue-600 shrink-0" />
                      <span>{item.city}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Right Column: Key Milestone Checklist */}
                  <div className="md:col-span-5 bg-slate-50/90 border border-slate-200/80 rounded-2xl p-5 sm:p-6">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-blue-600" />
                      <span>Key Highlights & Impact</span>
                    </h4>
                    <div className="space-y-2.5">
                      {item.highlights.map((hl, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
