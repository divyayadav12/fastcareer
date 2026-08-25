import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative bg-background pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-accent-light rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            x: [0, -20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-48 -left-24 w-72 h-72 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm mb-6">
              <ShieldCheck size={16} className="text-primary" />
              <span className="text-xs font-semibold text-text uppercase tracking-wider">Trusted Recruitment Partner Since 2008</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text leading-tight mb-6 tracking-tight">
              Connecting Exceptional Talent <br className="hidden lg:block"/>
              With <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-gradientStart">Exceptional Opportunities.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Since 2008, FAST CAREERS has been connecting exceptional professionals with organizations across finance, accounting, compliance, recruitment and other specialized domains.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Button variant="primary" size="lg" className="group">
                Find Your Next Opportunity
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Hire Top Talent
              </Button>
            </div>
          </motion.div>

          {/* Visual/Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            {/* Placeholder for professional corporate visual */}
            <div className="relative rounded-2xl bg-gray-100 shadow-2xl overflow-hidden aspect-[4/3] border border-gray-200 flex items-center justify-center">
              <img src="/hero-corporate.jpg" alt="Corporate Recruitment" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-white opacity-20"></div>
              
              {/* Floating elements to make it dynamic */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }} 
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 -left-10 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-3 hidden md:flex"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ShieldCheck size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Candidate Match</p>
                  <p className="font-bold text-sm">98% Fit</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
