import React from 'react';
import { motion } from 'framer-motion';
import { Building, Users, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const Employers = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text leading-tight mb-6">
                Hire the top <span className="text-primary">1% of talent</span> in the industry.
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                FAST CAREERS provides enterprise-grade recruitment solutions for companies looking to scale their teams with exceptional professionals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register?type=employer">
                  <Button size="lg" className="flex items-center gap-2">
                    Start Hiring Now <ArrowRight size={18} />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">Talk to Sales</Button>
              </div>
              <div className="mt-8 flex items-center gap-4 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> No setup fees</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> Cancel anytime</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-bold text-lg text-text">Applicant Pipeline</h3>
                    <p className="text-sm text-gray-500">Real-time tracking</p>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Users size={20} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Sarah Jenkins', role: 'Senior Financial Analyst', status: 'Interviewing', initials: 'SJ', statusColor: 'text-blue-700 bg-blue-100' },
                    { name: 'Michael Chang', role: 'Tax Director', status: 'Offer Extended', initials: 'MC', statusColor: 'text-green-700 bg-green-100' },
                    { name: 'David Smith', role: 'Compliance Officer', status: 'Screening', initials: 'DS', statusColor: 'text-yellow-700 bg-yellow-100' },
                  ].map((applicant, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-gray-100 text-gray-600 font-bold text-sm rounded-full shrink-0 flex items-center justify-center">
                        {applicant.initials}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm mb-1">{applicant.name}</div>
                        <div className="text-xs text-gray-500">{applicant.role}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${applicant.statusColor}`}>
                        {applicant.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-primary rounded-3xl opacity-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Why Employers Choose FAST</h2>
            <p className="text-gray-600">Our platform is designed to minimize your time-to-hire while maximizing the quality of your candidates.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl hover:shadow-md transition-shadow border border-transparent hover:border-gray-100">
              <div className="w-14 h-14 bg-blue-100 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-text mb-3">Smart Matching</h3>
              <p className="text-gray-600 leading-relaxed">Our proprietary AI algorithm matches your job requirements with candidate skills, scoring them from 0-100 for instant shortlisting.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-3xl hover:shadow-md transition-shadow border border-transparent hover:border-gray-100">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-text mb-3">Verified Profiles</h3>
              <p className="text-gray-600 leading-relaxed">Every candidate goes through a basic verification process. No more fake resumes or exaggerated skill sets wasting your time.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-3xl hover:shadow-md transition-shadow border border-transparent hover:border-gray-100">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Building size={28} />
              </div>
              <h3 className="text-xl font-bold text-text mb-3">Enterprise ATS</h3>
              <p className="text-gray-600 leading-relaxed">Manage your entire recruitment pipeline from our built-in Applicant Tracking System without needing third-party software.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to build your dream team?</h2>
          <p className="text-gray-300 text-lg mb-10">Join hundreds of top companies who trust FAST CAREERS to find their next exceptional hire.</p>
          <Link to="/register?type=employer">
            <Button size="lg" className="bg-primary hover:bg-primary-hover text-white border-none px-8 py-4 text-lg">
              Create Employer Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
