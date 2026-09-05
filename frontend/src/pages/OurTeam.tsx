import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  GraduationCap, 
  Trophy, 
  PartyPopper, 
  Lightbulb, 
  Compass, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  BookOpen,
  Award,
  Building2,
  Flame
} from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

interface EventItem {
  id: number;
  title: string;
  category: 'Learning & Masterclasses' | 'Festival Celebrations' | 'Placement Drives & Summits' | 'Strategy & Innovation' | 'Annual Milestones & Awards';
  categoryIcon: string;
  date: string;
  location: string;
  imageUrl: string;
  shortDesc: string;
  fullDesc: string;
  participants: string;
  highlights: string[];
}

const eventsData: EventItem[] = [
  // 1. Learning, Masterclasses & CA Training
  {
    id: 1,
    title: 'National CA Finalist Masterclass & Valuation Workshop',
    category: 'Learning & Masterclasses',
    categoryIcon: '🎓',
    date: 'August 2026',
    location: 'Auditorium Hall, Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Senior CA faculty and recruitment mentors training 350+ candidates on advanced Financial Modeling, IND AS standards, and Big 4 case interviews.',
    fullDesc: 'A full-day executive masterclass conducted by FAST Careers leadership and ICAI veteran faculty. Covered live M&A case studies, statutory audit simulation rounds, and discounted cash flow (DCF) valuation models on spreadsheets.',
    participants: '350+ CA Finalists & 6 Senior Mentors',
    highlights: ['Live Financial Modeling on Big Screen', 'Mock Technical Rounds', 'Direct Resume Evaluation Desk']
  },
  {
    id: 2,
    title: 'Simulated Panel Mock Interviews & Technical Grooming',
    category: 'Learning & Masterclasses',
    categoryIcon: '🎓',
    date: 'July 2026',
    location: 'Training Center, New Delhi',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Rigorous 1-on-1 interview simulations preparing candidates for Fortune 500 and Big 4 corporate finance partner rounds.',
    fullDesc: 'Focused cohort grooming sessions covering technical frameworks, stress management, group discussions, and articulate presentation skills tailored for senior finance appointments.',
    participants: '40 Candidates per cohort',
    highlights: ['Detailed performance appraisal report', 'Non-verbal communication coaching', 'Recorded interview video playback']
  },
  {
    id: 3,
    title: 'Whiteboard Strategy & Direct Tax Case Study Workshop',
    category: 'Learning & Masterclasses',
    categoryIcon: '🎓',
    date: 'June 2026',
    location: 'FAST Learning Hub, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Interactive workshop breaking down Transfer Pricing complexities, BEPS regulations, and recent tax audit reporting standards.',
    fullDesc: 'Hands-on problem-solving where young finance professionals analyzed real dispute case files under the direct guidance of Ex-EY and Ex-PwC tax managers.',
    participants: '85 Young Professionals',
    highlights: ['Case law precedent analysis', 'Transfer pricing benchmarking models', 'Q&A session with industry tax directors']
  },
  {
    id: 4,
    title: 'University Campus Orientation & Career Roadmapping Seminar',
    category: 'Learning & Masterclasses',
    categoryIcon: '🎓',
    date: 'May 2026',
    location: 'University Campus, Pune',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Guiding commerce toppers and CA aspirants on long-term career planning, articleship specialization, and industry readiness.',
    fullDesc: 'Over 500 students attended this high-impact guidance session on articleship choices, corporate finance trajectories, and building executive presence early in their careers.',
    participants: '500+ Students & Faculty',
    highlights: ['Live resume engineering demonstration', 'Free 1-on-1 profile guidance', 'Articleship roadmap blueprints']
  },
  {
    id: 5,
    title: 'Financial Analysis & Advanced Excel Modeling Bootcamp',
    category: 'Learning & Masterclasses',
    categoryIcon: '🎓',
    date: 'April 2026',
    location: 'Tech Learning Lab, Hyderabad',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Hands-on training session for candidates on dynamic 3-statement financial modeling, Power BI dashboards, and KPI analysis.',
    fullDesc: 'Intensive computer lab workshop focused on teaching candidates how to automate financial reports and present data insights to executive boardrooms.',
    participants: '60 Selected Candidates',
    highlights: ['Dynamic 3-statement model creation', 'Power BI dashboard templates', 'Corporate presentation skills']
  },

  // 2. Festival & Cultural Celebrations
  {
    id: 6,
    title: 'Grand Diwali Celebration & Traditional Festivities',
    category: 'Festival Celebrations',
    categoryIcon: '🪔',
    date: 'November 2025',
    location: 'FAST Careers Offices Nationwide',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Celebrating the Festival of Lights in vibrant traditional ethnic attire with floral rangolis, festive lighting, and sweet hampers.',
    fullDesc: 'A joyous celebration embracing Indian cultural heritage across all regional branches. Team members gathered for the annual office puja, traditional dress competitions, and exchanging festive greetings.',
    participants: 'All Regional Branches & Families',
    highlights: ['Office Puja & Diya Lighting', 'Traditional Ethnic Dress Showcase', 'Gourmet Festive Sweets & Lunch']
  },
  {
    id: 7,
    title: 'Holi – Festival of Colors & Team Harmony',
    category: 'Festival Celebrations',
    categoryIcon: '🎨',
    date: 'March 2026',
    location: 'Office Lawns & Terrace, Mumbai HQ',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'A joyous celebration with organic herbal colors, traditional music, festive gujiyas, and team camaraderie.',
    fullDesc: 'Bringing everyone together to celebrate the arrival of spring with organic gulal, cultural folk music, and refreshing traditional thandai and snacks.',
    participants: 'All Employees & Leadership',
    highlights: ['100% Organic Herbal Gulal', 'Traditional festive delicacies', 'Cultural group photography']
  },
  {
    id: 8,
    title: 'Navratri Traditional Dandiya & Garba Evening',
    category: 'Festival Celebrations',
    categoryIcon: '✨',
    date: 'October 2025',
    location: 'Banquet Hall, Ahmedabad Hub',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Dressed in colorful traditional Chaniya Cholis and Kurtas, dancing to traditional Garba and Dandiya beats.',
    fullDesc: 'An energetic cultural evening celebrating nine nights of devotion, music, and unity. Features best traditional attire awards and a grand Gujarati feast.',
    participants: 'Western Region Team & Guests',
    highlights: ['Live Dhol & Dandiya Beats', 'Best Dressed Traditional Awards', 'Grand Festive Dinner Feast']
  },
  {
    id: 9,
    title: 'Christmas & Year-End Gratitude Gala',
    category: 'Festival Celebrations',
    categoryIcon: '🎄',
    date: 'December 2025',
    location: 'Grand Ballroom, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Celebrating the holiday season with Secret Santa gifting, beautiful Christmas decorations, and a year-end gala dinner.',
    fullDesc: 'A warm winter evening reflecting on annual triumphs, distributing personalized recognition gifts, and toasting to new beginnings in the coming year.',
    participants: 'Entire Organization',
    highlights: ['Secret Santa Gift Exchange', 'Christmas Carols & Tree Lighting', 'Year-End Gratitude Toast']
  },
  {
    id: 10,
    title: '79th Independence Day – Patriotic Flag Hoisting & Cultural Tribute',
    category: 'Festival Celebrations',
    categoryIcon: '🇮🇳',
    date: 'August 2026',
    location: 'Headquarters, New Delhi & Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Honoring the nation with tricolor flag hoisting, national anthem, and pledging commitment to empowering Indian talent.',
    fullDesc: 'Team members dressed in white and tricolor shades assembled for the ceremonial flag hoisting, inspiring speeches on nation building through education, and traditional sweets distribution.',
    participants: 'All Regional Branches',
    highlights: ['Ceremonial Flag Hoisting', 'Nation-Building Address by Founder', 'Tricolor Sweets Distribution']
  },
  {
    id: 11,
    title: 'New Year Kickoff & Gratitude Luncheon',
    category: 'Festival Celebrations',
    categoryIcon: '🎉',
    date: 'January 2026',
    location: 'JW Marriott, New Delhi',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Welcoming the new year with annual goal setting, leadership vision sharing, and a lavish 5-star celebratory luncheon.',
    fullDesc: 'Commencing the annual recruitment calendar with renewed commitment to candidate excellence and strengthening corporate employer partnerships.',
    participants: 'North India Team & Leaders',
    highlights: ['Annual Vision & Mission Address', '5-Star Gourmet Buffet', 'Team Excellence Planners']
  },

  // 3. Placement Drives & Corporate Summits
  {
    id: 12,
    title: 'Mega National CA Placement Drive 2026',
    category: 'Placement Drives & Summits',
    categoryIcon: '🏛️',
    date: 'August 2026',
    location: 'Grand Convention Center, Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'India’s premier CA placement expo hosting 40+ multinational corporate partners, Big 4 firms, and consulting leaders.',
    fullDesc: 'FAST Careers organized an exclusive placement drive with on-the-spot interviews, psychometric evaluations, and same-day offer letter rollouts for qualified finance candidates.',
    participants: '600+ Candidates & 40 Corporate HRs',
    highlights: ['180+ Same-day job offers issued', 'Corporate Partner networking desks', 'Automated interview scheduling system']
  },
  {
    id: 13,
    title: 'Annual Corporate Leadership & Talent Summit',
    category: 'Placement Drives & Summits',
    categoryIcon: '🏛️',
    date: 'July 2026',
    location: 'Taj Lands End, Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Gathering 120+ CFOs, Managing Partners, and Talent Directors to discuss the Future of Finance Leadership in India.',
    fullDesc: 'A prestigious conference addressing AI in statutory auditing, global capability center expansions, and executive compensation trends.',
    participants: '120+ CXOs & Talent Heads',
    highlights: ['Panel on Future of CA Careers', 'Networking dinner with industry leaders', 'Annual Salary Trends Whitepaper Release']
  },
  {
    id: 14,
    title: 'Panel Discussion: Emerging Trends in Statutory & Tax Audit',
    category: 'Placement Drives & Summits',
    categoryIcon: '🏛️',
    date: 'May 2026',
    location: 'Tech Park Auditorium, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Executive panel debating automation in compliance, global reporting standards, and cross-border M&A diligence.',
    fullDesc: 'Live broadcasted session connecting senior audit partners with young CA finalists seeking clarity on career pathways.',
    participants: '300 In-person & 10,000+ Online Viewers',
    highlights: ['Interactive Slido Q&A', 'Networking breakout sessions', 'Industry trends booklet release']
  },
  {
    id: 15,
    title: 'BFSI & Fintech Leadership Recruitment Conclave',
    category: 'Placement Drives & Summits',
    categoryIcon: '🏛️',
    date: 'March 2026',
    location: 'ITC Grand Central, Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Exclusive talent bridge connecting private equity funds, banks, and fintech unicorns with elite financial analysts.',
    fullDesc: 'Structured hiring conclave facilitating fast-track recruitment for high-impact roles in investment banking, treasury, and credit risk.',
    participants: '50 Institutional Employers',
    highlights: ['Fast-track hiring lanes', 'Executive boardroom pitches', 'Direct offer rollouts']
  },

  // 4. Strategy & Innovation
  {
    id: 16,
    title: '24-Hour AI Candidate Matching Engine Hackathon',
    category: 'Strategy & Innovation',
    categoryIcon: '💡',
    date: 'June 2026',
    location: 'Innovation Lab, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Software architects, data engineers, and recruitment leads collaborating to build our high-speed Excel resume parser.',
    fullDesc: 'A focused 24-hour innovation marathon where our tech team engineered smart algorithm-based candidate-to-mandate matching.',
    participants: 'Tech & Product Teams',
    highlights: ['Sub-second resume extraction algorithm', 'Instant ZIP streaming protocol', 'Demonstration to executive board']
  },
  {
    id: 17,
    title: 'Executive War Room – Quarterly Sourcing Strategy',
    category: 'Strategy & Innovation',
    categoryIcon: '💡',
    date: 'April 2026',
    location: 'Executive Boardroom, Mumbai HQ',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Leadership aligning on national campus hiring routes, corporate SLAs, and tier-2 talent scout networks.',
    fullDesc: 'In-depth quarterly strategy review analyzing market demand, industry hiring bottlenecks, and setting aggressive placement targets.',
    participants: 'Department Heads & Partners',
    highlights: ['Whiteboard strategic roadmaps', 'Talent supply forecasting', 'Multi-city allocation matrix']
  },
  {
    id: 18,
    title: 'Design Thinking & Candidate Experience Workshop',
    category: 'Strategy & Innovation',
    categoryIcon: '💡',
    date: 'May 2026',
    location: 'Creativity Studio, Pune',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Collaborative workshop optimizing candidate onboarding, interview tracking, and transparent employer feedback loops.',
    fullDesc: 'Mapping out every touchpoint in an applicant’s journey to ensure prompt communication, zero friction, and high satisfaction.',
    participants: 'Operations & HR Leads',
    highlights: ['User journey map blueprint', 'Rapid feedback UI design', 'Candidate NPS enhancement plan']
  },
  {
    id: 19,
    title: 'Recruitment Mastermind & Knowledge Sharing Jam',
    category: 'Strategy & Innovation',
    categoryIcon: '💡',
    date: 'Bi-Weekly',
    location: 'Corporate Lounge, Gurugram',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Peer mentoring sessions where senior headhunters train junior associates on Boolean search tricks and executive outreach.',
    fullDesc: 'A continuous learning forum fostering team collaboration, industry knowledge transfer, and sharing best recruitment practices.',
    participants: 'All Talent Strategists',
    highlights: ['Advanced talent mapping tools', 'Candidate negotiation masterclass', 'Peer recognition shout-outs']
  },

  // 5. Annual Milestones & Awards
  {
    id: 20,
    title: '15th Foundation Anniversary & Commemorative Celebration',
    category: 'Annual Milestones & Awards',
    categoryIcon: '🏆',
    date: 'March 2026',
    location: 'Grand Ballroom, Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Celebrating 15 years of excellence, 5,000+ career breakthroughs, and honoring long-serving team members.',
    fullDesc: 'Reflecting on FAST Careers’ journey from 2008 to becoming a premier national talent brand, accompanied by commemorative awards and founder address.',
    participants: 'Entire Organization & Alumni',
    highlights: ['Founder Keynote Retrospective', 'Long-Service Loyalty Medals', '50kg Celebration Cake']
  },
  {
    id: 21,
    title: 'Top Recruiter & Mentor Annual Excellence Awards',
    category: 'Annual Milestones & Awards',
    categoryIcon: '🏆',
    date: 'June 2026',
    location: 'ITC Maurya, New Delhi',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Felicitation ceremony recognizing outstanding recruiter contributions, high placement volumes, and mentor dedication.',
    fullDesc: 'Honoring top team performers with performance bonuses, international conference sponsorships, and leadership excellence trophies.',
    participants: 'All Regional Branches',
    highlights: ['Recruiter of the Year Trophy', 'Outstanding Mentor of the Year', 'Gala Dinner & Felicitation']
  },
  {
    id: 22,
    title: 'Annual National Leadership Conclave & Retreat',
    category: 'Annual Milestones & Awards',
    categoryIcon: '🏆',
    date: 'February 2026',
    location: 'Heritage Resort, Udaipur',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80',
    shortDesc: '3-day executive leadership conference setting multi-year expansion roadmaps for Middle East & APAC talent markets.',
    fullDesc: 'Bringing regional heads and partners together to align on international client partnerships, institutional funding, and tech scaling.',
    participants: 'Partners & Regional Directors',
    highlights: ['3-Year Strategic Vision Blueprint', 'Global Partner Panel', 'Heritage Cultural Dinner']
  },
  {
    id: 23,
    title: 'Milestone Achievement & Record Placements Toast',
    category: 'Annual Milestones & Awards',
    categoryIcon: '🏆',
    date: 'July 2026',
    location: 'Sky Lounge Rooftop, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Celebrating the milestone of 500+ successful candidate placements in a single quarter with team toasts and celebration.',
    fullDesc: 'Honoring the relentless dedication and synergy of our recruitment, operations, and corporate relations teams nationwide.',
    participants: 'South Zone Team',
    highlights: ['Record quarterly milestone toast', 'Key contributor recognition', 'Celebration evening dinner']
  },
  {
    id: 24,
    title: 'Annual Team Building & Wellness Retreat',
    category: 'Annual Milestones & Awards',
    categoryIcon: '🏆',
    date: 'October 2025',
    location: 'Lakeside Resort, Lonavala',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'A serene wellness retreat fostering mental rejuvenation, leadership alignment, and holistic team wellness.',
    fullDesc: 'A rejuvenating 2-day offsite featuring morning yoga, team-building collaboration exercises, and sunset leadership circles.',
    participants: 'West Zone Team',
    highlights: ['Guided mindfulness & yoga', 'Collaborative trust exercises', 'Sunset amphitheater dinner']
  }
];

export const OurTeam: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<number, boolean>>({});

  const categories = [
    { id: 'All', label: 'All Moments (24)', icon: '🌟' },
    { id: 'Learning & Masterclasses', label: 'Learning & Masterclasses', icon: '🎓' },
    { id: 'Festival Celebrations', label: 'Festival Celebrations', icon: '🪔' },
    { id: 'Placement Drives & Summits', label: 'Placement Drives & Summits', icon: '🏛️' },
    { id: 'Strategy & Innovation', label: 'Strategy & Innovation', icon: '💡' },
    { id: 'Annual Milestones & Awards', label: 'Annual Milestones & Awards', icon: '🏆' },
  ];

  const filteredEvents = eventsData.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredEvents.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredEvents.length) % filteredEvents.length);
    }
  };

  const currentLightboxItem = activeLightboxIndex !== null ? filteredEvents[activeLightboxIndex] : null;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      {/* Professional Corporate Hero Banner - Solid #1F2937 Background */}
      <div className="relative bg-[#1F2937] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
            <Sparkles size={16} className="text-yellow-400" />
            <span>Culture, Leadership & Learning Moments</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            Learning Masterclasses & <span className="text-white">Cultural Celebrations</span>
          </h1>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">120+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">Masterclasses & Workshops</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">Cultural Festive Spirit</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">40+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">Corporate Placement Summits</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">15+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">Years of Leadership</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-7 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by topic, festival, city, or event..."
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

            {/* Results counter */}
            <div className="text-sm font-medium text-gray-500 self-start md:self-center">
              Showing <span className="font-bold text-gray-900">{filteredEvents.length}</span> of {eventsData.length} moments
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-md ring-2 ring-primary/20 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setActiveLightboxIndex(index)}
                className="group bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-2 cursor-pointer"
              >
                {/* Photo Container */}
                <div className="relative h-64 sm:h-72 w-full bg-gray-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Top Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-md">
                      <span>{item.categoryIcon}</span>
                      <span>{item.category}</span>
                    </span>
                  </div>

                  {/* Actions on image */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <button
                      onClick={(e) => toggleLike(item.id, e)}
                      title="Like moment"
                      className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-md ${
                        likedPhotos[item.id]
                          ? 'bg-rose-500 text-white'
                          : 'bg-black/40 text-white hover:bg-white hover:text-rose-500'
                      }`}
                    >
                      <Heart size={16} className={likedPhotos[item.id] ? 'fill-current' : ''} />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center group-hover:bg-primary transition-all shadow-md">
                      <Eye size={16} />
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                    <div className="flex items-center gap-3 text-xs font-medium text-gray-200 mb-1 drop-shadow-md">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-teal-400 flex-shrink-0" />
                        <span className="line-clamp-1">{item.location}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-blue-300 flex-shrink-0" />
                        <span>{item.date}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                      {item.shortDesc}
                    </p>

                    {/* Highlights chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.highlights.slice(0, 2).map((hl, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-100 rounded-lg text-[11px] font-medium"
                        >
                          ✓ {hl}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users size={14} className="text-gray-400" />
                      <span>{item.participants}</span>
                    </span>

                    <span className="font-semibold text-primary group-hover:underline inline-flex items-center gap-0.5">
                      Expand Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No moments found</h3>
            <p className="text-sm text-gray-500 mb-4">Try searching another keyword or picking a different category filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Corporate Commitment Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#0F2B48] via-[#163f69] to-[#0F2B48] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl relative z-10">
            <span className="px-3.5 py-1 bg-white/10 rounded-full text-xs font-bold text-teal-300 border border-white/20 uppercase tracking-wider">
              Mentorship & Leadership at FAST Careers
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-3 mb-4 text-white">
              Empowering Finance Talent & Celebrating Every Milestone
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              Our culture blends academic mentorship excellence, high-level corporate networking, festive togetherness, and continuous learning for India's finest Chartered Accountants and executive recruiters.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button variant="primary" size="md" className="bg-white text-primary hover:bg-gray-100 font-bold shadow-md">
                  Connect With Our Leadership
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="md" className="border-white text-white hover:bg-white/10 font-medium">
                  Explore Open CA & Finance Roles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox & Story Modal */}
      {currentLightboxItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-gray-100 flex flex-col relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors shadow-lg"
            >
              <X size={22} />
            </button>

            {/* Prev/Next Buttons */}
            <button
              onClick={handlePrevPhoto}
              title="Previous Photo"
              className="absolute left-4 top-1/3 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all shadow-lg"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNextPhoto}
              title="Next Photo"
              className="absolute right-4 top-1/3 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all shadow-lg"
            >
              <ChevronRight size={24} />
            </button>

            {/* Modal Image Area */}
            <div className="relative h-72 sm:h-96 w-full bg-black overflow-hidden flex items-center justify-center">
              <img
                src={currentLightboxItem.imageUrl}
                alt={currentLightboxItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-lg border border-white/20">
                  <span>{currentLightboxItem.categoryIcon}</span>
                  <span>{currentLightboxItem.category}</span>
                </span>
              </div>
            </div>

            {/* Modal Details */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[40vh] space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <MapPin size={15} />
                  {currentLightboxItem.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={15} />
                  {currentLightboxItem.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users size={15} />
                  {currentLightboxItem.participants}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                {currentLightboxItem.title}
              </h2>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {currentLightboxItem.fullDesc}
              </p>

              {/* Highlights */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentLightboxItem.highlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-800 font-medium">
                      <span className="w-2 h-2 rounded-full bg-teal-500" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Photo {activeLightboxIndex! + 1} of {filteredEvents.length}
                </span>
                <button
                  onClick={() => setActiveLightboxIndex(null)}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                >
                  Close Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
