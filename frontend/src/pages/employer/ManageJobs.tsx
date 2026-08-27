import React, { useState, useEffect } from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { PlusCircle, Briefcase, X, MapPin, Building, DollarSign } from 'lucide-react';
import { Button } from '../../components/Button';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const ManageJobs = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/employer`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
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
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        responsibilities: formData.responsibilities.split('\n').filter(r => r.trim())
      };
      
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs`, payload, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      setShowModal(false);
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
      alert('Error creating job. Please ensure all fields are filled properly.');
    }
  };

  return (
    <EmployerLayout>
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
            <div key={job._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-text mb-2">{job.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Building size={14}/> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign size={14}/> {job.salaryRange}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{job.type}</span>
                <span className="text-xs text-gray-400">Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
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
                    <select required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none">
                      <option value="">Select Location</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Pune">Pune</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Other">Other</option>
                    </select>
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
    </EmployerLayout>
  );
};
