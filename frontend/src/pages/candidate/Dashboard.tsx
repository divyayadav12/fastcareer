import React, { useState, useEffect } from 'react';
import { User, FileText, Bookmark, Settings, Bell, ChevronRight, Briefcase, CheckCircle2, Upload, MapPin, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import axios from 'axios';
import { Button } from '../../components/Button';
import { CandidateLayout } from '../../layouts/CandidateLayout';

export const CandidateDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  
  // Profile Form States
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '' });
  const [education, setEducation] = useState([{ degree: '', institution: '', passingYear: '' }]);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    // Fetch full profile to populate forms
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (res.data.resumeUrl) setResumeUrl(res.data.resumeUrl);
        if (res.data.address) setAddress(res.data.address);
        if (res.data.education && res.data.education.length > 0) setEducation(res.data.education);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    if (user?.token) fetchProfile();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = uploadRes.data.url;
      
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, { resumeUrl: url }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      setResumeUrl(url);
      alert('Resume uploaded successfully!');
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, { address, education }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      alert('Profile details saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEdu = [...education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setEducation(newEdu);
  };

  return (
    <CandidateLayout>
      <h1 className="text-2xl font-bold text-text mb-8">Welcome back, {user?.firstName}!</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Resume Upload Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-text mb-4">My Resume</h2>
            {resumeUrl ? (
              <div className="mb-4 p-4 border border-green-100 bg-green-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-green-600" />
                  <span className="text-sm font-medium text-green-800">Resume Uploaded Successfully</span>
                </div>
                <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${resumeUrl}`} target="_blank" rel="noreferrer" className="text-sm text-primary font-medium hover:underline">
                  View Resume
                </a>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">You haven't uploaded a resume yet. Upload one to easily apply for jobs.</p>
            )}
            
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                  <p className="text-xs text-gray-500">PDF or Word (MAX. 5MB)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>
            {uploading && <p className="text-sm text-center text-primary mt-2">Uploading...</p>}
          </div>

          {/* Profile Details Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-text mb-6">Complete Your Profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Address Section */}
              <div>
                <h3 className="text-md font-semibold flex items-center gap-2 mb-4"><MapPin size={18} className="text-primary"/> Address Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input type="text" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="123 Main St" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                    <input type="text" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Maharashtra" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                    <input type="text" value={address.zip} onChange={(e) => setAddress({...address, zip: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="400001" />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Education Section */}
              <div>
                <h3 className="text-md font-semibold flex items-center gap-2 mb-4"><GraduationCap size={18} className="text-primary"/> Education</h3>
                {education.map((edu, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree / Qualification</label>
                      <input type="text" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="B.Tech Computer Science" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution / University</label>
                      <input type="text" value={edu.institution} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="IIT Bombay" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year</label>
                      <input type="text" value={edu.passingYear} onChange={(e) => handleEducationChange(index, 'passingYear', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="2024" />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setEducation([...education, { degree: '', institution: '', passingYear: '' }])} className="text-sm text-primary font-medium hover:underline">
                  + Add Another Education
                </button>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" isLoading={savingProfile}>Save Profile Details</Button>
              </div>
            </form>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-text mb-4">Profile Completeness</h2>
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{resumeUrl && address.city && education[0].degree ? '100%' : resumeUrl ? '80%' : '65%'} Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: resumeUrl && address.city && education[0].degree ? '100%' : resumeUrl ? '80%' : '65%' }}></div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm">
                <span className="text-gray-500 line-through">Basic Information</span>
                <CheckCircle2 size={16} className="text-green-500" />
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className={resumeUrl ? "text-gray-500 line-through" : "text-gray-700 font-medium"}>Upload Resume</span>
                {resumeUrl ? <CheckCircle2 size={16} className="text-green-500" /> : <ChevronRight size={16} className="text-gray-400" />}
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className={address.city && education[0].degree ? "text-gray-500 line-through" : "text-gray-700 font-medium"}>Add Details</span>
                {address.city && education[0].degree ? <CheckCircle2 size={16} className="text-green-500" /> : <ChevronRight size={16} className="text-gray-400" />}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
};
