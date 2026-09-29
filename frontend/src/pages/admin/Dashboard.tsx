import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { 
  Users, Building2, Download, MapPin, GraduationCap, 
  FileText, Search, PlusCircle, CheckSquare, Square, 
  X, Check, Building, Mail, User, ShieldCheck, ChevronDown
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import api from '../../services/api';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getResumeUrl } from '../../utils/urlHelper';
import { fetchCandidateResumeBlob, viewCandidateResume } from '../../utils/clientPdfGenerator';

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  assignedEmployers?: Array<{
    _id: string;
    companyName?: string;
    firstName?: string;
    lastName?: string;
    email: string;
  }>;
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

  // Filters & Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [assignTargetEmployerId, setAssignTargetEmployerId] = useState('');
  const [assigning, setAssigning] = useState(false);

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
      const empList = res.data || [];
      setEmployers(empList);
      if (empList.length > 0 && !assignTargetEmployerId) {
        setAssignTargetEmployerId(empList[0]._id);
      }
    } catch (error) {
      console.error('Error fetching employers:', error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchCandidates();
      fetchEmployers();
    }
  }, [user]);

  // Selected registered employer object for 3 linked dropdowns
  const selectedEmployer = employers.find(e => e._id === assignTargetEmployerId) || employers[0];

  // Handle Candidate Selection
  const toggleSelectCandidate = (id: string) => {
    setSelectedCandidateIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCandidateIds.length === filteredCandidates.length) {
      setSelectedCandidateIds([]);
    } else {
      setSelectedCandidateIds(filteredCandidates.map(c => c._id));
    }
  };

  // Grant or Remove Access
  const handleAssignCandidates = async (action: 'assign' | 'unassign') => {
    if (selectedCandidateIds.length === 0) {
      toast.error('Please select at least one candidate using the checkboxes.');
      return;
    }
    if (!assignTargetEmployerId) {
      toast.error('Please select a registered company from the dropdown.');
      return;
    }

    const targetCompany = employers.find(e => e._id === assignTargetEmployerId);
    const companyTitle = targetCompany?.companyName || targetCompany?.firstName || 'selected company';

    setAssigning(true);
    try {
      await api.put('/users/candidates/assign-company', {
        candidateIds: selectedCandidateIds,
        employerId: assignTargetEmployerId,
        action,
      });

      toast.success(
        action === 'assign'
          ? `Granted ${selectedCandidateIds.length} candidate(s) access to ${companyTitle}!`
          : `Removed access for ${selectedCandidateIds.length} candidate(s) from ${companyTitle}.`
      );

      setSelectedCandidateIds([]);
      fetchCandidates();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update candidate access.');
    } finally {
      setAssigning(false);
    }
  };

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

  // Filter candidates
  const filteredCandidates = candidates.filter(candidate => {
    const fullName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.toLowerCase();
    const email = (candidate.email || '').toLowerCase();
    const city = (candidate.personalDetails?.currentCity || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch = fullName.includes(q) || email.includes(q) || city.includes(q);

    let matchesCompany = true;
    if (selectedCompanyFilter === 'unassigned') {
      matchesCompany = !candidate.assignedEmployers || candidate.assignedEmployers.length === 0;
    } else if (selectedCompanyFilter !== 'all') {
      matchesCompany = candidate.assignedEmployers?.some(e => e._id === selectedCompanyFilter) || false;
    }

    return matchesSearch && matchesCompany;
  });

  const handleBulkDownload = async () => {
    if (filteredCandidates.length === 0) {
      toast.error('No candidates available to download.');
      return;
    }
    
    setDownloading(true);
    try {
      const zip = new JSZip();
      
      const excelData = filteredCandidates.map(candidate => ({
        'First Name': candidate.firstName,
        'Last Name': candidate.lastName,
        'Email': candidate.email,
        'Registered On': new Date(candidate.createdAt).toLocaleDateString(),
        'Location': candidate.personalDetails?.currentCity ? `${candidate.personalDetails.currentCity}, ${candidate.personalDetails.currentState || ''}` : 'Not provided',
        'Education': candidate.qualifications?.graduation?.collegeName 
                      ? `${candidate.qualifications.graduation.courseName || 'Graduation'} from ${candidate.qualifications.graduation.collegeName} (${candidate.qualifications.graduation.yearOfCompletion})` 
                      : 'Not provided',
        'Permitted Companies': candidate.assignedEmployers?.map(e => e.companyName || e.firstName).join(', ') || 'Unassigned',
        'Resume Link': candidate.resumeUrl ? getResumeUrl(candidate.resumeUrl) : 'Not uploaded'
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      zip.file("Candidates_List.xlsx", excelBuffer);

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

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="text-indigo-600" /> Candidates Database
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Select candidates below and assign permission to registered companies.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              setActiveModalTab('register');
              setIsCompanyModalOpen(true);
            }}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Building2 size={16} /> Register New Company
          </button>

          <button 
            onClick={handleBulkDownload}
            disabled={downloading}
            className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              downloading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer'
            }`}
          >
            <Download size={16} /> {downloading ? 'Generating ZIP...' : 'Export ZIP'}
          </button>
        </div>
      </div>

      {/* Grant Access Control Panel (3 Linked Dropdowns of Registered Companies) */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md mb-6 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              <Building size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Grant Permission to Registered Company</h3>
              <p className="text-xs text-slate-400">Select a company registered in database to grant candidate access</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg">
              {selectedCandidateIds.length} Candidate(s) Selected
            </span>
          </div>
        </div>

        {/* 3 Linked Dropdowns of Registered Companies from Database */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Dropdown 1: Company Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Building size={14} className="text-indigo-400" /> 1. Registered Company Name
            </label>
            <select
              value={assignTargetEmployerId}
              onChange={(e) => setAssignTargetEmployerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {employers.length === 0 ? (
                <option value="">No Companies Registered Yet</option>
              ) : (
                employers.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.companyName || emp.firstName}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Dropdown 2: HR Representative Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <User size={14} className="text-indigo-400" /> 2. HR Representative
            </label>
            <select
              value={assignTargetEmployerId}
              onChange={(e) => setAssignTargetEmployerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {employers.length === 0 ? (
                <option value="">No HR Registered</option>
              ) : (
                employers.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName || ''} ({emp.companyName || 'Company'})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Dropdown 3: Company Login Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Mail size={14} className="text-indigo-400" /> 3. Company Email
            </label>
            <select
              value={assignTargetEmployerId}
              onChange={(e) => setAssignTargetEmployerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {employers.length === 0 ? (
                <option value="">No Email Registered</option>
              ) : (
                employers.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.email}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Selected Company: <span className="font-bold text-white">{selectedEmployer?.companyName || selectedEmployer?.firstName || 'None'}</span> ({selectedEmployer?.email || 'N/A'})
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleAssignCandidates('assign')}
              disabled={assigning || selectedCandidateIds.length === 0}
              className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                selectedCandidateIds.length === 0 ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              <Check size={16} /> Grant Access ({selectedCandidateIds.length})
            </button>

            <button
              onClick={() => handleAssignCandidates('unassign')}
              disabled={assigning || selectedCandidateIds.length === 0}
              className={`px-4 py-2.5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCandidateIds.length === 0 ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-rose-600/80 hover:bg-rose-600'
              }`}
            >
              <X size={16} /> Revoke Access
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-500 shrink-0">Filter By Access:</label>
          <select
            value={selectedCompanyFilter}
            onChange={(e) => setSelectedCompanyFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 bg-white w-full md:w-64"
          >
            <option value="all">All Candidates ({candidates.length})</option>
            <option value="unassigned">Unassigned Candidates</option>
            {employers.map(emp => (
              <option key={emp._id} value={emp._id}>
                Permitted to: {emp.companyName || emp.firstName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-4 w-12 text-center">
                  <button onClick={toggleSelectAll} className="cursor-pointer text-slate-400 hover:text-slate-600">
                    {selectedCandidateIds.length > 0 && selectedCandidateIds.length === filteredCandidates.length ? (
                      <CheckSquare className="text-indigo-600" size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>
                <th className="px-4 py-4 font-semibold">Candidate</th>
                <th className="px-4 py-4 font-semibold">Location</th>
                <th className="px-4 py-4 font-semibold">Education</th>
                <th className="px-4 py-4 font-semibold">Permitted Companies</th>
                <th className="px-4 py-4 font-semibold text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Loading candidates...
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    No candidates match the current filters.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => {
                  const isSelected = selectedCandidateIds.includes(candidate._id);
                  const assignedList = candidate.assignedEmployers || [];

                  return (
                    <tr 
                      key={candidate._id} 
                      className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-indigo-50/40' : ''}`}
                    >
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => toggleSelectCandidate(candidate._id)}
                          className="cursor-pointer text-slate-400 hover:text-slate-600"
                        >
                          {isSelected ? (
                            <CheckSquare className="text-indigo-600" size={18} />
                          ) : (
                            <Square size={18} />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4">
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
                      <td className="px-4 py-4 text-slate-600 text-xs">
                        {candidate.personalDetails?.currentCity ? (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-slate-400" /> 
                            {candidate.personalDetails.currentCity}, {candidate.personalDetails.currentState || ''}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not provided</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-slate-600 text-xs">
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
                      <td className="px-4 py-4">
                        {assignedList.length === 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                            Unassigned
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 max-w-xs">
                            {assignedList.map((emp) => (
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
                      <td className="px-4 py-4 text-right">
                        {candidate.resumeUrl ? (
                          <button 
                            onClick={() => viewCandidateResume(candidate)} 
                            className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <FileText size={14} /> View CV
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not uploaded</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                                {emp.companyName || 'Not Set'}
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
    </AdminLayout>
  );
};
