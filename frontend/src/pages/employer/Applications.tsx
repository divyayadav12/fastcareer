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
  Eye,
  Trash2
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      toast.success(`Application status updated to "${newStatus}"!`);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update application status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteApplication = async (appId: string, applicantName: string) => {
    if (!window.confirm(`Are you sure you want to delete the application from ${applicantName}?`)) {
      return;
    }
    setDeletingId(appId);
    try {
      await api.delete(`/applications/${appId}`);
      toast.success('Application removed successfully!');
      setApplications(prev => prev.filter(app => app._id !== appId));
    } catch (err) {
      console.error('Failed to delete application:', err);
      toast.error('Failed to delete application.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCleanupTestJobs = async () => {
    try {
      const res = await api.post('/jobs/cleanup-test-jobs');
      toast.success(res.data?.message || 'Cleaned up test jobs successfully!');
      fetchApplications();
    } catch (err) {
      console.error('Cleanup error:', err);
      toast.error('Failed to clean up test jobs.');
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

  const isJunkJob = (job?: any) => {
    if (!job) return true;
    const title = (job.title || '').trim().toLowerCase();
    const company = (job.company || '').trim().toLowerCase();
    return ['fdg', 'new', 'nj', 'test', 'demo', 'asdf', 'xyz'].includes(title) ||
           ['fdg', 'new', 'nj', 'test', 'demo', 'asdf', 'xyz'].includes(company);
  };

  const filteredApplications = applications.filter(app => {
    // 1. Omit junk test jobs and orphan applicants with no candidate details
    if (!app.candidate) return false;
    if (isJunkJob(app.job)) return false;

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
          <p className="text-gray-500 mt-1">Review and manage candidate applications received across all job postings.</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleCleanupTestJobs}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors shadow-2xs cursor-pointer"
            title="Clean test jobs and orphan applications"
          >
            <Trash2 size={14} />
            Clean Test Jobs
          </button>
          <button
            onClick={fetchApplications}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-primary' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Received</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{filteredApplications.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="text-xs font-bold text-amber-500 uppercase tracking-wider">Applied / Pending</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {filteredApplications.filter(a => !a.status || a.status === 'applied').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Shortlisted</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {filteredApplications.filter(a => a.status === 'shortlisted' || a.status === 'interviewed').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="text-xs font-bold text-green-600 uppercase tracking-wider">Hired</div>
          <div className="text-2xl font-black text-green-600 mt-1">
            {filteredApplications.filter(a => a.status === 'hired').length}
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
            <option value="all">All Statuses ({filteredApplications.length})</option>
            <option value="applied">Applied / Pending</option>
            <option value="reviewing">Under Review</option>
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
                <th className="px-5 py-4">Applicant</th>
                <th className="px-5 py-4">Applied Job Role</th>
                <th className="px-5 py-4">Applied Date</th>
                <th className="px-5 py-4">Status & Update</th>
                <th className="px-5 py-4 text-right">Actions & Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                    Loading candidate applications...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-800 mb-1">
                      {applications.length === 0 ? 'No applications received yet' : 'No matching applications found'}
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
                  const applicantFullName = `${candidate.firstName || 'Candidate'} ${candidate.lastName || ''}`.trim();
                  const currentStatus = (app.status || 'applied').toLowerCase();

                  return (
                    <tr key={app._id} className="hover:bg-gray-50/80 transition-colors">
                      {/* 1. Applicant Details */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-gray-900 text-sm">
                          {applicantFullName}
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

                      {/* 4. Status Update Dropdown */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={app.status || 'applied'}
                            disabled={updatingId === app._id}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className={`font-semibold text-xs px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none transition-all shadow-2xs ${
                              currentStatus === 'hired' ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100' :
                              currentStatus === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' :
                              currentStatus === 'interviewed' ? 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100' :
                              currentStatus === 'reviewing' ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100' :
                              currentStatus === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100' :
                              'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                            }`}
                          >
                            <option value="applied">⏰ Applied / Pending</option>
                            <option value="reviewing">🔍 Under Review</option>
                            <option value="shortlisted">⭐ Shortlisted</option>
                            <option value="interviewed">🎙️ Interviewed</option>
                            <option value="hired">🎉 Hired</option>
                            <option value="rejected">❌ Rejected</option>
                          </select>
                          {updatingId === app._id && (
                            <RefreshCw size={12} className="animate-spin text-primary" />
                          )}
                        </div>
                      </td>

                      {/* 5. Actions & Resume */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {app.coverLetter && (
                            <button
                              onClick={() => setSelectedCoverLetter({
                                applicant: applicantFullName,
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

                          {/* Delete Application Button */}
                          <button
                            onClick={() => handleDeleteApplication(app._id, applicantFullName)}
                            disabled={deletingId === app._id}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100 disabled:opacity-50"
                            title="Delete Application"
                          >
                            <Trash2 size={15} className={deletingId === app._id ? 'animate-pulse text-red-500' : ''} />
                          </button>
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
