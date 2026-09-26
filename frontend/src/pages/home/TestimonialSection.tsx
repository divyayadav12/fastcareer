import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Award, Building, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    quote: "FAST CA CAMPUS provided us with an outstanding pool of pre-screened CA freshers and rankers. The event was seamlessly coordinated across multiple interview panels, saving our recruitment team weeks of operational effort.",
    name: "Head of Talent Acquisition",
    designation: "Leading Indian FMCG Conglomerate",
    company: "Campus Recruiter Partner"
  },
  {
    quote: "Registering on FAST Careers right after my CA Final results was the best decision. I got shortlisted and interviewed by premier corporate recruiters during the Mumbai CA Campus drive and secured an offer in Corporate Finance.",
    name: "Chartered Accountant (AIR Ranker)",
    designation: "Placed at Leading Advisory Firm",
    company: "FAST CA Campus Alum"
  },
  {
    quote: "For lateral finance mandates requiring specific audit exposure or industry experience, FAST Careers' candidate shortlisting is remarkably precise. Their trained HR team truly understands CA profiles.",
    name: "VP - Human Resources",
    designation: "Premier Private Banking & Financial Services",
    company: "Lateral Hiring Partner"
  }
];

export const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-10 sm:py-12 bg-slate-50 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs sm:text-sm font-bold mb-3 hover:scale-105 transition-transform">
            <Award size={16} className="text-blue-600 animate-pulse" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Trusted by Recruiters & Candidates Alike
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-normal">
            Over a decade of enabling premier corporate placements across India’s CA community.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 z-10">
            <motion.button 
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev} 
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-blue-600 hover:border-blue-400 transition-colors focus:outline-none"
            >
              <ChevronLeft size={22} />
            </motion.button>
          </div>
          
          <div className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 z-10">
            <motion.button 
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={next} 
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-blue-600 hover:border-blue-400 transition-colors focus:outline-none"
            >
              <ChevronRight size={22} />
            </motion.button>
          </div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all border border-slate-100 relative min-h-[280px] flex items-center"
          >
            <motion.div 
              animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-6 left-6 text-blue-100/70 -z-10 pointer-events-none"
            >
              <Quote size={80} />
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full text-center"
              >
                <p className="text-lg md:text-xl text-slate-700 italic mb-6 leading-relaxed font-normal">
                  "{testimonials[currentIndex].quote}"
                </p>
                <div className="flex flex-col items-center">
                  <h4 className="font-extrabold text-slate-900 text-base">{testimonials[currentIndex].name}</h4>
                  <p className="text-xs sm:text-sm text-blue-600 font-bold">{testimonials[currentIndex].designation}</p>
                  <p className="text-xs text-gray-500 font-medium">{testimonials[currentIndex].company}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-7 bg-blue-600 shadow-xs' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
