import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { FileEdit, SearchCheck, GraduationCap, Briefcase, HelpCircle } from 'lucide-react';

const features = [
  { icon: FileEdit, text: 'Submit Hiring Requirement' },
  { icon: SearchCheck, text: 'Search Candidates' },
  { icon: GraduationCap, text: 'Campus Recruitment' },
  { icon: Briefcase, text: 'Lateral Hiring' },
  { icon: HelpCircle, text: 'Recruitment Support' },
];

export const EmployerSection = () => {
  return (
    <section className="py-24 bg-secondary text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full md:w-1/2 h-full bg-primary/10 rounded-r-full -z-10 -translate-x-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center flex-col-reverse md:flex-row">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4 md:order-1 order-2"
          >
            {features.map((feature, i) => (
              <div key={i} className={`bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all ${i === features.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}>
                <feature.icon size={32} className="text-primary mb-4" />
                <span className="font-semibold text-sm">{feature.text}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:order-2 order-1"
          >
            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">For Employers</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Build Your Team With The Right Talent.
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Tell us what you need. We'll help you find the professionals who can make an impact on your organization's growth.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button variant="primary" size="lg">Post a Requirement</Button>
              <Button variant="outline" size="lg" className="border-gray-500 text-white hover:bg-gray-800">Talk to Our Team</Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
