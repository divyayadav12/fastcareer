import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Users, 
  Building2, 
  Calendar, 
  MapPin, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Clock, 
  Layers, 
  DollarSign, 
  AlertCircle,
  Maximize2,
  X,
  ExternalLink,
  Laptop,
  Briefcase,
  Star,
  Globe,
  Download,
  FileDown,
  Presentation
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { RecruiterMarquee } from '../components/RecruiterMarquee';
import { ExecutiveLeadershipCards } from '../components/ExecutiveLeadershipCards';

const passOutAttempts = [
  { attempt: 'May 2024', count: 20446, heightPct: '100%', color: 'bg-blue-600', isCurrent: false },
  { attempt: 'Nov 2024', count: 11500, heightPct: '56%', color: 'bg-indigo-600', isCurrent: false },
  { attempt: 'May 2025', count: 14247, heightPct: '70%', color: 'bg-purple-600', isCurrent: false },
  { attempt: 'Sep 2025', count: 11466, heightPct: '56%', color: 'bg-amber-600', isCurrent: false },
  { attempt: 'Jan 2026', count: 7590, heightPct: '37%', color: 'bg-rose-600', isCurrent: false },
  { attempt: 'May 2026', count: 7931, heightPct: '39%', color: 'bg-blue-700 ring-4 ring-blue-200', isCurrent: true },
];

const totalAppearedTrend = [
  { term: 'Nov 2023', appeared: 160880 },
  { term: 'May 2024', appeared: 169597 },
  { term: 'Nov 2024', appeared: 147209 },
  { term: 'May 2025', appeared: 142402 },
  { term: 'Sep 2025', appeared: 101028 },
  { term: 'Jan 2026', appeared: 114114 },
  { term: 'May 2026', appeared: 120955 },
];

const comparativeData = [
  {
    parameter: 'Delivery Mode',
    icai: 'Physical Mode Only. Candidates divided across separate city centers.',
    fast: 'Physical (Mumbai & Delhi) + Pan-India Centralized Virtual Campus on Zoom/Teams.'
  },
  {
    parameter: 'Candidate Pool Access',
    icai: 'Divided city-wise; recruiter must attend each city individually.',
    fast: 'All India CA Pool in One Go! Candidates apply from all regions without city barriers.'
  },
  {
    parameter: 'Pricing & Commercials',
    icai: 'Fixed Cost Model — Pay upfront to participate, regardless of joining.',
    fast: 'Variable Model — Pay ONLY if candidate joins. No fixed fees, zero venue costs.'
  },
  {
    parameter: 'Participation Ratio',
    icai: 'Standard registration format with limited pre-drive filtering.',
    fast: '40% to 60% of newly qualified CAs + All Top 50 AIR Rankers.'
  },
  {
    parameter: 'Shortlisting & Follow-up',
    icai: 'Company handles raw lists and post-offer processes independently.',
    fast: 'Pre-screened Excel database after recruiter phone calls + post-offer joining follow-ups.'
  }
];

export const PlacementResults = () => {
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      
      {/* Lightbox Modal for Full Image Inspection */}
      <AnimatePresence>
        {activeImageModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImageModal(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
            >
              <button 
                onClick={() => setActiveImageModal(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <X size={20} />
              </button>
              <img 
                src={activeImageModal} 
                alt="Presentation Slide" 
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-extrabold mb-4 shadow-xs">
            <Sparkles size={16} className="text-blue-700" />
            <span>Official Report • Fast Career Consultants P Ltd.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
            CA Result Analysis May 2026 & <span className="text-blue-700">FAST CA CAMPUS</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
            Comprehensive breakdown of CA Final Examination pass-outs, 6-attempt supply decline trends, and exclusive recruitment campus drives by India's leading CA hiring firm.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* 1. Enlist for FAST CA Campus */}
            <Link to="/placement-drive">
              <motion.button 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <Building2 size={18} />
                <span>Enlist for FAST CA Campus</span>
                <ArrowRight size={16} />
              </motion.button>
            </Link>


            {/* 3. Result PPT Download */}
            <a 
              href="/FAST_Careers_CA_Results_May2026.pptx" 
              download="FAST_Careers_CA_Results_Analysis_May2026.pptx"
              onClick={() => toast.success('Downloading CA Results Analysis PPT...')}
              className="px-5 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 font-bold rounded-xl transition-all text-sm sm:text-base inline-flex items-center gap-2 shadow-xs group"
            >
              <Presentation size={18} className="text-amber-700 group-hover:scale-110 transition-transform" />
              <span>Result PPT Download</span>
              <Download size={15} className="text-amber-700" />
            </a>

            {/* 4. PDF Download */}
            <a 
              href="/FAST_Careers_CA_Results_May2026.pdf" 
              download="FAST_Careers_CA_Results_Analysis_May2026.pdf"
              onClick={() => toast.success('Downloading CA Results Analysis PDF...')}
              className="px-5 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border-2 border-rose-300 font-bold rounded-xl transition-all text-sm sm:text-base inline-flex items-center gap-2 shadow-xs group"
            >
              <FileDown size={18} className="text-rose-700 group-hover:scale-110 transition-transform" />
              <span>PDF Download</span>
              <Download size={15} className="text-rose-700" />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-12 text-left">
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-blue-700">7,931</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Total Fresh CAs Qualified</div>
              <div className="text-[11px] text-slate-500 mt-0.5">May 2026 Examination</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">14.07%</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Both Groups Passed</div>
              <div className="text-[11px] text-slate-500 mt-0.5">3,345 Successful Candidates</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-indigo-700">160K+</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Total CA Database</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Registered on fast-india.com</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">100%</div>
              <div className="text-xs font-bold text-slate-900 mt-1">Ready to Join Day 1</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Post-Articleship Batch</div>
            </div>
          </div>

        </div>
      </section>

      {/* FAST Careers CA Campus Invitation Card (Slide 10 Image) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden grid lg:grid-cols-12 gap-0 items-stretch">
            
            <div className="lg:col-span-5 relative group overflow-hidden bg-slate-950 flex items-center justify-center min-h-[300px]">
              <img 
                src="/ca_results/image5.jpg" 
                alt="FAST Careers CA Campus Invitation" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase font-extrabold tracking-wider text-blue-400">FAST CA CAMPUS INVITATION</span>
                <p className="text-sm font-medium text-slate-200 mt-1">India's leading specialized Chartered Accountant recruitment platform</p>
                <button 
                  onClick={() => setActiveImageModal('/ca_results/image5.jpg')}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white"
                >
                  <Maximize2 size={13} />
                  <span>Click to view original slide image</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-4 w-fit">
                <Award size={14} className="text-blue-700" />
                <span>Premier Recruitment Partner</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 tracking-tight">
                FAST Careers CA Campus Recruitment Drive
              </h2>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-2xl font-black text-blue-700">60+</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Corporates Recruited</div>
                  <div className="text-[11px] text-slate-500">Freshly qualified CAs</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-2xl font-black text-indigo-700">4,000+</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">CAs Enroll Each Season</div>
                  <div className="text-[11px] text-slate-500">For our campus drives</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-2xl font-black text-emerald-700">160,000+</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Total CA Database</div>
                  <div className="text-[11px] text-slate-500">Pan-India talent reach</div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                FAST Careers organizes both physical and pan-India virtual placement drives, connecting recruiters directly with top percentile CAs, AIR rankers, and multi-disciplinary finance professionals.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6-Attempt Pass-Out Trend Analysis Chart (Slide 2 Exact PPT Graphic) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200" id="chart-analysis">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-extrabold border border-rose-200 mb-2">
              <TrendingDown size={14} className="text-rose-600" />
              <span>CA Pass-outs on Decline!</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              An Analysis of Number of CAs Qualified in Last 6 Attempts
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Recent ICAI exam cycles have seen a significant reduction in newly qualified Chartered Accountants compared to historic batches.
            </p>
          </div>

          {/* Side-by-Side Presentation Slide & Live Bar Chart */}
          <div className="grid lg:grid-cols-12 gap-8 items-stretch mb-12">
            
            {/* Left: Original Slide Image Display */}
            <div className="lg:col-span-6 bg-slate-950 rounded-3xl p-4 sm:p-6 border-2 border-slate-800 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-blue-400 uppercase tracking-wider">PPT Slide 2 • Original Visual</span>
                  <button 
                    onClick={() => setActiveImageModal('/ca_results/image2.png')}
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                  >
                    <Maximize2 size={13} />
                    <span>Enlarge Slide</span>
                  </button>
                </div>
                <div 
                  onClick={() => setActiveImageModal('/ca_results/image2.png')}
                  className="rounded-2xl overflow-hidden cursor-pointer group relative border border-slate-800"
                >
                  <img 
                    src="/ca_results/image2.png" 
                    alt="CA Pass-Outs on Decline Last 6 Attempts Chart" 
                    className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      Click to View High-Res
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Source: CA Final Result Analysis May 2026</span>
                <span className="text-rose-400 font-bold">Supply Dip: -61% vs May 24</span>
              </div>
            </div>

            {/* Right: Live Interactive Trend Breakdown */}
            <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-slate-900">Live 6-Attempt Breakdown</h3>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    May 2024 — May 2026
                  </span>
                </div>

                {/* Vertical Interactive Bars */}
                <div className="grid grid-cols-6 gap-2 sm:gap-3 items-end h-56 pb-2 border-b-2 border-slate-200">
                  {passOutAttempts.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group">
                      
                      <span className={`text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded shadow-xs mb-1.5 ${
                        item.isCurrent ? 'bg-blue-700 text-white' : 'bg-white text-slate-800 border border-slate-200'
                      }`}>
                        {item.count >= 10000 ? `${(item.count/1000).toFixed(1)}k` : item.count}
                      </span>

                      <div className="w-full max-w-[42px] bg-slate-200 rounded-t-lg overflow-hidden flex items-end h-full">
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: item.heightPct }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className={`w-full ${item.color} rounded-t-lg group-hover:opacity-90 transition-all`}
                        />
                      </div>

                      <div className="mt-2 text-center">
                        <div className="text-[10px] font-black text-slate-900">{item.attempt.replace(' ', '\n')}</div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Insights */}
              <div className="mt-6 space-y-2 text-xs text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                  <TrendingDown size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Supply Squeeze:</strong> May 2026 (7,931) & Jan 2026 (7,590) are dramatically lower than May 2024 (20,446).</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Job Vacancies Exceed CA Pass-Outs:</strong> Recruiter competition will be fierce; early booking guarantees candidate availability.</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ICAI Press Release Breakdown with Slide 3 Official Document */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-wider font-black text-blue-700 block mb-2">
              EXAMINATION BREAKDOWN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              ICAI Press Release on Results (18 June 2026)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Official data verified from the Institute of Chartered Accountants of India (ICAI) official notification.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">
            
            {/* Left: Press Release Document Scan Image (Slide 3) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-200 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800">Official ICAI Press Release</span>
                <button 
                  onClick={() => setActiveImageModal('/ca_results/image4.png')}
                  className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-800 font-bold"
                >
                  <Maximize2 size={13} />
                  <span>View Full Scan</span>
                </button>
              </div>
              <div 
                onClick={() => setActiveImageModal('/ca_results/image4.png')}
                className="rounded-2xl overflow-hidden border border-slate-200 cursor-pointer group relative bg-slate-100"
              >
                <img 
                  src="/ca_results/image4.png" 
                  alt="ICAI Press Release 18 June 2026 Document" 
                  className="w-full h-auto object-contain group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  Click to Expand Document
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500 text-center">
                Announced on 18 June 2026 • Examination Results Final May 2026
              </div>
            </div>

            {/* Right: Clean Formatted Table & Key Takeaways */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                      <tr>
                        <th className="p-4 sm:p-5">Group(s)</th>
                        <th className="p-4 sm:p-5">Appeared</th>
                        <th className="p-4 sm:p-5">Passed</th>
                        <th className="p-4 sm:p-5">% Pass</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800 text-xs sm:text-sm">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-slate-900">Group – I</td>
                        <td className="p-4 sm:p-5">54,606</td>
                        <td className="p-4 sm:p-5 font-bold text-blue-700">6,555</td>
                        <td className="p-4 sm:p-5 font-black text-slate-900">12.00%</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-slate-900">Group – II</td>
                        <td className="p-4 sm:p-5">42,573</td>
                        <td className="p-4 sm:p-5 font-bold text-emerald-700">8,725</td>
                        <td className="p-4 sm:p-5 font-black text-slate-900">20.49%</td>
                      </tr>
                      <tr className="bg-blue-50/70 hover:bg-blue-50 transition-colors">
                        <td className="p-4 sm:p-5 font-black text-blue-900">Both Groups</td>
                        <td className="p-4 sm:p-5 font-bold">23,776</td>
                        <td className="p-4 sm:p-5 font-black text-blue-700">3,345</td>
                        <td className="p-4 sm:p-5 font-black text-blue-900">14.07%</td>
                      </tr>
                      <tr className="bg-slate-100/80 font-black">
                        <td className="p-4 sm:p-5 text-slate-900">Total Qualified CAs</td>
                        <td className="p-4 sm:p-5 text-slate-500">—</td>
                        <td className="p-4 sm:p-5 text-blue-700 text-base sm:text-lg">7,931</td>
                        <td className="p-4 sm:p-5 text-slate-900">Fresh Qualified CAs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key Note from Slide 8 */}
              <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Star size={16} className="text-amber-500" />
                  <span>Key Notes & Recruiter Implications</span>
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-700">A.</span>
                    <span>Last two results gave only <strong>7,500–8,000 CAs</strong> vs 11,500–15,000 earlier; ICAI shows more job openings than available CAs. <strong>Move early.</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-700">B.</span>
                    <span>Exams now <strong>only post-articleship</strong> — this batch is 100% ready to join immediately with zero delay.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-700">C.</span>
                    <span>ICAI back to two exams a year; <strong>no fresh CAs will qualify till 2027</strong>.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Huge Advantage Callout for Recruiters */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-7 sm:p-9 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 size={26} />
              </div>
              <div>
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wide block mb-1">
                  BIG ADVANTAGE FOR RECRUITERS
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                  Lesser Corporate Drop-Outs! 100% Ready to Join from Day One
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
                  <strong>Earlier:</strong> Candidates could appear for CA Final with up to 6 months of pending articleship, causing severe hiring delays and offer drop-outs.<br />
                  <strong>Now (Effective this result):</strong> Candidates can only sit for exams <strong>after completing entire articleship & training</strong>.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-xs">
                  <span>Zero Pending Commitments • Immediate Joining Ready</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAST CA Virtual Campus – Starts 30 June (Slide 11 Graphics) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold mb-3">
              <Laptop size={16} className="text-blue-700" />
              <span>India's 1st Virtual CA Campus</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              FAST CA VIRTUAL CAMPUS – Starts 30 June
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              One Day | One Company | Daily Campus | First Come - First Serve. Recruit first with FAST Careers!
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800 mb-12">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-block px-3.5 py-1 rounded-full bg-blue-600/30 border border-blue-400 text-blue-300 text-xs font-extrabold">
                  VIRTUAL CAMPUS FORMAT
                </div>
                <h3 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
                  One Company - One Date <br />
                  <span className="text-blue-400">Pan-India Centralized Selection</span>
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Slots provided on first come, first serve basis with <strong>Zero fixed or upfront costs</strong>. Conducted seamlessly online via Zoom / MS Teams as per your corporate panel preference.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-blue-400 shrink-0" />
                    <span className="text-xs font-semibold">Participated by All India CAs</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-blue-400 shrink-0" />
                    <span className="text-xs font-semibold">Pre-Drive Excel Shortlisting</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-blue-400 shrink-0" />
                    <span className="text-xs font-semibold">Zoom & MS Teams Integrated</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-blue-400 shrink-0" />
                    <span className="text-xs font-semibold">Zero Initial Fixed Fees</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Link to="/placement-drive">
                    <button className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center gap-2">
                      <span>Reserve Your Virtual Slot</span>
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Virtual Badges & Visuals from PPT */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-6 mb-6">
                  {/* Zoom Badge (Slide 11 image7) */}
                  <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-200 text-center w-32">
                    <img src="/ca_results/image7.png" alt="Zoom" className="h-8 object-contain mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-slate-700">Zoom Drive</span>
                  </div>
                  {/* Teams Badge (Slide 11 image8) */}
                  <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-200 text-center w-32">
                    <img src="/ca_results/image8.png" alt="MS Teams" className="h-8 object-contain mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-slate-700">MS Teams</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white">Starts 30 June</div>
                  <div className="text-xs text-blue-300 font-bold mt-1">Daily Dedicated Corporate Drives</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Physical Campus Schedule: Delhi & Mumbai (Slide 12 Monument Cards) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold mb-3">
              <MapPin size={16} className="text-blue-700" />
              <span>Physical Campus Venues</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              FAST CA PHYSICAL CAMPUS – July 2026 Schedule
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              One Day | One Venue | Tons of Participants | Multiple Recruiting Companies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-14">
            
            {/* Delhi Campus Card with India Gate Image (image9.jpg) */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden group">
                  <img 
                    src="/ca_results/image9.jpg" 
                    alt="Delhi India Gate - FAST CA Campus" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-blue-600 text-white tracking-wider">
                        Delhi NCR
                      </span>
                      <h3 className="text-2xl font-black text-white mt-1">07 July 2026</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveImageModal('/ca_results/image9.jpg')}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-blue-700 uppercase tracking-wider">Physical Venue</span>
                    <span className="text-xs font-bold text-slate-500">Premium Hotel Center</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">Delhi CA Campus Recruitment</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    Organized at a 5-star premium hotel business centre in New Delhi NCR. Slots on first come first serve basis with no fixed/upfront costs.
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center mb-6">
                    <div>
                      <div className="text-xl font-black text-blue-700">1,500+</div>
                      <div className="text-[11px] font-bold text-slate-700">CAs Expected</div>
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-900">Top AIRs</div>
                      <div className="text-[11px] font-bold text-slate-700">Rankers Attending</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <Link to="/placement-drive">
                  <button className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-colors shadow-md">
                    Reserve Delhi Slot
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Mumbai Campus Card with Gateway of India Image (image10.jpg) */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden group">
                  <img 
                    src="/ca_results/image10.jpg" 
                    alt="Mumbai Gateway of India - FAST CA Campus" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-purple-600 text-white tracking-wider">
                        Mumbai
                      </span>
                      <h3 className="text-2xl font-black text-white mt-1">10 July 2026</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveImageModal('/ca_results/image10.jpg')}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-purple-700 uppercase tracking-wider">Physical Venue</span>
                    <span className="text-xs font-bold text-slate-500">Financial Hub Center</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">Mumbai CA Campus Recruitment</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    Organized at a prime hotel convention center in the financial capital, Mumbai. First come, first serve basis with direct corporate panel rooms.
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center mb-6">
                    <div>
                      <div className="text-xl font-black text-purple-700">1,500+</div>
                      <div className="text-[11px] font-bold text-slate-700">CAs Expected</div>
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-900">Corporate</div>
                      <div className="text-[11px] font-bold text-slate-700">Exclusive Panels</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <Link to="/placement-drive">
                  <button className="w-full py-3.5 bg-slate-900 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md">
                    Reserve Mumbai Slot
                  </button>
                </Link>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* How it Works for Recruiting Companies (Slide 13) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-wider font-black text-blue-700 block mb-2">
              SEAMLESS PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              How FAST CA Campus Works for Recruiting Companies!
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              No fees charged from candidates for participating or joining. Zero hassle for HR teams.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-700 text-white font-black flex items-center justify-center mb-4">
                  1
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Mail Confirmation & JD</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Give us a mail confirmation to participate by filling a prescribed form & share your Job Description.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-blue-700">Step 1 • Enlistment</div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-700 text-white font-black flex items-center justify-center mb-4">
                  2
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Portal Listing & Screening</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We enlist you on www.fast-india.com. Candidates apply online & are screened by our HR recruiters over phone calls.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-blue-700">Step 2 • Sourcing</div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-700 text-white font-black flex items-center justify-center mb-4">
                  3
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Excel Shortlisting</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Resumes & Excel lists meeting your criteria are shared with you to shortlist prior to the drive.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-blue-700">Step 3 • Pre-Drive Match</div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-black flex items-center justify-center mb-4">
                  4
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Campus Drive & Joins</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Shortlisted applicants are called for interviews on Campus Day. Post-offer follow-up ensures seamless joining.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-emerald-700">Step 4 • Successful Onboarding</div>
            </div>

          </div>

        </div>
      </section>

      {/* Comparative Analysis: ICAI Campus vs FAST Careers Campus (Slide 16) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-wider font-black text-blue-700 block mb-2">
              WHY RECRUIT WITH FAST CAREERS?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Comparative of CA Campus by ICAI & FAST Careers
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Slide 16 Analysis: See why 60+ top-notch corporates choose FAST Careers for their CA talent acquisition.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 sm:p-5 w-1/4">Parameter</th>
                    <th className="p-4 sm:p-5 w-3/8 text-slate-300">ICAI CAMPUS</th>
                    <th className="p-4 sm:p-5 w-3/8 text-blue-400 bg-slate-800">FAST Careers CA CAMPUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {comparativeData.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">{row.parameter}</td>
                      <td className="p-4 sm:p-5 text-slate-600">{row.icai}</td>
                      <td className="p-4 sm:p-5 font-semibold text-blue-900 bg-blue-50/40">{row.fast}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* Ranker Recruitment Exclusive Banner (Slide 17 Image image13.jpg) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden relative">
            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-black uppercase mb-3">
                  <Award size={14} className="text-white" />
                  <span>AIR Top 50 Rankers</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight leading-tight">
                  Looking to Recruit Only CA Rankers!
                </h3>
                <p className="text-amber-100 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                  Contact us to know about <strong>FAST All India CA Ranker Campus 2026</strong>. Dedicated slots for high-merit candidates, AIR 1 to 50 rank holders, and gold medalists across India.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="mailto:sarthak@fast-india.com" 
                    className="px-6 py-3 bg-white text-amber-900 hover:bg-amber-50 font-black rounded-xl text-sm transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <Mail size={16} />
                    <span>Inquire About Ranker Pool</span>
                  </a>
                  <a 
                    href="tel:9826023534" 
                    className="px-6 py-3 bg-amber-900/40 hover:bg-amber-900/60 text-white font-bold rounded-xl text-sm transition-all border border-white/20 inline-flex items-center gap-2"
                  >
                    <Phone size={16} />
                    <span>Call Sarthak Jain</span>
                  </a>
                </div>
              </div>

              {/* Real Candidates Holding Offer Letters Photo (Slide 17 image13.jpg) */}
              <div className="lg:col-span-5 relative group">
                <div 
                  onClick={() => setActiveImageModal('/ca_results/image13.jpg')}
                  className="rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl cursor-pointer bg-slate-900"
                >
                  <img 
                    src="/ca_results/image13.jpg" 
                    alt="FAST Placed CA Candidates Holding Offers" 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-3 bg-amber-950/80 text-center text-xs text-amber-200 font-bold flex items-center justify-center gap-1.5">
                    <Maximize2 size={13} />
                    <span>Click to view original ranker slide photo</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Leadership Contact & Registration Section (Slide 18) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold mb-4">
            <ShieldCheck size={16} className="text-blue-700" />
            <span>Fast Career Consultants P Ltd.</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
            Feel Free to Ask Us • We Will Be Glad to Assist
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-slate-600 mb-10">
            <span className="px-3 py-1 bg-white rounded-lg border border-slate-200">Executed with Passion</span>
            <span className="px-3 py-1 bg-white rounded-lg border border-slate-200">Cost Effective</span>
            <span className="px-3 py-1 bg-white rounded-lg border border-slate-200">Strategically Advanced</span>
            <span className="px-3 py-1 bg-white rounded-lg border border-slate-200">Well Planned</span>
            <span className="px-3 py-1 bg-white rounded-lg border border-slate-200">Honest</span>
          </div>

          <ExecutiveLeadershipCards className="mb-10 max-w-3xl mx-auto" />

          <Link to="/placement-drive">
            <motion.button 
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-2xl shadow-lg transition-all inline-flex items-center gap-2"
            >
              <span>Enlist for Next CA Campus Drive</span>
              <ArrowRight size={18} />
            </motion.button>
          </Link>

        </div>
      </section>

      {/* Recruiter Marquee */}
      <RecruiterMarquee showTitle={true} />

    </div>
  );
};
