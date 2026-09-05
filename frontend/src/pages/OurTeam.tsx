import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  MapPin, 
  Briefcase, 
  Award, 
  X, 
  Building2, 
  Phone, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap 
} from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

const LinkedinIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 1.65-1.64 1.65 1.65 0 0 0-3.3 0 1.65 1.65 0 0 0 1.65 1.64m1.4 9.74v-8.37H5.06v8.37h2.8z"/>
  </svg>
);


interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: 'Leadership' | 'Headhunting & CA Specialists' | 'Client Relations' | 'Mentorship & Growth' | 'Tech & Operations';
  location: string;
  experience: string;
  badge: string;
  photoUrl: string;
  email: string;
  linkedin: string;
  specialties: string[];
  bio: string;
  keyAchievements: string[];
  education: string;
}

const teamMembersData: TeamMember[] = [
  {
    id: 1,
    name: 'Divyansh Sharma',
    role: 'Founder & Managing Director',
    department: 'Leadership',
    location: 'Mumbai, Maharashtra',
    experience: '16+ Years',
    badge: 'Executive Leadership',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    email: 'divyansh@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Executive Search', 'Corporate Strategy', 'M&A Advisory Talent', 'Big 4 Partnerships'],
    bio: 'Divyansh founded FAST Careers with the vision to bridge the talent gap between India’s elite finance professionals and multinational enterprises. Over 16 years, he has advised boardrooms across BFSI, FMCG, and Consulting.',
    keyAchievements: [
      'Placed 400+ Partners and Directors across Big 4 & Top Consulting Firms',
      'Pioneered the National CA Campus Accelerator initiative',
      'Recognized among Top 50 Recruitment Leaders in APAC'
    ],
    education: 'FCA, Institute of Chartered Accountants of India | MBA, IIM Ahmedabad'
  },
  {
    id: 2,
    name: 'Radhika Mehra',
    role: 'Co-Founder & Head of Headhunting',
    department: 'Leadership',
    location: 'New Delhi, NCR',
    experience: '14+ Years',
    badge: 'Ex-Deloitte Director',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    email: 'radhika.mehra@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['CFO Search', 'Statutory & Internal Audit', 'Corporate Finance', 'Board Placements'],
    bio: 'Former Talent Partner at Deloitte with a track record of building powerhouse leadership teams. Radhika leads the national headhunting division specializing in CXO and Senior Finance appointments.',
    keyAchievements: [
      'Led 120+ CFO & VP Finance transitions globally',
      'Keynote speaker at National ICAI Corporate Summits',
      'Mentored 1,000+ first-attempt Chartered Accountants'
    ],
    education: 'CA (AIR 14), ICAI | B.Com (Hons), Shri Ram College of Commerce (SRCC)'
  },
  {
    id: 3,
    name: 'Aditya Singhania',
    role: 'VP – Enterprise & Corporate Relations',
    department: 'Leadership',
    location: 'Bengaluru, Karnataka',
    experience: '12+ Years',
    badge: 'Ex-PwC Leader',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    email: 'aditya.s@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Enterprise Hiring', 'Fintech & Tech Talent', 'Investment Banking', 'Strategic Alliances'],
    bio: 'Aditya manages key corporate accounts for FAST Careers, liaising directly with Fortune 500 enterprises, Unicorns, and PE-backed tech companies across South India and international hubs.',
    keyAchievements: [
      'Signed and scaled 65+ exclusive enterprise talent mandates',
      'Architect of the Tech-Finance placement bridge program',
      'Expanded corporate hiring footprint across GCC and Singapore'
    ],
    education: 'Chartered Financial Analyst (CFA) | PGDM Finance, SPJIMR Mumbai'
  },
  {
    id: 4,
    name: 'Ananya Verma',
    role: 'Lead Partner – CA & Big 4 Placements',
    department: 'Headhunting & CA Specialists',
    location: 'Mumbai, Maharashtra',
    experience: '10+ Years',
    badge: 'Ex-EY Senior Manager',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    email: 'ananya.v@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Big 4 Articleship Placements', 'Statutory Audit', 'IND AS & IFRS', 'Direct Taxation'],
    bio: 'Ananya brings deep domain expertise from EY’s Assurance Practice. She heads our CA recruitment desk, helping rankers and multi-group qualifiers secure elite Big 4 and industrial roles.',
    keyAchievements: [
      'Facilitated 850+ Big 4 Assurance & Advisory placements',
      'Author of "The CA Finalist Career Playbook"',
      '99.2% candidate-employer alignment score'
    ],
    education: 'ACA, ICAI | B.Com, St. Xavier’s College Mumbai'
  },
  {
    id: 5,
    name: 'Rohan Deshmukh',
    role: 'Principal Consultant – Transfer Pricing & Direct Tax',
    department: 'Headhunting & CA Specialists',
    location: 'Pune, Maharashtra',
    experience: '9+ Years',
    badge: 'Ex-KPMG Specialist',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    email: 'rohan.d@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Transfer Pricing', 'International Taxation', 'Tax Litigation', 'BEPS & Pillar Two'],
    bio: 'Rohan is a recognized specialist in Direct Taxation and Transfer Pricing talent acquisition, serving global tax advisory practices and multinational corporate tax wings.',
    keyAchievements: [
      'Placed 300+ Tax Managers & TP Senior Associates',
      'Built custom tax talent pipelines for 25+ global consulting firms'
    ],
    education: 'CA, ICAI | LL.B, ILS Law College Pune'
  },
  {
    id: 6,
    name: 'Sneha Chawla',
    role: 'Senior Talent Strategist – Indirect Tax & GST',
    department: 'Headhunting & CA Specialists',
    location: 'Gurugram, NCR',
    experience: '8+ Years',
    badge: 'GST Advisory Lead',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=500&auto=format&fit=crop&q=80',
    email: 'sneha.c@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['GST Advisory', 'Customs & Foreign Trade', 'Supply Chain Tax', 'ERP Tax Integration'],
    bio: 'Sneha spearheads Indirect Tax recruitments across North and West India. Her deep understanding of GST litigation and customs compliance ensures premier candidate matchmaking.',
    keyAchievements: [
      'Successfully delivered on 200+ GST & Customs hiring drives',
      'Conducted 40+ campus workshops on Indirect Tax career pathways'
    ],
    education: 'FCA, ICAI | B.Com (Hons), Lady Shri Ram College (LSR)'
  },
  {
    id: 7,
    name: 'Vikramaditya Roy',
    role: 'Lead – Investment Banking & Private Equity Hiring',
    department: 'Headhunting & CA Specialists',
    location: 'Mumbai, Maharashtra',
    experience: '11+ Years',
    badge: 'Ex-Avendus Capital',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    email: 'vikram.roy@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['M&A Modeling', 'Private Equity', 'Venture Capital', 'Valuation & Due Diligence'],
    bio: 'Vikram specializes in placing high-caliber CAs and CFAs into boutique investment banks, private equity funds, and top tier transaction advisory practices.',
    keyAchievements: [
      'Orchestrated 150+ IB Analyst & Associate level transitions',
      'Advisor to top corporate venture arms for financial talent strategy'
    ],
    education: 'CA & CFA Charterholder | B.Sc Economics, Presidency University'
  },
  {
    id: 8,
    name: 'Pooja Kulkarni',
    role: 'Senior Headhunter – Industrial Trainees & Fresh CAs',
    department: 'Headhunting & CA Specialists',
    location: 'Hyderabad, Telangana',
    experience: '7+ Years',
    badge: 'Campus Placement Expert',
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=80',
    email: 'pooja.k@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Industrial Trainee Placement', 'CA Ranker Scouting', 'Off-Campus Hiring', 'Resume Optimization'],
    bio: 'Pooja manages national Industrial Training drives for top FMCG and automotive conglomerates, guiding ambitious CA candidates into high-growth corporate finance roles.',
    keyAchievements: [
      'Placed 600+ CA Industrial Trainees in Tata, ITC, and HUL',
      'Organizer of FAST Careers Annual Virtual Job Fair'
    ],
    education: 'ACA, ICAI | MBA HR, Symbiosis Pune'
  },
  {
    id: 9,
    name: 'Karan Bhasin',
    role: 'Lead – Risk Advisory & Internal Audit Hiring',
    department: 'Headhunting & CA Specialists',
    location: 'Noida, NCR',
    experience: '9+ Years',
    badge: 'CIA & CISA Specialist',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    email: 'karan.b@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Internal Audit', 'SOX Compliance', 'Forensic Accounting', 'ERM Frameworks'],
    bio: 'Karan leads Risk Advisory talent mandates for leading management consulting firms, placing specialist professionals in governance, risk, and fraud investigation teams.',
    keyAchievements: [
      'Placed 250+ Internal Audit & Forensics specialists across India & Middle East',
      'Built risk audit teams for 18 listed manufacturing companies'
    ],
    education: 'CA, ICAI | Certified Internal Auditor (CIA)'
  },
  {
    id: 10,
    name: 'Meera Nambiar',
    role: 'Head of Employer Success & Key Accounts',
    department: 'Client Relations',
    location: 'Bengaluru, Karnataka',
    experience: '10+ Years',
    badge: 'Client Excellence Lead',
    photoUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&auto=format&fit=crop&q=80',
    email: 'meera.n@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['SLA Management', 'Talent Fulfillment', 'Employer Branding', 'Account Management'],
    bio: 'Meera ensures seamless onboarding, hiring velocity, and high client satisfaction for over 150 corporate partners relying on FAST Careers for finance recruitment.',
    keyAchievements: [
      'Maintained a 98.4% client retention rate over 5 years',
      'Reduced average time-to-hire from 45 days to 14 days for key accounts'
    ],
    education: 'MBA in Operations & HR, Christ University Bengaluru'
  },
  {
    id: 11,
    name: 'Tarun Saxena',
    role: 'Regional Director – North India Corporate Alliances',
    department: 'Client Relations',
    location: 'New Delhi, NCR',
    experience: '13+ Years',
    badge: 'Enterprise Growth',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    email: 'tarun.saxena@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Corporate Partnerships', 'Bulk Hiring Drives', 'Executive Sourcing', 'North India Markets'],
    bio: 'Tarun brings over a decade of corporate recruitment experience, managing strategic relationships with prominent corporate houses, shared service centers, and consulting giants.',
    keyAchievements: [
      'Delivered 35+ high-volume campus recruitment drives across Delhi NCR & Chandigarh',
      'Onboarded 50+ new Fortune 500 clients to FAST Careers platform'
    ],
    education: 'B.Tech & MBA, Delhi Technological University (DTU)'
  },
  {
    id: 12,
    name: 'Shweta Iyer',
    role: 'Senior Account Manager – BFSI & Fintech',
    department: 'Client Relations',
    location: 'Mumbai, Maharashtra',
    experience: '8+ Years',
    badge: 'BFSI Sector Lead',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    email: 'shweta.iyer@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Banking & NBFCs', 'Wealth Management', 'Credit Risk', 'Fintech Talent'],
    bio: 'Shweta manages dedicated talent pipelines for top private banks, mutual funds, and NBFCs seeking qualified Chartered Accountants and treasury managers.',
    keyAchievements: [
      'Placed 400+ finance professionals in top tier Indian banks and AMCs',
      'Spearheaded exclusive diversity hiring drives for financial institutions'
    ],
    education: 'M.Com, University of Mumbai | Certified HR Professional'
  },
  {
    id: 13,
    name: 'Gaurav Agarwal',
    role: 'Lead – Western Region Corporate Engagements',
    department: 'Client Relations',
    location: 'Ahmedabad, Gujarat',
    experience: '9+ Years',
    badge: 'Gujarat & West Hub',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    email: 'gaurav.a@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Manufacturing & Chemicals', 'GIFT City Placements', 'Export Finance', 'SME to Unicorn Scaling'],
    bio: 'Gaurav leads business development across Gujarat and Western India, specializing in finance placements for GIFT City banking units, pharma conglomerates, and export houses.',
    keyAchievements: [
      'Placed 180+ CAs in emerging GIFT City international financial entities',
      'Key partner for 40+ industrial manufacturing leaders in Gujarat'
    ],
    education: 'CA, ICAI | B.Com, HL College of Commerce Ahmedabad'
  },
  {
    id: 14,
    name: 'Dr. Rameshwar Joshi',
    role: 'Chief Mentor – CA Career Strategy & Faculty Advisor',
    department: 'Mentorship & Growth',
    location: 'Jaipur, Rajasthan',
    experience: '22+ Years',
    badge: 'Senior ICAI Faculty',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
    email: 'dr.joshi@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Articleship Guidance', 'Post-Qualification Roadmap', 'Interview Coaching', 'Technical Prep'],
    bio: 'Veteran academician and mentor with over two decades of experience training thousands of Chartered Accountants. Dr. Joshi designs our proprietary interview prep modules.',
    keyAchievements: [
      'Mentored over 15,000 CA students and finalists throughout his career',
      'Author of 4 reference textbooks on Financial Reporting & Audit Standards',
      'Honored by ICAI Northern Region for excellence in student development'
    ],
    education: 'Ph.D in Commerce | FCA, ICAI | M.Com (Gold Medalist)'
  },
  {
    id: 15,
    name: 'Tanvi Khanna',
    role: 'Lead Career Coach – Resume Engineering & Grooming',
    department: 'Mentorship & Growth',
    location: 'Chandigarh, Punjab',
    experience: '7+ Years',
    badge: 'Master Resume Coach',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    email: 'tanvi.k@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['ATS-Compliant Resumes', 'Executive Bio Writing', 'LinkedIn Optimization', 'Mock Interviews'],
    bio: 'Tanvi works directly with job seekers to craft high-impact, ATS-optimized resumes and LinkedIn profiles that stand out in top corporate and consulting hiring filters.',
    keyAchievements: [
      'Engineered over 3,200 successful candidate resumes',
      'Achieved a 94% interview callback rate for coached candidates'
    ],
    education: 'MA in Organizational Psychology | Certified Professional Resume Writer (CPRW)'
  },
  {
    id: 16,
    name: 'Abhishek Sengupta',
    role: 'Mentor – Financial Modeling & Technical Interviews',
    department: 'Mentorship & Growth',
    location: 'Kolkata, West Bengal',
    experience: '8+ Years',
    badge: 'Ex-Credit Suisse',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&auto=format&fit=crop&q=80',
    email: 'abhishek.s@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['LBO Modeling', 'DCF Valuation', 'Technical Rounds Prep', 'IB Case Studies'],
    bio: 'Former Investment Banking Analyst at Credit Suisse. Abhishek conducts rigorous technical interview simulations for candidates targeting private equity, VC, and corporate M&A desks.',
    keyAchievements: [
      'Conducted 500+ one-on-one technical mock interview sessions',
      'Creator of FAST Careers 40-hour Financial Modeling Masterclass'
    ],
    education: 'CFA Level 3 Passed | B.Sc Mathematics & Statistics, St. Xavier’s College Kolkata'
  },
  {
    id: 17,
    name: 'Nisha Sundaram',
    role: 'Lead – South India Candidate Engagement',
    department: 'Mentorship & Growth',
    location: 'Chennai, Tamil Nadu',
    experience: '6+ Years',
    badge: 'Talent Scout Lead',
    photoUrl: 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=500&auto=format&fit=crop&q=80',
    email: 'nisha.s@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['South India CA Network', 'Fresher Hiring Drives', 'Career Counseling', 'Webinar Management'],
    bio: 'Nisha connects qualified talent from Chennai, Bengaluru, and Hyderabad with leading GCCs (Global Capability Centers) and multinational accounting firms.',
    keyAchievements: [
      'Built a network of 8,000+ active CA professionals across South India',
      'Hosted 25+ career guidance webinars with 10,000+ cumulative attendees'
    ],
    education: 'B.Com & MBA HR, Loyola College Chennai'
  },
  {
    id: 18,
    name: 'Siddharth Rao',
    role: 'Chief Technology Officer (CTO)',
    department: 'Tech & Operations',
    location: 'Bengaluru, Karnataka',
    experience: '12+ Years',
    badge: 'Ex-Amazon / Tech Lead',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80',
    email: 'siddharth@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['AI Candidate Matching', 'Platform Architecture', 'Data Security', 'Cloud Infrastructure'],
    bio: 'Siddharth leads the technology and engineering teams powering the FAST Careers digital recruitment ecosystem, candidate matching algorithms, and automated resume parsing pipelines.',
    keyAchievements: [
      'Architected FAST Careers automated Excel-to-Resume matching engine',
      'Built high-concurrency assessment portal handling 50k+ daily requests',
      'Implemented bank-grade data security and encryption for applicant profiles'
    ],
    education: 'B.Tech Computer Science, NIT Surathkal'
  },
  {
    id: 19,
    name: 'Kavita Menon',
    role: 'Head of People Operations & HR',
    department: 'Tech & Operations',
    location: 'Mumbai, Maharashtra',
    experience: '11+ Years',
    badge: 'People & Culture',
    photoUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=500&auto=format&fit=crop&q=80',
    email: 'kavita.m@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Internal Talent Acquisition', 'Recruiter Training', 'Culture & DEI', 'Compensation & Benefits'],
    bio: 'Kavita oversees internal team building, talent enablement, and employee satisfaction across FAST Careers’ five regional offices in India.',
    keyAchievements: [
      'Scaled FAST Careers internal team from 5 to 40+ high-performing professionals',
      'Designed the internal FAST Recruiter Certification Program'
    ],
    education: 'Master in Human Resource Management (MHRM), TISS Mumbai'
  },
  {
    id: 20,
    name: 'Prateek Mishra',
    role: 'Lead Data Analyst & Recruitment Insights',
    department: 'Tech & Operations',
    location: 'Pune, Maharashtra',
    experience: '6+ Years',
    badge: 'Analytics & Salary Insights',
    photoUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=500&auto=format&fit=crop&q=80',
    email: 'prateek.m@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Compensation Benchmarking', 'Hiring Analytics', 'Talent Supply Forecasting', 'Power BI Dashboards'],
    bio: 'Prateek transforms hiring data into actionable market intelligence, publishing the widely-cited Annual FAST Careers CA Salary & Placement Trends Report.',
    keyAchievements: [
      'Published 4 national CA salary benchmarking whitepapers',
      'Built real-time recruitment tracking dashboards for enterprise clients'
    ],
    education: 'B.E. Computer Engineering, COEP Pune | Certified Data Scientist'
  },
  {
    id: 21,
    name: 'Zoya Merchant',
    role: 'Senior Executive – Operations & Candidate Verification',
    department: 'Tech & Operations',
    location: 'Mumbai, Maharashtra',
    experience: '5+ Years',
    badge: 'Background Verification Lead',
    photoUrl: 'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=500&auto=format&fit=crop&q=80',
    email: 'zoya.m@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Credential Verification', 'ICAI Membership Check', 'Onboarding Compliance', 'DocuSign Pipelines'],
    bio: 'Zoya oversees rigorous candidate verification, ensuring all credentials, attempt certificates, and articleship records meet strict enterprise standards before client submission.',
    keyAchievements: [
      'Zero compliance failure rate across 4,000+ candidate credential screenings',
      'Streamlined digital verification turnaround time to under 4 hours'
    ],
    education: 'BMS, Narsee Monjee College Mumbai'
  },
  {
    id: 22,
    name: 'Manish Tiwari',
    role: 'Consultant – Tier 2 & Tier 3 CA Talent Scouting',
    department: 'Headhunting & CA Specialists',
    location: 'Indore, Madhya Pradesh',
    experience: '6+ Years',
    badge: 'Central India Lead',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    email: 'manish.t@fastcareers.in',
    linkedin: 'https://linkedin.com',
    specialties: ['Central India Network', 'Tier-2 Rankers Outreach', 'Virtual Screening', 'SME Accounting Hiring'],
    bio: 'Manish identifies high-potential CA rankers and commerce toppers from emerging educational hubs across Madhya Pradesh, Rajasthan, and Uttar Pradesh, connecting them to metro corporate hubs.',
    keyAchievements: [
      'Placed 220+ brilliant CAs from Tier-2 cities into Top 10 consulting firms',
      'Spearheaded 12 city-level outreach drives in Central India'
    ],
    education: 'ACA, ICAI | B.Com, DAVV Indore'
  }
];

export const OurTeam: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const departments = [
    'All',
    'Leadership',
    'Headhunting & CA Specialists',
    'Client Relations',
    'Mentorship & Growth',
    'Tech & Operations'
  ];

  const filteredMembers = teamMembersData.filter(member => {
    const matchesDept = selectedDepartment === 'All' || member.department === selectedDepartment;
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      member.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-[#0F2B48] via-[#163a5f] to-[#0b2137] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-lg">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs sm:text-sm font-medium mb-4 shadow-sm">
            <Sparkles size={16} className="text-yellow-400" />
            <span>Dedicated Recruitment & CA Talent Leaders</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-teal-300">Expert Team</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed">
            A powerhouse team of 20+ Chartered Accountants, executive search specialists, career mentors, and enterprise talent advisors empowering finance leaders across India.
          </p>

          {/* Quick Impact Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">22+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">Core Team Specialists</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">15+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">Years of Excellence</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">5,000+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">CA & Finance Placements</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">98.4%</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Search & Department Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, role, skill, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Results count */}
            <div className="text-sm font-medium text-gray-500 self-start md:self-center">
              Showing <span className="font-bold text-gray-900">{filteredMembers.length}</span> of {teamMembersData.length} team members
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedDepartment === dept
                    ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {dept === 'All' ? `All Members (${teamMembersData.length})` : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5"
              >
                {/* Photo & Badge Container */}
                <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback avatar if external image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  
                  {/* Fallback gradient behind image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                      <Award size={13} className="text-yellow-600" />
                      {member.badge}
                    </span>
                  </div>

                  {/* Location badge on image */}
                  <div className="absolute bottom-3 left-3 text-white flex items-center gap-1.5 text-xs font-medium drop-shadow-md">
                    <MapPin size={13} className="text-blue-300" />
                    <span>{member.location}</span>
                  </div>

                  {/* Quick Social Actions on Hover */}
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <a
                      href={`mailto:${member.email}`}
                      title={`Email ${member.name}`}
                      className="w-8 h-8 rounded-full bg-white text-gray-700 hover:text-primary hover:bg-gray-100 flex items-center justify-center shadow-md transition-colors"
                    >
                      <Mail size={14} />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn Profile"
                      className="w-8 h-8 rounded-full bg-[#0077B5] text-white hover:bg-[#005582] flex items-center justify-center shadow-md transition-colors"
                    >
                      <LinkedinIcon size={14} />
                    </a>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                      {member.department}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {member.name}
                    </h3>

                    <p className="text-xs font-medium text-gray-600 mb-3 line-clamp-1">
                      {member.role}
                    </p>

                    {/* Specialties Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {member.specialties.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[11px] font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                      {member.specialties.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded text-[10px] font-medium">
                          +{member.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      <Briefcase size={13} className="text-gray-400" />
                      {member.experience}
                    </span>

                    <button
                      onClick={() => setSelectedMember(member)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-blue-700 transition-colors py-1 px-2 rounded-lg hover:bg-blue-50"
                    >
                      <span>View Bio</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <Users className="mx-auto text-gray-400 mb-3" size={48} />
            <h3 className="text-lg font-bold text-gray-800 mb-1">No team members match your filter</h3>
            <p className="text-sm text-gray-500 mb-4">Try clearing your search query or selecting a different department category.</p>
            <button
              onClick={() => {
                setSelectedDepartment('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Join Our Team CTA Card */}
        <div className="mt-16 bg-gradient-to-r from-[#0F2B48] via-[#1a446c] to-[#0F2B48] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl relative z-10">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-200 border border-white/20 uppercase tracking-wider">
              Careers at FAST Careers
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-3 mb-4 text-white">
              Want to Join India’s Premier CA & Finance Recruitment Firm?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              We are constantly looking for high-energy talent strategists, Chartered Accountants passionate about mentoring, and executive headhunters to grow with us across our Mumbai, Delhi, Bengaluru, and Pune offices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button variant="primary" size="md" className="bg-white text-primary hover:bg-gray-100 font-bold">
                  Connect With Our Leadership
                </Button>
              </Link>
              <a href="mailto:careers@fastcareers.in">
                <Button variant="outline" size="md" className="border-white text-white hover:bg-white/10">
                  Send Your Resume (careers@fastcareers.in)
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Member Detail Bio Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 relative animate-scale-up">
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-blue-50/40 border-b border-gray-100 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <img
                src={selectedMember.photoUrl}
                alt={selectedMember.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-md border-2 border-white"
              />
              <div className="flex-grow text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
                  <Award size={13} className="text-yellow-600" />
                  {selectedMember.badge}
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900">{selectedMember.name}</h3>
                <p className="text-sm font-semibold text-gray-600 mt-0.5">{selectedMember.role}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Building2 size={14} className="text-gray-400" />
                    {selectedMember.department}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-gray-400" />
                    {selectedMember.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} className="text-gray-400" />
                    {selectedMember.experience} Exp
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Bio */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Professional Background</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedMember.bio}</p>
              </div>

              {/* Education */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Education & Credentials</h4>
                <div className="flex items-start gap-2 text-sm text-gray-800 font-medium">
                  <GraduationCap size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>{selectedMember.education}</span>
                </div>
              </div>

              {/* Key Highlights / Achievements */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Career Milestones</h4>
                <ul className="space-y-2">
                  {selectedMember.keyAchievements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Domain Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.specialties.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-100 rounded-lg text-xs font-semibold"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Actions */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-colors"
                  >
                    <Mail size={16} />
                    <span>{selectedMember.email}</span>
                  </a>
                  <a
                    href={selectedMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0077B5] text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#005582] transition-colors"
                  >
                    <LinkedinIcon size={16} />
                    <span>LinkedIn</span>
                  </a>
                </div>

                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
