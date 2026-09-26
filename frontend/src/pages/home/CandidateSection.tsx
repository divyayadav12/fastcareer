import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle2, FileText, UserPlus, Briefcase, Sparkles } from 'lucide-react';

const candidateHighlights = [
  {
    title: '100% Free for CAs',
    desc: 'Zero registration fee or placement commission for candidates at any stage.',
    icon: Sparkles
  },
  {
    title: 'All India Rankers & Freshers',
    desc: '5000+ candidates enroll after every ICAI result for top corporate roles.',
    icon: Award
  },
  {
    title: 'Direct Campus & Lateral Access',
    desc: 'Interview with 60+ top-tier corporates across 9 major cities & virtually.',
    icon: Briefcase
  },
  {
    title: 'Pre-Screened Shortlists',
    desc: 'Profile verified by HR recruiters to ensure direct interview calls.',
    icon: FileText
  }
];

export const CandidateSection = () => {
  return (
    <section className="py-10 sm:py-12 bg-white overflow-hidden relative border-b border-slate-200" id="candidates">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <span className="text-blue-600 font-bold tracking-wider uppercase text-xs sm:text-sm mb-3 block">
              For CA Candidates (Freshers & Experienced)
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Start Your Finance Career with <br />
              <span className="text-blue-700">India’s Top Corporates</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
              Join <strong>125,000+ Chartered Accountants</strong> registered on FAST Careers. Whether you just qualified in the recent ICAI exams or are an experienced CA seeking lateral growth, FAST Careers connects you directly with premier enterprises.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/register">
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus size={18} />
                  <span>Register Free on Portal</span>
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link to="/candidate/current-openings">
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-7 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase size={18} />
                  <span>View Current Openings</span>
                </motion.button>
              </Link>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Next FAST CA Campus Drive happening in <strong>Jan–Feb</strong> and <strong>Aug–Sep</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Dedicated openings for First-Attempt Rankers & Multiple-Attempt CAs</span>
              </div>
            </div>
          </motion.div>

          {/* Right Cards */}
          <div className="lg:col-span-5 grid sm:grid-cols-2 gap-4">
            {candidateHighlights.map((feat, i) => {
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.28, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-slate-50 hover:bg-white p-6 rounded-2xl border-2 border-slate-200/80 hover:border-blue-400 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div>
                    <div className="w-12 h-12 bg-blue-100/70 text-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:scale-110">
                      <feat.icon size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-2 group-hover:text-blue-700 transition-colors">{feat.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">{feat.desc}</p>
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
