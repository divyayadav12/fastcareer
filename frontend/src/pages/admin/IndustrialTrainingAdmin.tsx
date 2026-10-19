import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { 
  GraduationCap, Search, FileSpreadsheet, RefreshCw, Trash2, 
  MapPin, Phone, Mail, Award, CheckCircle2, AlertCircle, Building2,
  Calendar, User, Eye, X, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { saveAs } from 'file-saver';

interface IndustrialApplication {
  _id: string;
  name: string;
  email: string;
  phone: string;
  currentLocation: string;
  currentState: string;
  permanentLocation: string;
  permanentState: string;
  dob: string;
  gender: string;
  caInterBatch: string;
  bothGroups1stAttempt: string;
  group1: string;
  group2: string;
  caInterRank: string;
  articleshipFirmName: string;
  articleshipStartMonthYear: string;
  isVerified: boolean;
  verificationMethod?: string;
  verificationCode?: string;
  status?: string;
  createdAt?: string;
}

export const IndustrialTrainingAdmin: React.FC = () => {
  const [applications, setApplications] = useState<IndustrialApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [attemptFilter, setAttemptFilter] = useState('');
  const [exporting, setExporting] = useState(false);
  const [selectedApp, setSelectedApp] = useState<IndustrialApplication | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/industrial-training');
      setApplications(res.data?.data || []);
    } catch (err: any) {
      console.error('Error fetching industrial applications:', err);
      toast.error('Failed to load Industrial Training applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      const res = await api.get('/industrial-training/export', { responseType: 'blob' });
      saveAs(res.data, `Industrial_Training_Candidates_${Date.now()}.xlsx`);
      toast.success('Downloaded complete 16-field Industrial Training Excel!');
    } catch (e) {
      toast.error('Failed to export Industrial Training spreadsheet.');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove the application for "${name}"?`)) {
      return;
    }
    try {
      await api.delete(`/industrial-training/${id}`);
      toast.success('Application removed successfully.');
      setApplications(prev => prev.filter(app => app._id !== id));
      if (selectedApp?._id === id) setSelectedApp(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete application.');
    }
  };

  // Filtered applications
  const filtered = applications.filter(app => {
    if (batchFilter && app.caInterBatch !== batchFilter) return false;
    if (attemptFilter && app.bothGroups1stAttempt !== attemptFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
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

  const firstAttemptCount = applications.filter(a => a.bothGroups1stAttempt === 'Yes').length;
  const rankerCount = applications.filter(a => a.caInterRank && a.caInterRank !== 'No Rank' && a.caInterRank !== 'No').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-sm">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  CA Industrial Training Form Applications
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Manage all candidate registrations submitted through the Industrial Training form.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchApplications}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportExcel}
              disabled={exporting || applications.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <FileSpreadsheet size={15} />
              <span>{exporting ? 'Generating Excel...' : 'Download Excel Sheet'}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Total Applicants</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{applications.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <User size={20} />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">All submitted candidates</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Both Groups in 1st Attempt</p>
                <h3 className="text-2xl font-extrabold text-emerald-600 mt-0.5">{firstAttemptCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {applications.length > 0 ? `${Math.round((firstAttemptCount / applications.length) * 100)}% of applicants` : '0%'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">CA Inter Rankers</p>
                <h3 className="text-2xl font-extrabold text-amber-600 mt-0.5">{rankerCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award size={20} />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Rank holders recorded</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by candidate name, email, phone, firm, city, or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All CA Inter Batches</option>
              {Array.from(new Set(applications.map(a => a.caInterBatch).filter(Boolean))).map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select
              value={attemptFilter}
              onChange={(e) => setAttemptFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Attempts</option>
              <option value="Yes">1st Attempt: Yes</option>
              <option value="No">1st Attempt: No</option>
            </select>

            {(search || batchFilter || attemptFilter) && (
              <button
                onClick={() => { setSearch(''); setBatchFilter(''); setAttemptFilter(''); }}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Applications Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold tracking-wider">
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">Candidate Details</th>
                  <th className="px-4 py-3.5">Contact Info</th>
                  <th className="px-4 py-3.5">Current Location</th>
                  <th className="px-4 py-3.5">Permanent Location</th>
                  <th className="px-4 py-3.5">CA Inter Batch</th>
                  <th className="px-4 py-3.5">1st Attempt?</th>
                  <th className="px-4 py-3.5">Group 1 & 2</th>
                  <th className="px-4 py-3.5">Rank</th>
                  <th className="px-4 py-3.5">Articleship Firm</th>
                  <th className="px-4 py-3.5">Start Month/Yr</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span>Loading Industrial Training database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-12 text-center text-slate-500">
                      {applications.length === 0 ? (
                        <div>
                          <GraduationCap size={32} className="mx-auto text-slate-300 mb-2" />
                          <p className="font-semibold text-slate-700">No Industrial Training forms submitted yet.</p>
                          <p className="text-xs text-slate-400 mt-1">
                            When candidates fill the Industrial Training form from the navbar or login page, they will appear here.
                          </p>
                        </div>
                      ) : (
                        <p className="text-slate-500">No candidate records match your search filter.</p>
                      )}
                    </td>
                  </tr>
                ) : (
                  filtered.map((app, idx) => (
                    <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Candidate */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{app.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium text-slate-600">{app.gender || 'Not specified'}</span>
                          <span>•</span>
                          <span>DOB: {app.dob || '—'}</span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3">
                        <a 
                          href={`https://wa.me/91${app.phone}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-mono font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Phone size={11} /> {app.phone}
                        </a>
                        <div className="text-slate-500 text-[11px] truncate max-w-[160px]" title={app.email}>
                          {app.email}
                        </div>
                      </td>

                      {/* Current Location */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{app.currentLocation || '—'}</div>
                        <div className="text-[10px] text-slate-500">{app.currentState || '—'}</div>
                      </td>

                      {/* Permanent Location */}
                      <td className="px-4 py-3">
                        <div className="text-slate-700">{app.permanentLocation || '—'}</div>
                        <div className="text-[10px] text-slate-500">{app.permanentState || '—'}</div>
                      </td>

                      {/* Batch */}
                      <td className="px-4 py-3">
                        <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                          {app.caInterBatch || '—'}
                        </span>
                      </td>

                      {/* Both groups in 1st attempt */}
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          app.bothGroups1stAttempt === 'Yes'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {app.bothGroups1stAttempt || 'No'}
                        </span>
                      </td>

                      {/* Group 1 & 2 */}
                      <td className="px-4 py-3">
                        <div className="text-[11px] text-slate-700">G1: {app.group1 || '—'}</div>
                        <div className="text-[11px] text-slate-700">G2: {app.group2 || '—'}</div>
                      </td>

                      {/* Rank */}
                      <td className="px-4 py-3">
                        {app.caInterRank && app.caInterRank !== 'No Rank' && app.caInterRank !== 'No' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md">
                            <Award size={12} className="text-amber-600" />
                            {app.caInterRank}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No Rank</span>
                        )}
                      </td>

                      {/* Firm */}
                      <td className="px-4 py-3 font-semibold text-slate-900 max-w-[150px] truncate" title={app.articleshipFirmName}>
                        {app.articleshipFirmName}
                      </td>

                      {/* Articleship Start */}
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {app.articleshipStartMonthYear}
                      </td>

                      {/* Verification Status */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <CheckCircle2 size={11} /> {app.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="View Full Application"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(app._id, app.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {filtered.length} of {applications.length} submitted candidates
            </span>
            <span>
              Click &quot;Download Excel Sheet&quot; to export all 16 fields matching your Excel format.
            </span>
          </div>
        </div>

      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <GraduationCap size={20} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{selectedApp.name}</h3>
                  <p className="text-xs text-blue-100">Industrial Training Candidate Profile</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Section 1 */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-1.5 border-b border-slate-200 mb-2.5">
                  1. Personal & Contact Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block">Full Name:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email Address:</span>
                    <span className="font-semibold text-slate-800 font-mono">{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone Number:</span>
                    <span className="font-semibold text-slate-800 font-mono">{selectedApp.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date of Birth & Gender:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.dob} ({selectedApp.gender})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Current Location & State:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.currentLocation}, {selectedApp.currentState}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Permanent Location & State:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.permanentLocation}, {selectedApp.permanentState}</span>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="pt-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-1.5 border-b border-slate-200 mb-2.5">
                  2. CA Inter Exam Credentials
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block">CA Inter Batch:</span>
                    <span className="font-semibold text-blue-700">{selectedApp.caInterBatch}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">CA Both Groups in 1st Attempt:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.bothGroups1stAttempt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Group 1:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.group1}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Group 2:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.group2}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">CA Inter Rank:</span>
                    <span className="font-semibold text-amber-700">{selectedApp.caInterRank || 'No Rank'}</span>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="pt-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-1.5 border-b border-slate-200 mb-2.5">
                  3. Articleship Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block">Articleship Firm&apos;s Name 1:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.articleshipFirmName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Articleship Start Month and Year:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.articleshipStartMonthYear}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Verification Method:</span>
                    <span className="font-semibold text-emerald-700">{selectedApp.verificationMethod || 'Verified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Submission Date:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleString('en-IN') : '—'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
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
