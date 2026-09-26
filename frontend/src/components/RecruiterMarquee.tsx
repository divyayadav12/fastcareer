import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface CompanyLogoTile {
  id: number;
  name: string;
  category: string;
  badge?: string;
  logo: React.ReactNode;
}

export const COMPANY_TILES: CompanyLogoTile[] = [
  {
    id: 1,
    name: 'ITC Limited',
    category: "India's No.1 FMCG Giant",
    badge: 'FMCG Giant',
    logo: (
      <div className="flex items-center gap-1 font-black text-lg sm:text-xl tracking-tight text-[#0B2865]">
        <span className="font-black text-[#E31B23]">I</span>
        <span className="font-black text-[#0B2865]">T</span>
        <span className="font-black text-[#0B2865]">C</span>
      </div>
    )
  },
  {
    id: 2,
    name: 'NSE India',
    category: 'National Stock Exchange',
    badge: 'Stock Exchange',
    logo: (
      <div className="flex items-center gap-1">
        <span className="font-black text-sm sm:text-base text-[#EF4123] tracking-tighter">NSE</span>
        <span className="text-[9px] font-bold text-gray-700 uppercase">India</span>
      </div>
    )
  },
  {
    id: 3,
    name: 'Citibank',
    category: 'Global Investment Banking',
    badge: 'Banking',
    logo: (
      <div className="flex items-center gap-0.5">
        <span className="font-bold text-sm sm:text-base text-[#003B70] tracking-tight">citi</span>
        <span className="text-red-500 font-bold text-base -mt-1.5">^</span>
      </div>
    )
  },
  {
    id: 4,
    name: 'Deloitte',
    category: 'Big 4 Audit & Advisory',
    badge: 'Big 4',
    logo: (
      <div className="flex items-center gap-1 font-black text-sm sm:text-base text-black tracking-tight">
        <span>Deloitte</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></span>
      </div>
    )
  },
  {
    id: 5,
    name: 'KPMG',
    category: 'Big 4 Audit & Advisory',
    badge: 'Big 4',
    logo: (
      <span className="font-extrabold text-sm sm:text-base text-[#00338D] tracking-wider">
        KPMG
      </span>
    )
  },
  {
    id: 6,
    name: 'Ernst & Young (EY)',
    category: 'Big 4 Audit & Advisory',
    badge: 'Big 4',
    logo: (
      <div className="flex items-center gap-1">
        <span className="font-black text-sm sm:text-base text-black">EY</span>
        <div className="w-2 h-0.5 bg-yellow-400"></div>
      </div>
    )
  },
  {
    id: 7,
    name: 'ICICI Bank & Securities',
    category: 'Leading Private Bank',
    badge: 'Banking',
    logo: (
      <div className="flex items-center gap-1">
        <span className="font-black text-xs sm:text-sm text-[#B02A30] tracking-tight">ICICI</span>
        <span className="text-[10px] font-bold text-[#F58220]">Bank</span>
      </div>
    )
  },
  {
    id: 8,
    name: 'Kotak Mahindra Bank',
    category: 'Kotak Bank & Kotak Prime',
    badge: 'Banking & NBFC',
    logo: (
      <div className="flex items-center gap-1">
        <div className="w-3.5 h-3.5 rounded-full bg-[#ED1C24] flex items-center justify-center text-white text-[9px] font-bold">k</div>
        <span className="font-extrabold text-xs sm:text-sm text-[#003366]">kotak</span>
      </div>
    )
  },
  {
    id: 9,
    name: 'Vedanta Group',
    category: 'Global Natural Resources',
    badge: 'Conglomerate',
    logo: (
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 rounded-full bg-[#00875A]" />
        <span className="font-bold text-xs sm:text-sm text-[#002B49] tracking-tight">vedanta</span>
      </div>
    )
  },
  {
    id: 10,
    name: 'Aditya Birla Group',
    category: 'Indian Multinational',
    badge: 'Conglomerate',
    logo: (
      <div className="text-center leading-tight">
        <span className="font-black text-[11px] sm:text-xs text-[#E31E24] tracking-tight block">ADITYA BIRLA</span>
      </div>
    )
  },
  {
    id: 11,
    name: 'Johnson & Johnson',
    category: 'Healthcare & Pharma Giant',
    badge: 'Healthcare',
    logo: (
      <span className="font-serif font-black text-xs sm:text-sm text-[#D51900] tracking-tight">
        J&amp;J
      </span>
    )
  },
  {
    id: 12,
    name: 'Vodafone',
    category: 'Telecom Leader',
    badge: 'Telecom',
    logo: (
      <div className="flex items-center gap-1">
        <div className="w-3.5 h-3.5 rounded-full bg-[#E60000] text-white text-[9px] font-bold flex items-center justify-center">"</div>
        <span className="font-bold text-xs sm:text-sm text-gray-900">vodafone</span>
      </div>
    )
  },
  {
    id: 13,
    name: 'JM Financial',
    category: 'Investment Banking & Capital',
    badge: 'Investment Bank',
    logo: (
      <span className="font-bold text-xs sm:text-sm text-[#004A80] tracking-tight">
        JM FINANCIAL
      </span>
    )
  },
  {
    id: 14,
    name: 'Motilal Oswal',
    category: 'Financial Services',
    badge: 'Securities',
    logo: (
      <div className="text-center leading-tight">
        <span className="font-extrabold text-[10px] sm:text-xs text-[#E31E24] block">MOTILAL OSWAL</span>
      </div>
    )
  },
  {
    id: 15,
    name: 'Ambit Capital',
    category: 'Institutional Equities',
    badge: 'Capital Markets',
    logo: (
      <span className="font-black text-xs sm:text-sm text-[#1B365D] tracking-wider uppercase">
        AMBIT
      </span>
    )
  },
  {
    id: 16,
    name: 'Genpact',
    category: 'Global Professional Services',
    badge: 'Global Services',
    logo: (
      <span className="font-black text-xs sm:text-sm text-[#0072CE] tracking-tight">
        genpact
      </span>
    )
  },
  {
    id: 17,
    name: 'RPG Group',
    category: 'Industrial Conglomerate',
    badge: 'Conglomerate',
    logo: (
      <span className="font-black text-xs sm:text-sm text-[#0B2F64] tracking-widest uppercase">
        RPG
      </span>
    )
  },
  {
    id: 18,
    name: 'InterGlobe (IndiGo)',
    category: 'Aviation & Hospitality',
    badge: 'Aviation',
    logo: (
      <div className="flex items-center gap-1">
        <span className="font-extrabold text-xs sm:text-sm text-[#001D6E]">IndiGo</span>
      </div>
    )
  },
  {
    id: 19,
    name: 'Protiviti',
    category: 'Global Business Consulting',
    badge: 'Consulting',
    logo: (
      <span className="font-bold text-xs sm:text-sm text-[#005B94] tracking-tight">
        protiviti
      </span>
    )
  },
  {
    id: 20,
    name: 'Yes Bank',
    category: 'Commercial Banking',
    badge: 'Banking',
    logo: (
      <span className="font-black text-xs sm:text-sm text-[#004A8D] tracking-tight">
        YES BANK
      </span>
    )
  }
];

interface RecruiterMarqueeProps {
  showTitle?: boolean;
}

export const RecruiterMarquee: React.FC<RecruiterMarqueeProps> = () => {
  const row = [...COMPANY_TILES, ...COMPANY_TILES];

  return (
    <section className="w-full bg-slate-50 text-slate-900 pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold mb-2">
              <span>Past Corporate Recruiters</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mb-2">
              60+ Top-Notch Corporates of India
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              India's No.1 FMCG giants, Big 4 advisory firms, premier private banks, and industrial conglomerates recruit CAs through FAST Careers.
            </p>
          </div>

          <Link to="/placement-drive" className="self-start md:self-auto flex-shrink-0">
            <button className="px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all hover:scale-105 flex items-center gap-2">
              <span>Join as Recruiter</span>
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {/* Single Row Continuous Smooth Marquee */}
        <div className="relative overflow-hidden pt-2 select-none">
          {/* Edge fade gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-20 pointer-events-none bg-gradient-to-r from-slate-50 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-20 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent" />

          {/* Marquee row */}
          <div className="flex overflow-hidden">
            <div className="animate-marquee flex items-center gap-3 sm:gap-4 py-2">
              {row.map((item, idx) => (
                <div
                  key={`tile-${item.id}-${idx}`}
                  title={`${item.name} (${item.category})`}
                  className="bg-white rounded-2xl w-32 sm:w-40 md:w-44 h-16 sm:h-18 flex flex-col items-center justify-center px-3 py-2 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-shrink-0 border border-slate-200 group cursor-default"
                >
                  <div className="group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                    {item.logo}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold truncate max-w-[130px] mt-0.5">
                    {item.badge || item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
