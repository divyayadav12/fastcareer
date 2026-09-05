import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CompanyLogoTile {
  id: number;
  name: string;
  category: string;
  logo: React.ReactNode;
}

// Crisp, high-contrast SVG / styled brand emblems for clean white cards
const COMPANY_TILES: CompanyLogoTile[] = [
  {
    id: 1,
    name: 'ITC Limited',
    category: 'FMCG & Conglomerate',
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
    name: 'Hindustan Unilever',
    category: 'FMCG Leader',
    logo: (
      <div className="flex items-center gap-1.5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#003580">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-6h2v6zm4 0h-2V8h2v8z"/>
        </svg>
        <span className="font-extrabold text-xs sm:text-sm text-[#003580] tracking-tight">HUL</span>
      </div>
    )
  },
  {
    id: 3,
    name: 'Tata Group',
    category: 'Conglomerate',
    logo: (
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-[#0F5EA3] text-white font-black text-[10px] flex items-center justify-center">
          T
        </div>
        <span className="font-extrabold text-xs sm:text-sm text-[#0F5EA3] tracking-wider uppercase">TATA</span>
      </div>
    )
  },
  {
    id: 4,
    name: 'J.P. Morgan',
    category: 'Investment Bank',
    logo: (
      <span className="font-serif font-black text-xs sm:text-sm md:text-base text-[#111111] tracking-tight">
        J.P.Morgan
      </span>
    )
  },
  {
    id: 5,
    name: 'Jio Financial Services',
    category: 'Financial Services',
    logo: (
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-[#E51B24] text-white font-black text-[10px] flex items-center justify-center">
          Jio
        </div>
        <span className="font-extrabold text-[11px] sm:text-xs text-[#0B2865] uppercase">Finance</span>
      </div>
    )
  },
  {
    id: 6,
    name: 'NSE India',
    category: 'Stock Exchange',
    logo: (
      <div className="flex items-center gap-1">
        <span className="font-black text-sm sm:text-base text-[#EF4123] tracking-tighter">NSE</span>
        <span className="text-[9px] font-bold text-gray-500 uppercase">India</span>
      </div>
    )
  },
  {
    id: 7,
    name: 'Vedanta',
    category: 'Mining & Resources',
    logo: (
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#00875A]" />
        <span className="font-bold text-xs sm:text-sm text-[#002B49] tracking-tight">vedanta</span>
      </div>
    )
  },
  {
    id: 8,
    name: 'CK Birla Group',
    category: 'Industrial',
    logo: (
      <div className="text-center leading-tight">
        <span className="font-extrabold text-[11px] sm:text-xs text-[#003366] tracking-tight block">CK BIRLA</span>
        <span className="text-[8px] font-semibold text-gray-500 uppercase tracking-widest block">GROUP</span>
      </div>
    )
  },
  {
    id: 9,
    name: 'ITC Hotels',
    category: 'Luxury Hospitality',
    logo: (
      <div className="flex items-center gap-1">
        <span className="font-black text-[10px] sm:text-xs text-[#996515] uppercase tracking-wider">ITC HOTELS</span>
      </div>
    )
  },
  {
    id: 10,
    name: 'Deloitte',
    category: 'Big 4 Consulting',
    logo: (
      <div className="flex items-baseline font-black text-xs sm:text-sm md:text-base text-[#111111] tracking-tight">
        <span>Deloitte</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#86BC25] ml-0.5" />
      </div>
    )
  },
  {
    id: 11,
    name: 'Ernst & Young',
    category: 'Big 4 Assurance',
    logo: (
      <div className="flex items-center gap-1">
        <span className="font-black text-base sm:text-lg text-[#2E2E38] tracking-tighter">EY</span>
        <span className="w-2.5 h-1 bg-[#FFE600] rounded-xs" />
      </div>
    )
  },
  {
    id: 12,
    name: 'PwC',
    category: 'Big 4 Professional',
    logo: (
      <div className="flex items-center gap-1 font-extrabold text-sm sm:text-base text-[#D04A02]">
        <span>pwc</span>
      </div>
    )
  },
  {
    id: 13,
    name: 'KPMG',
    category: 'Big 4 Advisory',
    logo: (
      <div className="px-2 py-0.5 bg-[#00338D] text-white font-black text-xs sm:text-sm tracking-wider rounded">
        KPMG
      </div>
    )
  },
  {
    id: 14,
    name: 'Reliance',
    category: 'Conglomerate',
    logo: (
      <div className="text-center leading-tight">
        <span className="font-black text-xs sm:text-sm text-[#003399] tracking-tight block">Reliance</span>
        <span className="text-[7px] text-[#E31B23] font-bold uppercase tracking-widest block">Industries</span>
      </div>
    )
  },
  {
    id: 15,
    name: 'HDFC Bank',
    category: 'Banking',
    logo: (
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 bg-[#ED232A] text-white font-bold text-[9px] flex items-center justify-center rounded-xs">
          +
        </div>
        <span className="font-black text-[10px] sm:text-xs text-[#004C8F] tracking-tight">HDFC BANK</span>
      </div>
    )
  },
  {
    id: 16,
    name: 'Adani',
    category: 'Infrastructure',
    logo: (
      <span className="font-extrabold text-xs sm:text-sm text-[#185A9D] tracking-tight">
        adani
      </span>
    )
  }
];

interface RecruiterMarqueeProps {
  showTitle?: boolean;
}

export const RecruiterMarquee: React.FC<RecruiterMarqueeProps> = () => {
  // Triple array for seamless infinite sliding
  const row1 = [...COMPANY_TILES, ...COMPANY_TILES, ...COMPANY_TILES];
  const row2 = [...COMPANY_TILES.slice().reverse(), ...COMPANY_TILES.slice().reverse(), ...COMPANY_TILES.slice().reverse()];

  return (
    <section className="w-full bg-[#1E293B] text-white pt-16 pb-20 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-xl">
      {/* Background Soft Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
              Trusted by Top Companies
            </h2>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              More than 150+ leading enterprises and multinationals rely on FAST Careers for finance & CA recruitment.
            </p>
          </div>

          <Link to="/candidate/companies" className="self-start md:self-auto flex-shrink-0">
            <button className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white hover:bg-gray-100 text-gray-900 font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center gap-2">
              <span>Explore Openings</span>
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {/* Marquee Animation Rows positioned lower with compact, elegant white cards */}
        <div className="relative overflow-hidden pt-4 mt-2 sm:mt-4 select-none">
          {/* Edge fade gradients for seamless infinite look */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-20 pointer-events-none bg-gradient-to-r from-[#1E293B] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-20 pointer-events-none bg-gradient-to-l from-[#1E293B] to-transparent" />

          {/* Row 1: Smooth Continuous Scroll */}
          <div className="flex overflow-hidden mb-3.5 sm:mb-4">
            <div className="animate-marquee flex items-center gap-3 sm:gap-4 py-1">
              {row1.map((item, idx) => (
                <Link
                  key={`tile-r1-${item.id}-${idx}`}
                  to="/candidate/companies"
                  title={`${item.name} (${item.category})`}
                  className="bg-white rounded-xl sm:rounded-2xl w-28 sm:w-36 md:w-40 h-12 sm:h-14 md:h-16 flex items-center justify-center px-3 py-2 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex-shrink-0 border border-white/90 group cursor-pointer"
                >
                  <div className="group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                    {item.logo}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Row 2: Reverse Smooth Continuous Scroll */}
          <div className="flex overflow-hidden">
            <div className="animate-marquee-reverse flex items-center gap-3 sm:gap-4 py-1">
              {row2.map((item, idx) => (
                <Link
                  key={`tile-r2-${item.id}-${idx}`}
                  to="/candidate/companies"
                  title={`${item.name} (${item.category})`}
                  className="bg-white rounded-xl sm:rounded-2xl w-28 sm:w-36 md:w-40 h-12 sm:h-14 md:h-16 flex items-center justify-center px-3 py-2 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex-shrink-0 border border-white/90 group cursor-pointer"
                >
                  <div className="group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                    {item.logo}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
