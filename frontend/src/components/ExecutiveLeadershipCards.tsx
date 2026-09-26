import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Globe, Briefcase, Building2, MessageCircle } from 'lucide-react';

interface ExecutiveLeadershipCardsProps {
  className?: string;
  animate?: boolean;
}

export const ExecutiveLeadershipCards: React.FC<ExecutiveLeadershipCardsProps> = ({ 
  className = '',
  animate = true 
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 ${className}`}>
      
      {/* Card 1: CA Sarthak Jain */}
      <motion.div
        initial={animate ? { opacity: 0, y: 15 } : undefined}
        whileInView={animate ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-200 flex flex-col justify-between text-left"
      >
        <div>
          {/* Header Row: Avatar + Name/Title + Blue Call Button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-blue-100 shadow-xs shrink-0 bg-blue-50">
                <img 
                  src="/sarthak_jain.jpg" 
                  alt="CA Sarthak Jain" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0F172A] leading-tight">
                  Sarthak Jain
                </h3>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  FOUNDER, DIRECTOR & EXECUTIVE HEAD
                </p>
              </div>
            </div>

            <a 
              href="tel:+917007017090" 
              title="Call Sarthak Jain"
              className="w-9 h-9 rounded-full bg-[#EBF3FE] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors flex items-center justify-center shadow-xs shrink-0"
            >
              <Phone size={16} />
            </a>
          </div>

          {/* Contact List */}
          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs sm:text-[13px] text-slate-600">
            <div className="flex items-center gap-2.5">
              <Phone size={14} className="text-[#2563EB] shrink-0" />
              <div className="font-medium text-slate-700 flex items-center gap-1.5 flex-wrap">
                <a href="tel:+917007017090" className="hover:text-[#2563EB] transition-colors">+91 70070 17090</a>
                <span className="text-slate-300">|</span>
                <a href="tel:+917829822354" className="hover:text-[#2563EB] transition-colors">+91 78298 22354</a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail size={14} className="text-[#2563EB] shrink-0" />
              <a href="mailto:sarthak@fast-india.com" className="font-medium text-slate-700 hover:text-[#2563EB] transition-colors">
                sarthak@fast-india.com
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <Globe size={14} className="text-[#2563EB] shrink-0" />
              <a href="https://sarthakjainca.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-700 hover:text-[#2563EB] hover:underline transition-colors">
                https://sarthakjainca.com/
              </a>
            </div>
          </div>
        </div>

        {/* Footer Row: Consultations & WhatsApp */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-[#2563EB] flex items-center gap-1.5">
            <Briefcase size={14} />
            <span>Executive Consultations</span>
          </span>

          <a 
            href="https://wa.me/917007017090?text=Hello%20Sarthak%20Sir%2C%20I%20would%20like%20to%20inquire%20about%20FAST%20Careers." 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ECFDF5] border border-emerald-200 text-emerald-600 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
          >
            <MessageCircle size={13} className="fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>
      </motion.div>

      {/* Card 2: CA Ritesh Gupta */}
      <motion.div
        initial={animate ? { opacity: 0, y: 15 } : undefined}
        whileInView={animate ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-200 flex flex-col justify-between text-left"
      >
        <div>
          {/* Header Row: Avatar + Name/Title + Blue Call Button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-blue-100 shadow-xs shrink-0 bg-blue-50">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                  alt="Ritesh Gupta" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0F172A] leading-tight">
                  Ritesh Gupta
                </h3>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  FOUNDER, DIRECTOR & CORPORATE HEAD
                </p>
              </div>
            </div>

            <a 
              href="tel:+919200060000" 
              title="Call Ritesh Gupta"
              className="w-9 h-9 rounded-full bg-[#EBF3FE] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors flex items-center justify-center shadow-xs shrink-0"
            >
              <Phone size={16} />
            </a>
          </div>

          {/* Contact List */}
          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs sm:text-[13px] text-slate-600">
            <div className="flex items-center gap-2.5">
              <Phone size={14} className="text-[#2563EB] shrink-0" />
              <div className="font-medium text-slate-700 flex items-center gap-1.5 flex-wrap">
                <a href="tel:+919200060000" className="hover:text-[#2563EB] transition-colors">+91 92000 60000</a>
                <span className="text-slate-300">|</span>
                <a href="tel:+918282882824" className="hover:text-[#2563EB] transition-colors">+91 82828 82824</a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail size={14} className="text-[#2563EB] shrink-0" />
              <a href="mailto:ritesh@fast-india.com" className="font-medium text-slate-700 hover:text-[#2563EB] transition-colors">
                ritesh@fast-india.com
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <Globe size={14} className="text-[#2563EB] shrink-0" />
              <a href="https://fast-india.com" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-700 hover:text-[#2563EB] hover:underline transition-colors">
                https://fast-india.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer Row: Consultations & WhatsApp */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-[#2563EB] flex items-center gap-1.5">
            <Building2 size={14} />
            <span>Corporate Recruitments</span>
          </span>

          <a 
            href="https://wa.me/919200060000?text=Hello%20Ritesh%20Sir%2C%20I%20would%20like%20to%20inquire%20about%20FAST%20Careers%20corporate%20drives." 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ECFDF5] border border-emerald-200 text-emerald-600 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
          >
            <MessageCircle size={13} className="fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>
      </motion.div>

    </div>
  );
};
