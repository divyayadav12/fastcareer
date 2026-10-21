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
  Lightbulb, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  Award,
  Building2
} from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

interface EventItem {
  id: number;
  title: string;
  category: 'Placement Drives & Summits' | 'Learning & Masterclasses' | 'Strategy & Innovation' | 'Annual Milestones & Awards';
  categoryIcon: string;
  date: string;
  location: string;
  imageUrl: string;
  shortDesc: string;
  fullDesc: string;
  participants: string;
  highlights: string[];
}

// 100% Real Campus & Event Photos Only (Zero AI / Stock Images)
const eventsData: EventItem[] = [
  {
    id: 101,
    title: 'PHD Chamber Executive Leadership & Secretariat Conclave',
    category: 'Placement Drives & Summits',
    categoryIcon: '🏛️',
    date: 'August 2026',
    location: 'PHD Chamber of Commerce & Industry, New Delhi',
    imageUrl: '/team_photos/team_photo_2.jpg',
    shortDesc: 'Executive secretariat panel featuring Geeta Poduval (Secretary, IOA), S. Kapur, and industry leadership during corporate talent summit.',
    fullDesc: 'High-level delegation and secretariat roundtable discussing CA placement policies, corporate partnerships, and industry skill alignment at the PHD Chamber of Commerce & Industry.',
    participants: 'Senior Leadership & Secretariat Delegates',
    highlights: ['Executive Secretariat Roundtable', 'Industry Policy Alignment', 'Corporate Partnership Mandates']
  },
  {
    id: 102,
    title: 'PHD Chamber National Recruitment & Career Presentation',
    category: 'Placement Drives & Summits',
    categoryIcon: '🏛️',
    date: 'July 2026',
    location: 'PHD Chamber Main Auditorium, New Delhi',
    imageUrl: '/team_photos/team_photo_4.jpg',
    shortDesc: 'Keynote presentation and corporate address to a packed house of finance professionals and CA candidates.',
    fullDesc: 'Keynote presentation and interactive session at PHD Chamber auditorium explaining corporate placement roadmaps, financial advisory careers, and recruitment drives.',
    participants: '300+ Industry Professionals & Candidates',
    highlights: ['Corporate Offerings Presentation', 'Executive Panel Q&A', 'National Hiring Roadmap']
  },
  {
    id: 103,
    title: 'Candidate Orientation & Technical Grooming Assembly',
    category: 'Learning & Masterclasses',
    categoryIcon: '🎓',
    date: 'June 2026',
    location: 'FAST Careers Training Hall, New Delhi',
    imageUrl: '/team_photos/team_photo_5.jpg',
    shortDesc: 'Full auditorium of qualified CA candidates and finance professionals attending technical orientation and interview preparation.',
    fullDesc: 'High-engagement training session where hundreds of CA finalists and young professionals gathered to learn interview strategies, technical standards, and corporate etiquette.',
    participants: '250+ Qualified Candidates & Mentors',
    highlights: ['Interactive Technical Grooming', 'Corporate Interview Strategies', '1-on-1 Profile Mentorship']
  },
  {
    id: 104,
    title: 'National Executive Boardroom & Circular Summit Hall',
    category: 'Strategy & Innovation',
    categoryIcon: '💡',
    date: 'May 2026',
    location: 'Executive Council Hall, New Delhi',
    imageUrl: '/team_photos/team_photo_3.jpg',
    shortDesc: 'State-of-the-art circular boardroom setup for corporate strategy sessions, candidate selection panels, and employer briefings.',
    fullDesc: 'FAST Careers executive boardroom equipped with individual delegate microphones and documentation tables for high-stakes corporate hiring strategies.',
    participants: 'Board Members & Executive Partners',
    highlights: ['Circular Council Boardroom', 'Delegate Microphone System', 'Strategic Talent Sourcing Blueprint']
  },
  {
    id: 105,
    title: 'FAST Careers Corporate Event Hall & Reception Venue',
    category: 'Placement Drives & Summits',
    categoryIcon: '🏛️',
    date: 'April 2026',
    location: 'Corporate Convention Center, New Delhi',
    imageUrl: '/team_photos/team_photo_1.jpg',
    shortDesc: 'Banquet & reception setup for FAST Careers executive candidate registration and corporate employer briefing.',
    fullDesc: 'Our venue setup team preparing the grand auditorium and registration counters for national employer-candidate networking events.',
    participants: 'Operations & Event Coordination Team',
    highlights: ['Executive Registration Counters', 'Grand Banquet Setup', 'Employer Networking Lounge']
  },
  {
    id: 106,
    title: 'FAST Careers Recruitment Team & Celebration Assembly',
    category: 'Annual Milestones & Awards',
    categoryIcon: '🏆',
    date: 'September 2026',
    location: 'FAST Careers Headquarters, New Delhi',
    imageUrl: '/team_photos/team_photo_9.jpg',
    shortDesc: 'Joyous gathering of FAST Careers recruitment leads, headcount strategists, and executive mentors celebrating candidate success.',
    fullDesc: 'Group photograph of our core talent recruitment specialists and executive partners celebrating high candidate placement volume and team milestone successes.',
    participants: 'Entire Recruitment & Leadership Team',
    highlights: ['Team Excellence Celebration', 'Recruitment Leads Assembly', 'Placement Victory Moment']
  },
  {
    id: 107,
    title: 'Tiered Executive Auditorium Masterclass & Case Study Session',
    category: 'Learning & Masterclasses',
    categoryIcon: '🎓',
    date: 'August 2026',
    location: 'Management Institute Hall, New Delhi',
    imageUrl: '/team_photos/team_photo_6.jpg',
    shortDesc: 'Intensive case study presentation and corporate finance breakdown in a tiered executive auditorium.',
    fullDesc: 'Young finance aspirants seated in tiered auditorium desks participating in technical lectures, statutory audit case files, and corporate policy discussions.',
    participants: '150+ CA Candidates & Instructors',
    highlights: ['Tiered Auditorium Masterclass', 'Corporate Finance Case Studies', 'Interactive Lecture Modules']
  },
  {
    id: 108,
    title: 'National Finance Candidates Interactive Seminar & Q&A',
    category: 'Learning & Masterclasses',
    categoryIcon: '🎓',
    date: 'July 2026',
    location: 'Corporate Learning Center, New Delhi',
    imageUrl: '/team_photos/team_photo_7.jpg',
    shortDesc: 'Interactive Q&A session with candidates evaluating IND AS financial reporting standards and mock interview preparations.',
    fullDesc: 'An interactive classroom seminar where candidates engage directly with senior faculty on career guidance, technical evaluation, and corporate interview prep.',
    participants: '180+ Candidates & Mentors',
    highlights: ['IND AS Standards Seminar', 'Mock Interview Prep', 'Live Q&A Forum']
  },
  {
    id: 109,
    title: 'Delegate Registration & Executive Networking Corridor',
    category: 'Placement Drives & Summits',
    categoryIcon: '🏛️',
    date: 'June 2026',
    location: 'Grand Convention Corridor, New Delhi',
    imageUrl: '/team_photos/team_photo_8.jpg',
    shortDesc: 'Candidates and talent leads reviewing candidate dossiers and scheduling interview slots in the convention corridor.',
    fullDesc: 'Networking and profile verification corridor where candidates and corporate recruiters discuss interview schedules and document evaluation.',
    participants: 'Delegates & Sourcing Managers',
    highlights: ['Dossier Review Lounge', 'Interview Slot Scheduling', 'Executive Networking']
  },
  {
    id: 110,
    title: 'Grand 5-Star Hotel Atrium CA Placement Drive',
    category: 'Placement Drives & Summits',
    categoryIcon: '🏛️',
    date: 'October 2026',
    location: '5-Star Hotel Atrium, New Delhi',
    imageUrl: '/team_photos/team_photo_10.jpg',
    shortDesc: 'Bird’s-eye view of our mega national placement drive hosted in a grand 5-star hotel atrium with 40+ corporate desks.',
    fullDesc: 'A panoramic view of the 5-star convention atrium where hundreds of CA candidates and corporate HR teams gathered for on-the-spot interviews and employer networking.',
    participants: '500+ Candidates & Corporate HRs',
    highlights: ['Grand Hotel Atrium Venue', '40+ Corporate Desks', 'Live Candidate Networking']
  },
  {
    id: 111,
    title: 'Corporate Candidate Interview Queue & Networking Hall',
    category: 'Placement Drives & Summits',
    categoryIcon: '🏛️',
    date: 'September 2026',
    location: 'Convention Hall Corridor, New Delhi',
    imageUrl: '/team_photos/team_photo_11.jpg',
    shortDesc: 'Young CA finalists and corporate candidates lined up for Big 4 and Fortune 500 interview rounds.',
    fullDesc: 'Candidates dressed in formal business attire preparing their resume dossiers and awaiting their scheduled interview turns with corporate hiring managers.',
    participants: '300+ Qualified Candidates',
    highlights: ['Formal Business Attire', 'Fast-Track Interview Lines', 'On-the-Spot Evaluation']
  },
  {
    id: 112,
    title: 'Grand Ballroom CA Finalist Masterclass Assembly',
    category: 'Learning & Masterclasses',
    categoryIcon: '🎓',
    date: 'August 2026',
    location: 'Grand Ballroom, New Delhi',
    imageUrl: '/team_photos/team_photo_12.jpg',
    shortDesc: 'Hundreds of CA candidates attending a high-impact technical masterclass on financial modeling and IND AS.',
    fullDesc: 'Full ballroom audience of finance candidates attentively taking notes during the annual FAST Careers technical orientation and resume building session.',
    participants: '400+ Candidates & Industry Experts',
    highlights: ['Full Ballroom Assembly', 'Technical Lecture Notes', 'Career Mentorship']
  }
];

export const OurTeam: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<number, boolean>>({});

  const categories = [
    { id: 'All', label: `All Campus Glimpses (${eventsData.length})`, icon: '🌟' },
    { id: 'Placement Drives & Summits', label: 'Placement Drives & Summits', icon: '🏛️' },
    { id: 'Learning & Masterclasses', label: 'Learning & Masterclasses', icon: '🎓' },
    { id: 'Strategy & Innovation', label: 'Strategy & Boardrooms', icon: '💡' },
    { id: 'Annual Milestones & Awards', label: 'Team Milestones', icon: '🏆' },
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

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
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
      {/* Corporate Hero Banner - CA Campus */}
      <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-bold mb-4 shadow-xs">
            <Sparkles size={16} className="text-blue-700" />
            <span>Fast Career Consultants Private Limited</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4">
            FAST <span className="text-blue-700">CA Campus</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-4 font-normal">
            Real moments from our National CA Campus recruitment drives, executive secretariat panels, and corporate orientation masterclasses across India.
          </p>

          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-semibold">
            <span>✓ Verified Campus Glimpses</span>
            <span className="text-slate-300">•</span>
            <span>Zero Stock / AI Images</span>
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
                placeholder="Search by venue, city, or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Results counter */}
            <div className="text-sm font-medium text-gray-500 self-start md:self-center">
              Showing <span className="font-bold text-gray-900">{filteredEvents.length}</span> of {eventsData.length} Real Moments
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-5 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20 scale-102'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real Campus Photos Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No moments matched your search</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Try searching for different terms like &quot;PHD Chamber&quot;, &quot;Atrium&quot;, or &quot;Masterclass&quot;.
            </p>
            <Button
              variant="outline"
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((item, index) => {
              const isLiked = likedPhotos[item.id] || false;
              return (
                <div
                  key={item.id}
                  onClick={() => openLightbox(index)}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1.5"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Dark gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Category Pill Tag */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-gray-800 shadow-md">
                        <span>{item.categoryIcon}</span>
                        <span>{item.category}</span>
                      </span>
                    </div>

                    {/* Like & Zoom Action Buttons */}
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                      <button
                        onClick={(e) => toggleLike(item.id, e)}
                        className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                          isLiked 
                            ? 'bg-rose-500 text-white shadow-md' 
                            : 'bg-black/40 text-white hover:bg-black/60'
                        }`}
                        title="Love this photo"
                      >
                        <Heart size={15} className={isLiked ? 'fill-current' : ''} />
                      </button>

                      <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye size={15} />
                      </div>
                    </div>

                    {/* Bottom overlay snippet */}
                    <div className="absolute bottom-3 left-4 right-4 text-white text-xs flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5 font-medium truncate">
                        <MapPin size={13} className="text-amber-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 font-medium text-gray-300">
                        <Calendar size={13} />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Card Bottom */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-base sm:text-lg mb-2 leading-snug group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                        {item.shortDesc}
                      </p>
                    </div>

                    <div>
                      {/* Highlights Pill Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.highlights.slice(0, 2).map((h, i) => (
                          <span
                            key={i}
                            className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>

                      {/* Card Footer: Attendees */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                          <Users size={14} className="text-blue-700" />
                          <span>{item.participants}</span>
                        </span>
                        <span className="font-bold text-blue-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          View details &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Join FAST Careers CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-amber-300">
              National Placement Drives
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ready to Recruit from FAST CA Campus?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
              Join 150+ top companies recruiting qualified Chartered Accountants across India with zero hiring friction.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link to="/placement-drive">
                <Button variant="secondary" size="lg" className="font-bold bg-white text-blue-900 hover:bg-slate-100 shadow-md">
                  Register for Campus Drive
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="font-bold border-white/60 text-white hover:bg-white/10">
                  Contact Placement Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Modal for Photo Details */}
      {currentLightboxItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Previous photo"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={handleNextPhoto}
              className="absolute right-4 md:right-[calc(40%+16px)] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Next photo"
            >
              <ChevronRight size={22} />
            </button>

            {/* Lightbox Image Preview */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
              <img
                src={currentLightboxItem.imageUrl}
                alt={currentLightboxItem.title}
                className="w-full h-full max-h-[75vh] object-contain"
              />
            </div>

            {/* Lightbox Details Panel */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-[85vh] bg-white">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
                  <span>{currentLightboxItem.categoryIcon}</span>
                  <span>{currentLightboxItem.category}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-3">
                  {currentLightboxItem.title}
                </h2>

                <div className="space-y-2 mb-5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-amber-500 shrink-0" />
                    <span className="font-semibold text-gray-800">{currentLightboxItem.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-blue-600 shrink-0" />
                    <span>{currentLightboxItem.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-emerald-600 shrink-0" />
                    <span className="font-medium text-gray-700">{currentLightboxItem.participants}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">Event Synopsis</h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-normal">
                    {currentLightboxItem.fullDesc}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2.5">Key Highlights</h4>
                  <ul className="space-y-1.5">
                    {currentLightboxItem.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Photo {(activeLightboxIndex ?? 0) + 1} of {filteredEvents.length}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeLightbox}
                  className="text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
