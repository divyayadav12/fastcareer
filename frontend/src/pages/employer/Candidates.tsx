import React, { useState, useEffect } from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { Search, Filter, MapPin, GraduationCap, Download } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { getResumeUrl } from '../../utils/urlHelper';

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  resumeUrl?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  education?: {
    degree: string;
    institution: string;
    passingYear: string;
  }[];
}

export const EmployerCandidates = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/candidates`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setCandidates(res.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) {
      fetchCandidates();
    }
  }, [user]);

  return (
    <EmployerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Search Candidates</h1>
        <p className="text-gray-500">Find the perfect match for your open positions</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by skills, title, or keyword" 
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500">Loading candidates...</p>
        ) : candidates.length === 0 ? (
          <p className="text-gray-500">No candidates available.</p>
        ) : (
          candidates.map(candidate => (
            <div key={candidate._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg uppercase">
                  {candidate.firstName[0]}{candidate.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-text">{candidate.firstName} {candidate.lastName}</h3>
                  <p className="text-sm text-gray-500">{candidate.email}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400" />
                  {candidate.address?.city ? `${candidate.address.city}, ${candidate.address.state}` : 'Location not provided'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap size={16} className="text-gray-400" />
                  {candidate.education && candidate.education.length > 0 
                    ? `${candidate.education[0].degree}` 
                    : 'Education not provided'}
                </div>
              </div>

              {candidate.resumeUrl ? (
                <a 
                  href={getResumeUrl(candidate.resumeUrl)} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  <Download size={16} /> Download Resume
                </a>
              ) : (
                <button disabled className="w-full py-2 bg-gray-50 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                  No Resume
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </EmployerLayout>
  );
};
