import React, { useState } from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Building2, Search, ExternalLink, MapPin, CheckCircle2, Briefcase, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TOP_RECRUITERS } from '../home/RecruitersSection';

export const CompaniesRegistered = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'FMCG & Retail',
    'Banking & Finance',
    'Conglomerates & Industrial',
    'Hospitality & Services',
    'Big 4 & Consulting'
  ];

  const filteredCompanies = TOP_RECRUITERS.filter(company => {
    const matchesCat = selectedCategory === 'All' || company.category === selectedCategory;
    const matchesSearch = 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.hiringRoles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <CandidateLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <Sparkles size={14} className="text-yellow-600" />
            <span>Active Hiring Partners</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-1">Registered Corporate Recruiters</h1>
          <p className="text-gray-500 text-sm">Explore Fortune 500 multinationals, Big 4s, and leading Indian conglomerates actively hiring on FAST Careers.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search ITC, HUL, Tata, J.P. Morgan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat === 'All' ? `All Companies (${TOP_RECRUITERS.length})` : cat}
          </button>
        ))}
      </div>

      {/* Grid of Recruiter Companies */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompanies.map(company => (
            <div 
              key={company.id} 
              className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-100">
                    {company.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {company.openings} Active Openings
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-[#0F2B48] to-[#1a446c] text-white rounded-xl flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-105 transition-transform">
                    {company.shortName.slice(0, 3)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-text text-sm group-hover:text-primary transition-colors truncate">
                      {company.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{company.location}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                  {company.tagline}
                </p>

                {/* Key Roles */}
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Open Roles:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {company.hiringRoles.slice(0, 2).map((role, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-700 rounded text-[10px] border border-gray-100 font-medium">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Verified Recruiter</span>
                </span>
                <Link
                  to="/candidate/openings"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline"
                >
                  <span>Apply Now</span>
                  <ExternalLink size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto">
          <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-gray-800">No companies found</h3>
          <p className="text-xs text-gray-500 mt-1">Try searching another company name or resetting filters.</p>
        </div>
      )}
    </CandidateLayout>
  );
};
