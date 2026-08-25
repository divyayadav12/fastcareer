import React from 'react';
import { User, FileText, Bookmark, Settings, Bell, ChevronRight, Briefcase, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CandidateDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 shrink-0 h-auto md:min-h-[calc(100vh-64px)]">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl font-bold">
              JD
            </div>
            <div>
              <h3 className="font-bold text-text">John Doe</h3>
              <p className="text-xs text-gray-500">Candidate</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link to="/candidate/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-blue-50 text-primary">
              <User size={18} /> Profile Overview
            </Link>
            <Link to="/candidate/applications" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Briefcase size={18} /> My Applications
            </Link>
            <Link to="/candidate/saved-jobs" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Bookmark size={18} /> Saved Jobs
            </Link>
            <Link to="/candidate/resume" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <FileText size={18} /> Resume & Documents
            </Link>
            <Link to="/candidate/alerts" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Bell size={18} /> Job Alerts
            </Link>
            <Link to="/candidate/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Settings size={18} /> Account Settings
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-text mb-8">Welcome back, John!</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Applied Jobs</p>
              <h3 className="text-3xl font-bold text-text">12</h3>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <Briefcase size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Saved Jobs</p>
              <h3 className="text-3xl font-bold text-text">4</h3>
            </div>
            <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
              <Bookmark size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Profile Views</p>
              <h3 className="text-3xl font-bold text-text">28</h3>
            </div>
            <div className="bg-green-50 text-green-600 p-3 rounded-xl">
              <User size={24} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-text">Recent Applications</h2>
                <Link to="/candidate/applications" className="text-sm text-primary font-medium hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Briefcase size={20} className="text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-text text-sm">Senior Financial Analyst</h4>
                        <p className="text-xs text-gray-500">Global FinTech Corp • Applied 2 days ago</p>
                      </div>
                    </div>
                    <span className="bg-yellow-50 text-yellow-700 px-3 py-1 text-xs font-medium rounded-full">In Review</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-text mb-4">Profile Completeness</h2>
              <div className="mb-2 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">65% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 line-through">Basic Information</span>
                  <CheckCircle2 size={16} className="text-green-500" />
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 line-through">Education</span>
                  <CheckCircle2 size={16} className="text-green-500" />
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">Upload Resume</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">Add Skills</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
