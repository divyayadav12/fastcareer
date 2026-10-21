import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  ArrowRight,
  Building2,
  User,
  Calendar,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndustrialTrainingModal } from '../../components/IndustrialTrainingModal';

// ─── Shared timeline milestones (used in all slides' right card) ───────────────
const timelineMilestones = [
  {
    year: '2008',
    badgeBg: 'bg-[#1d64f2] text-white',
    dotBg: 'bg-[#1d64f2]',
    title: 'Indore Inception & 1st CA Campus',
    desc: "Founded in Indore; pioneered India's first private off-campus recruitment for fresh CAs.",
  },
  {
    year: '2010',
    badgeBg: 'bg-[#10b981] text-white',
    dotBg: 'bg-[#10b981]',
    title: 'Delhi NCR Campus Expansion',
    desc: 'Expanded to National Capital Region partnering with Big 4 advisory & top corporates.',
  },
  {
    year: '2012',
    badgeBg: 'bg-[#7c3aed] text-white',
    dotBg: 'bg-[#7c3aed]',
    title: '4+ Metro Cities & Bengaluru Hub',
    desc: 'Multi-city drives across Mumbai, Bengaluru, Chennai, Kolkata & corporate hubs.',
  },
  {
    year: '2020+',
    badgeBg: 'bg-[#0f172a] text-white',
    dotBg: 'bg-[#0f172a]',
    title: '10+ Cities & Pan-India Virtual Campus',
    desc: '10+ physical cities + Centralized All-India Virtual Campus connecting all 28 states & UTs.',
  },
];

// ─── Right-hand Milestone Card (shared across all slides) ────────────────────
const MilestoneCard = () => (
  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-shadow duration-300">
    {/* Card Header */}
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#eaf3ff] border border-[#bcd7ff] flex items-center justify-center text-[#1d64f2] shrink-0">
          <Calendar size={15} />
        </div>
        <div>
          <span className="text-[9px] font-black uppercase tracking-wider text-[#1d64f2] block leading-none">
            OUR PLACEMENT JOURNEY
          </span>
          <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-1 leading-tight">
            18+ Years Milestone Timeline
          </h3>
        </div>
      </div>

      <Link
        to="/placement-results"
        className="w-7 h-7 rounded-full bg-[#eaf3ff] hover:bg-[#d5e7ff] text-[#1d64f2] flex items-center justify-center shrink-0 transition-all hover:scale-110 shadow-2xs"
        aria-label="View Milestones"
      >
        <ArrowUpRight size={14} />
      </Link>
    </div>

    {/* Timeline */}
    <div className="relative pl-3.5 space-y-2 border-l-2 border-slate-200 ml-1.5">
      {timelineMilestones.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.35 + idx * 0.1 }}
          whileHover={{ scale: 1.02, x: 3 }}
          className="relative group cursor-pointer"
        >
          <div
            className={`absolute -left-[20px] top-3 w-2.5 h-2.5 rounded-full border-2 border-white ${item.dotBg} shadow-2xs group-hover:scale-125 transition-transform`}
          />
          <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-slate-200/70 group-hover:bg-[#f0f6ff] group-hover:border-blue-300 transition-all">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded leading-none ${item.badgeBg}`}>
                {item.year}
              </span>
              <span className="font-extrabold text-[11px] text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                {item.title}
              </span>
            </div>
            <p className="text-[10px] text-slate-600 leading-normal pl-0.5">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ─── Slide variants — instant crossfade, no scroll/movement ─────────────────
const slideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

// ─── Main Hero Component ──────────────────────────────────────────────────────
export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isPaused, setIsPaused] = useState(false);
  const [itModalOpen, setItModalOpen] = useState(false);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_COUNT = 3;
  const AUTO_INTERVAL = 6000; // 6 seconds

  const goTo = useCallback(
    (idx: number, dir?: number) => {
      const newDir = dir ?? (idx > currentSlide ? 1 : -1);
      setDirection(newDir);
      setCurrentSlide((idx + SLIDE_COUNT) % SLIDE_COUNT);
    },
    [currentSlide]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % SLIDE_COUNT);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (isPaused) return;
    autoRef.current = setInterval(next, AUTO_INTERVAL);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [isPaused, next]);

  // ─── SLIDE 1: CA Recruitment ──────────────────────────────────────────────
  const Slide1 = () => (
    <div className="grid lg:grid-cols-12 gap-6 lg:gap-4 items-center">
      {/* Left: Text & CTAs */}
      <div className="lg:col-span-5 text-left z-10 py-6 pl-8 sm:pl-10 lg:pl-4">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[#eaf3ff] border border-[#bcd7ff] px-3.5 py-1.5 rounded-full mb-3.5 shadow-2xs w-fit hover:scale-105 transition-transform"
        >
          <Trophy size={14} className="text-[#1d64f2] fill-[#1d64f2] shrink-0 animate-bounce" />
          <span className="text-[11px] font-black text-[#1d64f2] tracking-wider uppercase">
            INDIA'S LARGEST CA PLACEMENT COMPANY • SINCE 2008
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[45px] font-black text-[#0b192c] leading-[1.12] tracking-tight mb-3.5"
        >
          Recruit CAs <br />
          <span className="text-[#1d64f2]">(Experienced &amp; Freshers)</span> <br />
          From India's Largest CA <br />
          Placement Company
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs sm:text-sm text-slate-600 mb-5 max-w-md leading-relaxed font-medium"
        >
          <strong className="text-slate-900 font-bold">Fast Career Consultants Private Limited</strong> connects{' '}
          <strong className="text-[#1d64f2] font-bold">60+</strong> top-notch corporates with India's largest talent
          pool of <strong className="text-[#1d64f2] font-bold">125,000+</strong> registered Chartered Accountants, All
          India Rankers (AIRs), and seasoned finance leaders.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <Link to="/register" className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#1d64f2] hover:bg-[#1554cf] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap hover:shadow-lg"
            >
              <User size={16} className="shrink-0" />
              <span>Register as CA Candidate</span>
              <ArrowRight size={15} className="shrink-0" />
            </motion.button>
          </Link>

          <Link to="/placement-drive" className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-50 text-[#0b192c] border-2 border-[#cfdff5] hover:border-[#1d64f2] font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap hover:shadow-md"
            >
              <Building2 size={16} className="text-[#1d64f2] shrink-0" />
              <span>Hire CAs / Corporate Drive</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Center: Woman Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 0.2 },
          scale: { duration: 0.7, delay: 0.2 },
          y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
        }}
        className="lg:col-span-4 flex items-end justify-center relative min-h-[420px] lg:min-h-[520px] overflow-visible"
      >
        <img
          src="/hero_woman_new.png"
          alt="Corporate Woman - Fast Careers"
          className="w-full h-auto max-h-[540px] object-contain object-bottom pointer-events-none select-none"
        />
      </motion.div>

      {/* Right: Milestone Card */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="lg:col-span-3 z-10 py-6"
      >
        <MilestoneCard />
      </motion.div>
    </div>
  );

  // ─── SLIDE 2: Non-IT Recruitment for India ───────────────────────────────
  const Slide2 = () => (
    <div className="grid lg:grid-cols-12 gap-6 lg:gap-4 items-center">
      {/* Left: Text & CTAs */}
      <div className="lg:col-span-5 text-left z-10 py-6 pl-8 sm:pl-10 lg:pl-4">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[#fff7ed] border border-[#fed7aa] px-3.5 py-1.5 rounded-full mb-3.5 shadow-2xs w-fit hover:scale-105 transition-transform"
        >
          <Briefcase size={14} className="text-[#ea580c] fill-[#ea580c] shrink-0" />
          <span className="text-[11px] font-black text-[#ea580c] tracking-wider uppercase">
            INDIA'S LEADING NON-IT PLACEMENT PARTNER • SINCE 2008
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[45px] font-black text-[#0b192c] leading-[1.12] tracking-tight mb-3.5"
        >
          Recruiters of <br />
          <span className="text-[#ea580c]">Non-IT for India</span> <br />
          Finance, Accounts &amp; <br />
          Commerce Talent
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs sm:text-sm text-slate-600 mb-5 max-w-md leading-relaxed font-medium"
        >
          <strong className="text-slate-900 font-bold">Fast Career Consultants Private Limited</strong> bridges
          India's top <strong className="text-[#ea580c] font-bold">Non-IT talent</strong> — Finance, Accounts,
          Banking &amp; Commerce professionals — with{' '}
          <strong className="text-[#ea580c] font-bold">300+</strong> corporates across all major industries Pan-India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <Link to="/register" className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap hover:shadow-lg"
            >
              <User size={16} className="shrink-0" />
              <span>Register as Candidate</span>
              <ArrowRight size={15} className="shrink-0" />
            </motion.button>
          </Link>

          <Link to="/placement-drive" className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-50 text-[#0b192c] border-2 border-[#fed7aa] hover:border-[#ea580c] font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap hover:shadow-md"
            >
              <Building2 size={16} className="text-[#ea580c] shrink-0" />
              <span>Hire Non-IT Talent</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Center: Duo Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ opacity: { duration: 0.7, delay: 0.2 }, scale: { duration: 0.7, delay: 0.2 } }}
        className="lg:col-span-4 flex items-center justify-center relative overflow-hidden rounded-2xl"
        style={{ height: '420px' }}
      >
        <img
          src="/hero_non_it_duo.jpg"
          alt="Non-IT Corporate Duo - Fast Careers"
          className="w-full h-full object-cover object-top pointer-events-none select-none rounded-2xl shadow-lg"
        />
      </motion.div>

      {/* Right: Milestone Card */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="lg:col-span-3 z-10 py-6"
      >
        <MilestoneCard />
      </motion.div>
    </div>
  );

  const Slide3 = () => (
    <div className="grid lg:grid-cols-12 gap-6 lg:gap-4 items-center">
      {/* Left: Text & CTAs */}
      <div className="lg:col-span-5 text-left z-10 py-6 pl-8 sm:pl-10 lg:pl-4">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] px-3.5 py-1.5 rounded-full mb-3.5 shadow-2xs w-fit hover:scale-105 transition-transform"
        >
          <GraduationCap size={14} className="text-[#16a34a] shrink-0" />
          <span className="text-[11px] font-black text-[#16a34a] tracking-wider uppercase">
            CA INDUSTRIAL TRAINING PLACEMENT • SINCE 2008
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[45px] font-black text-[#0b192c] leading-[1.12] tracking-tight mb-3.5"
        >
          CA – IT Recruitment <br />
          <span className="text-[#16a34a]">&amp; Placement</span> <br />
          Industrial Training <br />
          for CA Students
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs sm:text-sm text-slate-600 mb-5 max-w-md leading-relaxed font-medium"
        >
          India's most trusted platform for{' '}
          <strong className="text-[#16a34a] font-bold">CA Industrial Training (IT)</strong> placements. We connect
          CA articleship students with top firms &amp; corporates for meaningful 9–15 month industrial training
          experiences across India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          {/* Open Industrial Training Modal */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setItModalOpen(true)}
            className="w-full sm:w-auto px-5 py-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap hover:shadow-lg"
          >
            <GraduationCap size={16} className="shrink-0" />
            <span>Apply for CA – IT</span>
            <ArrowRight size={15} className="shrink-0" />
          </motion.button>

          <Link to="/placement-drive" className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-50 text-[#0b192c] border-2 border-[#bbf7d0] hover:border-[#16a34a] font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap hover:shadow-md"
            >
              <Building2 size={16} className="text-[#16a34a] shrink-0" />
              <span>Hire CA – IT</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Center: CA Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 0.2 },
          scale: { duration: 0.7, delay: 0.2 },
          y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
        }}
        className="lg:col-span-4 flex items-end justify-center relative min-h-[380px] lg:min-h-[460px] overflow-visible"
      >
        <img
          src="/ca_hero_perfect.png"
          alt="CA Industrial Training - Fast Careers"
          className="w-full h-auto max-h-[480px] object-contain object-bottom pointer-events-none select-none transition-transform hover:scale-105 duration-500"
        />
      </motion.div>

      {/* Right: Milestone Card */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="lg:col-span-3 z-10 py-1 pb-4 sm:pb-6"
      >
        <MilestoneCard />
      </motion.div>
    </div>
  );

  const slides = [<Slide1 key="s1" />, <Slide2 key="s2" />, <Slide3 key="s3" />];

  // Background glow colors per slide
  const glowColors = [
    'bg-blue-100/40',    // Slide 1 – blue
    'bg-orange-100/40',  // Slide 2 – orange
    'bg-green-100/40',   // Slide 3 – green
  ];

  return (
    <>
      <section
        className="relative bg-gradient-to-b from-[#eaf3fd] via-[#f5f9fe] to-white pt-[74px] pb-2 sm:pt-[80px] sm:pb-3 lg:pt-[84px] lg:pb-3 border-b border-slate-200/80 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Soft Glow — changes per slide */}
        <motion.div
          key={`glow-${currentSlide}`}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-0 right-1/4 w-[700px] h-[700px] ${glowColors[currentSlide]} rounded-full blur-3xl pointer-events-none -z-10`}
        />

        {/* Slide Container */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ minHeight: '480px' }}>
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {slides[currentSlide]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation Controls ──────────────────────────────────────────── */}
        {/* Prev / Next Arrow Buttons */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#1d64f2] transition-all hover:scale-110 backdrop-blur-sm"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#1d64f2] transition-all hover:scale-110 backdrop-blur-sm"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-2.5 pt-3 pb-2">
          {Array.from({ length: SLIDE_COUNT }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === currentSlide
                  ? 'w-7 h-2.5 bg-[#1d64f2] shadow-sm'
                  : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Industrial Training Modal (Slide 3 CTA) */}
      <IndustrialTrainingModal
        isOpen={itModalOpen}
        onClose={() => setItModalOpen(false)}
      />
    </>
  );
};
