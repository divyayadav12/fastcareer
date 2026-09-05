import React from 'react';
import { TOP_RECRUITERS } from '../pages/home/RecruitersSection';
import { Sparkles, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecruiterMarqueeProps {
  showTitle?: boolean;
  theme?: 'light' | 'dark';
}

export const RecruiterMarquee: React.FC<RecruiterMarqueeProps> = ({ 
  showTitle = true, 
  theme = 'light' 
}) => {
  // Duplicate array 3 times for completely seamless infinite loop
  const marqueeItems = [...TOP_RECRUITERS, ...TOP_RECRUITERS, ...TOP_RECRUITERS];
  const reverseItems = [...TOP_RECRUITERS.slice().reverse(), ...TOP_RECRUITERS.slice().reverse(), ...TOP_RECRUITERS.slice().reverse()];

  const isDark = theme === 'dark';

  return (
    <div className={`w-full overflow-hidden py-8 ${isDark ? 'bg-[#0B1E32] text-white' : 'bg-white text-gray-900'} border-y border-gray-100 shadow-xs relative`}>
      {/* Subtle fade masks on left and right for seamless edge fade */}
      <div className={`absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none ${
        isDark 
          ? 'bg-gradient-to-r from-[#0B1E32] to-transparent' 
          : 'bg-gradient-to-r from-white to-transparent'
      }`} />
      <div className={`absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none ${
        isDark 
          ? 'bg-gradient-to-l from-[#0B1E32] to-transparent' 
          : 'bg-gradient-to-l from-white to-transparent'
      }`} />

      {showTitle && (
        <div className="text-center mb-5 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles size={13} className="text-yellow-600 animate-spin" />
            <span>Top Marquee Recruiters</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Over 150+ leading enterprises actively recruit through FAST Careers
          </p>
        </div>
      )}

      {/* Row 1: Left to Right Infinite Marquee */}
      <div className="flex overflow-hidden select-none mb-3">
        <div className="animate-marquee flex items-center gap-4 py-2">
          {marqueeItems.map((recruiter, idx) => (
            <Link
              key={`row1-${recruiter.id}-${idx}`}
              to="/candidate/companies"
              className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-300 flex-shrink-0 group ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border border-white/10 text-white' 
                  : 'bg-gray-50 hover:bg-blue-50/80 border border-gray-200/80 hover:border-primary/40 text-gray-900 shadow-xs'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F2B48] to-[#1e5285] text-white flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-110 transition-transform">
                {recruiter.shortName.slice(0, 3)}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xs sm:text-sm tracking-tight group-hover:text-primary transition-colors">
                  {recruiter.name.split('(')[0].trim()}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {recruiter.category.split('&')[0].trim()}
                </span>
              </div>
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                {recruiter.openings} Openings
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Row 2: Reverse Continuous Marquee */}
      <div className="flex overflow-hidden select-none">
        <div className="animate-marquee-reverse flex items-center gap-4 py-2">
          {reverseItems.map((recruiter, idx) => (
            <Link
              key={`row2-${recruiter.id}-${idx}`}
              to="/candidate/companies"
              className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-300 flex-shrink-0 group ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border border-white/10 text-white' 
                  : 'bg-gray-50 hover:bg-blue-50/80 border border-gray-200/80 hover:border-primary/40 text-gray-900 shadow-xs'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00A896] to-[#028073] text-white flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-110 transition-transform">
                {recruiter.shortName.slice(0, 3)}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xs sm:text-sm tracking-tight group-hover:text-teal-700 transition-colors">
                  {recruiter.name.split('(')[0].trim()}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {recruiter.location.split('/')[0].trim()}
                </span>
              </div>
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200/60">
                Hiring Now
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
