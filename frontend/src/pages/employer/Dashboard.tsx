import React from 'react';
import { Building, Users, FileText, Settings, Bell, PlusCircle, Briefcase, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';

export const EmployerDashboard = () => {
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
              <h3 className="font-bold text-text">TechCorp Inc.</h3>
              <p className="text-xs text-gray-500">Employer Account</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link to="/employer/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-blue-50 text-primary">
              <BarChart2 size={18} /> Dashboard
            </Link>
            <Link to="/employer/jobs" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Briefcase size={18} /> Manage Jobs
            </Link>
            <Link to="/employer/candidates" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Users size={18} /> Candidates
            </Link>
            <Link to="/employer/billing" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <FileText size={18} /> Billing & Plans
            </Link>
            <Link to="/employer/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Settings size={18} /> Company Profile
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-text">Employer Dashboard</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle size={18} /> Post a New Job
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm font-medium">Active Jobs</p>
              <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><Briefcase size={20} /></div>
            </div>
            <h3 className="text-3xl font-bold text-text">5</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm font-medium">Total Applicants</p>
              <div className="bg-green-50 text-green-600 p-2 rounded-lg"><Users size={20} /></div>
            </div>
            <h3 className="text-3xl font-bold text-text">142</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm font-medium">Shortlisted</p>
              <div className="bg-amber-50 text-amber-600 p-2 rounded-lg"><FileText size={20} /></div>
            </div>
            <h3 className="text-3xl font-bold text-text">18</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-500 text-sm font-medium">Profile Views</p>
              <div className="bg-purple-50 text-purple-600 p-2 rounded-lg"><Building size={20} /></div>
            </div>
            <h3 className="text-3xl font-bold text-text">892</h3>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-text">Recent Job Postings</h2>
                <Link to="/employer/jobs" className="text-sm text-primary font-medium hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-sm text-gray-500">
                      <th className="pb-3 font-medium">Job Title</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Applicants</th>
                      <th className="pb-3 font-medium">Posted</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-text">Senior Backend Engineer</td>
                      <td className="py-4"><span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full font-medium">Active</span></td>
                      <td className="py-4 text-gray-600">45</td>
                      <td className="py-4 text-gray-500 text-sm">2 days ago</td>
                    </tr>
                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-text">Product Designer</td>
                      <td className="py-4"><span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full font-medium">Active</span></td>
                      <td className="py-4 text-gray-600">32</td>
                      <td className="py-4 text-gray-500 text-sm">5 days ago</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-text">Marketing Manager</td>
                      <td className="py-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-full font-medium">Closed</span></td>
                      <td className="py-4 text-gray-600">65</td>
                      <td className="py-4 text-gray-500 text-sm">2 weeks ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-text mb-4">Recent Notifications</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                    <Users size={14} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800"><span className="font-semibold">Sarah Jenkins</span> applied for Senior Backend Engineer.</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-1">
                    <FileText size={14} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Your job <span className="font-semibold">Product Designer</span> is performing well. 30+ views today.</p>
                    <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-1">
                    <Bell size={14} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">Subscription renewing in 3 days.</p>
                    <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                  </div>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/employer/notifications" className="text-sm text-primary font-medium hover:underline flex items-center justify-center">
                  View all notifications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
