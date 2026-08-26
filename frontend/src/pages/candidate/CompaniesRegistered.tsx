import React from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Building2, Search, ExternalLink } from 'lucide-react';

export const CompaniesRegistered = () => {
  const companies = [
    { id: 1, name: "Google India", industry: "Technology", location: "Bangalore", jobs: 12 },
    { id: 2, name: "Microsoft", industry: "Technology", location: "Hyderabad", jobs: 8 },
    { id: 3, name: "TCS", industry: "IT Services", location: "Mumbai", jobs: 45 },
    { id: 4, name: "HDFC Bank", industry: "Finance", location: "Mumbai", jobs: 24 },
    { id: 5, name: "Amazon", industry: "E-Commerce", location: "Bangalore", jobs: 30 },
    { id: 6, name: "Infosys", industry: "IT Services", location: "Pune", jobs: 18 },
    { id: 7, name: "Deloitte", industry: "Consulting", location: "Gurgaon", jobs: 15 },
    { id: 8, name: "Reliance Ind.", industry: "Conglomerate", location: "Mumbai", jobs: 22 },
  ];

  return (
    <CandidateLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text mb-2">Companies Registered with Us</h1>
          <p className="text-gray-500">Explore top employers actively hiring on our platform.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search companies..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {companies.map(company => (
          <div key={company.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group cursor-pointer">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors">
              <Building2 size={28} className="text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-text mb-1 group-hover:text-primary transition-colors">{company.name}</h3>
            <p className="text-xs text-gray-500 mb-4">{company.industry} • {company.location}</p>
            
            <div className="mt-auto w-full pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                {company.jobs} Openings
              </span>
              <ExternalLink size={16} className="text-gray-400 group-hover:text-primary" />
            </div>
          </div>
        ))}
      </div>
    </CandidateLayout>
  );
};
