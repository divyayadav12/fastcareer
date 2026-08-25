import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Search, Users, Lightbulb, Building2, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: GraduationCap,
    title: 'Campus Recruitment',
    description: 'Connect organizations with emerging finance, accounting and business talent directly from top institutions.'
  },
  {
    icon: Briefcase,
    title: 'Lateral Recruitment',
    description: 'Identify experienced professionals based on specific skill sets, experience, and strategic business requirements.'
  },
  {
    icon: Users,
    title: 'Recruitment Consultancy',
    description: 'End-to-end recruitment support, from employer branding to onboarding strategies for scaling organizations.'
  },
  {
    icon: Lightbulb,
    title: 'Training & Development',
    description: 'Prepare candidates for successful transitions from education to demanding corporate careers.'
  },
  {
    icon: Search,
    title: 'Executive Search',
    description: 'Specialized, discreet talent identification for C-suite and critical leadership roles.'
  },
  {
    icon: Building2,
    title: 'Corporate Hiring',
    description: 'Customized, high-volume recruitment solutions tailored for growing organizations.'
  }
];

export const ServicesSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-text mb-4"
          >
            End-to-End Talent Solutions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg"
          >
            Comprehensive recruitment services designed to build high-performing teams and advance careers.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
            >
              {/* Hover Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              
              <div className="w-14 h-14 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <service.icon size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-text mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6 line-clamp-3">
                {service.description}
              </p>
              
              <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-2 transition-transform cursor-pointer">
                Learn more <ArrowRight size={16} className="ml-1" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
