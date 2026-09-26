import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Shield, Users, Download, FileText, Sparkles, Building2, CheckCircle2, ArrowRight, Award, MapPin } from 'lucide-react';
import { RecruiterMarquee } from '../components/RecruiterMarquee';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

const coreValues = [
  {
    icon: <Target className="text-blue-700 w-8 h-8" />,
    title: 'Excellence in Finance',
    description: 'We strive for exceptional quality in every CA fresher and seasoned executive placement.'
  },
  {
    icon: <Eye className="text-blue-700 w-8 h-8" />,
    title: '100% Pre-Screened Candidates',
    description: 'Rigorously verified attempt counts, articleship credentials, and technical exposure.'
  },
  {
    icon: <Shield className="text-blue-700 w-8 h-8" />,
    title: 'Integrity & Ethics',
    description: 'Upholding strict confidentiality and transparent recruitment commercials for clients.'
  },
  {
    icon: <Users className="text-blue-700 w-8 h-8" />,
    title: 'Pan-India Reach',
    description: 'Connecting candidates and corporates across 10+ major cities and centralized virtual drives.'
  }
];

export const About = () => {
  return (
    <div className="w-full bg-slate-50">
      
      {/* Hero Section - Clean Light Corporate Design */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-32 pb-16 px-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold mb-4">
            <Sparkles size={15} className="text-blue-700" />
            <span>India's Largest CA Placement Company • Since 2008</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-slate-900">
            About <span className="text-blue-700">FAST CAREERS</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
            <strong className="text-slate-900">Fast Career Consultants Private Limited</strong> connects India's finest Chartered Accountants & finance leaders with 60+ top-notch corporates, Big 4s, and leading industrial conglomerates.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link to="/placement-results">
              <motion.button 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <Award size={18} />
                <span>Our Placement Result & Analysis</span>
              </motion.button>
            </Link>
            <Link to="/placement-drive">
              <motion.button 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 font-bold rounded-xl transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <Building2 size={18} className="text-blue-700" />
                <span>Join Campus Drive</span>
              </motion.button>
            </Link>
            <Link to="/team">
              <motion.button 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 font-bold rounded-xl transition-all text-sm sm:text-base"
              >
                Meet Leadership & Team
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recruiter Marquee */}
      <RecruiterMarquee showTitle={true} />

      {/* Our Story */}
      <section className="py-20 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              <span>Our Heritage & Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-tight">
              18+ Years of Excellence in Finance & CA Talent
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed text-base">
              Founded in 2008 with our maiden CA Campus in Indore, <strong>Fast Career Consultants Private Limited</strong> has grown into India’s largest specialized CA recruitment powerhouse. Today, over <strong className="text-blue-800">125,000+ Chartered Accountants</strong> are registered on our portal seeking career opportunities.
            </p>
            <p className="text-slate-600 mb-4 leading-relaxed text-base">
              We partner directly with <strong>60+ top-notch corporates</strong> including <strong>ITC Limited, National Stock Exchange (NSE), Citibank, ICICI Bank, Kotak Mahindra Bank, Deloitte, KPMG, EY, Aditya Birla Group, Vedanta, Johnson & Johnson, Vodafone, JM Financial</strong>, and many more.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6 text-base">
              After every ICAI exam result, <strong>All AIRs (All India Rankers) & 5,000+ candidates</strong> enroll with us for their first job through our bi-annual FAST CA Campus Drives conducted in <strong>January–February</strong> and <strong>August–September</strong>.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-blue-700">125K+</div>
                <div className="text-xs text-slate-600 font-bold">Registered CAs</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-blue-700">60+</div>
                <div className="text-xs text-slate-600 font-bold">Top Corporates</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-2xl font-black text-blue-700">10+</div>
                <div className="text-xs text-slate-600 font-bold">Campus Cities</div>
              </div>
            </div>
          </div>

          {/* Corporate Profile Feature Box - Clean Light 3D Card */}
          <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border-2 border-slate-200 shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 mb-4">
                <FileText size={14} className="text-blue-700" />
                <span>Fast Career Consultants Private Limited</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
                Core Service Delivery Modes
              </h3>

              <div className="space-y-3.5 mb-8">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="font-extrabold text-sm text-blue-700">Mode 1: FAST CA CAMPUS</div>
                  <div className="text-xs text-slate-600 mt-1">Bi-annual private off-campus drives across 10+ cities for CA Freshers & Rankers post-ICAI results.</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="font-extrabold text-sm text-emerald-700">Mode 2: Lateral Recruitments</div>
                  <div className="text-xs text-slate-600 mt-1">1-on-1 executive hiring for experienced CAs & finance leadership from our 125K+ database.</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="font-extrabold text-sm text-slate-900">Mode 3: Company Specific Drives</div>
                  <div className="text-xs text-slate-600 mt-1">Custom day-long dedicated hiring drives organized in any city of choice or virtual.</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <Link to="/contact">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Connect With Our Directors</span>
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">The foundational principles that guide our daily recruitment operations and executive commitments.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-7 rounded-2xl shadow-xs border border-slate-200 hover:shadow-md transition-all"
              >
                <div className="mb-5 bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center border border-blue-100">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
