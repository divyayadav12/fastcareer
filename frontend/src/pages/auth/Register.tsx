import toast from 'react-hot-toast';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { register, reset } from '../../store/authSlice';
import type { AppDispatch, RootState } from '../../store';
import api from '../../services/api';

export const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // New Candidate Fields
  const [phone, setPhone] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [workStatus, setWorkStatus] = useState<'fresher' | 'experienced'>('experienced');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get('type');
  const [role, setRole] = useState<'candidate' | 'employer'>(
    typeParam === 'employer' ? 'employer' : 'candidate'
  );
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      if (user?.role === 'candidate') {
        navigate('/candidate/dashboard');
      } else if (user?.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/');
      }
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let uploadedResumeUrl = '';

    if (role === 'candidate') {
      if (!phone || !currentCity) {
        toast.error("Please fill in all mandatory candidate fields.");
        return;
      }
      
      if (resumeFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('resume', resumeFile);
        try {
          const res = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          uploadedResumeUrl = res.data.url;
        } catch (error) {
          toast.error("Failed to upload resume. Please try again.");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      ...(role === 'candidate' && {
        phone,
        currentCity,
        isFresherCA: workStatus === 'fresher',
        resumeUrl: uploadedResumeUrl
      })
    };

    dispatch(register(userData));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center pt-28 pb-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your {role === 'candidate' ? 'Candidate' : 'Employer'} profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Search & apply to jobs from India's No.1 CA Job Site
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-red-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          <div className="flex mb-6 p-1 bg-gray-100 rounded-lg max-w-sm mx-auto">
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'candidate' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setRole('candidate')}
            >
              Candidate
            </button>
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'employer' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setRole('employer')}
            >
              Employer
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Divya" />
              <Input label="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Yadav" />
            </div>

            <Input label="Email address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tell us your Email ID" />
            <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="(Minimum 6 characters)" />

            {role === 'candidate' && (
              <>
                <Input label="Mobile number" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 Enter your mobile number" />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work status *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`border p-4 rounded-lg cursor-pointer ${workStatus === 'experienced' ? 'border-primary bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setWorkStatus('experienced')}
                    >
                      <h4 className="font-bold text-gray-800">I'm experienced</h4>
                      <p className="text-xs text-gray-500 mt-1">I have work experience (excluding internships)</p>
                    </div>
                    <div 
                      className={`border p-4 rounded-lg cursor-pointer ${workStatus === 'fresher' ? 'border-primary bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setWorkStatus('fresher')}
                    >
                      <h4 className="font-bold text-gray-800">I'm a fresher</h4>
                      <p className="text-xs text-gray-500 mt-1">I am a student/Haven't worked after graduation</p>
                    </div>
                  </div>
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current city <span className="text-red-500">*</span></label>
                  <select 
                    required 
                    value={currentCity} 
                    onChange={(e) => setCurrentCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="" disabled>Select your city</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Surat">Surat</option>
                    <option value="Pune">Pune</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Lucknow">Lucknow</option>
                    <option value="Kanpur">Kanpur</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Indore">Indore</option>
                    <option value="Thane">Thane</option>
                    <option value="Bhopal">Bhopal</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                    <option value="Patna">Patna</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Ghaziabad">Ghaziabad</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resume Upload (PDF) <span className="text-gray-400 font-normal ml-1">Optional, but recommended</span></label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                          <span className="px-3 py-2 border border-gray-300 rounded-md shadow-sm">Choose File</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            accept=".pdf" 
                            ref={fileInputRef}
                            onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        {resumeFile ? resumeFile.name : 'No file chosen'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="pt-4">
              <Button type="submit" className="w-full justify-center py-3 text-lg" disabled={isLoading || isUploading}>
                {isUploading ? 'Uploading Resume...' : isLoading ? 'Registering...' : `Register Now`}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
