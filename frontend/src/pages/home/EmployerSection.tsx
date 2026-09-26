import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, Users, Sparkles, PhoneCall, Award, FileCheck2 } from 'lucide-react';

const employerBenefits = [
  {
    title: 'Pre-Screened Talent Only',
    desc: 'Candidates verified by experienced HR recruiters on audit exposure, attempts & technical fitment.',
    icon: ShieldCheck,
    tag: 'Verified CAs'
  },
  {
    title: 'Shortlisting & Campus Day Support',
    desc: 'Excel shortlists and complete resume dossiers prepared according to your precise corporate criteria.',
    icon: FileCheck2,
    tag: 'Zero Hassle'
  },
  {
    title: 'Pan-India 10+ City Infrastructure',
    desc: 'Conducted at premium hotel venues or seamlessly coordinated virtually & blended mode.',
    icon: Building2,
    tag: 'Pan-India'
  },
  {
    title: 'Competitive Commercials',
    desc: 'Cost-effective campus & lateral models with complete operational clarity and dedicated account managers.',
    icon: Award,
    tag: 'Best ROI'
  }
];

export const EmployerSection = () => {
  return (
    <section className="py-10 sm:py-12 bg-white border-b border-slate-200 relative overflow-hidden" id="employers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Cards Grid */}
          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4 sm:gap-5 order-2 lg:order-1">
            {employerBenefits.map((item, i) => {
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.28, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-slate-50 hover:bg-white border-2 border-slate-200/80 hover:border-blue-400 p-6 rounded-2xl sm:rounded-3xl shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:scale-110">
                        <item.icon size={24} />
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-200/80 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-800 transition-colors">
                        {item.tag}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="lg:col-span-6 order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold mb-4">
              <Building2 size={16} className="text-blue-700" />
              <span>For Corporate Recruiters & HR Leaders</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Recruit Top CAs for <br />
              <span className="text-blue-700">Your Organization</span>
            </h2>

            <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed font-normal">
              Join <strong className="text-slate-900">60+ leading corporate employers</strong> who trust FAST Careers for their CA talent requirements. Whether participating in our bi-annual FAST CA Campus, lining up candidates for lateral hiring, or hosting a dedicated corporate drive — we make CA recruitment seamless.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link to="/placement-drive">
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-7 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Building2 size={18} />
                  <span>Enlist for Campus / Hiring Drive</span>
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <PhoneCall size={18} className="text-blue-700" />
                  <span>Talk to Our Directors</span>
                </motion.button>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Participate by filling a simple confirmation form & sharing your JD.</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
