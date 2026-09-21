import React, { useState, useEffect } from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { CheckCircle2, XCircle, Clock, Building2, Briefcase } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../../store';
import axios from 'axios';

export const PlacementHistory = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token') || (user as any)?.token;
        if (token) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/applications/my`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setApplications(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load candidate applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const getStatusDisplay = (status: string) => {
    const s = (status || 'applied').toLowerCase();
    if (s === 'selected' || s === 'hired' || s === 'offer accepted') {
      return {
        label: 'Selected / Offer',
        icon: <CheckCircle2 size={16} className="text-green-600" />,
        bg: 'bg-green-50 border-green-200 text-green-700'
      };
    }
    if (s === 'rejected') {
      return {
        label: 'Rejected',
        icon: <XCircle size={16} className="text-red-600" />,
        bg: 'bg-red-50 border-red-200 text-red-700'
      };
    }
    if (s === 'interview' || s === 'shortlisted') {
      return {
        label: 'Shortlisted / Interview',
        icon: <Clock size={16} className="text-blue-600" />,
        bg: 'bg-blue-50 border-blue-200 text-blue-700'
      };
    }
    return {
      label: 'Application Under Review',
      icon: <Clock size={16} className="text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200 text-amber-700'
    };
  };

  return (
    <CandidateLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">Placement History & Applications</h1>
          <p className="text-gray-500">Track all your applied jobs, interview status, and recruiter responses.</p>
        </div>
        <Link 
          to="/candidate/openings" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm self-start md:self-auto"
        >
          <Briefcase size={16} /> Browse More Openings
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
            Loading your applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="p-16 text-center">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">No Applications Yet</h3>
            <p className="text-gray-500 text-sm mb-6">You have not applied to any jobs yet. Check out the current openings!</p>
            <Link 
              to="/candidate/openings" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
            >
              Explore Openings Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Company & Role</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Date Applied</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Location / Salary</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => {
                  const job = app.job || {};
                  const statusInfo = getStatusDisplay(app.status);

                  return (
                    <tr key={app._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <Building2 size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{job.title || 'Job Opening'}</p>
                            <p className="text-sm text-gray-500">{job.company || 'Confidential'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        <div>{job.location || 'Pan India'}</div>
                        <div className="text-xs text-gray-400">{job.salaryRange || 'Best in Industry'}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${statusInfo.bg}`}>
                          {statusInfo.icon}
                          {statusInfo.label}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CandidateLayout>
  );
};
