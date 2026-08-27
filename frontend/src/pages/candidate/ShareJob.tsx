import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Button } from '../../components/Button';
import { Share2, Building, MapPin, Briefcase, User, Mail, Phone, Hash } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export const ShareJob = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    industry: '',
    companyName: '',
    jobDescription: '',
    location: '',
    region: '',
    noOfPost: '',
    concernedPerson: '',
    mobileNo: '',
    emailId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shared-jobs`, formData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      toast.success('Job Opportunity Shared Successfully! Admin will review it.');
      setFormData({
        industry: '', companyName: '', jobDescription: '', location: '', 
        region: '', noOfPost: '', concernedPerson: '', mobileNo: '', emailId: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong while submitting.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <CandidateLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Share Job Opportunities with Us</h1>
        <p className="text-gray-500">Know about an opening? Share the details and help the community.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 max-w-4xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Industry */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry <span className="text-red-500">*</span></label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                <select 
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white"
                >
                  <option value="" disabled>Select Industry</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="Finance">Finance & Accounts (F&A)</option>
                  <option value="Audit">Audit</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Company Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Google, Microsoft"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            {/* Job Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea 
                rows={3}
                placeholder="Brief description of the role and requirements..."
                value={formData.jobDescription}
                onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" 
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white"
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="UAE">UAE</option>
                </select>
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region / City</label>
              <input 
                type="text" 
                placeholder="e.g. Mumbai, Delhi, Remote"
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
              />
            </div>

            {/* No of Posts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Of Posts <span className="text-red-500">*</span></label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="number" 
                  min="1"
                  placeholder="e.g. 5"
                  value={formData.noOfPost}
                  onChange={(e) => setFormData({...formData, noOfPost: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            {/* Concerned Person */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Concerned Person Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="HR or Manager Name"
                  value={formData.concernedPerson}
                  onChange={(e) => setFormData({...formData, concernedPerson: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            {/* Mobile No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No. of Contact Person</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="tel" 
                  placeholder="+91 9876543210"
                  value={formData.mobileNo}
                  onChange={(e) => setFormData({...formData, mobileNo: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            {/* Email Id */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Id</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="contact@company.com"
                  value={formData.emailId}
                  onChange={(e) => setFormData({...formData, emailId: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <Button type="submit" className="flex items-center gap-2" isLoading={saving}>
              <Share2 size={18} /> Submit Opportunity
            </Button>
          </div>
        </form>
      </div>
    </CandidateLayout>
  );
};
