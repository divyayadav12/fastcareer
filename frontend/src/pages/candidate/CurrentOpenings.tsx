import React, { useState, useEffect } from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Search, MapPin, Briefcase, IndianRupee, Clock, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salaryMin: number;
  salaryMax: number;
  createdAt: string;
}

export const CurrentOpenings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs`);
        setJobs(res.data);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Search jobs or companies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500 col-span-full">Loading current openings...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-gray-500 col-span-full">No jobs found matching your criteria.</p>
        ) : (
          filteredJobs.map((job) => (
            <Link to={`/jobs/${job._id}`} key={job._id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 group-hover:border-primary/20 transition-colors">
                  <Building size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-text group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6 flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400" /> {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase size={16} className="text-gray-400" /> {job.type}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <IndianRupee size={16} className="text-gray-400" /> 
                  ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={14} /> 
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
                <span className="text-sm font-medium text-primary group-hover:underline">View Details</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </CandidateLayout>
  );
};
