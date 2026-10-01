import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { 
  Users, Building2, Download, MapPin, GraduationCap, 
  FileText, Search, PlusCircle, X, Building, Mail, User, UserCheck
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
      
      const excelData = filteredCandidates.map(candidate => ({
        'First Name': candidate.firstName,
        'Last Name': candidate.lastName,
        'Email': candidate.email,
        'Registered On': new Date(candidate.createdAt).toLocaleDateString(),
        'Location': candidate.personalDetails?.currentCity ? `${candidate.personalDetails.currentCity}, ${candidate.personalDetails.currentState || ''}` : 'Not provided',
        'Education': candidate.qualifications?.graduation?.collegeName 
                      ? `${candidate.qualifications.graduation.courseName || 'Graduation'} from ${candidate.qualifications.graduation.collegeName} (${candidate.qualifications.graduation.yearOfCompletion})` 
                      : 'Not provided',
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
    </AdminLayout>
  );
};
