import React, { useEffect, useState } from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import api from '../../services/api';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Phone, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Building, 
  MessageSquare, 
  X, 
  RefreshCw,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getResumeUrl } from '../../utils/urlHelper';
import { viewCandidateResume } from '../../utils/clientPdfGenerator';

export const EmployerApplications = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<{ applicant: string; text: string } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications/employer');
      setApplications(res.data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      toast.error('Could not load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    setUpdatingId(appId);
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApplications(prev => prev.map(app => app._id === appId ? { ...app, status: newStatus } : app));
      toast.success(`Application status updated to ${newStatus}!`);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update application status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || 'applied').toLowerCase();
    switch(s) {
      case 'reviewing':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><Clock size={12}/> Reviewing</span>;
      case 'shortlisted':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><CheckCircle2 size={12}/> Shortlisted</span>;
      case 'interviewed':
        return <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><Briefcase size={12}/> Interviewed</span>;
      case 'hired':
        return <span className="px-2.5 py-1 bg-green-100 text-green-800 border border-green-300 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><CheckCircle2 size={12}/> Hired</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><XCircle size={12}/> Rejected</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><Clock size={12}/> Applied</span>;
    }
  };

  const getCandidatePhone = (candidate: any) => {
    return candidate?.phone || candidate?.personalDetails?.phone || candidate?.personalDetails?.alternatePhone || '';
  };

  const getCandidateQualification = (candidate: any) => {
    if (candidate?.caPortfolio?.caFinal?.group1Attempts || candidate?.caPortfolio?.caFinal?.bothGroups1stAttempt) {
      return candidate?.caPortfolio?.caFinal?.bothGroups1stAttempt ? 'CA Final (Both Grp 1st Att.)' : 'CA Final';
    }
    if (candidate?.caPortfolio?.caInter?.group1Attempts || candidate?.caPortfolio?.caInter?.bothGroups1stAttempt) {
      return 'CA Inter';
    }
    if (candidate?.qualifications?.graduation?.college) {
      return `Graduation (${candidate.qualifications.graduation.yearOfCompletion || 'Completed'})`;
    }
    return '';
  };

  const filteredApplications = applications.filter(app => {
    const candidateName = `${app.candidate?.firstName || ''} ${app.candidate?.lastName || ''}`.toLowerCase();
    const candidateEmail = (app.candidate?.email || '').toLowerCase();
    const candidatePhone = getCandidatePhone(app.candidate);
    const jobTitle = (app.job?.title || '').toLowerCase();
    const jobCompany = (app.job?.company || '').toLowerCase();

    const matchesSearch = 
      candidateName.includes(searchTerm.toLowerCase()) ||
      candidateEmail.includes(searchTerm.toLowerCase()) ||
      candidatePhone.includes(searchTerm) ||
      jobTitle.includes(searchTerm.toLowerCase()) ||
      jobCompany.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || (app.status || 'applied').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <EmployerLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-500 mt-1">Review and manage applications received from candidates across all job postings.</p>
        </div>
        <button
          onClick={fetchApplications}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs self-start md:self-auto cursor-pointer"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin text-primary' : ''} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Received</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{applications.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="text-xs font-bold text-amber-500 uppercase tracking-wider">Pending / Applied</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {applications.filter(a => !a.status || a.status === 'applied').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Shortlisted</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {applications.filter(a => a.status === 'shortlisted' || a.status === 'interviewed').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="text-xs font-bold text-green-600 uppercase tracking-wider">Hired</div>
          <div className="text-2xl font-black text-green-600 mt-1">
            {applications.filter(a => a.status === 'hired').length}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search candidate, job, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500 shrink-0">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="all">All Statuses ({applications.length})</option>
            <option value="applied">Applied / Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewed">Interviewed</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/80">
                <th className="px-5 py-4">Applicant Details</th>
                <th className="px-5 py-4">Applied Job Role</th>
                <th className="px-5 py-4">Applied Date</th>
                <th className="px-5 py-4">Current Status</th>
                <th className="px-5 py-4 text-center">Change Status</th>
                <th className="px-5 py-4 text-right">Actions & Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                    Loading candidate applications...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-800 mb-1">
                      {applications.length === 0 ? 'No applications received yet' : 'No matching applications'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {applications.length === 0
                        ? 'When candidates apply for jobs, their submitted profiles and resumes will appear here.'
                        : 'Try searching with different terms or changing your status filter.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredApplications.map(app => {
                  const candidate = app.candidate || {};
                  const job = app.job || {};
                  const phone = getCandidatePhone(candidate);
                  const qualification = getCandidateQualification(candidate);
                  const resumeUrl = app.resumeUrl || candidate.resumeUrl;

                  return (
                    <tr key={app._id} className="hover:bg-gray-50/80 transition-colors">
                      {/* 1. Applicant Details */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-gray-900 text-sm">
                          {candidate.firstName ? `${candidate.firstName} ${candidate.lastName || ''}` : 'Candidate'}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                          <Mail size={13} className="text-gray-400" />
                          <span>{candidate.email || 'No email provided'}</span>
                        </div>
                        {phone && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                            <Phone size={13} className="text-emerald-500" />
                            <span>{phone}</span>
                          </div>
                        )}
                        {qualification && (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                              <GraduationCap size={12} /> {qualification}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 2. Job Info */}
                      <td className="px-5 py-4">
                        <div className="text-sm text-gray-900 font-bold">
                          {job.title || 'General Application'}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Building size={12} className="text-gray-400" />
                          {job.company || 'Coaching Fast'} • {job.location || 'India'}
                        </div>
                        {job.salaryRange && (
                          <div className="text-xs font-medium text-emerald-600 mt-0.5">
                            {job.salaryRange}
                          </div>
                        )}
                      </td>

                      {/* 3. Applied Date */}
                      <td className="px-5 py-4 text-xs text-gray-600 font-medium">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Recent'}
                      </td>

                      {/* 4. Current Status Badge */}
                      <td className="px-5 py-4">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* 5. Update Status Dropdown */}
                      <td className="px-5 py-4 text-center">
                        <select
                          value={app.status || 'applied'}
                          disabled={updatingId === app._id}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold bg-white text-gray-700 hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-50"
                        >
                          <option value="applied">Applied</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interviewed">Interviewed</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      {/* 6. Actions & Resume */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {app.coverLetter && (
                            <button
                              onClick={() => setSelectedCoverLetter({
                                applicant: `${candidate.firstName || 'Candidate'} ${candidate.lastName || ''}`,
                                text: app.coverLetter
                              })}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                              title="View Cover Letter"
                            >
                              <MessageSquare size={13} /> Letter
                            </button>
                          )}

                          {resumeUrl ? (
                            <a
                              href={getResumeUrl(resumeUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-2xs"
                            >
                              <Eye size={14} /> View CV
                            </a>
                          ) : candidate.resumeUrl ? (
                            <button
                              onClick={() => viewCandidateResume(candidate)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                              <FileText size={14} /> View CV
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No Resume</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cover Letter Modal */}
      {selectedCoverLetter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-base text-gray-900">
                Cover Letter: {selectedCoverLetter.applicant}
              </h3>
              <button
                onClick={() => setSelectedCoverLetter(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-80 overflow-y-auto">
              {selectedCoverLetter.text}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCoverLetter(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </EmployerLayout>
  );
};
