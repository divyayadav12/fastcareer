import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building2, GraduationCap, Users } from 'lucide-react';

const serviceDetails = [
  {
    id: 'executive-search',
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    title: 'Executive Search',
    imageUrl: '/service-exec.jpg',
    description: 'Identifying and securing transformational leadership for your organization. Our executive search process is thorough, discreet, and highly targeted.',
    features: [
      'C-Suite & Board Level Placements',
      'Confidential Search Execution',
      'Comprehensive Market Mapping',
      'Leadership Assessment & Profiling'
    ]
  },
  {
    id: 'permanent-staffing',
    icon: <Building2 className="w-10 h-10 text-primary" />,
    title: 'Permanent Staffing',
    imageUrl: '/service-perm.jpg',
    description: 'Finding the right full-time talent that aligns with your company culture and long-term strategic goals.',
    features: [
      'Mid to Senior Level Hiring',
      'Rigorous Candidate Screening',
      'Cultural Fit Assessment',
      'Salary Negotiation & Onboarding Support'
    ]
  },
  {
    id: 'campus-hiring',
    icon: <GraduationCap className="w-10 h-10 text-primary" />,
    title: 'Campus Hiring Solutions',
    imageUrl: '/service-campus.jpg',
    description: 'Building your future talent pipeline by connecting you with top graduates from premier institutions.',
    features: [
      'University Relationship Management',
      'Volume Hiring Management',
      'Pre-placement Talks Organization',
      'Entry-level Assessment Centers'
    ]
  },
  {
    id: 'contract-staffing',
    icon: <Users className="w-10 h-10 text-primary" />,
    title: 'Contract & Temporary Staffing',
    imageUrl: '/service-contract.jpg',
    description: 'Flexible workforce solutions to help you manage peak workloads, special projects, or interim leadership needs.',
    features: [
      'Rapid Deployment of Professionals',
      'Project-based Hiring',
      'Payroll & Compliance Management',
      'Interim Management Solutions'
    ]
  }
];

export const Services = () => {
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
            Our Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Comprehensive talent solutions designed to scale with your organization. From strategic executive hires to volume campus recruitment.
          </motion.p>
        </div>
      </section>

      {/* Services Detailed List */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-20">
          {serviceDetails.map((service, index) => (
            <div 
              key={service.id} 
              className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2">
                <div className="aspect-[4/3] bg-gray-200 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-md">
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 font-medium z-10">[Image: {service.title}]</span>
                  )}
                  <div className="absolute inset-0 bg-secondary/5 mix-blend-multiply"></div>
                </div>
              </div>
              
              {/* Content Side */}
              <div className="w-full md:w-1/2">
                <div className="mb-6 bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center">
                  {service.icon}
                </div>
                <h2 className="text-3xl font-bold text-text mb-4">{service.title}</h2>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {service.description}
                </p>
                <ul className="space-y-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text mb-6">Need a Custom Solution?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Every organization is unique. Contact our consultants to design a tailored recruitment strategy that fits your specific needs.
          </p>
          <a href="/contact" className="inline-block bg-primary text-white font-semibold py-4 px-8 rounded-full hover:bg-primary-hover transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Consult with an Expert
          </a>
        </div>
      </section>
    </div>
  );
};
