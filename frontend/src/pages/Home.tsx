import React from 'react';
import { Hero } from './home/Hero';
import { CorporateRecruitersSection } from './home/CorporateRecruitersSection';
import { PanIndiaPresenceSection } from './home/PanIndiaPresenceSection';
import { TrustStats } from './home/TrustStats';
import { AboutSection } from './home/AboutSection';
import { ServicesSection } from './home/ServicesSection';
import { JourneyTimelineSection } from './home/JourneyTimelineSection';
import { ExpertiseSection } from './home/ExpertiseSection';
import { ProcessSection } from './home/ProcessSection';
import { CandidateSection } from './home/CandidateSection';
import { EmployerSection } from './home/EmployerSection';
import { TestimonialSection } from './home/TestimonialSection';
import { FAQSection } from './home/FAQSection';
import { CTASection } from './home/CTASection';

export const Home = () => {
  return (
    <div className="w-full bg-white">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Past Corporate Recruiters (60+ Top-Notch Corporates) */}
      <CorporateRecruitersSection />

      {/* 3. Pan-India Presence Today (Regional & Virtual Campus Cards) */}
      <PanIndiaPresenceSection />

      {/* 4. Trust Stats & Placement Metrics */}
      <TrustStats />

      {/* 5. About & In-Depth Service Offerings */}
      <AboutSection />
      <JourneyTimelineSection />
      <ServicesSection />
      <ExpertiseSection />
      <ProcessSection />
      <CandidateSection />
      <EmployerSection />
      <TestimonialSection />
      <FAQSection />
      <CTASection />
    </div>
  );
};
