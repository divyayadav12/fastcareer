import React from 'react';
import { motion } from 'framer-motion';
import { LeadershipCard } from '../components/LeadershipCard';
import { Target, Eye, Shield, Users, Download, FileText, Sparkles, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { RecruiterMarquee } from '../components/RecruiterMarquee';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

const coreValues = [
  {
    icon: <Target className="text-primary w-8 h-8" />,
    title: 'Excellence',
    description: 'We strive for exceptional quality in every CA and executive placement.'
  },
  {
    icon: <Eye className="text-primary w-8 h-8" />,
    title: 'Transparency',
    description: 'Clear, ethical, and honest communication with clients and candidates.'
  },
  {
    icon: <Shield className="text-primary w-8 h-8" />,
    title: 'Integrity',
    description: 'Upholding strict confidentiality and the highest standards of recruitment ethics.'
  },
  {
    icon: <Users className="text-primary w-8 h-8" />,
    title: 'Partnership',
    description: 'Building long-term strategic relationships rather than transactional exchanges.'
  }
];

export const About = () => {
  return (
    <div className="w-full">
      {/* Hero Section - Exact Color from Image (#1F2937) */}
      <section className="bg-[#1F2937] text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-blue-200 text-xs sm:text-sm font-semibold mb-4 border border-white/10 shadow-sm"
          >
            <Sparkles size={15} className="text-yellow-400" />
            <span>Pioneering Finance & CA Headhunting Since 2008</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white"
          >
            About <span className="text-white">FAST CAREERS</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Connecting India's finest Chartered Accountants & finance leaders with Fortune 500 enterprises, Big 4s, and leading industrial conglomerates for over 16 years.
          </motion.p>

          {/* Quick Action Buttons in Hero */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/FAST_Careers_Corporate_Profile.pdf"
              download="FAST_Careers_Corporate_Profile.pdf"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <Download size={18} />
              <span>Download Corporate Profile (PDF)</span>
            </a>
            <Link to="/team">
              <button className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all">
                Meet Our Leadership & Team
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Continuous Infinite Scrolling Recruiter Marquee */}
      <RecruiterMarquee showTitle={true} theme="light" />

      {/* Our Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <span>Our Heritage & Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text mb-6">
              16+ Years of Excellence in Finance & CA Talent
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Founded in 2008 on the principle that elite financial talent drives enterprise growth, FAST CAREERS began as a boutique advisory firm specializing in Chartered Accountant placements. Over the years, we have grown into India’s most trusted talent solutions brand.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We partner directly with leading conglomerates including <strong>ITC, Hindustan Unilever (HUL), Tata Group, JPMorgan Chase, Jio Financial Services, NSE, Vedanta, CK Birla Group, ITC Hotels</strong>, and the <strong>Big 4 consulting firms (Deloitte, EY, PwC, KPMG)</strong> to deliver pre-vetted, high-caliber financial leadership.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our unique approach combines rigorous technical assessment, articleship background verification, and continuous candidate mentorship masterclasses.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl font-black text-primary">5,000+</div>
                <div className="text-xs text-gray-500 font-medium">CA Placements</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl font-black text-primary">150+</div>
                <div className="text-xs text-gray-500 font-medium">Corporate Partners</div>
              </div>
            </div>
          </div>

          {/* Corporate Profile Download Feature Box */}
          <div className="bg-gradient-to-br from-[#0F2B48] via-[#163e65] to-[#0a1e33] rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold border border-white/10 mb-4">
                <FileText size={14} />
                <span>Official PDF Brochure 2026</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                FAST Careers Corporate Profile
              </h3>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
                Download our comprehensive company deck containing recruitment methodologies, CA candidate screening framework, marquee client list, SLA metrics, and corporate engagement plans.
              </p>

              <div className="space-y-2.5 mb-8">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
                  <CheckCircle2 size={16} className="text-teal-400 flex-shrink-0" />
                  <span>Executive Headhunting & CFO Practice Overview</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
                  <CheckCircle2 size={16} className="text-teal-400 flex-shrink-0" />
                  <span>Big 4 & Industrial Trainee Talent Pipelines</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
                  <CheckCircle2 size={16} className="text-teal-400 flex-shrink-0" />
                  <span>150+ Partner Portfolio & Case Studies</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
                  <CheckCircle2 size={16} className="text-teal-400 flex-shrink-0" />
                  <span>Multi-City Branch Presence & Contact Directory</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <a
                href="/FAST_Careers_Corporate_Profile.pdf"
                download="FAST_Careers_Corporate_Profile.pdf"
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-100 text-primary font-extrabold rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <Download size={18} className="text-primary" />
                <span>Download Corporate Profile PDF</span>
              </a>
              <p className="text-center text-[11px] text-gray-400 mt-2">
                Official Document • PDF Format • Instant Download
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-text mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The foundational principles that guide our daily recruitment operations and executive commitments.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-white p-8 rounded-2xl shadow-xs hover:shadow-lg border border-gray-100 transition-all"
              >
                <div className="mb-6 bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xs">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-text mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture & Team Link Banner */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-50 via-teal-50/50 to-blue-50 rounded-3xl p-8 sm:p-12 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
              Life @ FAST Careers
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 mb-2">
              Explore Our CA Masterclasses, Celebrations & Culture
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm max-w-2xl">
              See photos and stories from our nationwide CA workshops, annual awards, Diwali celebrations, hackathons, and corporate leadership summits.
            </p>
          </div>
          <Link to="/team">
            <Button variant="primary" size="md" className="flex-shrink-0 flex items-center gap-2 font-bold shadow-md">
              <span>View Team & Activities</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
