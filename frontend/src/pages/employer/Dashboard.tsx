import React, { useState, useEffect } from 'react';
import { Building, Users, FileText, Briefcase, Download, Eye, CheckCircle2, XCircle, Search, Filter, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { EmployerLayout } from '../../layouts/EmployerLayout';

export const EmployerDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/employer');
      setApplications(res.data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      toast.error('Failed to load candidate profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      toast.success(`Candidate marked as ${newStatus}`);
      setApplications(prev => prev.map(app => app._id === appId ? { ...app, status: newStatus } : app));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredApplications = applications.filter(app => {
    const fullName = `${app.candidate?.firstName || ''} ${app.candidate?.lastName || ''}`.toLowerCase();
    const email = (app.candidate?.email || '').toLowerCase();
    const jobTitle = (app.job?.title || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = fullName.includes(query) || email.includes(query) || jobTitle.includes(query);
    const matchesStatus = statusFilter === 'all' || (app.status || 'applied').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalForwarded = applications.length;
  const shortlistedCount = applications.filter(a => (a.status || '').toLowerCase() === 'shortlisted').length;
  const pendingCount = applications.filter(a => (a.status || 'applied').toLowerCase() === 'applied').length;
  const rejectedCount = applications.filter(a => (a.status || '').toLowerCase() === 'rejected').length;

  return (
    <EmployerLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.companyName || user?.firstName || 'Employer'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Access pre-screened and shortlisted candidate profiles shared with your company.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Forwarded Profiles</p>
            <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl"><Users size={20} /></div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900">{totalForwarded}</h3>
          <p className="text-xs text-gray-400 mt-2">Shared by Fast Careers Admin</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Shortlisted</p>
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl"><CheckCircle2 size={20} /></div>
          </div>
          <h3 className="text-3xl font-extrabold text-emerald-600">{shortlistedCount}</h3>
          <p className="text-xs text-gray-400 mt-2">Marked for interview</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Pending Review</p>
            <div className="bg-amber-50 text-amber-600 p-2 rounded-xl"><Clock size={20} /></div>
          </div>
          <h3 className="text-3xl font-extrabold text-amber-600">{pendingCount}</h3>
          <p className="text-xs text-gray-400 mt-2">Awaiting decision</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Rejected</p>
            <div className="bg-rose-50 text-rose-600 p-2 rounded-xl"><XCircle size={20} /></div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900">{rejectedCount}</h3>
          <p className="text-xs text-gray-400 mt-2">Not suitable</p>
        </div>
      </div>

      {/* Forwarded Candidates Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pre-Screened Candidates For Your Review</h2>
            <p className="text-xs text-gray-500 mt-0.5">Profiles explicitly forwarded to your company by Fast Careers</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search candidate or job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-700"
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied / Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <th className="px-6 py-4 font-semibold">Candidate Info</th>
                <th className="px-6 py-4 font-semibold">Job Position</th>
                <th className="px-6 py-4 font-semibold">Forwarded Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
                <th className="px-6 py-4 font-semibold text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    Loading forwarded candidates...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <Users size={24} />
                      </div>
                      <p className="text-base font-semibold text-gray-800">No candidates forwarded yet</p>
                      <p className="text-xs text-gray-500 max-w-md">
                        Fast Careers administration has not forwarded candidate profiles to this account yet. Once candidates are shared, they will appear right here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map(app => (
                  <tr key={app._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{app.candidate?.firstName} {app.candidate?.lastName}</div>
                      <div className="text-xs text-gray-500">{app.candidate?.email}</div>
                      {app.candidate?.phone && (
                        <div className="text-xs text-gray-400 mt-0.5">{app.candidate.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{app.job?.title || 'General Profile'}</span>
                      {app.job?.department && (
                        <div className="text-xs text-gray-400">{app.job.department}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(app.appliedAt || app.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        app.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {app.status || 'Applied'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStatusChange(app._id, 'shortlisted')}
                          title="Shortlist Candidate"
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg transition-colors"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, 'rejected')}
                          title="Reject Candidate"
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Eye size={14} /> View CV
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No Resume</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </EmployerLayout>
  );
};
