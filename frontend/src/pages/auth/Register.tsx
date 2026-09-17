import toast from 'react-hot-toast';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Search, ChevronDown, Check, X } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { register, reset } from '../../store/authSlice';
import type { AppDispatch, RootState } from '../../store';
import api from '../../services/api';
import { ALL_CITIES } from '../../utils/constants';

const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune', 'Kolkata',
  'Ahmedabad', 'Chennai', 'Jaipur', 'Indore', 'Chandigarh', 'Lucknow',
  'Surat', 'Noida', 'Gurgaon', 'Bhopal', 'Vadodara', 'Kanpur'
];

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
  
  // Searchable City Dropdown state
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter cities based on search input
  const filteredCities = useMemo(() => {
    const query = citySearchQuery.trim().toLowerCase();
    if (!query) {
      return ALL_CITIES.slice(0, 100);
    }
    return ALL_CITIES.filter(c => c.toLowerCase().includes(query)).slice(0, 100);
  }, [citySearchQuery]);
  
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

                
                <div className="relative" ref={cityDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current city <span className="text-red-500">*</span>
                  </label>

                  {/* Dropdown Trigger Box */}
                  <div
                    onClick={() => {
                      setCityDropdownOpen(prev => !prev);
                      setTimeout(() => cityInputRef.current?.focus(), 100);
                    }}
                    className={`w-full px-4 py-2.5 border rounded-xl flex items-center justify-between cursor-pointer bg-white transition-all shadow-sm ${
                      cityDropdownOpen ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <MapPin size={18} className={currentCity ? 'text-primary shrink-0' : 'text-gray-400 shrink-0'} />
                      <span className={`block truncate text-sm ${currentCity ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                        {currentCity || 'Search or select your city...'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      {currentCity && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentCity('');
                            setCitySearchQuery('');
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                          title="Clear city"
                        >
                          <X size={14} />
                        </button>
                      )}
                      <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${cityDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                    </div>
                  </div>

                  {/* Hidden Input for HTML5 form validation */}
                  <input
                    type="text"
                    tabIndex={-1}
                    value={currentCity}
                    required
                    onChange={() => {}}
                    className="opacity-0 absolute inset-x-0 bottom-0 h-0 pointer-events-none"
                  />

                  {/* Dropdown Menu */}
                  {cityDropdownOpen && (
                    <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      {/* Search Input Bar */}
                      <div className="p-3 border-b border-gray-100 bg-gray-50/80">
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            ref={cityInputRef}
                            type="text"
                            value={citySearchQuery}
                            onChange={(e) => setCitySearchQuery(e.target.value)}
                            placeholder="Type city name (e.g. Pune, Jaipur, Indore...)"
                            className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                          />
                          {citySearchQuery && (
                            <button
                              type="button"
                              onClick={() => setCitySearchQuery('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Popular Cities Chips (visible when not searching) */}
                      {!citySearchQuery.trim() && (
                        <div className="p-3 border-b border-gray-100 bg-white">
                          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Popular Cities
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {POPULAR_CITIES.map(city => (
                              <button
                                key={city}
                                type="button"
                                onClick={() => {
                                  setCurrentCity(city);
                                  setCityDropdownOpen(false);
                                  setCitySearchQuery('');
                                }}
                                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                                  currentCity === city
                                    ? 'bg-primary text-white shadow-sm font-semibold'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                                }`}
                              >
                                {city}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* City Options List */}
                      <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                        <div className="px-3 py-1.5 bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 z-10 flex justify-between items-center">
                          <span>{citySearchQuery.trim() ? `Search Results` : 'All Indian Cities (A-Z)'}</span>
                          <span className="text-[10px] text-gray-400 font-normal">
                            {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'}
                          </span>
                        </div>

                        {filteredCities.length > 0 ? (
                          filteredCities.map(city => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                setCurrentCity(city);
                                setCityDropdownOpen(false);
                                setCitySearchQuery('');
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-blue-50/70 transition-colors ${
                                currentCity === city ? 'bg-blue-50 font-semibold text-primary' : 'text-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <MapPin size={14} className={currentCity === city ? 'text-primary' : 'text-gray-400'} />
                                <span>{city}</span>
                              </div>
                              {currentCity === city && <Check size={16} className="text-primary" />}
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center">
                            <p className="text-sm text-gray-500 mb-2">No cities found matching "{citySearchQuery}"</p>
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentCity(citySearchQuery.trim());
                                setCityDropdownOpen(false);
                                setCitySearchQuery('');
                              }}
                              className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-primary border border-primary/20 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              Use "{citySearchQuery.trim()}" as my city
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Footer notice */}
                      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-center text-[11px] text-gray-400">
                        Search from 4,000+ Indian cities across all states
                      </div>
                    </div>
                  )}
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
