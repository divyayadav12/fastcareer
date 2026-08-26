import React from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Calendar, MapPin, Building2, Users, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';

export const JobFair = () => {
  const fairs = [
    {
      id: 1,
      title: "Tech Career Expo 2026",
      date: "October 15, 2026",
      location: "Mumbai Exhibition Center",
      companies: 50,
      attendees: "2000+",
      status: "Upcoming"
    },
    {
      id: 2,
      title: "Finance & Banking Job Fair",
      date: "November 5, 2026",
      location: "Delhi Convention Hub",
      companies: 35,
      attendees: "1500+",
      status: "Registration Open"
    },
    {
      id: 3,
      title: "Virtual Startup Hiring Drive",
      date: "September 20, 2026",
      location: "Online (Zoom)",
      companies: 120,
      attendees: "5000+",
      status: "Ongoing"
    }
  ];

  return (
    <CandidateLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Job Fair Available</h1>
        <p className="text-gray-500">Discover and register for upcoming career events and mass hiring drives.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fairs.map(fair => (
          <div key={fair.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 relative">
              <span className="absolute top-4 right-4 bg-white/20 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/30">
                {fair.status}
              </span>
              <h3 className="text-xl font-bold text-white mt-4">{fair.title}</h3>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="space-y-4 mb-6 flex-1">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar size={18} className="text-primary" />
                  <span className="font-medium">{fair.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin size={18} className="text-primary" />
                  <span>{fair.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Building2 size={18} className="text-primary" />
                  <span>{fair.companies} Top Companies</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Users size={18} className="text-primary" />
                  <span>{fair.attendees} Candidates Expected</span>
                </div>
              </div>
              
              <Button className="w-full flex items-center justify-center gap-2">
                Register Now <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CandidateLayout>
  );
};
