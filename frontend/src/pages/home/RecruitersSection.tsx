import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Sparkles, Briefcase, MapPin, ExternalLink, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface RecruiterCompany {
  id: number;
  name: string;
  shortName: string;
  category: 'FMCG & Retail' | 'Banking & Finance' | 'Conglomerates & Industrial' | 'Hospitality & Services' | 'Big 4 & Consulting';
  tagline: string;
  location: string;
  openings: number;
  featured: boolean;
  hiringRoles: string[];
}

export const TOP_RECRUITERS: RecruiterCompany[] = [
  {
    id: 1,
    name: 'ITC Limited',
    shortName: 'ITC',
    category: 'FMCG & Retail',
    tagline: 'Leading FMCG, Agri-Business & Paperboards Conglomerate',
    location: 'Kolkata / Pan-India',
    openings: 18,
    featured: true,
    hiringRoles: ['Financial Analyst', 'Factory Finance Manager', 'Internal Audit Lead']
  },
  {
    id: 2,
    name: 'Hindustan Unilever Limited (HUL)',
    shortName: 'HUL',
    category: 'FMCG & Retail',
    tagline: "India's #1 FMCG Market Leader & Consumer Goods Pioneer",
    location: 'Mumbai / Pan-India',
    openings: 24,
    featured: true,
    hiringRoles: ['Brand Finance Partner', 'Commercial Finance Manager', 'Supply Chain Analyst']
  },
  {
    id: 3,
    name: 'Tata Group (Tata Sons / TCS / Tata Steel)',
    shortName: 'TATA',
    category: 'Conglomerates & Industrial',
    tagline: "India's Most Trusted $300B+ Global Conglomerate",
    location: 'Mumbai / Pan-India',
    openings: 42,
    featured: true,
    hiringRoles: ['Treasury Manager', 'Corporate Governance CA', 'Statutory Reporting Lead']
  },
  {
    id: 4,
    name: 'JPMorgan Chase & Co.',
    shortName: 'J.P. Morgan',
    category: 'Banking & Finance',
    tagline: 'Global Leader in Financial Services & Investment Banking',
    location: 'Mumbai / Bengaluru',
    openings: 35,
    featured: true,
    hiringRoles: ['Investment Banking Analyst', 'Equity Research CA', 'Credit Risk Manager']
  },
  {
    id: 5,
    name: 'Jio Financial Services (JFSL)',
    shortName: 'Jio Finance',
    category: 'Banking & Finance',
    tagline: 'Next-Gen Digital Financial Services, NBFC & Asset Management',
    location: 'Mumbai / Navi Mumbai',
    openings: 29,
    featured: true,
    hiringRoles: ['Credit Underwriter', 'Risk & Compliance Lead', 'Wealth Strategy CA']
  },
  {
    id: 6,
    name: 'NSE (National Stock Exchange of India)',
    shortName: 'NSE',
    category: 'Banking & Finance',
    tagline: "World's Largest Derivatives Exchange & Premier Financial Market",
    location: 'Mumbai, BKC',
    openings: 15,
    featured: true,
    hiringRoles: ['Market Surveillance Lead', 'Regulatory Compliance CA', 'Clearing House Auditor']
  },
  {
    id: 7,
    name: 'Vedanta Limited',
    shortName: 'Vedanta',
    category: 'Conglomerates & Industrial',
    tagline: 'Global Diversified Natural Resources, Metals & Energy Giant',
    location: 'Mumbai / New Delhi',
    openings: 22,
    featured: true,
    hiringRoles: ['Plant Commercial Head', 'Cost Controller CA', 'Indirect Tax Strategist']
  },
  {
    id: 8,
    name: 'CK Birla Group',
    shortName: 'CK Birla',
    category: 'Conglomerates & Industrial',
    tagline: '$3B+ Industrial Conglomerate across Technology, Auto & Healthcare',
    location: 'New Delhi / Gurugram',
    openings: 14,
    featured: true,
    hiringRoles: ['Corporate Finance Specialist', 'Audit & Assurance CA', 'M&A Analyst']
  },
  {
    id: 9,
    name: 'ITC Hotels / IHCL (Luxury Hospitality)',
    shortName: 'ITC Hotels',
    category: 'Hospitality & Services',
    tagline: "India's Premier Luxury Hotel & Hospitality Chain",
    location: 'New Delhi / Pan-India',
    openings: 16,
    featured: true,
    hiringRoles: ['Financial Controller', 'Unit Chief Accountant', 'Revenue Auditor']
  },
  {
    id: 10,
    name: 'Deloitte Touche Tohmatsu',
    shortName: 'Deloitte',
    category: 'Big 4 & Consulting',
    tagline: 'Global Big 4 Leader in Audit, Consulting, Tax & Advisory',
    location: 'Mumbai / Gurugram / Bengaluru',
    openings: 38,
    featured: true,
    hiringRoles: ['Statutory Audit Senior', 'M&A Due Diligence Lead', 'Transfer Pricing Specialist']
  },
  {
    id: 11,
    name: 'Ernst & Young (EY)',
    shortName: 'EY',
    category: 'Big 4 & Consulting',
    tagline: 'Global Leader in Assurance, Tax, Transaction Advisory & Consulting',
    location: 'Mumbai / Delhi NCR / Bengaluru',
    openings: 45,
    featured: true,
    hiringRoles: ['Assurance Associate', 'Direct Tax Manager', 'Valuation Modeler']
  },
  {
    id: 12,
    name: 'PricewaterhouseCoopers (PwC)',
    shortName: 'PwC',
    category: 'Big 4 & Consulting',
    tagline: 'Big 4 Professional Services & Strategic Business Advisory',
    location: 'Mumbai / Kolkata / Bengaluru',
    openings: 30,
    featured: true,
    hiringRoles: ['Risk Assurance Senior', 'Forensic Auditor', 'Deals Advisory CA']
  },
  {
    id: 13,
    name: 'KPMG India',
    shortName: 'KPMG',
    category: 'Big 4 & Consulting',
    tagline: 'Leading Audit, Tax, Strategy & Financial Advisory Firm',
    location: 'Gurugram / Mumbai / Bengaluru',
    openings: 28,
    featured: true,
    hiringRoles: ['Statutory Audit Associate', 'GST Advisory CA', 'Management Consultant']
  },
  {
    id: 14,
    name: 'Reliance Industries Limited (RIL)',
    shortName: 'Reliance',
    category: 'Conglomerates & Industrial',
    tagline: "India's Largest Fortune 500 Energy, Retail & Telecom Group",
    location: 'Mumbai / Navi Mumbai',
    openings: 50,
    featured: true,
    hiringRoles: ['Treasury & FX Analyst', 'Retail Finance Controller', 'SAP FICO Specialist']
  },
  {
    id: 15,
    name: 'HDFC Bank',
    shortName: 'HDFC Bank',
    category: 'Banking & Finance',
    tagline: "India's #1 Private Sector Banking & Financial Conglomerate",
    location: 'Mumbai / Pan-India',
    openings: 36,
    featured: true,
    hiringRoles: ['Credit Risk Underwriter', 'Treasury Operations CA', 'Wholesale Banking RM']
  },
  {
    id: 16,
    name: 'Adani Group',
    shortName: 'Adani',
    category: 'Conglomerates & Industrial',
    tagline: 'Leading Infrastructure, Ports, Logistics & Energy Conglomerate',
    location: 'Ahmedabad / Pan-India',
    openings: 20,
    featured: true,
    hiringRoles: ['Project Finance Specialist', 'Corporate Accounts Manager', 'Internal Auditor']
  }
];

export const RecruitersSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'FMCG & Retail',
    'Banking & Finance',
    'Conglomerates & Industrial',
    'Hospitality & Services',
    'Big 4 & Consulting'
  ];

  const filteredRecruiters = TOP_RECRUITERS.filter(r => 
    selectedCategory === 'All' || r.category === selectedCategory
  );

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-y border-gray-200/60 overflow-hidden relative">
      {/* Background Decorative Blurs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold mb-3 shadow-sm">
            <Sparkles size={16} className="text-yellow-600" />
            <span>Trusted by India's & Global Corporate Giants</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Our Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-700 to-teal-600">Recruiting Partners</span>
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            FAST Careers actively partners with Fortune 500 multinationals, Big 4 consulting leaders, FMCG powerhouses, and top financial institutions to hire qualified Chartered Accountants & finance leaders.
          </p>
        </div>

        {/* Dynamic Infinite Brand Marquee Ticker */}
        <div className="mb-14 bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80 overflow-hidden">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-5">
            Active Hiring Partners & Campus Recruiters
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {TOP_RECRUITERS.slice(0, 9).map((brand) => (
              <div
                key={brand.id}
                className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200/70 hover:border-primary hover:bg-blue-50/50 transition-all flex items-center gap-2 shadow-xs group cursor-default"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-black text-xs flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  {brand.shortName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="font-extrabold text-xs sm:text-sm text-gray-900 group-hover:text-primary transition-colors">
                    {brand.name.split('(')[0].trim()}
                  </span>
                  <span className="ml-1.5 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                    {brand.openings} Openings
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-md ring-2 ring-primary/20 scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat === 'All' ? `All Recruiters (${TOP_RECRUITERS.length})` : cat}
            </button>
          ))}
        </div>

        {/* Recruiter Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecruiters.map((recruiter) => (
            <div
              key={recruiter.id}
              className="group bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Top Badge & Openings */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-100 text-[11px] font-bold">
                    {recruiter.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {recruiter.openings} Openings
                  </span>
                </div>

                {/* Company Name & Tagline */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F2B48] to-[#1a446c] text-white flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                    {recruiter.shortName.slice(0, 3)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900 group-hover:text-primary transition-colors leading-snug">
                      {recruiter.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin size={12} className="text-gray-400" />
                      <span>{recruiter.location}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4">
                  {recruiter.tagline}
                </p>

                {/* Hiring Roles */}
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Actively Hiring For:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {recruiter.hiringRoles.map((role, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[11px] font-medium text-gray-700"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>Verified Partner</span>
                </span>
                
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline"
                >
                  <span>View Roles</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#0F2B48] via-[#163f69] to-[#0F2B48] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-teal-300 border border-white/20 uppercase tracking-wider">
              Exclusive Employer Partnerships
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold mt-2 text-white">
              Want Your Organization Featured Among India’s Top Recruiters?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Partner with FAST Careers to access pre-vetted first-attempt Chartered Accountants, industrial trainees, and finance leaders.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/contact">
              <button className="px-5 py-3 bg-white text-primary hover:bg-gray-100 rounded-xl text-xs sm:text-sm font-extrabold shadow-md transition-all">
                Post Hiring Mandate
              </button>
            </Link>
            <Link to="/jobs">
              <button className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all">
                Explore All Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
