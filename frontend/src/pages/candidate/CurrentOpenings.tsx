import React, { useState, useEffect } from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Search, MapPin, Briefcase, IndianRupee, Clock, Building, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import axios from 'axios';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryRange?: string;
  createdAt: string;
}

export const CurrentOpenings = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // 1. Fetch all jobs
        const res = await axios.get(`${apiUrl}/api/jobs`);
        setJobs(res.data || []);

        // 2. Fetch logged in candidate's applications
        const token = localStorage.getItem('token') || (user as any)?.token;
        if (token) {
          try {
            const appRes = await axios.get(`${apiUrl}/api/applications/my`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (Array.isArray(appRes.data)) {
              const ids = appRes.data
                .map((app: any) => (typeof app.job === 'object' && app.job ? app.job._id : app.job))
                .filter(Boolean);
              setAppliedJobIds(ids);
            }
          } catch (appErr) {
            console.error('Failed to fetch candidate applications', appErr);
          }
        }
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const formatSalary = (job: Job) => {
    if (job.salaryRange && job.salaryRange.trim() !== '') {
      return job.salaryRange;
    }
    if (job.salaryMin && job.salaryMax) {
      return `₹${(job.salaryMin / 100000).toFixed(1)}L - ₹${(job.salaryMax / 100000).toFixed(1)}L`;
    }
    if (job.salaryMin) {
      return `₹${(job.salaryMin / 100000).toFixed(1)}L+`;
    }
    return 'Best in Industry';
  };

  const filteredJobs = jobs.filter(job => 
    (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <CandidateLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text mb-2">Current Openings</h1>
          <p className="text-gray-500">Browse and apply to the latest job opportunities.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search jobs, company, location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            Loading current openings...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center col-span-full">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">No jobs found matching your criteria.</p>
            <p className="text-gray-400 text-sm mt-1">Try searching with different keywords.</p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isApplied = appliedJobIds.includes(job._id);

            return (
              <Link 
                to={`/jobs/${job._id}`} 
                key={job._id} 
                className={`bg-white rounded-2xl border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative ${
                  isApplied ? 'border-emerald-200/80 bg-gradient-to-b from-emerald-50/20 to-white' : 'border-gray-100'
                }`}
              >
                {/* Top Badge if already applied */}
                {isApplied && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      Applied
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4 pr-16">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-colors ${
                    isApplied 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                      : 'bg-gray-50 border-gray-100 text-gray-400 group-hover:border-primary/20 group-hover:text-primary'
                  }`}>
                    <Building size={24} />
                  </div>
                  <div>
                    <h3 className={`font-bold transition-colors line-clamp-1 ${
                      isApplied ? 'text-gray-900 group-hover:text-emerald-700' : 'text-text group-hover:text-primary'
                    }`}>
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6 flex-grow">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-400" /> {job.location || 'Pan India'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase size={16} className="text-gray-400" /> {job.type || 'Full-time'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IndianRupee size={16} className="text-gray-400" /> 
                    {formatSalary(job)}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={14} /> 
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recent'}
                  </div>
                  
                  {isApplied ? (
                    <span className="text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      Already Applied
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm font-medium text-white bg-primary px-3.5 py-1.5 rounded-lg group-hover:bg-primary/90 transition-colors shadow-sm">
                      Apply Now
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </CandidateLayout>
  );
};
