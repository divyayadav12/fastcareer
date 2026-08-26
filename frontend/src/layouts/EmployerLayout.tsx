import React from 'react';
import { Building, Users, FileText, Settings, Briefcase, BarChart2, Database } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface EmployerLayoutProps {
  children: React.ReactNode;
}

export const EmployerLayout = ({ children }: EmployerLayoutProps) => {
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
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 shrink-0 h-auto md:min-h-[calc(100vh-64px)]">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Building size={24} />
            </div>
            <div>
              <h3 className="font-bold text-text truncate max-w-[150px]">{user?.firstName || 'Employer'}</h3>
              <p className="text-xs text-gray-500">Employer Account</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link to="/employer/dashboard" className={getLinkClass('/employer/dashboard')}>
              <BarChart2 size={18} /> Dashboard
            </Link>
            <Link to="/employer/jobs" className={getLinkClass('/employer/jobs')}>
              <Briefcase size={18} /> Manage Jobs
            </Link>
            <Link to="/employer/candidates" className={getLinkClass('/employer/candidates')}>
              <Users size={18} /> Candidates
            </Link>
            <Link to="/employer/billing" className={getLinkClass('/employer/billing')}>
              <FileText size={18} /> Billing & Plans
            </Link>
            <Link to="/employer/platform-data" className={getLinkClass('/employer/platform-data')}>
              <Database size={18} /> Platform Submissions
            </Link>
            <Link to="/employer/settings" className={getLinkClass('/employer/settings')}>
              <Settings size={18} /> Company Profile
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
};
