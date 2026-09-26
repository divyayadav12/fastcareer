import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, FileCheck, Calculator, Briefcase, TrendingUp, Award, Building2, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecruiterMarquee } from '../components/RecruiterMarquee';

const domains = [
  {
    icon: <FileCheck className="w-10 h-10 text-blue-700" />,
    title: 'Statutory & Internal Audit',
    description: 'Specialized placement for Big 4s, top consulting firms, and listed enterprise audit divisions.',
    roles: ['Statutory Audit Senior / Manager', 'Internal Financial Controls (IFC)', 'Forensic & Risk Advisory', 'SOX Compliance Specialists']
  },
  {
    icon: <Landmark className="w-10 h-10 text-blue-700" />,
    title: 'Corporate Finance & FP&A',
    description: 'Financial planning, budgeting, executive reporting, and strategic decision support for conglomerates.',
    roles: ['Corporate Finance Lead', 'FP&A Manager / Controller', 'Cost Management & MIS', 'Chief Financial Officer (CFO)']
  },
  {
    icon: <Calculator className="w-10 h-10 text-blue-700" />,
    title: 'Direct & Indirect Taxation',
    description: 'Corporate taxation, transfer pricing, GST litigation, and international tax structuring expertise.',
    roles: ['Direct Tax Consultant', 'Transfer Pricing Specialist', 'GST & Customs Manager', 'International Tax Lead']
  },
  {
    icon: <TrendingUp className="w-10 h-10 text-blue-700" />,
    title: 'Banking, Treasury & NBFCs',
    description: 'Liquidity management, forex desk, credit appraisal, and regulatory compliance for financial institutions.',
    roles: ['Treasury Manager', 'Credit Risk Underwriter', 'ALM & Capital Market Analyst', 'Banking Relationship Manager']
  },
  {
    icon: <Briefcase className="w-10 h-10 text-blue-700" />,
    title: 'Investment Banking & M&A',
    description: 'Financial modeling, valuation analysis, due diligence, and capital advisory for institutional clients.',
    roles: ['M&A Deal Advisory Associate', 'Valuation & Modeling Lead', 'Private Equity Analyst', 'Due Diligence Manager']
  },
  {
    icon: <Award className="w-10 h-10 text-blue-700" />,
    title: 'All India Rankers & CA Freshers',
    description: 'Direct campus selection for newly qualified CAs and merit rankers from recent ICAI exam cycles.',
    roles: ['Management Trainee - Finance', 'Associate Consultant - Big 4', 'Executive Trainee - FMCG/Industrial', 'Financial Analyst Trainee']
  }
];

export const Expertise = () => {
  return (
    <div className="w-full bg-slate-50">
      
      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-32 pb-20 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs sm:text-sm font-semibold mb-4 border border-blue-400/30">
            <Sparkles size={15} className="text-blue-400" />
            <span>Bird's Eye Focus on Finance Domain</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white">
            Our Core Expertise Domains
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We deal and specialise <strong>exclusively in Finance & CA Recruitments</strong>. This single-minded focus attracts India’s finest talent as well as premier corporate employers.
          </p>
        </div>
      </section>

      {/* Expertise Grid */}
      <section className="py-20 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domains.map((domain, index) => (
              <div 
                key={index}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-200 shadow-xs">
                    {domain.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{domain.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                    {domain.description}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2.5">Key CA Roles:</h4>
                  <ul className="space-y-1.5">
                    {domain.roles.map((role, idx) => (
                      <li key={idx} className="flex items-center text-xs font-semibold text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 shrink-0"></span>
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-14 p-8 bg-slate-900 rounded-3xl text-white text-center max-w-3xl mx-auto border border-slate-800 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">Looking for specialized CA talent in these domains?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-xl mx-auto">
              Participate in our upcoming FAST CA Campus drive or submit a specific lateral hiring mandate.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/placement-drive">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2">
                  <span>Enlist For Next Drive</span>
                  <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/contact">
                <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm border border-slate-700 transition-all">
                  Contact Our Team
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter Marquee */}
      <RecruiterMarquee showTitle={true} />

    </div>
  );
};
