import React, { useEffect, useState } from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { Shield, Activity, Users, Building, Briefcase, Settings, ClipboardList, Award, Search, RefreshCw, Eye, CheckCircle2, XCircle, Clock, Volume2, Star, MessageSquare, X, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { getResumeUrl } from '../../utils/urlHelper';

interface AssessmentSubmission {
  _id: string;
  candidate: any;
  answers: Array<{
    questionId: number;
    questionText: string;
    type: 'mcq' | 'typing' | 'audio';
    candidateAnswer: string;
    audioDurationSeconds?: number;
    isCorrect?: boolean;
  }>;
  mcqScore: number;
  totalMcqQuestions: number;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected';
  adminNotes?: string;
  adminRating?: number;
  createdAt: string;
  reviewedAt?: string;
}

export const CandidateTestResults = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [assessments, setAssessments] = useState<AssessmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentSubmission | null>(null);

  // Review modal form state
  const [reviewStatus, setReviewStatus] = useState<string>('submitted');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [savingReview, setSavingReview] = useState(false);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/assessments');
      setAssessments(res.data || []);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      toast.error('Failed to load candidate assessment submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const openReviewModal = (assessment: AssessmentSubmission) => {
    setSelectedAssessment(assessment);
    setReviewStatus(assessment.status || 'submitted');
    setReviewNotes(assessment.adminNotes || '');
    setReviewRating(assessment.adminRating || 0);
  };

  const handleSaveReview = async () => {
    if (!selectedAssessment) return;

    setSavingReview(true);
    try {
      const res = await api.put(`/assessments/${selectedAssessment._id}/review`, {
        status: reviewStatus,
        adminNotes: reviewNotes,
        adminRating: reviewRating
      });

      toast.success('Candidate evaluation saved successfully!');
      setAssessments(prev => 
        prev.map(a => a._id === selectedAssessment._id ? { ...a, ...res.data.assessment } : a)
      );
      setSelectedAssessment(null);
    } catch (err) {
      console.error('Error saving review:', err);
      toast.error('Failed to save assessment review.');
    } finally {
      setSavingReview(false);
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
    return 'CA Aspirant';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle2 size={12} /> Shortlisted</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12} /> Under Review</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12} /> Submitted</span>;
    }
  };

  const filteredAssessments = assessments.filter(a => {
    const candidate = a.candidate || {};
    const name = `${candidate.firstName || ''} ${candidate.lastName || ''}`.toLowerCase();
    const email = (candidate.email || '').toLowerCase();
    const phone = getCandidatePhone(candidate);

    const matchesSearch = name.includes(searchTerm.toLowerCase()) || 
                          email.includes(searchTerm.toLowerCase()) || 
                          phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <EmployerLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award size={13} className="text-amber-600" />
            Fast Selection Assessments
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Test Results</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Review 6-question candidate assessments, listen to voice recordings, and fast-track top talent.
          </p>
        </div>

        <button
          onClick={fetchAssessments}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs self-start md:self-auto cursor-pointer"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin text-primary' : ''} />
          Refresh
        </button>
      </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Tests Submitted</div>
            <div className="text-2xl font-black text-gray-900 mt-1">{assessments.length}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Shortlisted</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {assessments.filter(a => a.status === 'shortlisted').length}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Under Review</div>
            <div className="text-2xl font-black text-blue-600 mt-1">
              {assessments.filter(a => a.status === 'under_review').length}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Avg MCQ Score</div>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {assessments.length > 0 
                ? (assessments.reduce((sum, a) => sum + (a.mcqScore || 0), 0) / assessments.length).toFixed(1) + ' / 2'
                : '0 / 2'
              }
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search candidate name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-500 shrink-0">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Submissions ({assessments.length})</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Qualification</th>
                  <th className="px-6 py-4">MCQ Score</th>
                  <th className="px-6 py-4">Voice Recordings</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                      Loading candidate assessment submissions...
                    </td>
                  </tr>
                ) : filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-500">
                      <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-gray-800 mb-1">No Assessment Submissions Found</h3>
                      <p className="text-xs text-gray-400">
                        {assessments.length === 0 
                          ? 'When candidates take the Fast Selection Test, their answers and voice recordings will appear here.'
                          : 'Try changing your search term or status filter.'
                        }
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((item) => {
                    const candidate = item.candidate || {};
                    const phone = getCandidatePhone(candidate);
                    const qual = getCandidateQualification(candidate);
                    const audioAnswers = item.answers?.filter(a => a.type === 'audio') || [];

                    return (
                      <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Candidate */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-sm">
                            {candidate.firstName} {candidate.lastName}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{candidate.email}</div>
                          {phone && <div className="text-xs text-emerald-600 mt-0.5">{phone}</div>}
                        </td>

                        {/* Qualification */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                            {qual}
                          </span>
                        </td>

                        {/* MCQ Score */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                            item.mcqScore === 2 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                              : item.mcqScore === 1 
                              ? 'bg-amber-50 text-amber-700 border-amber-300' 
                              : 'bg-rose-50 text-rose-700 border-rose-300'
                          }`}>
                            <CheckCircle2 size={13} /> {item.mcqScore || 0} / 2
                          </span>
                        </td>

                        {/* Voice Recordings */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            <Volume2 size={14} className="text-purple-600" />
                            {audioAnswers.length} Voice Answers
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {getStatusBadge(item.status)}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openReviewModal(item)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            <Eye size={14} /> Review & Listen
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Assessment Modal */}
        {selectedAssessment && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      Assessment Review: {selectedAssessment.candidate?.firstName} {selectedAssessment.candidate?.lastName}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800">
                      MCQ: {selectedAssessment.mcqScore} / 2
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedAssessment.candidate?.email} • {getCandidatePhone(selectedAssessment.candidate)} • {getCandidateQualification(selectedAssessment.candidate)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                
                {/* 1. Answers Review */}
                <div className="space-y-6">
                  {selectedAssessment.answers?.map((ans, idx) => {
                    return (
                      <div key={idx} className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {ans.questionId}
                            </span>
                            <h4 className="font-bold text-sm text-gray-900 leading-snug">
                              {ans.questionText}
                            </h4>
                          </div>

                          <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-700 shrink-0">
                            {ans.type === 'mcq' ? 'MCQ' : ans.type === 'typing' ? 'Written Text' : 'Voice Audio'}
                          </span>
                        </div>

                        {/* Answer Rendering */}
                        <div className="pl-8">
                          {ans.type === 'mcq' ? (
                            <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold">
                              {ans.isCorrect ? (
                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                              ) : (
                                <XCircle size={18} className="text-rose-600 shrink-0" />
                              )}
                              <span className={ans.isCorrect ? 'text-emerald-900' : 'text-rose-900'}>
                                {ans.candidateAnswer}
                              </span>
                              <span className="ml-auto text-xs text-gray-400 font-normal">
                                {ans.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                              </span>
                            </div>
                          ) : ans.type === 'typing' ? (
                            <div className="p-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {ans.candidateAnswer}
                            </div>
                          ) : (
                            /* Voice Audio Player */
                            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
                              <div className="flex items-center gap-2 text-xs font-bold text-purple-900 uppercase">
                                <Volume2 size={16} className="text-purple-600" />
                                Spoken Voice Recording
                              </div>
                              <audio 
                                controls 
                                src={ans.candidateAnswer} 
                                className="w-full h-10 mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 2. Admin Evaluation & Feedback Box */}
                <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-6 space-y-4">
                  <h4 className="font-bold text-sm text-blue-950 uppercase tracking-wider flex items-center gap-2">
                    <Award size={18} className="text-primary" /> Admin Evaluation & Decision
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Status Select */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Candidate Test Status
                      </label>
                      <select
                        value={reviewStatus}
                        onChange={(e) => setReviewStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="shortlisted">⭐ Shortlisted for Interview</option>
                        <option value="rejected">❌ Rejected</option>
                      </select>
                    </div>

                    {/* Star Rating */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Candidate Rating (1 to 5 Stars)
                      </label>
                      <div className="flex items-center gap-2 py-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              size={24}
                              className={star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-gray-600 ml-2">
                          {reviewRating > 0 ? `${reviewRating} / 5 Stars` : 'Unrated'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Notes */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Recruiter Feedback / Notes
                    </label>
                    <textarea
                      rows={3}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Enter feedback on communication clarity, technical depth, interview recommendation..."
                      className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white sticky bottom-0">
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReview}
                  disabled={savingReview}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {savingReview ? (
                    'Saving...'
                  ) : (
                    <>
                      <Send size={14} /> Save Evaluation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
    </EmployerLayout>
  );
};
