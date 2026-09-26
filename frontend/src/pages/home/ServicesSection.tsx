import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Users, Lightbulb, ArrowRight, CheckCircle2, Sparkles, Building2, UserCheck, CalendarCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: GraduationCap,
    title: 'Campus Recruitment',
    description: 'Connect organizations with emerging Chartered Accountants, rankers, and finance talent through nationwide campus drives.',
    badge: 'Freshers & Rankers',
    link: '/placement-drive'
  },
  {
    icon: Briefcase,
    title: 'Lateral Recruitment',
    description: 'Identify experienced CA professionals (1 to 15+ yrs) based on specific audit, taxation, and corporate finance requirements.',
    badge: 'Experienced CAs',
    link: '/placement-drive'
  },
  {
    icon: Users,
    title: 'Recruitment Consultancy',
    description: 'End-to-end recruitment support, from candidate profiling and pre-screening to interview coordination and feedback.',
    badge: 'Full Lifecycle',
    link: '/services'
  },
  {
    icon: Lightbulb,
    title: 'Training & Mentorship',
    description: 'Grooming candidates on Big 4 case interviews, technical tax/audit frameworks, and articulate presentation.',
    badge: 'Masterclasses',
    link: '/team'
  }
];

const deliveryModes = [
  {
    modeNumber: 'MODE 01',
    badge: 'Flagship Program',
    badgeColor: 'bg-blue-700 text-white',
    icon: Building2,
    title: 'FAST CA CAMPUS',
    subtitle: 'Private Off-Campus Drives for CA Freshers',
    description: 'Exclusive CA Campus Drives conducted across 9+ cities physically and centrally virtually for CA Freshers. The biggest private job fairs for CAs in India.',
    points: [
      'Conducted twice a year: January–February & August–September',
      '5,000+ candidates register for each campus cycle',
      '20–30 top corporates participate across India',
      'Most suited for CA Fresher & Ranker recruitments'
    ],
    highlight: 'Drives across Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Pune, etc.',
    cta: 'Register for Campus Drive',
    link: '/placement-drive'
  },
  {
    modeNumber: 'MODE 02',
    badge: 'Experienced Hiring',
    badgeColor: 'bg-slate-900 text-white',
    icon: UserCheck,
    title: 'LATERAL RECRUITMENTS',
    subtitle: 'Traditional 1-on-1 Executive Hiring',
    description: 'Traditional Hiring Method where candidates are lined up individually for interviews virtually or in person for face-to-face selection processes.',
    points: [
      'Screened from our database of 125,000+ CAs or head-hunted',
      'Trained HR recruiters match candidates to exact JD',
      'Fast turnaround with verified track record and credentials',
      'Most suitable for Few Requirements & Experienced CAs (1 to 15+ yrs)'
    ],
    highlight: 'Mid to Senior CA & Finance Leadership Profiles',
    cta: 'Submit Lateral Requirement',
    link: '/placement-drive'
  },
  {
    modeNumber: 'MODE 03',
    badge: 'Customized & Exclusive',
    badgeColor: 'bg-emerald-700 text-white',
    icon: CalendarCheck,
    title: 'COMPANY SPECIFIC DRIVE',
    subtitle: 'Dedicated Day-Long Recruitment Drives',
    description: 'A pool of pre-screened candidates lined up on a mutually convenient date and venue for a dedicated, day-long recruitment process.',
    points: [
      'Customised exclusive drives on mutually accepted dates',
      'Can be organised in any city of choice or virtually / blended mode',
      'Organised at your office premises, business centres, or hotel venues',
      'Most suitable for High-Volume Fresher & Ranker Hirings'
    ],
    highlight: 'Dedicated Selection Process in Any City of Choice',
    cta: 'Plan Dedicated Drive',
    link: '/placement-drive'
  }
];

export const ServicesSection = () => {
  return (
    <section className="py-10 sm:py-12 bg-slate-50 border-b border-slate-200" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold mb-3">
            <Sparkles size={16} className="text-blue-700" />
            <span>End-to-End Talent Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            End-to-End Talent Solutions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Comprehensive recruitment services designed to build high-performing finance teams and advance Chartered Accountant careers.
          </p>
        </div>

        {/* 4 Cards in 1 Row Grid with 2 from Left and 2 from Right Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-12 overflow-hidden">
          {services.map((service, index) => {
            const isLeft = index < 2; // Cards 0 & 1 from Left, Cards 2 & 3 from Right
            const animX = isLeft ? -140 : 140;
            const delay = index * 0.12;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: animX, scale: 0.94 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ 
                  duration: 0.95, 
                  delay: delay, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200/90 shadow-xs hover:shadow-2xl hover:border-blue-500 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
              >
                {/* Top Blue Highlight Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-all duration-200 shadow-xs group-hover:scale-110">
                      <service.icon size={22} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md group-hover:bg-blue-50 group-hover:text-blue-800 transition-colors">
                      {service.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-5 font-normal">
                    {service.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-100">
                  <Link 
                    to={service.link}
                    className="flex items-center text-blue-700 font-bold text-xs group-hover:translate-x-1.5 transition-transform"
                  >
                    <span>Learn more</span>
                    <ArrowRight size={13} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3 Core Service Delivery Modes Section */}
        <div className="pt-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mx-auto mb-8"
          >
            <span className="text-xs uppercase tracking-wider font-extrabold text-blue-700 block mb-2">
              SERVICE DELIVERY MODES
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
              3 Specialized Delivery Frameworks for CA Recruitment
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              Tailored recruitment modes for CA Freshers, Lateral Appointments, and Dedicated Corporate Drives.
            </p>
          </motion.div>

          {/* Stacking Wide Horizontal Delivery Mode Cards */}
          <div className="space-y-6 max-w-5xl mx-auto pb-12 relative">
            {deliveryModes.map((mode, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ top: `calc(90px + ${index * 16}px)` }}
                  className="sticky bg-white rounded-3xl p-6 sm:p-8 md:p-9 border-2 border-slate-200/90 hover:border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-200 group cursor-pointer"
                >
                  <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-center">
                    
                    {/* Left Column */}
                    <div className="md:col-span-7">
                      <div className="flex items-center gap-3 mb-2.5">
                        <span className="text-xs font-black text-blue-700 tracking-wider">
                          {mode.modeNumber}
                        </span>
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${mode.badgeColor} shadow-2xs`}>
                          {mode.badge}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:scale-110">
                          <mode.icon size={20} />
                        </div>
                        <div>
                          <h4 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                            {mode.title}
                          </h4>
                          <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                            {mode.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-3">
                        {mode.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <MapPin size={13} className="text-blue-600 shrink-0" />
                        <span>{mode.highlight}</span>
                      </div>
                    </div>

                    {/* Right Column: Key Points + CTA Button */}
                    <div className="md:col-span-5 bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                      <div className="space-y-2 mb-4">
                        {mode.points.map((pt, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>

                      <Link to={mode.link}>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2.5 bg-slate-900 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                        >
                          <span>{mode.cta}</span>
                          <ArrowRight size={14} />
                        </motion.button>
                      </Link>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
