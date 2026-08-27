import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const PlacementDriveForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    currentCity: '',
    caStatus: '',
    grad_completed: '',
    caInter_bothGroups1stAttempt: false,
    caFinal_bothGroups1stAttempt: false,
    articleshipFirmName: '',
    articleshipMonths: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Post to the webhook endpoint which acts as a universal intake endpoint
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/webhooks/zoho`, formData);
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting form', error);
      alert('Error submitting form. Please try again.');
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 py-6 px-8 text-white">
          <h2 className="text-3xl font-bold">CA Placement Drive Registration</h2>
          <p className="mt-2 text-blue-100">Fill out this form to register for the upcoming placement drive.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Section: Account Details */}
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Create Password *</label>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                <p className="text-xs text-gray-500 mt-1">You will use this password to log in to your dashboard later.</p>
              </div>
            </div>
          </div>

          {/* Section: Professional Details */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current City</label>
                <input type="text" name="currentCity" value={formData.currentCity} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CA Status</label>
                <select name="caStatus" value={formData.caStatus} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                  <option value="">Select Status...</option>
                  <option value="CA Fresher">CA Fresher</option>
                  <option value="CA Experienced">CA Experienced</option>
                  <option value="CA Inter">CA Inter</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Articleship Firm Name</label>
                <input type="text" name="articleshipFirmName" value={formData.articleshipFirmName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Articleship Duration (Months)</label>
                <input type="number" name="articleshipMonths" value={formData.articleshipMonths} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
              </div>

              <div className="md:col-span-2 flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <input type="checkbox" name="caInter_bothGroups1stAttempt" checked={formData.caInter_bothGroups1stAttempt} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" id="caInter_bothGroups1stAttempt" />
                <label htmlFor="caInter_bothGroups1stAttempt" className="text-sm font-medium text-gray-700 cursor-pointer">Cleared CA Inter Both Groups in 1st Attempt</label>
              </div>

              <div className="md:col-span-2 flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <input type="checkbox" name="caFinal_bothGroups1stAttempt" checked={formData.caFinal_bothGroups1stAttempt} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" id="caFinal_bothGroups1stAttempt" />
                <label htmlFor="caFinal_bothGroups1stAttempt" className="text-sm font-medium text-gray-700 cursor-pointer">Cleared CA Final Both Groups in 1st Attempt</label>
              </div>

            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-lg font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 text-white hover:-translate-y-1'
              }`}
            >
              {loading ? 'Submitting...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
