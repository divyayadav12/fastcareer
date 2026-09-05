import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare, PhoneCall, Sparkles } from 'lucide-react';
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
    question: 'What makes FAST Careers different from general job portals?',
    answer: 'FAST Careers is India\'s premier specialized executive search and recruitment consultancy focused exclusively on Chartered Accountants (CAs), finance specialists, semi-qualified CAs, and corporate finance leadership. Unlike generic job boards, our candidates are hand-curated and directly fast-tracked to senior decision-makers in Fortune 500 multinationals and top Indian conglomerates.'
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
    question: 'What is FAST Careers\' background screening and verification process for candidates?',
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
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Candidates & CAs', 'Employers', 'General'];

  const filteredFaqs = FAQS.filter(
    faq => activeCategory === 'All' || faq.category === activeCategory
  );

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden" id="faq">
      {/* Background Decorative Glow with Floating Animation */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.35, 0.5, 0.35]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Scroll-Triggered Header Animation */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold mb-3 shadow-xs">
            <HelpCircle size={16} className="text-primary" />
            <span>Got Questions? We Have Answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Everything you need to know about CA recruitment, corporate hiring partnerships, and profile shortlisting on FAST Careers.
          </p>
        </motion.div>

        {/* Scroll-Triggered Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat === 'All' ? `All Questions (${FAQS.length})` : cat}
            </button>
          ))}
        </motion.div>

        {/* Accordion FAQ List with Scroll Trigger & Staggered Reveal */}
        <div className="space-y-3.5 mb-12">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(idx * 0.07, 0.4),
                  ease: "easeOut"
                }}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-primary/40 shadow-lg ring-2 ring-primary/10'
                    : 'border-gray-200/80 shadow-xs hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 pr-2">
                    <motion.div
                      animate={{
                        scale: isOpen ? [1, 1.15, 1] : 1
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-blue-50 text-primary'
                      }`}
                    >
                      {faq.id}
                    </motion.div>
                    <span className="font-extrabold text-sm sm:text-base text-gray-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isOpen
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                {/* Animated Smooth Accordion Opening & Closing */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`answer-${faq.id}`}
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
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-gray-100">
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-3">
                          {faq.answer}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-semibold">
                            Tag: {faq.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll-Triggered Bottom Help CTA Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="bg-gradient-to-r from-[#0F2B48] via-[#163e65] to-[#0F2B48] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-blue-900/50"
        >
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Still have questions or need assistance?
            </h3>
            <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-lg">
              Our career advisors and talent consultants are here to help you every step of the way.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/contact">
              <button className="px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-900 font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center gap-2">
                <PhoneCall size={15} />
                <span>Contact Us</span>
              </button>
            </Link>
            <a
              href="https://wa.me/918839250427"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center gap-1.5"
            >
              <MessageSquare size={15} />
              <span>WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
