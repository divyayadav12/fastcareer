import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Globe2, PhoneCall, FileSpreadsheet, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    num: '01',
    icon: FileText,
    title: 'Share JD & Mail Confirmation',
    desc: 'Give us a Mail Confirmation to participate by filling a prescribed form & share your Job Description.'
  },
  {
    num: '02',
    icon: Globe2,
    title: 'Corporate Enlistment',
    desc: 'We enlist your company as an official participating corporate on our portal (www.fast-india.com).'
  },
  {
    num: '03',
    icon: PhoneCall,
    title: 'Applications & HR Call Screening',
    desc: 'Candidates apply online and are rigorously screened by our expert HR recruiters over phone calls.'
  },
  {
    num: '04',
    icon: FileSpreadsheet,
    title: 'Resumes & Excel Shortlist Shared',
    desc: 'Resumes & structured Excel list of applicants meeting your specified criteria are shared with your team.'
  },
  {
    num: '05',
    icon: Users,
    title: 'Shortlisting & Campus Day Interviews',
    desc: 'Your company shortlists candidates and shortlisted applicants are invited for interviews on Campus Day.'
  }
];

export const ProcessSection = () => {
  return (
    <section className="py-10 sm:py-12 bg-white overflow-hidden border-b border-slate-200" id="process">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs sm:text-sm font-bold mb-3 hover:scale-105 transition-transform">
            <span>Workflow & Execution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            How Does FAST CA CAMPUS Work?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
            Our step-by-step corporate drive execution ensures you interview only top-quality, pre-screened CA candidates with zero operational hassle.
          </p>
        </motion.div>

        {/* 5-Step Process Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {steps.map((step, index) => {
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-slate-50 hover:bg-white rounded-2xl p-6 border-2 border-slate-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group relative cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div>
                  {/* Step Number Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-110 group-hover:bg-blue-700 transition-transform">
                      {step.num}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <step.icon size={18} />
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2.5 leading-snug group-hover:text-blue-700 transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Phase {step.num}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="mt-8 text-center">
          <Link to="/placement-drive">
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-all text-sm"
            >
              <span>Participate in Next CA Campus Drive</span>
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </div>

      </div>
    </section>
  );
};
