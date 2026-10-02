import React, { useEffect, useState, useRef } from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { AdminLayout } from '../../layouts/AdminLayout';
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
  Trash2,
  Building2,
  User,
  Check,
  CheckSquare,
  Square,
  Calendar,
  MapPin,
  Award,
  Filter,
  UploadCloud,
  FileSpreadsheet,
  Star,
  Users,
  CheckCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getResumeUrl } from '../../utils/urlHelper';
import { fetchCandidateResumeBlob, viewCandidateResume } from '../../utils/clientPdfGenerator';

interface Employer {
  _id: string;
  companyName?: string;
  firstName: string;
  lastName?: string;
  email: string;
}

export const EmployerApplications = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<any[]>([]);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<{ applicant: string; text: string } | null>(null);

  // Admin Sharing & Multi-select State
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [selectedEmployerId, setSelectedEmployerId] = useState<string>('');
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>('');
  const [sharing, setSharing] = useState(false);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // Unique company names for Dropdown 1
  const uniqueCompanyNames = Array.from(
    new Set(
      employers
        .map(emp => (emp.companyName || `${emp.firstName || ''} ${emp.lastName || ''}`).trim())
        .filter(Boolean)
    )
  ).sort();

  // Filter employers for Dropdowns 2 & 3 based on selected company name
  const filteredHRsForCompany = selectedCompanyName
    ? employers.filter(emp => {
        const cName = (emp.companyName || `${emp.firstName || ''} ${emp.lastName || ''}`).trim();
        return cName.toLowerCase() === selectedCompanyName.toLowerCase();
      })
    : employers;

  const handleSelectCompanyName = (cName: string) => {
    setSelectedCompanyName(cName);
    if (!cName) return;

    const matchingEmps = employers.filter(emp => {
      const name = (emp.companyName || `${emp.firstName || ''} ${emp.lastName || ''}`).trim();
      return name.toLowerCase() === cName.toLowerCase();
    });

    if (matchingEmps.length > 0) {
      setSelectedEmployerId(matchingEmps[0]._id);
    }
  };

  const handleSelectHROrEmail = (empId: string) => {
    if (!empId) return;
    setSelectedEmployerId(empId);
    const emp = employers.find(e => e._id === empId);
    if (emp) {
      const cName = (emp.companyName || `${emp.firstName || ''} ${emp.lastName || ''}`).trim();
      setSelectedCompanyName(cName);
    }
  };

  // Excel Matching States
  const [isExcelMode, setIsExcelMode] = useState(false);
  const [excelFileName, setExcelFileName] = useState('');
  const [matchedEmails, setMatchedEmails] = useState<Set<string>>(new Set());
  const [excelStats, setExcelStats] = useState<{
    totalEmails: number;
    matchedCandidates: number;
    resumesAvailable: number;
    resumesUnavailable: number;
    notFound: number;
  } | null>(null);
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rich Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [caQualificationFilter, setCaQualificationFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      toast.error('Please upload a valid Excel file (.xlsx or .xls).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsProcessingExcel(true);
    setProcessingStep('Uploading Excel...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post(
        '/users/candidates/match-excel',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = res.data;
      setIsExcelMode(true);
      setExcelFileName(file.name);
      setExcelStats({
        totalEmails: data.totalEmails,
        matchedCandidates: data.matchedCandidates,
        resumesAvailable: data.resumesAvailable,
        resumesUnavailable: data.resumesUnavailable,
        notFound: data.notFound,
      });

      const emailSet = new Set<string>(
        (data.candidates || []).map((c: any) => c.email.toLowerCase())
      );
      setMatchedEmails(emailSet);

      toast.success(
        `${data.matchedCandidates} candidates matched from Excel!`
      );
    } catch (err: any) {
      console.error('Error matching Excel file:', err);
      const msg = err.response?.data?.message || 'Failed to match candidates from Excel file.';
      toast.error(msg);
    } finally {
      setIsProcessingExcel(false);
      setProcessingStep('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearExcelMode = () => {
    setIsExcelMode(false);
    setExcelFileName('');
    setExcelStats(null);
    setMatchedEmails(new Set());
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Returned to full applications list.');
  };

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

  const fetchEmployers = async () => {
    try {
      const res = await api.get('/users/employers');
      const empList = res.data || [];
      setEmployers(empList);
      if (empList.length > 0 && !selectedEmployerId) {
        setSelectedEmployerId(empList[0]._id);
      }
    } catch (err) {
      console.error('Error fetching employers:', err);
    }
  };

  const isAdminOrStaff = user?.role === 'admin' || user?.role === 'employee';

  useEffect(() => {
    fetchApplications();
    if (isAdminOrStaff) {
      fetchEmployers();
    }
  }, [user]);

  // Currently selected employer object for 3 synced dropdowns
  const selectedEmployer = employers.find(e => e._id === selectedEmployerId) || employers[0];

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

  const handleCompanyStatusChange = async (appId: string, candidateId: string, newCompanyStatus: string) => {
    setUpdatingId(appId);
    try {
      await api.put('/applications/company-status', {
        applicationId: appId,
        candidateId: candidateId,
        companyStatus: newCompanyStatus
      });
      setApplications(prev => prev.map(app => app._id === appId ? { ...app, companyStatus: newCompanyStatus } : app));
      toast.success(`Company status updated to "${newCompanyStatus}"!`);
    } catch (err) {
      console.error('Failed to update company status:', err);
      toast.error('Failed to update company status.');
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

  // Admin Share Candidates to Registered Company
  const handleShareWithCompany = async (action: 'assign' | 'unassign') => {
    if (selectedAppIds.length === 0) {
      toast.error('Please select candidate applications using the checkboxes first.');
      return;
    }
    if (!selectedEmployerId) {
      toast.error('Please select a registered company from the dropdown.');
      return;
    }

    const companyTitle = selectedEmployer?.companyName || selectedEmployer?.firstName || 'selected company';
    setSharing(true);

    try {
      // Find candidate IDs corresponding to selected applications
      const selectedApps = applications.filter(a => selectedAppIds.includes(a._id));
      const candidateIds = Array.from(
        new Set(selectedApps.map(a => a.candidate?._id).filter(Boolean))
      );

      if (candidateIds.length > 0) {
        await api.put('/users/candidates/assign-company', {
          candidateIds,
          employerId: selectedEmployerId,
          action,
        });
      }

      await api.put('/applications/share', {
        applicationIds: selectedAppIds,
      });

      toast.success(
        action === 'assign'
          ? `Successfully shared ${selectedAppIds.length} candidate application(s) with ${companyTitle}!`
          : `Removed access for ${selectedAppIds.length} candidate(s) from ${companyTitle}.`
      );

      setSelectedAppIds([]);
      fetchApplications();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to share applications with company.');
    } finally {
      setSharing(false);
    }
  };

  // Multi-select Handlers
  const toggleSelectApp = (id: string) => {
    setSelectedAppIds(prev =>
      prev.includes(id) ? prev.filter(aId => aId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAppIds.length === filteredApplications.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(filteredApplications.map(a => a._id));
    }
  };

  const selectTop20 = () => {
    const top20Ids = filteredApplications.slice(0, 20).map(a => a._id);
    setSelectedAppIds(top20Ids);
    toast.success(`Selected top ${top20Ids.length} candidate application(s)!`);
  };

  const selectAllFiltered = () => {
    const allIds = filteredApplications.map(a => a._id);
    setSelectedAppIds(allIds);
    toast.success(`Selected all ${allIds.length} candidate application(s)!`);
  };

  const clearSelection = () => {
    setSelectedAppIds([]);
    toast.success('Selection cleared.');
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedAppIds.length === 0) {
      toast.error('Please select candidate applications using checkboxes or quick selection first.');
      return;
    }
    setBulkUpdating(true);
    try {
      const res = await api.put('/applications/bulk-status', {
        applicationIds: selectedAppIds,
        status: newStatus
      });
      setApplications(prev => prev.map(app => 
        selectedAppIds.includes(app._id) ? { ...app, status: newStatus } : app
      ));
      toast.success(res.data?.message || `Updated Admin Status to "${newStatus}" for ${selectedAppIds.length} candidate(s)!`);
    } catch (err: any) {
      console.error('Failed to bulk update status:', err);
      toast.error(err.response?.data?.message || 'Failed to update candidate statuses.');
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleBulkCompanyStatusChange = async (newCompanyStatus: string) => {
    if (selectedAppIds.length === 0) {
      toast.error('Please select candidate applications using checkboxes or quick selection first.');
      return;
    }
    setBulkUpdating(true);
    try {
      const res = await api.put('/applications/bulk-status', {
        applicationIds: selectedAppIds,
        companyStatus: newCompanyStatus
      });
      setApplications(prev => prev.map(app => 
        selectedAppIds.includes(app._id) ? { ...app, companyStatus: newCompanyStatus } : app
      ));
      toast.success(res.data?.message || `Updated Company Status to "${newCompanyStatus}" for ${selectedAppIds.length} candidate(s)!`);
    } catch (err: any) {
      console.error('Failed to bulk update company status:', err);
      toast.error(err.response?.data?.message || 'Failed to update company statuses.');
    } finally {
      setBulkUpdating(false);
    }
  };

  const getCandidatePhone = (candidate: any) => {
    return candidate?.phone || candidate?.personalDetails?.phone || candidate?.personalDetails?.alternatePhone || '';
  };

  const getCandidateCity = (candidate: any) => {
    return candidate?.personalDetails?.currentCity || candidate?.personalDetails?.permanentCity || '';
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

  // Extract unique cities for filter dropdown
  const uniqueCities = Array.from(
    new Set(
      applications
        .map(a => a.candidate?.personalDetails?.currentCity?.trim())
        .filter(Boolean) as string[]
    )
  ).sort();

  // Filter logic
  const filteredApplications = applications.filter(app => {
    if (!app.candidate) return false;
    if (isJunkJob(app.job)) return false;

    const candidateName = `${app.candidate?.firstName || ''} ${app.candidate?.lastName || ''}`.toLowerCase();
    const candidateEmail = (app.candidate?.email || '').toLowerCase();
    const candidatePhone = getCandidatePhone(app.candidate);
    const candidateCity = getCandidateCity(app.candidate).toLowerCase();
    const jobTitle = (app.job?.title || '').toLowerCase();
    const jobCompany = (app.job?.company || '').toLowerCase();
    const q = searchTerm.toLowerCase();

    // 1. Search matching
    const matchesSearch = 
      candidateName.includes(q) ||
      candidateEmail.includes(q) ||
      candidatePhone.includes(q) ||
      jobTitle.includes(q) ||
      jobCompany.includes(q);

    // 2. Status matching
    const matchesStatus = statusFilter === 'all' || (app.status || 'applied').toLowerCase() === statusFilter.toLowerCase();

    // 3. City matching
    const matchesCity = cityFilter === 'all' || candidateCity === cityFilter.toLowerCase();

    // 4. CA Qualification matching
    let matchesCA = true;
    const ca = app.candidate?.caPortfolio;
    if (caQualificationFilter === 'ca_final') {
      matchesCA = !!(ca?.caFinal?.group1Attempts || ca?.caFinal?.group2Attempts || ca?.caFinal?.bothGroups1stAttempt);
    } else if (caQualificationFilter === 'ca_inter') {
      matchesCA = !!(ca?.caInter?.group1Attempts || ca?.caInter?.group2Attempts || ca?.caInter?.bothGroups1stAttempt);
    } else if (caQualificationFilter === 'ranker') {
      matchesCA = !!(ca?.caFinal?.ranker || ca?.caInter?.ranker);
    } else if (caQualificationFilter === 'both_groups_1st') {
      matchesCA = !!(ca?.caFinal?.bothGroups1stAttempt || ca?.caInter?.bothGroups1stAttempt);
    }

    // 5. Date matching
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const appDate = new Date(app.appliedAt || app.createdAt).getTime();
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (dateFilter === 'today') {
        matchesDate = (now - appDate) <= oneDay;
      } else if (dateFilter === 'last_7_days') {
        matchesDate = (now - appDate) <= (7 * oneDay);
      } else if (dateFilter === 'last_30_days') {
        matchesDate = (now - appDate) <= (30 * oneDay);
      }
    }

    // 6. Excel email matching
    const matchesExcel = !isExcelMode || matchedEmails.has(candidateEmail);

    return matchesSearch && matchesStatus && matchesCity && matchesCA && matchesDate && matchesExcel;
  });

  const Layout = isAdminOrStaff ? AdminLayout : EmployerLayout;

  return (
    <Layout>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleExcelUpload}
        accept=".xlsx, .xls"
        className="hidden"
      />

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="text-indigo-600" /> 
            {isAdminOrStaff ? 'Job Applications & Applied Candidates' : 'Forwarded Candidate Applications'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAdminOrStaff 
              ? 'Full roster of candidates who applied for jobs. Review details, filter by job/location/CA status, match Excel sheets, and forward profiles to registered companies.' 
              : 'Review candidates shared with your company and update hiring statuses.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-50"
            title="Upload Excel with candidate emails (.xlsx, .xls)"
          >
            <UploadCloud size={14} /> {isProcessingExcel ? (processingStep || 'Processing...') : 'Upload Excel Match'}
          </button>

          {isAdminOrStaff && (
            <>
              <button
                onClick={handleCleanupTestJobs}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 size={14} /> Clean Test Jobs
              </button>
              <button
                onClick={fetchApplications}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw size={14} /> Refresh List
              </button>
            </>
          )}
        </div>
      </div>

      {/* Excel Matching Summary Banner */}
      {isExcelMode && excelStats && (
        <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm mb-6 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                  Excel Match Results
                  <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full">
                    {excelFileName}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Showing only candidate applications whose email matches the uploaded Excel sheet.
                </p>
              </div>
            </div>
            <button
              onClick={clearExcelMode}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors self-start sm:self-auto cursor-pointer"
            >
              <X size={16} /> Reset / Show All Applications
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
            <div className="bg-white border border-gray-200 p-3.5 rounded-xl shadow-2xs">
              <p className="text-xs font-medium text-gray-500">Total Emails</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{excelStats.totalEmails}</p>
            </div>
            <div className="bg-white border border-green-200 p-3.5 rounded-xl shadow-2xs bg-green-50/20">
              <p className="text-xs font-medium text-green-700">Matched Candidates</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{excelStats.matchedCandidates}</p>
            </div>
            <div className="bg-white border border-emerald-200 p-3.5 rounded-xl shadow-2xs bg-emerald-50/20">
              <p className="text-xs font-medium text-emerald-700">Resumes Available</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{excelStats.resumesAvailable}</p>
            </div>
            <div className="bg-white border border-amber-200 p-3.5 rounded-xl shadow-2xs bg-amber-50/20">
              <p className="text-xs font-medium text-amber-700">Resume Not Available</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">{excelStats.resumesUnavailable}</p>
            </div>
            <div className="bg-white border border-gray-200 p-3.5 rounded-xl shadow-2xs bg-gray-50/50 col-span-2 sm:col-span-1">
              <p className="text-xs font-medium text-gray-500">Not Found</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{excelStats.notFound}</p>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN CONTROL PANEL: 3 Linked Dropdowns to Share Candidates with Registered Companies */}
      {isAdminOrStaff && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md mb-6 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                <Building size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Share Selected Candidates with Registered Company</h3>
                <p className="text-xs text-slate-400">Select candidate applications below and grant access to a company</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg">
                {selectedAppIds.length} Application(s) Selected
              </span>
            </div>
          </div>

          {/* 3 Linked Dropdowns of Registered Companies from Database */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Dropdown 1: Registered Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Building size={14} className="text-indigo-400" /> 1. Registered Company Name
              </label>
              <select
                value={selectedCompanyName}
                onChange={(e) => handleSelectCompanyName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">-- Select Company Name --</option>
                {uniqueCompanyNames.map(cName => (
                  <option key={cName} value={cName}>
                    {cName}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown 2: HR Representative Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <User size={14} className="text-indigo-400" /> 2. HR Representative
              </label>
              <select
                value={selectedEmployerId}
                onChange={(e) => handleSelectHROrEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">
                  {selectedCompanyName ? `-- HRs of ${selectedCompanyName} --` : '-- Select HR Representative --'}
                </option>
                {filteredHRsForCompany.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName || ''} ({emp.companyName || 'Company'})
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown 3: Company Login Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Mail size={14} className="text-indigo-400" /> 3. Company Email
              </label>
              <select
                value={selectedEmployerId}
                onChange={(e) => handleSelectHROrEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">
                  {selectedCompanyName ? `-- Emails of ${selectedCompanyName} --` : '-- Select Company Email --'}
                </option>
                {filteredHRsForCompany.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              Selected Target Company: <span className="font-bold text-white">{selectedEmployer?.companyName || selectedEmployer?.firstName || 'None'}</span> ({selectedEmployer?.email || 'N/A'})
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleShareWithCompany('assign')}
                disabled={sharing || selectedAppIds.length === 0}
                className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                  selectedAppIds.length === 0 ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                <Check size={16} /> Grant Access ({selectedAppIds.length})
              </button>

              <button
                onClick={() => handleShareWithCompany('unassign')}
                disabled={sharing || selectedAppIds.length === 0}
                className={`px-4 py-2.5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedAppIds.length === 0 ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-rose-600/80 hover:bg-rose-600'
                }`}
              >
                <X size={16} /> Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RICH FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-600 uppercase tracking-wider">
          <Filter size={14} className="text-indigo-600" /> Advanced Candidate Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search candidate, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 w-full border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            />
          </div>

          {/* City Filter */}
          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-700"
            >
              <option value="all">All Cities / Locations ({uniqueCities.length})</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* CA Qualification Filter */}
          <div>
            <select
              value={caQualificationFilter}
              onChange={(e) => setCaQualificationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-700 font-medium"
            >
              <option value="all">All CA Qualifications</option>
              <option value="ca_final">CA Final</option>
              <option value="ca_inter">CA Inter</option>
              <option value="ranker">Rankers Only (AIR)</option>
              <option value="both_groups_1st">Both Groups 1st Attempt</option>
            </select>
          </div>

          {/* Applied Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-700"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-700 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied / Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* QUICK SELECTION & BULK ACTIONS TOOLBAR */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md mb-6 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Quick Select Helpers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <CheckCheck size={16} className="text-indigo-400" /> Quick Selection:
          </span>
          <button
            onClick={selectTop20}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Select the first 20 candidates in current list"
          >
            ⚡ Select Top 20 Candidates
          </button>
          <button
            onClick={selectAllFiltered}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Select All ({filteredApplications.length})
          </button>
          {selectedAppIds.length > 0 && (
            <button
              onClick={clearSelection}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
            >
              Clear Selection ({selectedAppIds.length})
            </button>
          )}
        </div>

        {/* Right Side: Bulk Status Change Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleBulkStatusChange('shortlisted')}
            disabled={bulkUpdating || selectedAppIds.length === 0}
            className={`px-4 py-2 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
              selectedAppIds.length === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95'
            }`}
            title="Bulk shortlist all selected candidates with 1 click"
          >
            <Star size={15} className="fill-slate-950 text-slate-950" /> ⭐ Bulk Shortlist ({selectedAppIds.length})
          </button>

          {/* Bulk Admin Status Dropdown */}
          {isAdminOrStaff && (
            <select
              disabled={bulkUpdating || selectedAppIds.length === 0}
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkStatusChange(e.target.value);
                  e.target.value = '';
                }
              }}
              className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer disabled:opacity-50"
            >
              <option value="">-- Bulk Admin Status ({selectedAppIds.length}) --</option>
              <option value="applied">Applied / Pending</option>
              <option value="shortlisted">⭐ Shortlisted</option>
              <option value="hired">🎉 Hired</option>
              <option value="rejected">🚫 Rejected</option>
            </select>
          )}

          {/* Bulk Company Status Dropdown */}
          <select
            disabled={bulkUpdating || selectedAppIds.length === 0}
            onChange={(e) => {
              if (e.target.value) {
                handleBulkCompanyStatusChange(e.target.value);
                e.target.value = '';
              }
            }}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer disabled:opacity-50"
          >
            <option value="">-- Bulk Company Status ({selectedAppIds.length}) --</option>
            <option value="CV View">👁️ CV View</option>
            <option value="CV Rejected">❌ CV Rejected</option>
            <option value="Shortlisted for Round 1">⭐ Shortlisted for Round 1</option>
            <option value="Shortlisted for Round 2">⭐⭐ Shortlisted for Round 2</option>
            <option value="Shortlisted for Round 3">🌟 Shortlisted for Round 3</option>
            <option value="Selected">🎉 Selected</option>
            <option value="Rejected">🚫 Rejected</option>
          </select>
        </div>
      </div>

      {/* APPLICANTS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                {isAdminOrStaff && (
                  <th className="px-4 py-4 w-12 text-center">
                    <button onClick={toggleSelectAll} className="cursor-pointer text-slate-400 hover:text-slate-600">
                      {selectedAppIds.length > 0 && selectedAppIds.length === filteredApplications.length ? (
                        <CheckSquare className="text-indigo-600" size={18} />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </th>
                )}
                <th className="px-6 py-4 font-semibold">Applicant</th>
                <th className="px-6 py-4 font-semibold">Job / Position</th>
                <th className="px-6 py-4 font-semibold">City & Qualification</th>
                <th className="px-6 py-4 font-semibold">Applied Date</th>
                {isAdminOrStaff && <th className="px-6 py-4 font-semibold">Permitted Companies</th>}
                {isAdminOrStaff ? (
                  <>
                    <th className="px-6 py-4 font-semibold">Admin Status</th>
                    <th className="px-6 py-4 font-semibold">Company Status</th>
                  </>
                ) : (
                  <th className="px-6 py-4 font-semibold">Company Status</th>
                )}
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={isAdminOrStaff ? 9 : 6} className="px-6 py-12 text-center text-slate-500">
                    Loading applications...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={isAdminOrStaff ? 9 : 6} className="px-6 py-16 text-center text-slate-500">
                    No candidate applications match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredApplications.map(app => {
                  const isSelected = selectedAppIds.includes(app._id);
                  const candidate = app.candidate;
                  const phone = getCandidatePhone(candidate);
                  const city = getCandidateCity(candidate);
                  const qual = getCandidateQualification(candidate);
                  const assignedList = candidate?.assignedEmployers || [];

                  return (
                    <tr 
                      key={app._id} 
                      className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-indigo-50/40' : ''}`}
                    >
                      {isAdminOrStaff && (
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => toggleSelectApp(app._id)}
                            className="cursor-pointer text-slate-400 hover:text-slate-600"
                          >
                            {isSelected ? (
                              <CheckSquare className="text-indigo-600" size={18} />
                            ) : (
                              <Square size={18} />
                            )}
                          </button>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{candidate?.firstName} {candidate?.lastName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail size={12} className="text-slate-400" /> {candidate?.email}
                        </div>
                        {phone && (
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone size={12} className="text-slate-400" /> {phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{app.job?.title || 'General Application'}</div>
                        <div className="text-xs text-slate-500">{app.job?.company || 'Fast Careers Partner'}</div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {city && (
                          <div className="flex items-center gap-1 text-slate-600 font-medium mb-0.5">
                            <MapPin size={13} className="text-slate-400" /> {city}
                          </div>
                        )}
                        {qual ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            <GraduationCap size={12} /> {qual}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No CA details</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(app.appliedAt || app.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      {isAdminOrStaff && (
                        <td className="px-6 py-4">
                          {assignedList.length === 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                              Unassigned
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                              {assignedList.map((emp: any) => (
                                <span
                                  key={emp._id}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                                >
                                  <Building size={12} />
                                  {emp.companyName || emp.firstName}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      )}
                      {isAdminOrStaff && (
                        <td className="px-6 py-4">
                          <select
                            value={app.status || 'applied'}
                            disabled={updatingId === app._id}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full outline-none border cursor-pointer ${
                              app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              app.status === 'hired' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              app.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <option value="applied">Applied / Pending</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <select
                          value={app.companyStatus || 'Pending Review'}
                          disabled={updatingId === app._id}
                          onChange={(e) => handleCompanyStatusChange(app._id, candidate?._id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg outline-none border cursor-pointer ${
                            app.companyStatus === 'CV View' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            app.companyStatus === 'CV Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            app.companyStatus === 'Shortlisted for Round 1' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            app.companyStatus === 'Shortlisted for Round 2' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                            app.companyStatus === 'Shortlisted for Round 3' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                            app.companyStatus === 'Selected' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold' :
                            app.companyStatus === 'Rejected' ? 'bg-red-50 text-red-800 border-red-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="Pending Review">-- Pending Review --</option>
                          <option value="CV View">👁️ CV View</option>
                          <option value="CV Rejected">❌ CV Rejected</option>
                          <option value="Shortlisted for Round 1">⭐ Shortlisted for Round 1</option>
                          <option value="Shortlisted for Round 2">⭐⭐ Shortlisted for Round 2</option>
                          <option value="Shortlisted for Round 3">🌟 Shortlisted for Round 3</option>
                          <option value="Selected">🎉 Selected</option>
                          <option value="Rejected">🚫 Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {app.resumeUrl && (
                            <button
                              onClick={() => viewCandidateResume(candidate || { resumeUrl: app.resumeUrl })}
                              className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <Eye size={13} /> CV
                            </button>
                          )}
                          {app.coverLetter && (
                            <button
                              onClick={() => setSelectedCoverLetter({ applicant: `${candidate?.firstName || ''} ${candidate?.lastName || ''}`, text: app.coverLetter })}
                              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <MessageSquare size={13} /> Letter
                            </button>
                          )}
                          {isAdminOrStaff && (
                            <button
                              onClick={() => handleDeleteApplication(app._id, `${candidate?.firstName || ''} ${candidate?.lastName || ''}`)}
                              disabled={deletingId === app._id}
                              title="Delete Application"
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 text-base">Cover Letter: {selectedCoverLetter.applicant}</h3>
              <button onClick={() => setSelectedCoverLetter(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-sans">
              {selectedCoverLetter.text}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedCoverLetter(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
