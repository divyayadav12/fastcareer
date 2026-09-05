import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'Candidates & CAs' | 'Employers' | 'General';
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    category: 'General',
    question: 'What services does FAST Careers provide?',
    answer: 'FAST Careers offers exceptional executive recruitment and specialized staffing solutions for Chartered Accountants (CAs), finance specialists, semi-qualified CAs, and corporate leadership. We ensure the perfect match for business needs through meticulous candidate profiling, coordination, and feedback support.'
  },
  {
    id: 2,
    category: 'Candidates & CAs',
    question: 'Is registration and placement assistance completely free for candidates?',
    answer: 'Yes, 100% free! We never charge any registration fee, placement charge, or commission from candidates or job seekers at any stage of their hiring journey.'
  },
  {
    id: 3,
    category: 'Candidates & CAs',
    question: 'What types of roles and CTC packages are typically offered?',
    answer: 'We cater to a broad spectrum of finance careers including Fresher CA Campus Opportunities, Statutory Audit, Internal Audit & IFC, Direct & Indirect Taxation, Corporate Finance, FP&A, Investment Banking, Treasury Management, and Executive Leadership (CFO / VP Finance) with packages ranging from ₹10 LPA to ₹1+ Crore.'
  },
  {
    id: 4,
    category: 'Candidates & CAs',
    question: 'Can Fresher CAs and multiple-attempt candidates apply?',
    answer: 'Absolutely! We believe in real talent and industry capability. We run dedicated recruitment mandates for first-attempt rankers as well as multiple-attempt CAs and industrial trainees with strong practical audit and corporate exposure.'
  },
  {
    id: 5,
    category: 'Employers',
    question: 'How do corporate employers and hiring teams partner with FAST Careers?',
    answer: 'Corporate employers can post their hiring mandates directly through our "Employers" section or Contact page. Our dedicated recruitment consultants will review the requirement and share pre-screened, verified candidate shortlists within 24 to 48 hours.'
  },
  {
    id: 6,
    category: 'Candidates & CAs',
    question: 'How are candidates shortlisted for top recruiters like Tata, ITC, HUL, and J.P. Morgan?',
    answer: 'Our proprietary candidate portfolio mapping matches your articleship domain (Big 4, mid-firm, listed company audit), attempt history, GMCS completion, and preferred campus locations directly with the live hiring criteria of our corporate clients.'
  },
  {
    id: 7,
    category: 'Candidates & CAs',
    question: 'What is the expected timeline from profile submission to interview calls?',
    answer: 'Once your profile and resume are fully completed and verified on the portal, relevant shortlistings typically happen within 3 to 7 business days depending on active vacancy cycles and employer schedules.'
  },
  {
    id: 8,
    category: 'Employers',
    question: 'How does FAST Careers ensure the quality and authenticity of candidates?',
    answer: 'We verify ICAI membership/registration numbers, exam passing sessions, attempt counts, articleship firm credentials, graduation records, and prior employment history to ensure employers only interview authentic, high-caliber talent.'
  },
  {
    id: 9,
    category: 'General',
    question: 'How can I reach the FAST Careers support team on WhatsApp for quick help?',
    answer: 'You can connect directly with our support desk via the WhatsApp connect button on the Contact page or by reaching out at +91 8839250427 for instant application and recruiter inquiries.'
  },
  {
    id: 10,
    category: 'General',
    question: 'Where can I download the FAST Careers official Corporate Profile brochure?',
    answer: 'You can download our official Corporate Profile PDF directly from the About Us page by clicking the "Download Corporate Profile" button.'
  }
];

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] relative overflow-hidden" id="faq">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold mb-3 shadow-xs">
            <HelpCircle size={16} className="text-primary" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Everything You Need To <span className="text-[#0B2865]">Know</span>
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Quick answers about CA recruitment, corporate hiring partnerships, and profile shortlisting on FAST Careers.
          </p>
        </motion.div>

        {/* Minimal Clean FAQ Accordion matching reference image */}
        <div className="space-y-3.5 mb-12">
          {FAQS.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(idx * 0.05, 0.35),
                  ease: "easeOut"
                }}
                className={`bg-white rounded-xl sm:rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md ${
                  isOpen
                    ? 'border-blue-200/90 shadow-md ring-1 ring-blue-100'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none focus:outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className={`font-bold text-sm sm:text-base leading-snug transition-colors ${
                    isOpen ? 'text-[#0B2865]' : 'text-[#0B2865] group-hover:text-primary'
                  }`}>
                    {faq.question}
                  </span>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0 text-[#0B2865] p-1"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                {/* Animated Smooth Accordion Opening & Closing on Click */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`content-${faq.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        transition: {
                          height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.25, delay: 0.05 }
                        }
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        transition: {
                          height: { duration: 0.25, ease: "easeInOut" },
                          opacity: { duration: 0.15 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-gray-500 text-xs sm:text-sm leading-relaxed border-t border-gray-50">
                        <p className="pt-2">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Help CTA Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 25 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-r from-[#0F2B48] via-[#163e65] to-[#0F2B48] rounded-2xl p-6 sm:p-7 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 border border-blue-900/50"
        >
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Still have questions or need personalized guidance?
            </h3>
            <p className="text-blue-200 text-xs sm:text-sm mt-0.5">
              Connect directly with our senior talent advisors on phone or WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/contact">
              <button className="px-4.5 py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center gap-2">
                <PhoneCall size={14} />
                <span>Contact Us</span>
              </button>
            </Link>
            <a
              href="https://wa.me/918839250427"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center gap-1.5"
            >
              <MessageSquare size={14} />
              <span>WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
