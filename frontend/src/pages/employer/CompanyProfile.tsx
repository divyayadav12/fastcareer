import React, { useState } from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { Button } from '../../components/Button';
import { Building, Globe, MapPin, Phone } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export const CompanyProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [saving, setSaving] = useState(false);

  // Mock form state
  const [formData, setFormData] = useState({
    companyName: user?.firstName || 'Company Name',
    industry: 'Information Technology',
    website: 'https://',
    phone: '',
    address: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Mock save
    setTimeout(() => {
      setSaving(false);
      alert('Company profile updated successfully!');
    }, 1000);
  };

  return (
    <EmployerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Company Profile</h1>
        <p className="text-gray-500">Update your company information visible to candidates</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
              <Building size={32} />
            </div>
            <div>
              <button type="button" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                Upload Logo
              </button>
              <p className="text-xs text-gray-500 mt-2">Recommended size: 256x256px (JPG, PNG)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input 
                type="text" 
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description about your company..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" isLoading={saving}>Save Changes</Button>
          </div>
        </form>
      </div>
    </EmployerLayout>
  );
};
