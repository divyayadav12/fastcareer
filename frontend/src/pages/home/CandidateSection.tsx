import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { Search, UploadCloud, Bell, Activity } from 'lucide-react';

const features = [
  { icon: Search, text: 'Search Jobs' },
  { icon: UploadCloud, text: 'Upload Resume' },
  { icon: Activity, text: 'Track Applications' },
  { icon: Bell, text: 'Job Alerts' },
];

export const CandidateSection = () => {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-primary/5 rounded-l-full -z-10 translate-x-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">For Candidates</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text mb-6 leading-tight">
              Your Next Opportunity Starts Here.
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Explore opportunities, showcase your skills and connect with top organizations looking for talent exactly like you.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button variant="primary" size="lg">Search Jobs</Button>
              <Button variant="outline" size="lg">Create Candidate Profile</Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md hover:-translate-y-1 transition-all">
                <feature.icon size={32} className="text-primary mb-4" />
                <span className="font-semibold text-text">{feature.text}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
