import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { AdminLayout } from '../../layouts/AdminLayout';
import { PlusCircle, Briefcase, X, MapPin, Building, DollarSign, Trash2, Search, Check, Users, User, Mail } from 'lucide-react';
import { Button } from '../../components/Button';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { ALL_CITIES } from '../../utils/constants';

export const ManageJobs = () => {
  const { user } = useSelector((state: any) => state.auth);
  const Layout = user?.role === 'admin' ? AdminLayout : EmployerLayout;
  const [jobs, setJobs] = useState<any[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);
  const [selectedEmployerIds, setSelectedEmployerIds] = useState<string[]>([]);
  const [activeDropdownEmployerId, setActiveDropdownEmployerId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: user?.companyName || '',
    location: '',
    type: 'Full-time',
    category: '',
    salaryRange: '',
    description: '',
    requirements: '',
    responsibilities: ''
  });

  const fetchEmployers = async () => {
    try {
      const res = await api.get('/users/employers');
      const empList = res.data || [];
      setEmployers(empList);
      if (empList.length > 0 && !activeDropdownEmployerId) {
        setActiveDropdownEmployerId(empList[0]._id);
        setSelectedEmployerIds([empList[0]._id]);
      }
    } catch (err) {
      console.error('Error fetching employers:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs/employer');
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchJobs();
      if (user?.role === 'admin') {
        fetchEmployers();
      }
    }
  }, [user]);

  const handleSelectEmployerFromDropdown = (empId: string) => {
    setActiveDropdownEmployerId(empId);
    if (empId && !selectedEmployerIds.includes(empId)) {
      setSelectedEmployerIds(prev => [...prev, empId]);
    }
  };

  const toggleEmployerSelection = (empId: string) => {
    setSelectedEmployerIds(prev => 
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  const selectAllEmployers = () => {
    setSelectedEmployerIds(employers.map(e => e._id));
  };

  const clearAllEmployers = () => {
    setSelectedEmployerIds([]);
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"? All associated applications will also be removed.`)) {
      return;
    }

    setDeletingId(jobId);
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success(`Job "${jobTitle}" deleted successfully!`);
      setJobs(prev => prev.filter((j: any) => j._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        targetEmployers: selectedEmployerIds,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        responsibilities: formData.responsibilities.split('\n').filter(r => r.trim())
      };
      
      await api.post('/jobs', payload);
      toast.success('Job posted successfully and shared with selected companies!');
      
      setShowModal(false);
      setSelectedEmployerIds([]);
      setFormData({
        title: '',
        company: user?.companyName || '',
        location: '',
        type: 'Full-time',
        category: '',
        salaryRange: '',
        description: '',
        requirements: '',
        responsibilities: ''
      });
      fetchJobs();
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Error creating job. Please ensure all fields are filled properly.');
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-text">Manage Jobs</h1>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <PlusCircle size={18} /> Post a New Job
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={32} />
          </div>
          <h2 className="text-lg font-bold text-text mb-2">No jobs posted yet</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">You haven't posted any jobs. Start posting jobs to find the right candidates for your company.</p>
          <Button onClick={() => setShowModal(true)}>Post Your First Job</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job: any) => (
            <div key={job._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-gray-300 transition-all">
              <div>
                <h3 className="text-lg font-bold text-text mb-2">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Building size={14}/> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign size={14}/> {job.salaryRange || 'Not Disclosed'}</span>
                </div>
                {job.targetEmployers && job.targetEmployers.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-semibold text-slate-500">Shared with HR Portal:</span>
                    {job.targetEmployers.map((emp: any) => (
                      <span key={emp._id || emp} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 font-medium">
                        🏢 {emp.companyName || `${emp.firstName || ''} ${emp.lastName || ''}`} ({emp.email || 'HR Email'})
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="flex flex-col items-end gap-1">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{job.type}</span>
                  <span className="text-xs text-gray-400">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => handleDeleteJob(job._id, job.title)}
                  disabled={deletingId === job._id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100 disabled:opacity-50"
                  title="Delete Job"
                >
                  <Trash2 size={18} className={deletingId === job._id ? 'animate-pulse text-red-500' : ''} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-3xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-text">Post a New Job</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form id="jobForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. CA Article Assistant"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company / Firm Name *</label>
                    <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input required type="text" list="allCitiesList" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Search city..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                    <datalist id="allCitiesList">
                      {ALL_CITIES.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
                    <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none">
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Articleship">Articleship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none">
                      <option value="">Select Category</option>
                      <option value="Auditing">Auditing</option>
                      <option value="Taxation">Taxation</option>
                      <option value="Finance">Finance</option>
                      <option value="Accounting">Accounting</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary / Stipend *</label>
                    <select required value={formData.salaryRange} onChange={e => setFormData({...formData, salaryRange: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none">
                      <option value="">Select Salary / Stipend</option>
                      <option value="₹5,000 - ₹10,000 / month">₹5,000 - ₹10,000 / month</option>
                      <option value="₹10,000 - ₹20,000 / month">₹10,000 - ₹20,000 / month</option>
                      <option value="₹20,000 - ₹50,000 / month">₹20,000 - ₹50,000 / month</option>
                      <option value="₹3LPA - ₹5LPA">₹3LPA - ₹5LPA</option>
                      <option value="₹5LPA - ₹10LPA">₹5LPA - ₹10LPA</option>
                      <option value="₹10LPA+">₹10LPA+</option>
                      <option value="Not Disclosed">Not Disclosed</option>
                    </select>
                  </div>
                </div>

                {/* SHARE JOB & APPLICANTS WITH REGISTERED COMPANIES (3 SYNCED DROPDOWNS) */}
                {user?.role === 'admin' && (
                  <div className="bg-indigo-50/40 p-5 rounded-xl border border-indigo-100/80 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-indigo-100">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <Building size={16} className="text-indigo-600" /> Share Job & Applicants with Companies (3 Synced Dropdowns)
                        </label>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Select company by Company Name, HR Name, or Email. Job & applicant details will auto-share with selected HRs.
                        </p>
                      </div>
                      {selectedEmployerIds.length > 0 && (
                        <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 shrink-0">
                          {selectedEmployerIds.length} Company Selected
                        </span>
                      )}
                    </div>

                    {/* 3 LINKED DROPDOWNS OF REGISTERED COMPANIES */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {/* Dropdown 1: Registered Company Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                          <Building size={13} className="text-indigo-600" /> 1. Registered Company Name
                        </label>
                        <select
                          value={activeDropdownEmployerId}
                          onChange={(e) => handleSelectEmployerFromDropdown(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-2xs"
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

                      {/* Dropdown 2: HR Representative */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                          <User size={13} className="text-indigo-600" /> 2. HR Representative
                        </label>
                        <select
                          value={activeDropdownEmployerId}
                          onChange={(e) => handleSelectEmployerFromDropdown(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-2xs"
                        >
                          {employers.length === 0 ? (
                            <option value="">No HR Registered</option>
                          ) : (
                            employers.map(emp => (
                              <option key={emp._id} value={emp._id}>
                                {emp.firstName} {emp.lastName || ''} (Company)
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      {/* Dropdown 3: Company Email */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                          <Mail size={13} className="text-indigo-600" /> 3. Company Email
                        </label>
                        <select
                          value={activeDropdownEmployerId}
                          onChange={(e) => handleSelectEmployerFromDropdown(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-2xs"
                        >
                          {employers.length === 0 ? (
                            <option value="">No Company Email</option>
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

                    {/* Selected Companies Badges */}
                    {selectedEmployerIds.length > 0 && (
                      <div className="pt-2 border-t border-indigo-100/80">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-600 mr-1">Selected Target HRs:</span>
                          {selectedEmployerIds.map(empId => {
                            const emp = employers.find(e => e._id === empId);
                            if (!emp) return null;
                            return (
                              <span
                                key={empId}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-indigo-900 border border-indigo-200 rounded-lg text-xs font-semibold shadow-2xs"
                              >
                                🏢 {emp.companyName || emp.firstName} ({emp.email})
                                <button
                                  type="button"
                                  onClick={() => toggleEmployerSelection(empId)}
                                  className="hover:text-rose-600 text-slate-400 font-bold ml-1 cursor-pointer transition-colors"
                                  title="Remove company"
                                >
                                  <X size={13} />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Describe the role..."></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (One per line) *</label>
                  <textarea required value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. CA Inter Both Groups Cleared&#10;Good knowledge of Tally"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (One per line) *</label>
                  <textarea required value={formData.responsibilities} onChange={e => setFormData({...formData, responsibilities: e.target.value})} rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Assisting in Statutory Audit&#10;Filing GST Returns"></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-xl">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button form="jobForm" type="submit">Post Job</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
