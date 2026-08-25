import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Understand', desc: 'Understand client requirements.' },
  { num: '02', title: 'Source', desc: 'Identify suitable candidates.' },
  { num: '03', title: 'Screen', desc: 'Evaluate profiles and skills.' },
  { num: '04', title: 'Interview', desc: 'Coordinate interviews.' },
  { num: '05', title: 'Select', desc: 'Match candidate with organization.' },
  { num: '06', title: 'Success', desc: 'Complete placement successfully.' },
];

export const ProcessSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-text mb-4"
          >
            How Our Recruitment Process Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg"
          >
            A streamlined, transparent approach to finding the perfect match.
          </motion.p>
        </div>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden md:block relative mt-20 mb-10">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent-gradientStart -translate-y-1/2 transform scale-x-0 origin-left" style={{ animation: 'fillTimeline 2s forwards', animationPlayState: 'paused' }} id="timeline-line"></div>
          
          <div className="grid grid-cols-6 gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 mb-4 transition-colors duration-500 hover:border-primary hover:text-primary shadow-sm relative group">
                  {step.num}
                  <div className="absolute inset-0 rounded-full bg-primary/10 scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100 -z-10"></div>
                </div>
                <h3 className="font-bold text-text mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 max-w-[120px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden relative border-l-2 border-gray-100 ml-4 mt-8 space-y-8 pb-4">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8"
            >
              <div className="absolute -left-[17px] top-1 w-8 h-8 bg-white border-4 border-primary rounded-full flex items-center justify-center text-xs font-bold text-primary shadow-sm">
                {step.num}
              </div>
              <h3 className="font-bold text-text mb-1">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
