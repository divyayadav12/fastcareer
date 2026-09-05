import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Globe, MessageCircle, Camera } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <img src="/logo.png" alt="FAST CAREERS" className="h-14 mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Since 2008, connecting exceptional professionals with organizations across finance, accounting, compliance, and specialized domains.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Link size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Globe size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Camera size={20} /></a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><RouterLink to="/about" className="hover:text-primary transition-colors">About Us</RouterLink></li>
              <li><RouterLink to="/team" className="hover:text-primary transition-colors">Our Team</RouterLink></li>
              <li><RouterLink to="/services" className="hover:text-primary transition-colors">Services</RouterLink></li>
              <li><RouterLink to="/expertise" className="hover:text-primary transition-colors">Expertise</RouterLink></li>
              <li><RouterLink to="/contact" className="hover:text-primary transition-colors">Contact</RouterLink></li>
            </ul>
          </div>

          {/* Column 3: Candidates */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Candidates</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><RouterLink to="/jobs" className="hover:text-primary transition-colors">Search Jobs</RouterLink></li>
              <li><RouterLink to="/register" className="hover:text-primary transition-colors">Register</RouterLink></li>
              <li><RouterLink to="/login" className="hover:text-primary transition-colors">Login</RouterLink></li>
              <li><RouterLink to="/dashboard/job-alerts" className="hover:text-primary transition-colors">Job Alerts</RouterLink></li>
            </ul>
          </div>

          {/* Column 4: Employers */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Employers</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><RouterLink to="/employers/post" className="hover:text-primary transition-colors">Post Requirement</RouterLink></li>
              <li><RouterLink to="/employers/solutions" className="hover:text-primary transition-colors">Recruitment Solutions</RouterLink></li>
              <li><RouterLink to="/employers/campus" className="hover:text-primary transition-colors">Campus Hiring</RouterLink></li>
              <li><RouterLink to="/employers/login" className="hover:text-primary transition-colors">Employer Login</RouterLink></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} FAST CAREERS. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <RouterLink to="/privacy" className="hover:text-white transition-colors">Privacy Policy</RouterLink>
            <RouterLink to="/terms" className="hover:text-white transition-colors">Terms & Conditions</RouterLink>
            <RouterLink to="/cookie" className="hover:text-white transition-colors">Cookie Policy</RouterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};
