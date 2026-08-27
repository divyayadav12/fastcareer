import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Button } from '../../components/Button';
import { Share2, User, Mail, Phone, Upload } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export const ReferFriend = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    friendName: '',
    friendEmail: '',
    friendPhone: '',
    relation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const data = new FormData();
      data.append('friendName', formData.friendName);
      data.append('friendEmail', formData.friendEmail);
      data.append('friendPhone', formData.friendPhone);
      if (file) {
        data.append('resume', file);
      }

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/candidate/referrals`, data, {
        headers: { 
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Referral Submitted Successfully! We will contact them soon.');
      setFormData({ friendName: '', friendEmail: '', friendPhone: '', relation: '' });
      setFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <CandidateLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Refer a Friend</h1>
        <p className="text-gray-500">Help your friends find their dream job and earn referral rewards.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 max-w-3xl">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-4">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
            <Share2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Earn up to ₹10,000 per successful referral!</h3>
            <p className="text-sm text-blue-700">When your referred friend gets successfully placed through our platform, you receive a referral bonus.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Friend's Full Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="text" 
                  value={formData.friendName}
                  onChange={(e) => setFormData({...formData, friendName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Friend's Email Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="email" 
                  value={formData.friendEmail}
                  onChange={(e) => setFormData({...formData, friendEmail: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Friend's Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="tel" 
                  value={formData.friendPhone}
                  onChange={(e) => setFormData({...formData, friendPhone: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Friend's Resume (Optional)</label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-6 h-6 mb-1 text-gray-400" />
                  <p className="text-xs text-gray-500">PDF or Word (MAX. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button type="submit" isLoading={saving}>Submit Referral</Button>
          </div>
        </form>
      </div>
    </CandidateLayout>
  );
};
