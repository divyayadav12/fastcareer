import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { 
  Users, Building2, Download, MapPin, GraduationCap, 
  FileText, Search, PlusCircle, X, Building, Mail, User, UserCheck, FileSpreadsheet,
  Trash2, Phone, Award, CheckCircle2, RefreshCw, Eye
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import api from '../../services/api';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getResumeUrl } from '../../utils/urlHelper';
import { fetchCandidateResumeBlob, viewCandidateResume } from '../../utils/clientPdfGenerator';
import { formatCandidateForExcel, downloadCandidatesExcel } from '../../utils/excelExportHelper';

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  personalDetails?: {
    currentCity?: string;
    currentState?: string;
  };
  qualifications?: {
    graduation?: {
      courseName?: string;
      collegeName?: string;
      yearOfCompletion?: string;
    };
  };
  createdAt: string;
}

interface Employer {
  _id: string;
  companyName?: string;
  firstName: string;
  lastName?: string;
  email: string;
  createdAt?: string;
}

export const AdminDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Company Modal State
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'register' | 'list'>('register');
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    hrName: '',
    email: '',
    password: 'Company@123',
  });
  const [creatingCompany, setCreatingCompany] = useState(false);

  // Industrial Training Applications State
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'candidates' | 'industrial'>(
    searchParams.get('tab') === 'industrial' ? 'industrial' : 'candidates'
  );
  const [isIndustrialModalOpen, setIsIndustrialModalOpen] = useState(false);
  const [industrialList, setIndustrialList] = useState<any[]>([]);
  const [loadingIndustrial, setLoadingIndustrial] = useState(false);
  const [industrialSearch, setIndustrialSearch] = useState('');
  const [industrialBatchFilter, setIndustrialBatchFilter] = useState('');
  const [industrialAttemptFilter, setIndustrialAttemptFilter] = useState('');

  useEffect(() => {
    if (searchParams.get('tab') === 'industrial') {
      setActiveTab('industrial');
    }
  }, [searchParams]);

  const fetchIndustrialApplications = async () => {
    try {
      setLoadingIndustrial(true);
      const res = await api.get('/industrial-training');
      setIndustrialList(res.data?.data || []);
    } catch (e) {
      console.error('Error fetching industrial training applications:', e);
    } finally {
      setLoadingIndustrial(false);
    }
  };

  const handleExportIndustrialExcel = async () => {
    try {
      const res = await api.get('/industrial-training/export', { responseType: 'blob' });
      saveAs(res.data, `Industrial_Training_Candidates_${Date.now()}.xlsx`);
      toast.success('Downloaded Industrial Training Excel Sheet! ✓');
    } catch (e) {
      toast.error('Failed to export Industrial Training spreadsheet.');
    }
  };

  const handleDeleteIndustrial = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete Industrial Training record for "${name}"?`)) return;
    try {
      await api.delete(`/industrial-training/${id}`);
      toast.success('Record deleted successfully.');
      setIndustrialList(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      toast.error('Failed to delete record.');
    }
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/candidates');
      setCandidates(res.data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployers = async () => {
    try {
      const res = await api.get('/users/employers');
      setEmployers(res.data || []);
    } catch (error) {
      console.error('Error fetching employers:', error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchCandidates();
      fetchEmployers();
      fetchIndustrialApplications();
    }
  }, [user]);

  // Create Company Handler (Database Registration)
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyForm.companyName || !companyForm.hrName || !companyForm.email) {
      toast.error('Please fill in Company Name, HR Name, and Login Email.');
      return;
    }

    setCreatingCompany(true);
    try {
      await api.post('/users', {
        companyName: companyForm.companyName,
        firstName: companyForm.hrName,
        lastName: '',
        email: companyForm.email,
        password: companyForm.password || 'Company@123',
        role: 'employer',
      });

      toast.success(`Company "${companyForm.companyName}" registered in Database!`);
      setCompanyForm({ 
        companyName: '',
        hrName: '', 
        email: '', 
        password: 'Company@123' 
      });
      fetchEmployers();
      setActiveModalTab('list');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register company.');
    } finally {
      setCreatingCompany(false);
    }
  };

  // Filter candidates by search query
  const filteredCandidates = candidates.filter(candidate => {
    const fullName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.toLowerCase();
    const email = (candidate.email || '').toLowerCase();
    const city = (candidate.personalDetails?.currentCity || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    return fullName.includes(q) || email.includes(q) || city.includes(q);
  });

  const handleBulkDownload = async () => {
    if (filteredCandidates.length === 0) {
      toast.error('No candidates available to download.');
      return;
    }
    
    setDownloading(true);
    try {
      const zip = new JSZip();
      
      const excelData = filteredCandidates.map(formatCandidateForExcel);

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates Database");
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      zip.file("Candidates_Full_Data.xlsx", excelBuffer);

      const resumesFolder = zip.folder("Resumes");
      if (resumesFolder) {
        const fetchPromises = filteredCandidates.map(async (candidate) => {
          try {
            const blob = await fetchCandidateResumeBlob(candidate);
            const sanitize = (s: string) => s.replace(/[/\\?%*:|"<>]/g, '').trim().replace(/\s+/g, '_');
            const base = `${sanitize(candidate.firstName || 'Candidate')}_${sanitize(candidate.lastName || '')}`.replace(/_+$/, '');
            const fileName = `${base || 'Candidate'}.pdf`;
            resumesFolder.file(fileName, blob);
          } catch (error) {
            console.error(`Failed to fetch resume for ${candidate.firstName}:`, error);
          }
        });
        await Promise.all(fetchPromises);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, "Candidates_Data_and_Resumes.zip");
      toast.success('ZIP package downloaded successfully!');
    } catch (error) {
      console.error('Error generating bulk download:', error);
      toast.error('Failed to generate bulk download.');
    } finally {
      setDownloading(false);
    }
  };

  const handleExportExcel = () => {
    if (filteredCandidates.length === 0) {
      toast.error('No candidates available to export.');
      return;
    }
    try {
      downloadCandidatesExcel(filteredCandidates, 'Candidates_Complete_Data');
      toast.success('Excel spreadsheet downloaded with all candidate fields!');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Failed to export Excel.');
    }
  };

  const filteredIndustrial = industrialList.filter(app => {
    if (industrialBatchFilter && app.caInterBatch !== industrialBatchFilter) return false;
    if (industrialAttemptFilter && app.bothGroups1stAttempt !== industrialAttemptFilter) return false;
    if (!industrialSearch) return true;
    const q = industrialSearch.toLowerCase();
    return (
      (app.name || '').toLowerCase().includes(q) ||
      (app.email || '').toLowerCase().includes(q) ||
      (app.phone || '').toLowerCase().includes(q) ||
      (app.articleshipFirmName || '').toLowerCase().includes(q) ||
      (app.currentLocation || '').toLowerCase().includes(q) ||
      (app.currentState || '').toLowerCase().includes(q) ||
      (app.caInterRank || '').toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="text-indigo-600" /> Candidates Database
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review registered candidates, search profiles, and export resume packages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {user?.role !== 'employee' && (
            <>
              <button
                onClick={() => {
                  setActiveModalTab('register');
                  setIsCompanyModalOpen(true);
                }}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Building2 size={16} /> Register New Company
              </button>

              <Link
                to="/admin/add-employee"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <UserCheck size={16} /> Manage Employees
              </Link>
            </>
          )}

          <button 
            onClick={() => {
              fetchIndustrialApplications();
              setIsIndustrialModalOpen(true);
            }}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-all cursor-pointer"
            title="View CA Industrial Training Applications"
          >
            <GraduationCap size={16} /> Industrial Training {industrialList.length > 0 && `(${industrialList.length})`}
          </button>

          <button 
            onClick={handleExportExcel}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            title="Download Excel spreadsheet with all candidate details"
          >
            <FileSpreadsheet size={16} /> Export Excel
          </button>

          <button 
            onClick={handleBulkDownload}
            disabled={downloading}
            className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              downloading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-xs cursor-pointer'
            }`}
          >
            <Download size={16} /> {downloading ? 'Generating ZIP...' : 'Export ZIP'}
          </button>
        </div>
      </div>

      {/* Quick KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => { setActiveTab('candidates'); setSearchParams({}); }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'candidates'
              ? 'bg-indigo-50/70 border-indigo-500 shadow-sm ring-2 ring-indigo-200'
              : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Registered Candidates</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{candidates.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-2">View Candidates Database →</p>
        </button>

        <button
          onClick={() => { setActiveTab('industrial'); setSearchParams({ tab: 'industrial' }); }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'industrial'
              ? 'bg-amber-50/70 border-amber-500 shadow-sm ring-2 ring-amber-200'
              : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-500">Industrial Training Forms</p>
                <span className="text-[9px] font-black bg-amber-500 text-white px-1.5 py-0.2 rounded-full uppercase">HOT</span>
              </div>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-0.5">{industrialList.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-2">View 16-Field Form Submissions →</p>
        </button>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Registered Companies</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{employers.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 size={20} />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Hiring partner profiles</p>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <button
          onClick={() => { setActiveTab('candidates'); setSearchParams({}); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'candidates'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users size={16} />
          <span>Registered Candidates Database</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
            activeTab === 'candidates' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {candidates.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('industrial'); setSearchParams({ tab: 'industrial' }); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'industrial'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap size={16} />
          <span>CA Industrial Training Form Applications</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
            activeTab === 'industrial' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            {industrialList.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Registered Candidates */}
      {activeTab === 'candidates' && (
        <>
          {/* Search Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search candidates by name, email, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredCandidates.length} of {candidates.length} Registered Candidates
            </div>
          </div>

          {/* Candidates Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-semibold">Candidate</th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-6 py-4 font-semibold">Education</th>
                    <th className="px-6 py-4 font-semibold">Registered On</th>
                    <th className="px-6 py-4 font-semibold text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        Loading candidate database...
                      </td>
                    </tr>
                  ) : filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                        No candidates found.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((candidate) => (
                      <tr key={candidate._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                              {(candidate.firstName?.[0] || 'C')}{(candidate.lastName?.[0] || '')}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{candidate.firstName} {candidate.lastName}</div>
                              <div className="text-xs text-slate-500">{candidate.email}</div>
                              {candidate.phone && <div className="text-xs text-slate-400">{candidate.phone}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-xs">
                          {candidate.personalDetails?.currentCity ? (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} className="text-slate-400" /> 
                              {candidate.personalDetails.currentCity}, {candidate.personalDetails.currentState || ''}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Not provided</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-xs">
                          {candidate.qualifications?.graduation?.collegeName ? (
                            <div>
                              <div className="font-semibold text-slate-800 flex items-center gap-1">
                                <GraduationCap size={14} className="text-indigo-500" /> 
                                {candidate.qualifications.graduation.courseName || 'Graduation'}
                              </div>
                              <div className="text-slate-500">
                                {candidate.qualifications.graduation.collegeName} ({candidate.qualifications.graduation.yearOfCompletion})
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Not provided</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(candidate.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {candidate.resumeUrl ? (
                            <button 
                              onClick={() => viewCandidateResume(candidate)} 
                              className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <FileText size={14} /> View CV
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Not uploaded</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: CA Industrial Training Form Applications */}
      {activeTab === 'industrial' && (
        <div className="space-y-4">
          {/* Industrial Filter & Action Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by candidate name, email, phone, firm, city, or state..."
                value={industrialSearch}
                onChange={(e) => setIndustrialSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={industrialBatchFilter}
                onChange={(e) => setIndustrialBatchFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All CA Inter Batches</option>
                {Array.from(new Set(industrialList.map(a => a.caInterBatch).filter(Boolean))).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select
                value={industrialAttemptFilter}
                onChange={(e) => setIndustrialAttemptFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Attempts</option>
                <option value="Yes">1st Attempt: Yes</option>
                <option value="No">1st Attempt: No</option>
              </select>

              <button
                onClick={handleExportIndustrialExcel}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Download 16-field Excel spreadsheet"
              >
                <FileSpreadsheet size={15} /> Download Excel
              </button>

              <button
                onClick={fetchIndustrialApplications}
                className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                title="Refresh"
              >
                <RefreshCw size={15} className={loadingIndustrial ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Industrial Training Applications Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold tracking-wider">
                    <th className="px-3.5 py-3.5">#</th>
                    <th className="px-3.5 py-3.5">Candidate</th>
                    <th className="px-3.5 py-3.5">Contact</th>
                    <th className="px-3.5 py-3.5">Current Location</th>
                    <th className="px-3.5 py-3.5">Permanent Location</th>
                    <th className="px-3.5 py-3.5">CA Inter Batch</th>
                    <th className="px-3.5 py-3.5">1st Attempt?</th>
                    <th className="px-3.5 py-3.5">Group 1 & 2</th>
                    <th className="px-3.5 py-3.5">Rank</th>
                    <th className="px-3.5 py-3.5">Articleship Firm</th>
                    <th className="px-3.5 py-3.5">Start Date</th>
                    <th className="px-3.5 py-3.5">Status</th>
                    <th className="px-3.5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingIndustrial ? (
                    <tr>
                      <td colSpan={13} className="px-4 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                          <span>Loading Industrial Training form submissions...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredIndustrial.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="px-4 py-12 text-center text-slate-500">
                        {industrialList.length === 0 ? (
                          <div>
                            <GraduationCap size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="font-semibold text-slate-700">No Industrial Training forms submitted yet.</p>
                            <p className="text-xs text-slate-400 mt-1">
                              When candidates fill the Industrial Training form from the navbar or login page, their submissions will appear here.
                            </p>
                          </div>
                        ) : (
                          <p className="text-slate-500">No records match your search filter.</p>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredIndustrial.map((app, idx) => (
                      <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-3.5 py-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="px-3.5 py-3">
                          <div className="font-bold text-slate-900">{app.name}</div>
                          <div className="text-[10px] text-slate-500">{app.gender || '—'} • DOB: {app.dob || '—'}</div>
                        </td>
                        <td className="px-3.5 py-3">
                          <a
                            href={`https://wa.me/91${app.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono font-bold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Phone size={11} /> {app.phone}
                          </a>
                          <div className="text-slate-500 text-[11px] truncate max-w-[150px]" title={app.email}>
                            {app.email}
                          </div>
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="font-semibold text-slate-800">{app.currentLocation || '—'}</div>
                          <div className="text-[10px] text-slate-500">{app.currentState || '—'}</div>
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="text-slate-700">{app.permanentLocation || '—'}</div>
                          <div className="text-[10px] text-slate-500">{app.permanentState || '—'}</div>
                        </td>
                        <td className="px-3.5 py-3 font-semibold text-blue-700">
                          {app.caInterBatch}
                        </td>
                        <td className="px-3.5 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            app.bothGroups1stAttempt === 'Yes'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {app.bothGroups1stAttempt || 'No'}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-[11px]">
                          <div>G1: {app.group1 || '—'}</div>
                          <div>G2: {app.group2 || '—'}</div>
                        </td>
                        <td className="px-3.5 py-3">
                          {app.caInterRank && app.caInterRank !== 'No Rank' && app.caInterRank !== 'No' ? (
                            <span className="font-bold text-amber-700 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded text-[10px]">
                              {app.caInterRank}
                            </span>
                          ) : (
                            <span className="text-slate-400">No Rank</span>
                          )}
                        </td>
                        <td className="px-3.5 py-3 font-semibold text-slate-900 max-w-[140px] truncate" title={app.articleshipFirmName}>
                          {app.articleshipFirmName}
                        </td>
                        <td className="px-3.5 py-3 text-slate-600">
                          {app.articleshipStartMonthYear}
                        </td>
                        <td className="px-3.5 py-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <CheckCircle2 size={10} /> {app.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-right">
                          <button
                            onClick={() => handleDeleteIndustrial(app._id, app.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredIndustrial.length} of {industrialList.length} applications</span>
              <button
                onClick={handleExportIndustrialExcel}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Download Excel spreadsheet matching recruitment columns →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register & Manage Companies Modal */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Register New Company</h2>
                  <p className="text-xs text-slate-500">Create company credentials to store in database</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCompanyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-6 pt-3 bg-slate-50/30 gap-6">
              <button
                onClick={() => setActiveModalTab('register')}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeModalTab === 'register'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <PlusCircle size={16} /> Register Company
              </button>
              <button
                onClick={() => setActiveModalTab('list')}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeModalTab === 'list'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Building size={16} /> Registered ({employers.length})
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeModalTab === 'register' ? (
                <form onSubmit={handleCreateCompany} className="space-y-4">
                  {/* Field 1: Company Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tata Consultancy Services"
                        value={companyForm.companyName}
                        onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                        className="pl-9 w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Field 2: HR Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      HR Representative Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Sharma"
                        value={companyForm.hrName}
                        onChange={(e) => setCompanyForm({ ...companyForm, hrName: e.target.value })}
                        className="pl-9 w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Field 3: Login Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Login Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input
                        type="email"
                        required
                        placeholder="e.g. hr@tcs.com"
                        value={companyForm.email}
                        onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                        className="pl-9 w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Default Password Notice */}
                  <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-center justify-between text-xs text-indigo-800">
                    <span>Default Password: <strong>Company@123</strong></span>
                    <span className="text-indigo-500">Auto-filled</span>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsCompanyModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingCompany}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      {creatingCompany ? 'Saving to Database...' : 'Register Company'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {employers.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      No companies registered in database yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase">
                            <th className="py-2.5">Company Name</th>
                            <th className="py-2.5">HR Name</th>
                            <th className="py-2.5">Email</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {employers.map(emp => (
                            <tr key={emp._id} className="hover:bg-slate-50/50">
                              <td className="py-3 font-semibold text-slate-900">
                                {emp.companyName || (emp.firstName ? `${emp.firstName} ${emp.lastName || ''}`.trim() : 'Registered Company')}
                              </td>
                              <td className="py-3 text-slate-600">{emp.firstName} {emp.lastName || ''}</td>
                              <td className="py-3 text-slate-500 font-mono text-xs">{emp.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Industrial Training Submissions Modal */}
      {isIndustrialModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <GraduationCap className="text-amber-300" size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">CA Industrial Training Form Applications</h2>
                  <p className="text-xs text-blue-100 font-medium">
                    {industrialList.length} verified candidate registrations recorded
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportIndustrialExcel}
                  className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  title="Download the exact Excel spreadsheet"
                >
                  <FileSpreadsheet size={14} /> Download Excel
                </button>
                <button
                  onClick={() => setIsIndustrialModalOpen(false)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Filter by candidate name, email, firm, or city..."
                  value={industrialSearch}
                  onChange={(e) => setIndustrialSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Showing {industrialList.filter(app => {
                  if (!industrialSearch) return true;
                  const q = industrialSearch.toLowerCase();
                  return (
                    (app.name || '').toLowerCase().includes(q) ||
                    (app.email || '').toLowerCase().includes(q) ||
                    (app.articleshipFirmName || '').toLowerCase().includes(q) ||
                    (app.currentLocation || '').toLowerCase().includes(q)
                  );
                }).length} applications
              </span>
            </div>

            {/* Table */}
            <div className="overflow-y-auto overflow-x-auto flex-1 p-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                    <th className="px-3 py-2.5">Candidate</th>
                    <th className="px-3 py-2.5">Contact</th>
                    <th className="px-3 py-2.5">Location</th>
                    <th className="px-3 py-2.5">CA Inter Batch</th>
                    <th className="px-3 py-2.5">1st Attempt</th>
                    <th className="px-3 py-2.5">Articleship Firm</th>
                    <th className="px-3 py-2.5">Start Date</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingIndustrial ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        Loading Industrial Training applications...
                      </td>
                    </tr>
                  ) : industrialList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        No Industrial Training applications submitted yet.
                      </td>
                    </tr>
                  ) : (
                    industrialList
                      .filter(app => {
                        if (!industrialSearch) return true;
                        const q = industrialSearch.toLowerCase();
                        return (
                          (app.name || '').toLowerCase().includes(q) ||
                          (app.email || '').toLowerCase().includes(q) ||
                          (app.articleshipFirmName || '').toLowerCase().includes(q) ||
                          (app.currentLocation || '').toLowerCase().includes(q)
                        );
                      })
                      .map((app) => (
                        <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-3">
                            <p className="font-bold text-slate-900">{app.name}</p>
                            <span className="text-[10px] text-slate-500">{app.gender} • {app.dob}</span>
                          </td>
                          <td className="px-3 py-3">
                            <p className="text-slate-800 font-mono">{app.phone}</p>
                            <p className="text-slate-500 text-[11px] truncate">{app.email}</p>
                          </td>
                          <td className="px-3 py-3">
                            <p className="text-slate-800">{app.currentLocation}</p>
                            <span className="text-[10px] text-slate-500">{app.currentState}</span>
                          </td>
                          <td className="px-3 py-3 font-semibold text-blue-700">
                            {app.caInterBatch}
                            {app.caInterRank && app.caInterRank !== 'No Rank' && (
                              <span className="block text-[10px] text-amber-600 font-bold">{app.caInterRank}</span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              app.bothGroups1stAttempt === 'Yes' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {app.bothGroups1stAttempt}
                            </span>
                          </td>
                          <td className="px-3 py-3 font-semibold text-slate-800">
                            {app.articleshipFirmName}
                          </td>
                          <td className="px-3 py-3 text-slate-600">
                            {app.articleshipStartMonthYear}
                          </td>
                          <td className="px-3 py-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              ✓ {app.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Tip: Click &quot;Download Excel&quot; to export the full spreadsheet matching your recruitment sheet format.
              </span>
              <button
                onClick={() => setIsIndustrialModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
};
