import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, PieChart, ShieldCheck, MonitorPlay, BarChart4, Globe2 } from 'lucide-react';

const domains = [
  {
    icon: <Landmark className="w-12 h-12 text-primary" />,
    title: 'Finance & Banking',
    description: 'Corporate finance, investment banking, private equity, and wealth management roles.',
    roles: ['Chief Financial Officer', 'Investment Analyst', 'Portfolio Manager', 'VP Finance']
  },
  {
    icon: <PieChart className="w-12 h-12 text-primary" />,
    title: 'Accounting & Taxation',
    description: 'Certified professionals for public accounting, corporate tax, and internal auditing.',
    roles: ['Tax Director', 'Audit Manager', 'Financial Controller', 'Senior Accountant']
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-primary" />,
    title: 'Risk & Compliance',
    description: 'Experts in regulatory compliance, risk mitigation, and corporate governance.',
    roles: ['Chief Compliance Officer', 'Risk Analyst', 'AML Director', 'Regulatory Affairs']
  },
  {
    icon: <MonitorPlay className="w-12 h-12 text-primary" />,
    title: 'FinTech & Tech',
    description: 'Bridging the gap between financial services and cutting-edge technology.',
    roles: ['Product Manager', 'Data Scientist', 'CTO', 'Blockchain Engineer']
  },
  {
    icon: <BarChart4 className="w-12 h-12 text-primary" />,
    title: 'Consulting & Strategy',
    description: 'Management consultants and strategists for top-tier advisory firms.',
    roles: ['Strategy Director', 'Management Consultant', 'Operations Head', 'M&A Advisor']
  },
  {
    icon: <Globe2 className="w-12 h-12 text-primary" />,
    title: 'Global Operations',
    description: 'Leaders capable of managing complex, cross-border financial operations.',
    roles: ['Head of Shared Services', 'Global Ops Director', 'Supply Chain Finance', 'Treasury Manager']
  }
];

export const Expertise = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-secondary text-white pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Our Expertise Domains
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Deep industry knowledge meets expansive networking. We specialize in specific verticals to ensure we understand the nuances of every role.
          </motion.p>
        </div>
      </section>

      {/* Expertise Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {domains.map((domain, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="mb-6 bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center">
                {domain.icon}
              </div>
              <h3 className="text-2xl font-bold text-text mb-4">{domain.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {domain.description}
              </p>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Placements</h4>
                <ul className="space-y-2">
                  {domain.roles.map((role, idx) => (
                    <li key={idx} className="flex items-center text-sm font-medium text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Methodology Banner */}
      <section className="py-20 px-4 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">Our Specialization Advantage</h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            By focusing on core financial and corporate domains, our recruiters speak your language. We understand the technical requirements, the regulatory environments, and the cultural nuances of these specific industries.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Candidate Retention</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">15k+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Pre-vetted Network</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">&lt; 30</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Days Average Time-to-Fill</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
