import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, IndianRupee, Clock, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { mockJobs } from '../data/mockJobs';

export const JobListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Finance', 'Accounting', 'Compliance', 'Tech'];

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || job.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Search Header */}
      <section className="bg-secondary pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Find Your Next Career Move</h1>
          
          <div className="bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-lg">
            <div className="flex-grow flex items-center px-4 py-3 md:py-0 bg-gray-50 rounded-xl">
              <Search className="text-gray-400 mr-3 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search job title or company..."
                className="w-full bg-transparent focus:outline-none text-text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-grow flex items-center px-4 py-3 md:py-0 bg-gray-50 rounded-xl">
              <MapPin className="text-gray-400 mr-3 w-5 h-5" />
              <input 
                type="text" 
                placeholder="City, state, or 'Remote'"
                className="w-full bg-transparent focus:outline-none text-text"
              />
            </div>
            <Button className="py-4 md:py-auto px-8 rounded-xl justify-center">
              Search Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-text mb-6">Filters</h3>
            
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Job Category</h4>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      className="form-radio text-primary focus:ring-primary h-4 w-4"
                      checked={categoryFilter === cat}
                      onChange={() => setCategoryFilter(cat)}
                    />
                    <span className="text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Job Type</h4>
              <div className="space-y-2">
                {['Full-time', 'Part-time', 'Contract'].map(type => (
                  <label key={type} className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="form-checkbox text-primary rounded focus:ring-primary h-4 w-4" />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h2>
            <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium">
              <option>Most Recent</option>
              <option>Salary: High to Low</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={job.id} 
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary transition-colors"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link to={`/jobs/${job.id}`} className="text-xl font-bold text-text hover:text-primary transition-colors">
                          {job.title}
                        </Link>
                        {job.isHot && (
                          <span className="bg-blue-50 text-primary text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                            <Flame size={12} /> Hot
                          </span>
                        )}
                      </div>
                      <p className="text-primary font-medium mb-4">{job.company}</p>
                      
                      <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><Briefcase size={16} /> {job.type}</span>
                        <span className="flex items-center gap-1.5"><IndianRupee size={16} /> {job.salaryRange}</span>
                        <span className="flex items-center gap-1.5"><Clock size={16} /> {job.postedAt}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                    </div>
                    
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 shrink-0">
                      <Link to={`/jobs/${job.id}`}>
                        <Button className="w-full md:w-auto px-8">Apply Now</Button>
                      </Link>
                      <Link to={`/jobs/${job.id}`} className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
