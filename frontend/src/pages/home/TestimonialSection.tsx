import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: "FAST CAREERS understood exactly what we were looking for in our next CFO. Their executive search team was discreet, professional, and delivered a shortlist of exceptional candidates within weeks.",
    name: "Placeholder Name",
    designation: "CEO",
    company: "Global Finance Corp"
  },
  {
    quote: "As a fresh CA, I was struggling to find the right entry point into the corporate world. The team at FAST didn't just place me; they guided me through the interview process and helped me secure a role at a top firm.",
    name: "Placeholder Candidate",
    designation: "Chartered Accountant",
    company: "Top Tier Firm"
  },
  {
    quote: "Their lateral hiring solutions have significantly reduced our time-to-hire. The candidates they send over are always pre-screened and highly relevant to our specific tech stack and culture.",
    name: "Placeholder HR Head",
    designation: "Head of Talent Acquisition",
    company: "Tech Innovators Inc"
  }
];

export const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-text mb-4"
          >
            What People Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg"
          >
            Real feedback from our valued clients and candidates. (Placeholder Content)
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 z-10">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-primary transition-colors focus:outline-none">
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 z-10">
            <button onClick={next} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-primary transition-colors focus:outline-none">
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative min-h-[300px] flex items-center">
            <Quote size={80} className="absolute top-8 left-8 text-gray-100 -z-10" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full text-center"
              >
                <p className="text-xl md:text-2xl text-gray-700 italic mb-8 leading-relaxed">
                  "{testimonials[currentIndex].quote}"
                </p>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <h4 className="font-bold text-text text-lg">{testimonials[currentIndex].name}</h4>
                  <p className="text-sm text-gray-500">{testimonials[currentIndex].designation}, {testimonials[currentIndex].company}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-primary' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
