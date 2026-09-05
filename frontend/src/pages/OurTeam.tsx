import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  Gamepad2, 
  GraduationCap, 
  Trophy, 
  PartyPopper, 
  Lightbulb, 
  Compass, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  Heart
} from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

interface ActivityItem {
  id: number;
  title: string;
  category: 'Teaching & Mentorship' | 'Gaming & Fun' | 'Placement Drives' | 'Celebrations' | 'Hackathons & Strategy' | 'Offsites & Retreats';
  categoryIcon: string;
  date: string;
  location: string;
  imageUrl: string;
  shortDesc: string;
  fullDesc: string;
  participants: string;
  highlights: string[];
}

const activitiesData: ActivityItem[] = [
  // 1. Teaching & Mentorship
  {
    id: 1,
    title: 'National CA Finalist Masterclass & Valuation Workshop',
    category: 'Teaching & Mentorship',
    categoryIcon: '🎓',
    date: 'August 2026',
    location: 'Auditorium Hall, Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Our senior CA mentors coaching 350+ aspirants on advanced Financial Modeling, IND AS standards, and Big 4 interview strategies.',
    fullDesc: 'A full-day intensive masterclass conducted by FAST Careers leadership and veteran ICAI faculty. Covered real-world M&A case studies, statutory audit simulation rounds, and live DCF valuation modeling on spreadsheets.',
    participants: '350+ CA Finalists & 6 Senior Mentors',
    highlights: ['Live Financial Modeling on Big Screen', 'Mock Technical Rounds', 'Direct Resume Evaluation Desk']
  },
  {
    id: 2,
    title: 'One-on-One Technical Mock Interview & GD Room',
    category: 'Teaching & Mentorship',
    categoryIcon: '🎓',
    date: 'July 2026',
    location: 'Training Center, New Delhi',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Mentors conducting rigorous simulated panel interviews to prepare candidates for Fortune 500 corporate finance rounds.',
    fullDesc: 'Small cohort grooming sessions focused on behavioral frameworks, stress management, group discussions, and technical answers for Big 4 partners and corporate CFOs.',
    participants: '40 Candidates per batch',
    highlights: ['Personalized feedback report', 'Body language & communication tips', 'Recorded video playback analysis']
  },
  {
    id: 3,
    title: 'Interactive Whiteboard Strategy & Tax Audit Workshop',
    category: 'Teaching & Mentorship',
    categoryIcon: '🎓',
    date: 'June 2026',
    location: 'FAST Learning Hub, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Deep-dive interactive session breaking down recent GST litigations, Transfer Pricing complexities, and tax audit reporting.',
    fullDesc: 'Hands-on problem solving where candidates solved real litigation case files under the direct guidance of Ex-EY and Ex-PwC tax managers.',
    participants: '85 Young Professionals',
    highlights: ['Case law analysis', 'Transfer pricing benchmarking', 'Q&A round with tax directors']
  },
  {
    id: 4,
    title: 'Campus Orientation & Resume Engineering Bootcamp',
    category: 'Teaching & Mentorship',
    categoryIcon: '🎓',
    date: 'May 2026',
    location: 'University Campus, Pune',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Teaching students how to transform academic achievements and articleship experience into powerful ATS-friendly executive profiles.',
    fullDesc: 'Over 500 commerce toppers and CA foundation qualifiers attended this energy-packed session on career roadmapping, LinkedIn branding, and networking.',
    participants: '500+ Students & Faculty',
    highlights: ['Live resume makeover on projector', 'Free 1-on-1 profile reviews', 'Industry readiness roadmap']
  },

  // 2. Gaming & Fun
  {
    id: 5,
    title: 'Friday VR Gaming & Virtual Reality Racing Tournament',
    category: 'Gaming & Fun',
    categoryIcon: '🎮',
    date: 'Weekly Event',
    location: 'Recreation Lounge, Mumbai HQ',
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Team unwinding after intense headhunting weeks with competitive VR sim racing, Beat Saber, and gaming console faceoffs.',
    fullDesc: 'Every Friday evening, the FAST Careers recreation lounge turns into a gaming arena where recruiters, developers, and leadership compete for the monthly Gaming Champion trophy.',
    participants: 'Entire FAST Team',
    highlights: ['VR Racing simulator setup', 'Leaderboard scoreboard', 'Pizza & beverage party']
  },
  {
    id: 6,
    title: 'Annual Table Tennis & Foosball Championship',
    category: 'Gaming & Fun',
    categoryIcon: '🎮',
    date: 'July 2026',
    location: 'Game Zone, Bengaluru Office',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Fast-paced table tennis doubles and foosball battles between our Recruitment and Client Relations teams.',
    fullDesc: 'A thrilling 3-day internal sports league complete with custom team jerseys, commentary, and championship medals.',
    participants: '32 Internal Players',
    highlights: ['Doubles table tennis finals', 'Custom trophies & prizes', 'Live team commentary']
  },
  {
    id: 7,
    title: 'Bowling Night & Arcade Fun Outing',
    category: 'Gaming & Fun',
    categoryIcon: '🎮',
    date: 'June 2026',
    location: 'Smaaash Entertainment Arena, Gurugram',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'A high-energy team outing with bowling strikes, arcade games, laser tag, and music.',
    fullDesc: 'Celebrating Q2 placement targets with an all-expenses-paid gaming day out at the arcade arena for all team members.',
    participants: '45 Team Members',
    highlights: ['Strike bowling competition', 'Laser tag challenge', 'Team dinner & mocktails']
  },
  {
    id: 8,
    title: 'Board Game & Strategy Mystery Night',
    category: 'Gaming & Fun',
    categoryIcon: '🎮',
    date: 'May 2026',
    location: 'Rooftop Cafe, Pune',
    imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Relaxed evening of Catan, Monopoly, Secret Hitler, and team building puzzles over coffee and snacks.',
    fullDesc: 'Fostering strategic thinking and team camaraderie through competitive tabletop games and collaborative puzzle challenges.',
    participants: '25 Team Members',
    highlights: ['Strategy board games', 'Rooftop sunset views', 'Trivia quiz round']
  },

  // 3. Placement Drives & Seminars
  {
    id: 9,
    title: 'Mega CA Placement Drive 2026 – 40+ Corporate Partners',
    category: 'Placement Drives',
    categoryIcon: '🏆',
    date: 'August 2026',
    location: 'Grand Convention Hall, Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'India’s largest private CA recruitment drive connecting 600+ candidates with Big 4, MNCs, and Consulting giants.',
    fullDesc: 'FAST Careers organized an exclusive placement expo with on-the-spot interviews, aptitude screenings, and same-day offer letter rollouts by leading corporate employers.',
    participants: '600+ Candidates & 40 Corporate HRs',
    highlights: ['180+ On-the-spot job offers', 'Exclusive CXO keynote', 'Automated interview scheduling system']
  },
  {
    id: 10,
    title: 'Annual Corporate Leadership & Talent Summit',
    category: 'Placement Drives',
    categoryIcon: '🏆',
    date: 'July 2026',
    location: 'Taj Lands End, Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'FAST Careers hosting 100+ CFOs, HR Heads, and Managing Partners to discuss the Future of Finance Hiring.',
    fullDesc: 'A prestigious thought-leadership conference addressing AI in auditing, remote global accounting teams, and competitive compensation packages.',
    participants: '120+ CXOs & Talent Leaders',
    highlights: ['Panel on Future of CA Careers', 'Networking dinner & cocktail', 'Launch of Annual Salary Trends Report']
  },
  {
    id: 11,
    title: 'Stage Felicitation & Top Recruiter Excellence Awards',
    category: 'Placement Drives',
    categoryIcon: '🏆',
    date: 'June 2026',
    location: 'ITC Maurya, New Delhi',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Recognizing our top performing headhunters, talent mentors, and fastest corporate placements of the year.',
    fullDesc: 'Celebrating internal milestones with cash bonuses, international trip vouchers, and trophies for outstanding recruiter contributions.',
    participants: 'All Regional Branches',
    highlights: ['Recruiter of the Year Award', 'Top Mentor Trophy', 'Gala Dinner & live band']
  },
  {
    id: 12,
    title: 'Panel Discussion: The Modern Chartered Accountant in Tech',
    category: 'Placement Drives',
    categoryIcon: '🏆',
    date: 'April 2026',
    location: 'Tech Park Auditorium, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Live panel debate featuring startup CFOs and AI researchers exploring tech transformations in accounting.',
    fullDesc: 'Streamed live to 10,000+ CA students across the country with an open audience Q&A session.',
    participants: '300 In-person & 10k Online Viewers',
    highlights: ['Interactive Slido Q&A', 'Networking breakout rooms', 'Tech demo booths']
  },

  // 4. Celebrations & Milestones
  {
    id: 13,
    title: 'Grand Diwali Celebration & Traditional Festivities',
    category: 'Celebrations',
    categoryIcon: '🎉',
    date: 'November 2025',
    location: 'FAST Careers Offices Nationwide',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Dressed in colorful ethnic attire, lighting diyas, creating floral rangolis, and enjoying festive treats together.',
    fullDesc: 'A joyous celebration filled with team games, sweet hampers, traditional music, and capturing festive memories across all regional branches.',
    participants: 'All Employees & Families',
    highlights: ['Rangoli competition', 'Traditional attire contest', 'Gourmet festive lunch']
  },
  {
    id: 14,
    title: '15th Foundation Anniversary & Mega Cake Cutting',
    category: 'Celebrations',
    categoryIcon: '🎉',
    date: 'March 2026',
    location: 'Headquarters, Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Celebrating 15 years of excellence in executive recruitment and 5,000+ successful career placements.',
    fullDesc: 'Commemorating our journey from a small 3-person office in 2008 to India’s most trusted CA placement consultancy with a 50kg cake and special video tributes.',
    participants: 'Entire Organization',
    highlights: ['Founder retrospective keynote', '50kg Celebration Cake', 'Memory video compilation']
  },
  {
    id: 15,
    title: 'Target Milestone Bash & Rooftop Cocktail Party',
    category: 'Celebrations',
    categoryIcon: '🎉',
    date: 'July 2026',
    location: 'Sky Lounge Rooftop, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Hitting the milestone of 500 placements in a single quarter called for a rooftop DJ party under the stars.',
    fullDesc: 'A night of music, celebration, team toasts, and dancing to celebrate the hardest-working recruitment team in the country.',
    participants: '60 Team Members',
    highlights: ['Live DJ performance', 'Custom cocktail menu', 'Team toast & celebration speeches']
  },
  {
    id: 16,
    title: 'New Year Kickoff & Gratitude Lunch',
    category: 'Celebrations',
    categoryIcon: '🎉',
    date: 'January 2026',
    location: 'JW Marriott, New Delhi',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Welcoming the new year with gratitude, goal-setting vision boards, and a lavish 5-star buffet lunch.',
    fullDesc: 'Reflecting on past accomplishments, sharing personal growth aspirations, and gifting personalized welcome kits for the year ahead.',
    participants: 'North India Team',
    highlights: ['Vision board crafting', '5-star gourmet buffet', 'Team gifts & journals']
  },

  // 5. Hackathons & Strategy
  {
    id: 17,
    title: '24-Hour AI Recruitment Engine & Tech Hackathon',
    category: 'Hackathons & Strategy',
    categoryIcon: '💡',
    date: 'June 2026',
    location: 'Innovation Lab, Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Engineers, product designers, and senior recruiters collaborating overnight to build our automated Excel matching algorithm.',
    fullDesc: 'A pizza-fueled 24-hour coding sprint where team members prototyped instant candidate matching, ZIP resume streaming, and ATS score parsers.',
    participants: 'Engineering & Product Teams',
    highlights: ['24-hour sprint', 'Pizza & Red Bull energy stations', 'Winner demo to executive board']
  },
  {
    id: 18,
    title: 'War Room Quarterly Sourcing & Growth Strategy',
    category: 'Hackathons & Strategy',
    categoryIcon: '💡',
    date: 'April 2026',
    location: 'Executive Boardroom, Mumbai HQ',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Team mapping out nationwide campus hiring routes, corporate mandates, and client SLA milestones on whiteboard walls.',
    fullDesc: 'Cross-functional strategy workshops aligning headhunting pods, marketing teams, and corporate relations managers on upcoming quarter targets.',
    participants: 'Department Leads & Pod Heads',
    highlights: ['Whiteboard roadmapping', 'Market share analysis', 'Hiring capacity forecasting']
  },
  {
    id: 19,
    title: 'Design Thinking & Candidate Experience Sprint',
    category: 'Hackathons & Strategy',
    categoryIcon: '💡',
    date: 'May 2026',
    location: 'Creativity Studio, Pune',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Sticky note brainstorming sessions to redesign candidate interview tracking and employer dashboards for maximum ease.',
    fullDesc: 'Empathetic design workshop where team members mapped out every step of a candidate’s journey from registration to final offer rollout.',
    participants: 'UX, HR & Operations Leads',
    highlights: ['Journey mapping walls', 'Rapid wireframing', 'User test interviews']
  },
  {
    id: 20,
    title: 'Coffee & Collaborative Sourcing Jam Session',
    category: 'Hackathons & Strategy',
    categoryIcon: '💡',
    date: 'Weekly',
    location: 'Cafe Lounge, Gurugram',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Informal morning strategy sessions where recruiters exchange leads, share headhunting tricks, and mentor junior associates.',
    fullDesc: 'A relaxed coffee morning culture that promotes cross-pod knowledge sharing, Boolean search mastery, and peer encouragement.',
    participants: 'All Recruiters',
    highlights: ['Boolean search masterclass', 'Fresh brewed artisan coffee', 'Lead exchange board']
  },

  // 6. Offsites & Retreats
  {
    id: 21,
    title: 'Annual Himalayan Mountain Trek & Leadership Offsite',
    category: 'Offsites & Retreats',
    categoryIcon: '🏕️',
    date: 'March 2026',
    location: 'Manali & Solang Valley, Himachal Pradesh',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
    shortDesc: '4-day adventure offsite in the snow-capped mountains with river rafting, trekking, campfires, and team bonding.',
    fullDesc: 'An unforgettable getaway where the entire team escaped city routines to recharge, conquer mountain trails, and bond over acoustic music by the bonfire.',
    participants: '40 Team Members',
    highlights: ['12km mountain trek', 'Bonfire & stargazing session', 'River rafting challenge']
  },
  {
    id: 22,
    title: 'Goa Beach Resort Retreat & Team Building Games',
    category: 'Offsites & Retreats',
    categoryIcon: '🏕️',
    date: 'October 2025',
    location: 'South Goa Beachfront Resort',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Beach volleyball tournaments, sunset cruises, tug-of-war on the sand, and seafood barbecues.',
    fullDesc: 'Celebrating our record-breaking annual placements with 3 days of sun, sand, laughter, and high-energy collaborative team games.',
    participants: 'Entire Company',
    highlights: ['Sunset catamaran cruise', 'Beach tug-of-war & obstacle race', 'Gala seafood dinner']
  },
  {
    id: 23,
    title: 'Rishikesh River Rafting & Camping Expedition',
    category: 'Offsites & Retreats',
    categoryIcon: '🏕️',
    date: 'February 2026',
    location: 'Ganges Riverside Camp, Rishikesh',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Conquering white water rapids, cliff jumping, riverside camping under the stars, and yoga at sunrise.',
    fullDesc: 'Building trust and fearless teamwork through adrenaline-fueled adventure sports along the holy river Ganges.',
    participants: '30 Adventurers',
    highlights: ['26km white water rafting', 'Riverside camping & BBQ', 'Sunrise meditation & yoga']
  },
  {
    id: 24,
    title: 'Lakeside Camping, Barbecue & Acoustic Music Night',
    category: 'Offsites & Retreats',
    categoryIcon: '🏕️',
    date: 'December 2025',
    location: 'Pawna Lake, Maharashtra',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1000&auto=format&fit=crop&q=80',
    shortDesc: 'Weekend getaway with lakeside tents, live guitar jamming, outdoor barbecue grilling, and stargazing.',
    fullDesc: 'A peaceful weekend retreat where team members shared stories, sang around the fire, and celebrated each other’s personal growth.',
    participants: 'West Zone Team',
    highlights: ['Live acoustic guitar jam', 'Live BBQ cooking contest', 'Lakeside tent camping']
  }
];

export const OurTeam: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<number, boolean>>({});

  const categories = [
    { id: 'All', label: 'All Activities (24)', icon: '🌟' },
    { id: 'Teaching & Mentorship', label: 'Teaching & Masterclasses', icon: '🎓' },
    { id: 'Gaming & Fun', label: 'Gaming & Fun Fridays', icon: '🎮' },
    { id: 'Placement Drives', label: 'Placement Drives & Summits', icon: '🏆' },
    { id: 'Celebrations', label: 'Celebrations & Gala', icon: '🎉' },
    { id: 'Hackathons & Strategy', label: 'Brainstorming & Hackathons', icon: '💡' },
    { id: 'Offsites & Retreats', label: 'Offsites & Adventures', icon: '🏕️' },
  ];

  const filteredActivities = activitiesData.filter(item => {
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
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredActivities.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredActivities.length) % filteredActivities.length);
    }
  };

  const currentLightboxItem = activeLightboxIndex !== null ? filteredActivities[activeLightboxIndex] : null;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      {/* Hero Banner with Rich Dynamic Aesthetic */}
      <div className="relative bg-gradient-to-br from-[#0F2B48] via-[#163e65] to-[#0a1e33] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl">
        {/* Glow & Blurred backdrop blobs */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
            <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            <span>Life @ FAST Careers • Team in Action</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white">
            Company Activities, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-teal-300">Learning & Fun</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed">
            Beyond executive headhunting — explore our vibrant team culture! From live CA masterclasses and nationwide placement drives to VR gaming tournaments, hackathons, festive galas, and Himalayan mountain treks.
          </p>

          {/* Quick Activity Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">120+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">Masterclasses & Workshops</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">50+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">Fun Fridays & Game Tournaments</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">40+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">National Placement Drives</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium mt-1">Energy, Passion & Growth</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Controls & Filter Bar */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-7 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search activities by name, city, or topic..."
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
              Displaying <span className="font-bold text-gray-900">{filteredActivities.length}</span> of {activitiesData.length} activity moments
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

        {/* Dynamic Activity Photos Gallery */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setActiveLightboxIndex(index)}
                className="group bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-2 cursor-pointer"
              >
                {/* Photo with Overlay, Hover Zoom & Badges */}
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

                  {/* Like & Zoom Action Icons */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <button
                      onClick={(e) => toggleLike(item.id, e)}
                      title="Like photo"
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

                  {/* Location & Date on image */}
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

                {/* Card Info Section */}
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
                      Expand Photo & Story →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No activities found</h3>
            <p className="text-sm text-gray-500 mb-4">Try clearing your search terms or picking another category filter.</p>
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

        {/* Bottom Join Company Culture CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#0F2B48] via-[#163f69] to-[#0F2B48] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl relative z-10">
            <span className="px-3.5 py-1 bg-white/10 rounded-full text-xs font-bold text-teal-300 border border-white/20 uppercase tracking-wider">
              Life at FAST Careers
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-3 mb-4 text-white">
              Love Learning, Team Spirit & High Energy? Come Work With Us!
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              We work hard, celebrate every milestone, organize world-class masterclasses, and have fun together. Whether you are an experienced recruiter, an enthusiastic CA mentor, or a tech creator — there's a place for you at FAST Careers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button variant="primary" size="md" className="bg-white text-primary hover:bg-gray-100 font-bold shadow-md">
                  Explore Careers With Us
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="md" className="border-white text-white hover:bg-white/10 font-medium">
                  Search Finance & CA Jobs
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

            {/* Slideshow Prev/Next Buttons */}
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

            {/* Modal Content / Story */}
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
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Highlights & Takeaways</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentLightboxItem.highlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-800 font-medium">
                      <span className="w-2 h-2 rounded-full bg-teal-500" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Photo {activeLightboxIndex! + 1} of {filteredActivities.length}
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
