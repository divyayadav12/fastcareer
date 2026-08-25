import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { ArrowRight } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Image / Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative bg-gray-100 flex items-center justify-center border border-gray-200">
               <img src="/about-section.jpg" alt="Corporate Expertise" className="absolute inset-0 w-full h-full object-cover" />
               {/* Decorative background overlay */}
               <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent mix-blend-multiply"></div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-accent-light rounded-full mix-blend-multiply filter blur-3xl opacity-60 -z-10"></div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-text mb-6">
              Built on Expertise. <br />
              <span className="text-primary">Driven by People.</span>
            </h2>
            
            <div className="w-16 h-1 bg-primary mb-8 rounded-full"></div>
            
            <div className="space-y-6 text-gray-600 text-lg">
              <p>
                Founded in 2008 with a focus on CA recruitment, FAST CAREERS has evolved into a leading staffing partner across multiple domains—including finance, compliance, accounting, and beyond.
              </p>
              <p>
                We believe that great companies are built by great people. Our rigorous selection process and deep industry knowledge allow us to go beyond resumes to find true cultural and professional fits.
              </p>
              <p className="font-semibold text-secondary">
                At FAST CAREERS, quality means matching the right talent with the right opportunity—on time, every time.
              </p>
            </div>

            <div className="mt-10">
              <Button variant="outline" size="lg" className="group">
                Discover Our Story
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
