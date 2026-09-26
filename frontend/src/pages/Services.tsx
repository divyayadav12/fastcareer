import React from 'react';
import { motion } from 'framer-motion';
import { Building2, UserCheck, CalendarCheck, CheckCircle2, ArrowRight, MapPin, Sparkles, FileText, Globe2, PhoneCall, FileSpreadsheet, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecruiterMarquee } from '../components/RecruiterMarquee';

const serviceModes = [
  {
    modeNumber: 'MODE 01',
    badge: 'Flagship Placement Drive',
    badgeColor: 'bg-blue-700 text-white',
    icon: Building2,
    title: 'FAST CA CAMPUS',
    subtitle: 'Private Off-Campus Drives for CA Freshers',
    description: 'Exclusive CA Campus Drives conducted across 9 cities physically and centrally virtually for CA Freshers. The biggest private job fairs for CAs in India.',
    points: [
      'Conducted twice a year: January–February & August–September post ICAI results',
      '5,000+ candidates register for each campus drive cycle',
      '20–30 top corporates participate across India',
      'Most suited for CA Fresher & All India Ranker (AIR) recruitments',
      '100% Pre-screened candidates with highly competitive commercials'
    ],
    highlight: 'Physical drives in Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Pune, Ahmedabad, Hyderabad, Jaipur + Virtual',
    cta: 'Register for Upcoming Campus Drive',
    link: '/placement-drive'
  },
  {
    modeNumber: 'MODE 02',
    badge: 'Experienced & Lateral',
    badgeColor: 'bg-slate-900 text-white',
    icon: UserCheck,
    title: 'LATERAL RECRUITMENTS',
    subtitle: 'Traditional 1-on-1 Hiring for Experienced CAs',
    description: 'Traditional Hiring Method where candidates are lined up individually for interviews virtually or in person for face-to-face selection processes.',
    points: [
      'Screened from our proprietary database of 125,000+ CAs or head-hunted',
      'Trained HR recruiters match candidates to your exact JD requirements',
      'Quick turnaround with verified audit experience, attempts & fitment',
      'Most suitable for Few Requirements & Experienced Candidates (1 to 15+ years)',
      'Flexible interview scheduling aligned with corporate HR calendars'
    ],
    highlight: 'Ideal for Statutory Audit, Corporate Finance, Taxation & CFO Practice',
    cta: 'Submit Lateral Hiring Mandate',
    link: '/placement-drive'
  },
  {
    modeNumber: 'MODE 03',
    badge: 'Exclusive Dedicated Drive',
    badgeColor: 'bg-emerald-700 text-white',
    icon: CalendarCheck,
    title: 'COMPANY SPECIFIC RECRUITMENT DRIVE',
    subtitle: 'Dedicated Day-Long Custom Hiring Drives',
    description: 'A dedicated pool of pre-screened candidates lined up on a mutually convenient date and venue for a day-long recruitment process.',
    points: [
      'Customised exclusive recruitment drives on mutually accepted dates',
      'Can be organised in any city of choice or virtually / blended mode',
      'Organised at your office premises, business centres, or hotel venues',
      'We pre-screen & share candidate details; line up only shortlisted candidates',
      'Most suitable for High-Volume Fresher Hiring & Ranker Hirings'
    ],
    highlight: 'Dedicated Selection Process in Any City of Choice',
    cta: 'Plan a Dedicated Drive',
    link: '/placement-drive'
  }
];

const campusSteps = [
  {
    num: '01',
    icon: FileText,
    title: 'Share JD & Mail Confirmation',
    desc: 'Give us a Mail Confirmation to participate by filling a prescribed form & share your Job Description.'
  },
  {
    num: '02',
    icon: Globe2,
    title: 'Corporate Enlistment',
    desc: 'We enlist your company as an official participating corporate on our portal (www.fast-india.com).'
  },
  {
    num: '03',
    icon: PhoneCall,
    title: 'Applications & HR Call Screening',
    desc: 'Candidates apply online and are rigorously screened by our expert HR recruiters over phone calls.'
  },
  {
    num: '04',
    icon: FileSpreadsheet,
    title: 'Resumes & Excel Shortlist Shared',
    desc: 'Resumes & structured Excel list of applicants meeting your specified criteria are shared with your team.'
  },
  {
    num: '05',
    icon: Users,
    title: 'Shortlisting & Campus Day Interviews',
    desc: 'Your company shortlists candidates and shortlisted applicants are invited for interviews on Campus Day.'
  }
];

export const Services = () => {
  return (
    <div className="w-full bg-slate-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-32 pb-16 px-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold mb-4">
            <Sparkles size={15} className="text-blue-700" />
            <span>Fast Career Consultants Private Limited</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-slate-900">
            Our Service <span className="text-blue-700">Delivery Modes</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Tailored recruitment frameworks designed specifically for CA Freshers, Rankers, and Experienced Finance Professionals across India.
          </p>
        </div>
      </section>

      {/* 3 Core Delivery Modes */}
      <section className="py-20 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              3 Specialized Modes for CA Recruitment
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Choose the delivery mode that best matches your hiring volume, timeline, and candidate seniority.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {serviceModes.map((mode, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-blue-700 tracking-wider">
                      {mode.modeNumber}
                    </span>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${mode.badgeColor}`}>
                      {mode.badge}
                    </span>
                  </div>

                  <div className="w-14 h-14 bg-white border border-slate-200 text-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-xs">
                    <mode.icon size={28} />
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{mode.title}</h3>
                  <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-4">{mode.subtitle}</h4>
                  
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {mode.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {mode.points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500 mb-4 flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-600 shrink-0" />
                    <span>{mode.highlight}</span>
                  </div>
                  <Link to={mode.link}>
                    <button className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
                      <span>{mode.cta}</span>
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How FAST CA Campus Works (5 Steps) */}
      <section className="py-20 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              How Does FAST CA CAMPUS Work?
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              A transparent 5-step recruitment process for participating corporate employers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {campusSteps.map((step, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {step.num}
                    </div>
                    <step.icon size={18} className="text-blue-700" />
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-2 leading-snug">
                    {step.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-blue-700">
                  Step {step.num}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiter Marquee */}
      <RecruiterMarquee showTitle={true} />

    </div>
  );
};
