import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Button } from '../../components/Button';
import { RefreshCw, Building, IndianRupee, Briefcase, Clock } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export const WantToChangeJob = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    currentCompany: '',
    currentDesignation: '',
    currentCTC: '',
    expectedCTC: '',
    noticePeriod: '30 Days',
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/candidate/job-change`, formData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      toast.success('Your request has been submitted. Our career counselors will contact you soon!');
      setFormData({
        currentCompany: '', currentDesignation: '', currentCTC: '', expectedCTC: '', noticePeriod: '30 Days', reason: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <CandidateLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Want to Change a Job?</h1>
        <p className="text-gray-500">Let us help you transition to your next big role seamlessly.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
            <RefreshCw size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">Confidential Job Search</h2>
            <p className="text-sm text-gray-500">We keep your profile discreet and only share it with top employers matching your expectations.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Current Company */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Company <span className="text-red-500">*</span></label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="text" 
                  value={formData.currentCompany}
                  onChange={(e) => setFormData({...formData, currentCompany: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            {/* Current Designation */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Designation <span className="text-red-500">*</span></label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="text" 
                  value={formData.currentDesignation}
                  onChange={(e) => setFormData({...formData, currentDesignation: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            {/* Current CTC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current CTC (in Lakhs) <span className="text-red-500">*</span></label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="number" 
                  step="0.1"
                  placeholder="e.g. 12.5"
                  value={formData.currentCTC}
                  onChange={(e) => setFormData({...formData, currentCTC: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            {/* Expected CTC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected CTC (in Lakhs) <span className="text-red-500">*</span></label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="number" 
                  step="0.1"
                  placeholder="e.g. 18.0"
                  value={formData.expectedCTC}
                  onChange={(e) => setFormData({...formData, expectedCTC: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            {/* Notice Period */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period <span className="text-red-500">*</span></label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  required
                  value={formData.noticePeriod}
                  onChange={(e) => setFormData({...formData, noticePeriod: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white"
                >
                  <option value="Immediate">Immediate Joiner</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                  <option value="90 Days">90 Days</option>
                </select>
              </div>
            </div>

            {/* Reason */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for leaving (Optional)</label>
              <textarea
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                placeholder="Looking for better growth, relocation, etc."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button type="submit" isLoading={saving}>Submit Request</Button>
          </div>
        </form>
      </div>
    </CandidateLayout>
  );
};
