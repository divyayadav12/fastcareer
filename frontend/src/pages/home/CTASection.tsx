import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-secondary">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[50%] -right-[10%] w-[70%] h-[200%] bg-gradient-to-l from-primary/20 to-transparent transform rotate-12"></div>
        <div className="absolute -bottom-[50%] -left-[10%] w-[50%] h-[150%] bg-gradient-to-r from-primary/10 to-transparent transform -rotate-12"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-6"
        >
          Ready For The Next Opportunity?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
        >
          Whether you're a professional looking to advance your career or an organization seeking exceptional talent, we are here to help.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Button variant="primary" size="lg" className="group text-base px-8 py-4">
            Find Your Next Job
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" className="border-gray-500 text-white hover:bg-gray-800 text-base px-8 py-4">
            Find Your Next Hire
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
