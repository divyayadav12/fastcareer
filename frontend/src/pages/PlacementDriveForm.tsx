import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { STATES, STATE_CITY_MAP, ALL_CITIES, YEARS, MONTHS, BOARDS, ATTEMPTS, CA_EXAM_MONTHS, NATURE_OF_WORK, COLLEGES, PREFERRED_CAMPUS_CITIES, ARTICLESHIP_TYPES } from '../utils/constants';

export const PlacementDriveForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    resumeUrl: '',
    currentCity: '',
    caStatus: '',
    grad_completed: '',
    caInter_bothGroups1stAttempt: false,
    articleshipFirmName: '',
    articleshipCity: '',
    articleshipMonths: '',
    articleshipType: '',
    articleshipFirmType: '',
    articleshipPartners: '',
    grad_percentage: '',
    grad_college: '',
    grad_yearOfCompletion: '',
    grad_type: 'REGULAR',
    class12_percentage: '',
    class12_year: '',
    class12_board: '',
    class10_percentage: '',
    class10_year: '',
    class10_board: '',
    alternatePhone: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    currentAddress: '',
    currentState: '',
    permanentAddressSameAsCurrent: false,
    permanentAddress: '',
    permanentCity: '',
    permanentState: '',
    preferredCampusCity: '',
    prefCity1: '', prefCity2: '', prefCity3: '', prefCity4: '', prefCity5: '',
    caInter_group1Attempts: '',
    caInter_group1Month: '',
    caInter_group1Year: '',
    caInter_group2Attempts: '',
    caInter_group2Month: '',
    caInter_group2Year: '',
    caInter_ranker: '',
    caInter_completionSessionMonth: '',
    caInter_completionSessionYear: '',
    caInter_percentage: '',
    caFinal_bothGroups1stAttempt: false,
    caFinal_group1Attempts: '',
    caFinal_group1Month: '',
    caFinal_group1Year: '',
    caFinal_group2Attempts: '',
    caFinal_group2Month: '',
    caFinal_group2Year: '',
    caFinal_ranker: '',
    caFinal_completionSessionMonth: '',
    caFinal_completionSessionYear: '',
    caFinal_percentage: '',
    articleshipCompletionDateMonth: '',
    articleshipCompletionDateYear: '',
    gmcsCompleted: '',
    big4Articleship: '',
    industrialTrainee: '',
    listedCompanyWork: '',
    natureOfWork: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'permanentAddressSameAsCurrent') {
        newData.permanentAddress = checked ? prev.currentAddress : prev.permanentAddress;
      }
      if (name === 'currentState') {
        newData.currentCity = '';
      }
      if (name === 'permanentState') {
        newData.permanentCity = '';
      }
      return newData;
    });
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      const uploadData = new FormData();
      uploadData.append('resume', file);
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData(prev => ({ ...prev, resumeUrl: res.data.url }));
    } catch (error) {
      console.error("Resume upload failed:", error);
      alert("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const validateStep = (step: number) => {
    setError(null);
    if (step === 1) {
      if (!formData.resumeUrl) {
        setError("Please upload your resume.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
        setError("Phone number must be exactly 10 digits.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (formData.alternatePhone && !/^\d{10}$/.test(formData.alternatePhone)) {
        setError("Alternate phone number must be exactly 10 digits.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (formData.password && formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
      if (!formData.firstName || !formData.email || !formData.phone || !formData.password) {
        setError("Please fill all required fields in this step.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
    }
    
    if (step === 2) {
      const percentages = [
        formData.caInter_percentage, formData.caFinal_percentage
      ];
      for (const p of percentages) {
        if (p) {
          const num = parseFloat(p);
          if (isNaN(num) || num < 0 || num > 100) {
            setError("Percentages must be a valid number between 0 and 100.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
          }
        }
      }
    }

    if (step === 3) {
      const percentages = [
        formData.grad_percentage, formData.class12_percentage, formData.class10_percentage
      ];
      for (const p of percentages) {
        if (p) {
          const num = parseFloat(p);
          if (isNaN(num) || num < 0 || num > 100) {
            setError("Percentages must be a valid number between 0 and 100.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
          }
        }
      }
    }
    return true;
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/webhooks/zoho`, formData);
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting form', err);
      setError('Error submitting form. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border-t-4 border-green-500">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">Your profile has been successfully created. You can now log in using your email and password.</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700 transition duration-300"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
        <div className="bg-primary py-6 px-8 text-white">
          <h2 className="text-3xl font-bold">CA Placement Drive Registration</h2>
          <p className="text-white mt-2">Fill in your details below to register for the upcoming placement drive. (Step {currentStep} of 3)</p>
          <div className="w-full bg-white/20 rounded-full h-2 mt-4">
            <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm m-6">
            <p className="font-medium">Please correct the following errors:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {currentStep === 1 && (
            <div className="space-y-8 animate-fadeIn">
              
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-900 border-b border-blue-200 pb-2 mb-4">Resume Upload *</h3>
                <label className="block text-sm font-medium text-blue-800 mb-1">Upload Resume (PDF, DOCX)</label>
                <input required={!formData.resumeUrl} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={uploading} className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition" />
                {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                {formData.resumeUrl && <p className="text-sm text-green-600 mt-1 font-medium">Resume uploaded successfully!</p>}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Create Password *</label>
                    <div className="relative">
                      <input required type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10" />
                      <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone Number</label>
                    <input type="tel" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select Gender...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select Status...</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
                    <input type="text" name="currentAddress" value={formData.currentAddress} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current State</label>
                    <select name="currentState" value={formData.currentState} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select State...</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current City</label>
                    <select name="currentCity" value={(formData.currentCity === 'Other' || (formData.currentCity && formData.currentState && STATE_CITY_MAP[formData.currentState] && !STATE_CITY_MAP[formData.currentState].includes(formData.currentCity))) ? 'Other' : formData.currentCity} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white" disabled={!formData.currentState}>
                      <option value="">Select City...</option>
                      {(formData.currentState ? STATE_CITY_MAP[formData.currentState] || ALL_CITIES : ALL_CITIES).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {(formData.currentCity === 'Other' || (formData.currentCity && formData.currentState && STATE_CITY_MAP[formData.currentState] && !STATE_CITY_MAP[formData.currentState].includes(formData.currentCity))) && (
                      <input type="text" name="currentCity" placeholder="Enter your city" value={formData.currentCity === 'Other' ? '' : formData.currentCity} onChange={handleChange} required className="mt-2 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                    <input type="text" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} disabled={formData.permanentAddressSameAsCurrent} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div className="md:col-span-2 flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <input type="checkbox" name="permanentAddressSameAsCurrent" checked={formData.permanentAddressSameAsCurrent} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" id="permanentAddressSameAsCurrent" />
                    <label htmlFor="permanentAddressSameAsCurrent" className="text-sm font-medium text-gray-700 cursor-pointer">Permanent Address is same as Current</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permanent State</label>
                    <select name="permanentState" value={formData.permanentState} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select State...</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permanent City</label>
                    <select name="permanentCity" value={(formData.permanentCity === 'Other' || (formData.permanentCity && formData.permanentState && STATE_CITY_MAP[formData.permanentState] && !STATE_CITY_MAP[formData.permanentState].includes(formData.permanentCity))) ? 'Other' : formData.permanentCity} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white" disabled={!formData.permanentState}>
                      <option value="">Select City...</option>
                      {(formData.permanentState ? STATE_CITY_MAP[formData.permanentState] || ALL_CITIES : ALL_CITIES).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {(formData.permanentCity === 'Other' || (formData.permanentCity && formData.permanentState && STATE_CITY_MAP[formData.permanentState] && !STATE_CITY_MAP[formData.permanentState].includes(formData.permanentCity))) && (
                      <input type="text" name="permanentCity" placeholder="Enter your city" value={formData.permanentCity === 'Other' ? '' : formData.permanentCity} onChange={handleChange} required className="mt-2 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">CA Portfolio Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CA Status</label>
                    <select name="caStatus" value={formData.caStatus} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select Status...</option>
                      <option value="CA Fresher">CA Fresher</option>
                      <option value="CA Experienced">CA Experienced</option>
                      <option value="CA Inter">CA Inter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GMCS Completed?</label>
                    <select name="gmcsCompleted" value={formData.gmcsCompleted} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select...</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="text-md font-semibold text-gray-800 mt-4 mb-2">CA Inter Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Group 1 Attempts</label>
                        <select name="caInter_group1Attempts" value={formData.caInter_group1Attempts} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Select...</option>
                          {ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Group 1 Month</label>
                        <select name="caInter_group1Month" value={formData.caInter_group1Month} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Month...</option>
                          {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Group 1 Year</label>
                        <select name="caInter_group1Year" value={formData.caInter_group1Year} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Year...</option>
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Group 2 Attempts</label>
                        <select name="caInter_group2Attempts" value={formData.caInter_group2Attempts} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Select...</option>
                          {ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Group 2 Month</label>
                        <select name="caInter_group2Month" value={formData.caInter_group2Month} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Month...</option>
                          {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Group 2 Year</label>
                        <select name="caInter_group2Year" value={formData.caInter_group2Year} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Year...</option>
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Ranker</label>
                        <select name="caInter_ranker" value={formData.caInter_ranker} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Percentage</label>
                        <input type="text" name="caInter_percentage" value={formData.caInter_percentage} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-3">
                      <input type="checkbox" name="caInter_bothGroups1stAttempt" checked={formData.caInter_bothGroups1stAttempt} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" id="caInter_bothGroups1stAttempt" />
                      <label htmlFor="caInter_bothGroups1stAttempt" className="text-sm font-medium text-gray-700 cursor-pointer">Cleared Both Groups in 1st Attempt</label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="text-md font-semibold text-gray-800 mt-4 mb-2">CA Final Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Group 1 Attempts</label>
                        <select name="caFinal_group1Attempts" value={formData.caFinal_group1Attempts} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Select...</option>
                          {ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Group 1 Month</label>
                        <select name="caFinal_group1Month" value={formData.caFinal_group1Month} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Month...</option>
                          {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Group 1 Year</label>
                        <select name="caFinal_group1Year" value={formData.caFinal_group1Year} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Year...</option>
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Group 2 Attempts</label>
                        <select name="caFinal_group2Attempts" value={formData.caFinal_group2Attempts} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Select...</option>
                          {ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Group 2 Month</label>
                        <select name="caFinal_group2Month" value={formData.caFinal_group2Month} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Month...</option>
                          {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Group 2 Year</label>
                        <select name="caFinal_group2Year" value={formData.caFinal_group2Year} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Year...</option>
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Ranker</label>
                        <select name="caFinal_ranker" value={formData.caFinal_ranker} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Percentage</label>
                        <input type="text" name="caFinal_percentage" value={formData.caFinal_percentage} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-3">
                      <input type="checkbox" name="caFinal_bothGroups1stAttempt" checked={formData.caFinal_bothGroups1stAttempt} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" id="caFinal_bothGroups1stAttempt" />
                      <label htmlFor="caFinal_bothGroups1stAttempt" className="text-sm font-medium text-gray-700 cursor-pointer">Cleared Both Groups in 1st Attempt</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">Articleship Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                    <select name="articleshipType" value={formData.articleshipType} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Select...</option>
                      {ARTICLESHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Firm Name</label>
                    <input type="text" name="articleshipFirmName" value={formData.articleshipFirmName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                    <input type="text" name="articleshipCity" value={formData.articleshipCity} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Duration (Months)</label>
                    <input type="number" name="articleshipMonths" value={formData.articleshipMonths} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Firm Type</label>
                    <select name="articleshipFirmType" value={formData.articleshipFirmType} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Select...</option>
                      <option value="Big 4">Big 4</option>
                      <option value="Medium">Medium Size</option>
                      <option value="Small">Small Size</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">No. of Partners</label>
                    <input type="number" name="articleshipPartners" value={formData.articleshipPartners} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Big 4 Articleship?</label>
                    <select name="big4Articleship" value={formData.big4Articleship} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Select...</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Completion Month</label>
                    <select name="articleshipCompletionDateMonth" value={formData.articleshipCompletionDateMonth} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Month...</option>
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Completion Year</label>
                    <select name="articleshipCompletionDateYear" value={formData.articleshipCompletionDateYear} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Year...</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industrial Trainee?</label>
                      <select name="industrialTrainee" value={formData.industrialTrainee} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Listed Company Work Experience?</label>
                      <select name="listedCompanyWork" value={formData.listedCompanyWork} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nature of Work in Articleship</label>
                      <select name="natureOfWork" value={formData.natureOfWork} onChange={handleChange} className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="">Select...</option>
                        {NATURE_OF_WORK.map(work => (
                          <option key={work} value={work}>{work}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">Educational Qualifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Completed?</label>
                    <select name="grad_completed" value={formData.grad_completed} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select...</option>
                      <option value="Yes">Yes</option>
                      <option value="No/Pursuing">No/Pursuing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduation College Name</label>
                    <select name="grad_college" value={formData.grad_college} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select College...</option>
                      {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Percentage</label>
                    <input type="number" name="grad_percentage" value={formData.grad_percentage} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                    <select name="grad_yearOfCompletion" value={formData.grad_yearOfCompletion} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select Year...</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Type</label>
                    <select name="grad_type" value={formData.grad_type} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="REGULAR">Regular</option>
                      <option value="CORRESPONDENCE">Correspondence</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class 12th Board</label>
                    <select name="class12_board" value={formData.class12_board} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select Board...</option>
                      {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class 12th Percentage</label>
                    <input type="number" name="class12_percentage" value={formData.class12_percentage} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class 12th Year</label>
                    <select name="class12_year" value={formData.class12_year} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select Year...</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class 10th Board</label>
                    <select name="class10_board" value={formData.class10_board} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select Board...</option>
                      {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class 10th Percentage</label>
                    <input type="number" name="class10_percentage" value={formData.class10_percentage} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class 10th Year</label>
                    <select name="class10_year" value={formData.class10_year} onChange={handleChange} className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                      <option value="">Select Year...</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 flex flex-col-reverse sm:flex-row justify-between gap-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="w-full sm:w-1/3 text-base sm:text-lg font-bold py-3 sm:py-4 px-4 sm:px-8 rounded-xl shadow-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
              >
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className={`w-full ${currentStep === 1 ? '' : 'sm:w-2/3'} text-base sm:text-lg font-bold py-3 sm:py-4 px-4 sm:px-8 rounded-xl shadow-lg bg-primary hover:bg-primary-hover hover:shadow-primary/30 text-white hover:-translate-y-1 transition-all duration-300`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-2/3 text-base sm:text-lg font-bold py-3 sm:py-4 px-4 sm:px-8 rounded-xl shadow-lg transition-all duration-300 ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover hover:shadow-primary/30 text-white hover:-translate-y-1'
                }`}
              >
                {loading ? 'Submitting...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
