import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, Calculator, FileCheck, UserPlus, Users, GraduationCap, Briefcase, ChartBar } from 'lucide-react';

const domains = [
  { name: 'Finance', icon: Landmark },
  { name: 'Accounting', icon: Calculator },
  { name: 'Compliance', icon: FileCheck },
  { name: 'CA Recruitment', icon: UserPlus },
  { name: 'Corporate Hiring', icon: Users },
  { name: 'Campus Recruitment', icon: GraduationCap },
  { name: 'Management', icon: Briefcase },
  { name: 'Professional Services', icon: ChartBar },
];

export const ExpertiseSection = () => {
  return (
    <section className="py-20 bg-secondary text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold mb-4"
          >
            Our Core Expertise
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-1 bg-primary mx-auto rounded-full mb-6"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg"
          >
            Specialized recruitment across key business functions.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {domains.map((domain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 p-6 rounded-xl text-center hover:bg-white/10 hover:border-primary/50 transition-all cursor-default group backdrop-blur-sm"
            >
              <domain.icon size={32} className="mx-auto mb-4 text-gray-400 group-hover:text-primary transition-colors" />
              <h3 className="font-semibold text-sm md:text-base">{domain.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
