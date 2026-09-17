import React, { useEffect, useState } from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import api from '../../services/api';
import { Download, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../../components/Button';
import { getResumeUrl } from '../../utils/urlHelper';

export const EmployerApplications = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/employer');
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'reviewed': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Clock size={12}/> Reviewed</span>;
      case 'shortlisted': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><CheckCircle size={12}/> Shortlisted</span>;
      case 'rejected': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><XCircle size={12}/> Rejected</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Clock size={12}/> Pending</span>;
    }
  };

  return (
    <EmployerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <p className="text-gray-500 mt-1">Review and manage applications received for your job postings.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500 bg-gray-50">
                <th className="px-4 py-3 font-medium">Applicant</th>
                <th className="px-4 py-3 font-medium">Job Title</th>
                <th className="px-4 py-3 font-medium">Applied On</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">Loading applications...</td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">No applications received yet.</td></tr>
              ) : (
                applications.map(app => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{app.candidate?.firstName} {app.candidate?.lastName}</div>
                      <div className="text-xs text-gray-500">{app.candidate?.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-700 font-medium">{app.job?.title}</div>
                      <div className="text-xs text-gray-500">{app.job?.location}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {app.resumeUrl ? (
                        <a href={getResumeUrl(app.resumeUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                          <FileText size={16} /> View
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">No Resume</span>
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
