import React from 'react';
import { Shield, Users, Building, Briefcase, FileText, Settings, Activity, CheckCircle, XCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white shrink-0 h-auto md:min-h-[calc(100vh-64px)]">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold">FAST Admin</h3>
              <p className="text-xs text-gray-400">Superuser</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-gray-800 text-white">
              <Activity size={18} /> Overview
            </Link>
            <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Users size={18} /> Candidates
            </Link>
            <Link to="/admin/employers" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Building size={18} /> Employers
            </Link>
            <Link to="/admin/jobs" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Briefcase size={18} /> Jobs
            </Link>
            <Link to="/admin/reports" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <FileText size={18} /> Reports
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Settings size={18} /> System Settings
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-text mb-8">Platform Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
              <Users size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-text">14,284</p>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <Activity size={14} /> +12% this month
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Active Employers</h3>
              <Building size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-text">428</p>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <Activity size={14} /> +5% this month
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Live Jobs</h3>
              <Briefcase size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-text">2,145</p>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <Activity size={14} /> +18% this month
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Applications</h3>
              <FileText size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-text">8,932</p>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <Activity size={14} /> +24% this month
            </p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Pending Employer Approvals */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-text">Pending Employer Approvals</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">NextGen Tech</div>
                      <div className="text-sm text-gray-500">nextgen.io</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">mike@nextgen.io</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-3"><CheckCircle size={20} /></button>
                      <button className="text-red-600 hover:text-red-900"><XCircle size={20} /></button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Global Finance Corp</div>
                      <div className="text-sm text-gray-500">gfc.com</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">hr@gfc.com</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-3"><CheckCircle size={20} /></button>
                      <button className="text-red-600 hover:text-red-900"><XCircle size={20} /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent System Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-text">Recent System Activity</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-sm text-gray-800">New candidate registration spike detected.</p>
                  <p className="text-xs text-gray-400 mt-1">10 mins ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                  <Activity size={14} />
                </div>
                <div>
                  <p className="text-sm text-gray-800">High API latency on Job Search endpoint.</p>
                  <p className="text-xs text-gray-400 mt-1">45 mins ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <CheckCircle size={14} />
                </div>
                <div>
                  <p className="text-sm text-gray-800">System backup completed successfully.</p>
                  <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
