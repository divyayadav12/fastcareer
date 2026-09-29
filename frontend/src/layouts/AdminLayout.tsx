import React from 'react';
import { Building, Users, FileText, Settings, Briefcase, BarChart2, Database, ClipboardList, Award, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClass = (path: string) => {
    return `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive(path)
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 h-auto md:min-h-[calc(100vh-64px)] shadow-sm z-10">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <Shield size={20} />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-slate-900 truncate">
                {user?.firstName ? `${user.firstName} (Admin)` : 'FAST Admin'}
              </h3>
              <p className="text-xs text-indigo-600 font-medium">Administrator</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link to="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
              <Users size={18} /> Candidates Database
            </Link>
            <Link to="/admin/test-results" className={getLinkClass('/admin/test-results')}>
              <Award size={18} className="text-amber-500" /> Assessment Results
            </Link>
            <Link to="/admin/add-company" className={getLinkClass('/admin/add-company')}>
              <Building size={18} /> Manage Companies
            </Link>
            <Link to="/admin/applications" className={getLinkClass('/admin/applications')}>
              <ClipboardList size={18} /> Shared Applications
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
