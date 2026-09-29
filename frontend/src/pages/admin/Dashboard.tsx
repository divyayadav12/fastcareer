import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { 
  Users, Building2, Download, MapPin, GraduationCap, 
  FileText, Search, PlusCircle, CheckSquare, Square, 
  X, Check, ShieldCheck, UserCheck, Trash2, Building
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
    firstName: '',
    lastName: '',
    email: '',
    password: '',
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
      setEmployers(res.data || []);
      if (res.data?.length > 0 && !assignTargetEmployerId) {
        setAssignTargetEmployerId(res.data[0]._id);
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
      toast.error('Please select at least one candidate.');
      return;
    }
    if (!assignTargetEmployerId) {
      toast.error('Please select a company.');
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
          ? `Successfully granted ${selectedCandidateIds.length} candidate(s) access to ${companyTitle}!`
          : `Removed access to ${selectedCandidateIds.length} candidate(s) from ${companyTitle}.`
      );

      setSelectedCandidateIds([]);
      fetchCandidates(); // Refresh list to update badges
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update candidate access.');
    } finally {
      setAssigning(false);
    }
  };

  // Create Company Handler
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.companyName || !companyForm.firstName || !companyForm.email || !companyForm.password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setCreatingCompany(true);
    try {
      await api.post('/users', {
        ...companyForm,
        role: 'employer',
      });

      toast.success(`Company "${companyForm.companyName}" registered successfully!`);
      setCompanyForm({ companyName: '', firstName: '', lastName: '', email: '', password: '' });
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
            Browse registered candidates and grant permission/access to specific companies.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              setActiveModalTab('register');
              setIsCompanyModalOpen(true);
            }}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-colors"
          >
            <Building2 size={16} /> Register / Manage Companies
          </button>

          <button 
            onClick={handleBulkDownload}
            disabled={downloading}
            className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              downloading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            <Download size={16} /> {downloading ? 'Generating ZIP...' : 'Export ZIP'}
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, or city..."
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
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 bg-white w-full md:w-56"
          >
            <option value="all">All Candidates ({candidates.length})</option>
            <option value="unassigned">Unassigned (Not Given to Any Company)</option>
            {employers.map(emp => (
              <option key={emp._id} value={emp._id}>
                Permitted to: {emp.companyName || emp.firstName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Assignment Bar (shows when candidates are selected) */}
      {selectedCandidateIds.length > 0 && (
        <div className="bg-indigo-900 text-white p-4 rounded-2xl shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-700 text-indigo-100 font-bold px-3 py-1 rounded-lg text-xs">
              {selectedCandidateIds.length} Selected
            </span>
            <span className="text-sm font-medium">Assign access for selected candidates to company:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <select
              value={assignTargetEmployerId}
              onChange={(e) => setAssignTargetEmployerId(e.target.value)}
              className="bg-indigo-800 text-white border border-indigo-700 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              {employers.map(emp => (
                <option key={emp._id} value={emp._id} className="text-slate-900">
                  {emp.companyName || emp.firstName} ({emp.email})
                </option>
              ))}
            </select>

            <button
              onClick={() => handleAssignCandidates('assign')}
              disabled={assigning}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Check size={16} /> Grant Access
            </button>

            <button
              onClick={() => handleAssignCandidates('unassign')}
              disabled={assigning}
              className="px-4 py-2 bg-rose-500/80 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Trash2 size={16} /> Revoke
            </button>

            <button
              onClick={() => setSelectedCandidateIds([])}
              className="px-3 py-2 bg-indigo-800 hover:bg-indigo-700 text-indigo-200 text-xs font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Manage Companies & Access</h2>
                  <p className="text-xs text-slate-500">Create company login credentials and view registered employers</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCompanyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-6 pt-3 bg-slate-50/30 gap-6">
              <button
                onClick={() => setActiveModalTab('register')}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeModalTab === 'register'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <PlusCircle size={16} /> Register New Company
              </button>
              <button
                onClick={() => setActiveModalTab('list')}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeModalTab === 'list'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Building size={16} /> Registered Companies ({employers.length})
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeModalTab === 'register' ? (
                <form onSubmit={handleCreateCompany} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tata Consultancy Services"
                        value={companyForm.companyName}
                        onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">HR First Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh"
                        value={companyForm.firstName}
                        onChange={(e) => setCompanyForm({ ...companyForm, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">HR Last Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sharma"
                        value={companyForm.lastName}
                        onChange={(e) => setCompanyForm({ ...companyForm, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Login Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="hr@tcs.com"
                        value={companyForm.email}
                        onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Temporary Login Password *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Company@123"
                      value={companyForm.password}
                      onChange={(e) => setCompanyForm({ ...companyForm, password: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <p className="text-xs text-slate-400 mt-1">Share this email and password with the company HR to let them log in.</p>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsCompanyModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingCompany}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                    >
                      {creatingCompany ? 'Registering...' : 'Register Company'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {employers.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      No companies registered yet. Switch to the Register tab to create one.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase">
                            <th className="py-2.5">Company Name</th>
                            <th className="py-2.5">HR Representative</th>
                            <th className="py-2.5">Login Email</th>
                            <th className="py-2.5 text-right">Permitted Candidates</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {employers.map(emp => {
                            const candidateCount = candidates.filter(c => 
                              c.assignedEmployers?.some(e => e._id === emp._id)
                            ).length;

                            return (
                              <tr key={emp._id} className="hover:bg-slate-50/50">
                                <td className="py-3 font-semibold text-slate-900">
                                  {emp.companyName || 'Not Set'}
                                </td>
                                <td className="py-3 text-slate-600">{emp.firstName} {emp.lastName || ''}</td>
                                <td className="py-3 text-slate-500 font-mono text-xs">{emp.email}</td>
                                <td className="py-3 text-right">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                                    {candidateCount} Assigned
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
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
