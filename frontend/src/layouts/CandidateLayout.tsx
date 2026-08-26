import React from 'react';
import { User, FileText, Bookmark, Settings, Bell, Briefcase, Download, Printer, MessageSquare, Share2, Building, RefreshCw, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface CandidateLayoutProps {
  children: React.ReactNode;
}

export const CandidateLayout = ({ children }: CandidateLayoutProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClass = (path: string) => {
    return `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive(path)
        ? 'bg-blue-50 text-primary'
        : 'text-gray-700 hover:bg-gray-50'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 shrink-0 h-auto md:min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl font-bold uppercase">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h3 className="font-bold text-text truncate max-w-[160px]">{user?.firstName} {user?.lastName}</h3>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Candidate'}</p>
            </div>
          </div>

          <nav className="space-y-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4 px-4">Profile & Jobs</div>
            <Link to="/candidate/dashboard" className={getLinkClass('/candidate/dashboard')}>
              <User size={18} /> Update Profile
            </Link>
            <Link to="/candidate/job-fair" className={getLinkClass('/candidate/job-fair')}>
              <Building size={18} /> Job Fair Available
            </Link>
            <Link to="/candidate/openings" className={getLinkClass('/candidate/openings')}>
              <Briefcase size={18} /> Current Openings
            </Link>
            
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-4">Resume & Downloads</div>
            <Link to="/candidate/resume-downloads" className={getLinkClass('/candidate/resume-downloads')}>
              <Download size={18} /> Resume Downloads
            </Link>
            <Link to="/candidate/resume-print" className={getLinkClass('/candidate/resume-print')}>
              <Printer size={18} /> Resume Print (Site)
            </Link>
            <Link to="/candidate/imp-downloads" className={getLinkClass('/candidate/imp-downloads')}>
              <FileText size={18} /> IMP Downloads
            </Link>
            
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-4">Community & Feedback</div>
            <Link to="/candidate/feedback" className={getLinkClass('/candidate/feedback')}>
              <MessageSquare size={18} /> Feel it Say it
            </Link>
            <Link to="/candidate/refer" className={getLinkClass('/candidate/refer')}>
              <Share2 size={18} /> Refer to a Friend
            </Link>
            <Link to="/candidate/companies" className={getLinkClass('/candidate/companies')}>
              <Building size={18} /> Companies Registered
            </Link>

            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-4">Career Actions</div>
            <Link to="/candidate/change-job" className={getLinkClass('/candidate/change-job')}>
              <RefreshCw size={18} /> Want to Change a Job?
            </Link>
            <Link to="/candidate/share-job" className={getLinkClass('/candidate/share-job')}>
              <Share2 size={18} /> Share Job Opportunities
            </Link>
            <Link to="/candidate/placements" className={getLinkClass('/candidate/placements')}>
              <Clock size={18} /> Placement History
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
