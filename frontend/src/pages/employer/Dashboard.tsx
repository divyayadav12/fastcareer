import React, { useState, useEffect } from 'react';
import { 
  Building, Users, FileText, Download, Eye, 
  Search, MapPin, GraduationCap, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { viewCandidateResume } from '../../utils/clientPdfGenerator';

interface AssignedCandidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  applicationId?: string;
  applicationStatus?: string;
  appliedJobTitle?: string;
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
  caPortfolio?: {
    isFresherCA?: boolean;
    caFinal?: {
      bothGroups1stAttempt?: boolean;
      group1Attempts?: string;
      group2Attempts?: string;
    };
    caInter?: {
      bothGroups1stAttempt?: boolean;
      group1Attempts?: string;
      group2Attempts?: string;
    };
  };
  createdAt: string;
}

export const EmployerDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [candidates, setCandidates] = useState<AssignedCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  const fetchAssignedCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/candidates');
      if (Array.isArray(res.data)) {
        setCandidates(res.data);
      } else {
        setCandidates([]);
      }
    } catch (err: any) {
      console.error('Error fetching assigned candidates:', err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (candidateId: string, applicationId: string | undefined, newStatus: string) => {
    try {
      setCandidates(prev => prev.map(c => {
        if (c._id === candidateId) {
          return { ...c, applicationStatus: newStatus };
        }
        return c;
      }));

      await api.put('/applications/candidate-status', {
        candidateId,
        applicationId,
        status: newStatus
      });

      const statusLabels: Record<string, string> = {
        applied: 'Pending Review',
        reviewing: 'Under Review',
        shortlisted: 'Shortlisted',
        interviewed: 'Interview Scheduled',
        hired: 'Selected / Hired',
        rejected: 'Rejected'
      };

      toast.success(`Candidate status updated to "${statusLabels[newStatus] || newStatus}"`);
    } catch (err: any) {
      toast.error('Failed to update candidate status');
      fetchAssignedCandidates();
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchAssignedCandidates();
    }
  }, [user]);

  const safeCandidates = Array.isArray(candidates) ? candidates : [];

  // Extract unique cities safely
  const uniqueCities = Array.from(
    new Set(
      safeCandidates
        .map(c => {
          const city = c?.personalDetails?.currentCity;
          return typeof city === 'string' ? city.trim() : '';
        })
        .filter(Boolean)
    )
  ).sort();

  const filteredCandidates = safeCandidates.filter(candidate => {
    if (!candidate) return false;
    const fullName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.toLowerCase();
    const email = (candidate.email || '').toLowerCase();
    const city = (candidate.personalDetails?.currentCity || '').toLowerCase();
    const q = (searchQuery || '').toLowerCase();

    const matchesSearch = fullName.includes(q) || email.includes(q) || city.includes(q);
    const matchesCity = cityFilter === 'all' || city === cityFilter.toLowerCase();

    return matchesSearch && matchesCity;
  });

  return (
    <EmployerLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
            <Building size={14} /> Company Portal
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.companyName || user?.firstName || 'Company'} Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse candidate profiles authorized and forwarded specifically to your company by Fast Careers.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Assigned Candidates</p>
            <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl"><Users size={20} /></div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900">{safeCandidates.length}</h3>
          <p className="text-xs text-gray-400 mt-2">Shared by Fast Careers Admin</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">CA Final / Qualified</p>
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl"><GraduationCap size={20} /></div>
          </div>
          <h3 className="text-3xl font-extrabold text-emerald-600">
            {safeCandidates.filter(c => c?.caPortfolio?.caFinal?.group1Attempts || c?.caPortfolio?.caFinal?.bothGroups1stAttempt).length}
          </h3>
          <p className="text-xs text-gray-400 mt-2">Qualified finance candidates</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Shortlisted Candidates</p>
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl"><CheckCircle2 size={20} /></div>
          </div>
          <h3 className="text-3xl font-extrabold text-emerald-700">
            {safeCandidates.filter(c => c.applicationStatus === 'shortlisted' || c.applicationStatus === 'hired').length}
          </h3>
          <p className="text-xs text-gray-400 mt-2">Shortlisted or hired by your company</p>
        </div>
      </div>

      {/* Candidate List Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Forwarded Candidate Profiles</h2>
            <p className="text-xs text-gray-500 mt-0.5">Showing candidates assigned to your company</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              />
            </div>

            {uniqueCities.length > 0 && (
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-700"
              >
                <option value="all">All Locations</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <th className="px-6 py-4 font-semibold">Candidate Info</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Education / Profile</th>
                <th className="px-6 py-4 font-semibold">Review / Selection Status</th>
                <th className="px-6 py-4 font-semibold text-right">Resume / CV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    Loading permitted candidate profiles...
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <Users size={24} />
                      </div>
                      <p className="text-base font-semibold text-gray-800">No Candidates Assigned Yet</p>
                      <p className="text-xs text-gray-500 max-w-md">
                        Fast Careers administration has not assigned candidate profiles to your company yet. As soon as candidates are forwarded by the admin, their complete profiles and resumes will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCandidates.map(candidate => (
                  <tr key={candidate._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{candidate.firstName} {candidate.lastName}</div>
                      <div className="text-xs text-gray-500">{candidate.email}</div>
                      {candidate.phone && (
                        <div className="text-xs text-gray-400 mt-0.5">{candidate.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {candidate.personalDetails?.currentCity ? (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          {candidate.personalDetails.currentCity}, {candidate.personalDetails.currentState || ''}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {(candidate.caPortfolio?.caFinal?.group1Attempts || candidate.caPortfolio?.caFinal?.bothGroups1stAttempt) ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                          <GraduationCap size={14} /> CA Final
                        </span>
                      ) : (candidate.caPortfolio?.caInter?.group1Attempts || candidate.caPortfolio?.caInter?.bothGroups1stAttempt) ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                          <GraduationCap size={14} /> CA Inter
                        </span>
                      ) : candidate.qualifications?.graduation?.collegeName ? (
                        <div>
                          <div className="font-medium text-gray-800">{candidate.qualifications.graduation.courseName || 'Graduation'}</div>
                          <div className="text-gray-400 text-xs">{candidate.qualifications.graduation.collegeName}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Profile on record</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={candidate.applicationStatus || 'applied'}
                        onChange={(e) => handleStatusChange(candidate._id, candidate.applicationId, e.target.value)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border outline-none cursor-pointer transition-all shadow-2xs ${
                          (candidate.applicationStatus || 'applied') === 'shortlisted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-300'
                            : (candidate.applicationStatus || 'applied') === 'hired'
                            ? 'bg-green-100 text-green-800 border-green-300 font-bold focus:ring-green-400'
                            : (candidate.applicationStatus || 'applied') === 'reviewing'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-300'
                            : (candidate.applicationStatus || 'applied') === 'interviewed'
                            ? 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-purple-300'
                            : (candidate.applicationStatus || 'applied') === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-300'
                            : 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-300'
                        }`}
                      >
                        <option value="applied">⏳ Pending Review</option>
                        <option value="reviewing">🔍 Under Review</option>
                        <option value="shortlisted">⭐ Shortlisted</option>
                        <option value="interviewed">📅 Interview Scheduled</option>
                        <option value="hired">🎉 Selected / Hired</option>
                        <option value="rejected">❌ Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {candidate.resumeUrl ? (
                        <button
                          onClick={() => viewCandidateResume(candidate)}
                          className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <FileText size={14} /> View CV
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No Resume</span>
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
