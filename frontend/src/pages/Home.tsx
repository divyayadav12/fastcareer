import React from 'react';
import { Hero } from './home/Hero';
import { TrustStats } from './home/TrustStats';
import { RecruiterMarquee } from '../components/RecruiterMarquee';
import { AboutSection } from './home/AboutSection';
import { ServicesSection } from './home/ServicesSection';
import { ExpertiseSection } from './home/ExpertiseSection';
import { ProcessSection } from './home/ProcessSection';
import { CandidateSection } from './home/CandidateSection';
import { EmployerSection } from './home/EmployerSection';
import { TestimonialSection } from './home/TestimonialSection';
import { CTASection } from './home/CTASection';

export const Home = () => {
  return (
    <div className="w-full">
      <Hero />
      <TrustStats />
      <RecruiterMarquee />
      <AboutSection />
      <ServicesSection />
      <ExpertiseSection />
      <ProcessSection />
      <CandidateSection />
      <EmployerSection />
      <TestimonialSection />
      <CTASection />
    </div>
  );
};
