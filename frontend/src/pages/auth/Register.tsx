import toast from 'react-hot-toast';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapPin,
  Search,
  ChevronDown,
  Check,
  X,
  Building2,
  Briefcase,
  Zap,
  TrendingUp,
  GraduationCap,
  FileText,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { register, reset } from '../../store/authSlice';
import type { AppDispatch, RootState } from '../../store';
import api from '../../services/api';
import { ALL_CITIES, ATTEMPTS, CA_EXAM_MONTHS, YEARS } from '../../utils/constants';
import { parseResumeFile } from '../../utils/resumeParser';

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
  const [showPassword, setShowPassword] = useState(false);

  // Candidate Specific Fields
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [workStatus, setWorkStatus] = useState<'fresher' | 'experienced'>('experienced');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isScanningResume, setIsScanningResume] = useState(false);
  const [scannedFields, setScannedFields] = useState<string[]>([]);

  // CA Intermediate Examination State
  const [caInter, setCaInter] = useState({
    bothGroups1stAttempt: false,
    group1Attempts: '1',
    group1Month: 'May',
    group1Year: '2020',
    group2Attempts: '1',
    group2Month: 'May',
    group2Year: '2020',
    ranker: 'No',
    completionSessionMonth: 'May',
    completionSessionYear: '2020',
  });

  const handleCaInterChange = (field: string, value: any) => {
    setCaInter(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'bothGroups1stAttempt' && value === true) {
        next.group1Attempts = '1';
        next.group2Attempts = '1';
        if (next.group1Month) next.group2Month = next.group1Month;
        if (next.group1Year) next.group2Year = next.group1Year;
        if (next.group1Month) next.completionSessionMonth = next.group1Month;
        if (next.group1Year) next.completionSessionYear = next.group1Year;
      }
      if (next.bothGroups1stAttempt) {
        if (field === 'group1Month') {
          next.group2Month = value;
          next.completionSessionMonth = value;
        }
        if (field === 'group1Year') {
          next.group2Year = value;
          next.completionSessionYear = value;
        }
      }
      return next;
    });
  };

  // CA Final Examination State
  const [caFinal, setCaFinal] = useState({
    bothGroups1stAttempt: false,
    group1Attempts: '1',
    group1Month: 'May',
    group1Year: '2023',
    group2Attempts: '1',
    group2Month: 'May',
    group2Year: '2023',
    ranker: 'No',
    completionSessionMonth: 'May',
    completionSessionYear: '2023',
  });

  const handleCaFinalChange = (field: string, value: any) => {
    setCaFinal(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'bothGroups1stAttempt' && value === true) {
        next.group1Attempts = '1';
        next.group2Attempts = '1';
        if (next.group1Month) next.group2Month = next.group1Month;
        if (next.group1Year) next.group2Year = next.group1Year;
        if (next.group1Month) next.completionSessionMonth = next.group1Month;
        if (next.group1Year) next.completionSessionYear = next.group1Year;
      }
      if (next.bothGroups1stAttempt) {
        if (field === 'group1Month') {
          next.group2Month = value;
          next.completionSessionMonth = value;
        }
        if (field === 'group1Year') {
          next.group2Year = value;
          next.completionSessionYear = value;
        }
      }
      return next;
    });
  };

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

  const [formError, setFormError] = useState<string>('');
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
    if (isError && message) {
      setFormError(message);
      toast.error(message, { duration: 6000 });
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

  const processResumeFile = async (file: File) => {
    if (!file) return;
    const ext = file.name.toLowerCase();
    if (!ext.endsWith('.pdf') && !ext.endsWith('.docx') && !ext.endsWith('.doc')) {
      toast.error('Please upload a valid PDF or DOCX resume.');
      return;
    }

    setResumeFile(file);
    setIsScanningResume(true);
    setScannedFields([]);

    try {
      const parsed = await parseResumeFile(file);
      const extracted: string[] = [];

      if (parsed.firstName) {
        setFirstName(parsed.firstName);
        extracted.push('First Name');
      }
      if (parsed.lastName) {
        setLastName(parsed.lastName);
        extracted.push('Last Name');
      }
      if (parsed.email) {
        setEmail(parsed.email);
        extracted.push('Email');
      }
      if (parsed.phone) {
        setPhone(parsed.phone);
        extracted.push('Phone');
      }
      if (parsed.dateOfBirth) {
        setDateOfBirth(parsed.dateOfBirth);
        extracted.push('Date of Birth');
      }
      if (parsed.city) {
        setCurrentCity(parsed.city);
        extracted.push('City');
      }
      if (parsed.linkedinUrl) {
        setLinkedinUrl(parsed.linkedinUrl);
        extracted.push('LinkedIn');
      }
      if (parsed.workStatus) {
        setWorkStatus(parsed.workStatus);
        extracted.push('Experience Stage');
      }
      if (parsed.caInterBothGroups1stAttempt !== undefined || parsed.caInterGroup1Year || parsed.caInterYear) {
        setCaInter(prev => {
          const next = { ...prev };
          if (parsed.caInterBothGroups1stAttempt !== undefined) {
            next.bothGroups1stAttempt = parsed.caInterBothGroups1stAttempt;
          }
          if (parsed.caInterGroup1Attempts) next.group1Attempts = parsed.caInterGroup1Attempts;
          if (parsed.caInterGroup1Month) next.group1Month = parsed.caInterGroup1Month;
          if (parsed.caInterGroup1Year) next.group1Year = parsed.caInterGroup1Year;
          if (parsed.caInterGroup2Attempts) next.group2Attempts = parsed.caInterGroup2Attempts;
          if (parsed.caInterGroup2Month) next.group2Month = parsed.caInterGroup2Month;
          if (parsed.caInterGroup2Year) next.group2Year = parsed.caInterGroup2Year;
          if (parsed.caInterRanker) next.ranker = parsed.caInterRanker;
          if (parsed.caInterCompletionMonth) next.completionSessionMonth = parsed.caInterCompletionMonth;
          if (parsed.caInterCompletionYear) next.completionSessionYear = parsed.caInterCompletionYear;
          return next;
        });
        extracted.push('CA Inter Details');
      }
      if (parsed.caFinalBothGroups1stAttempt !== undefined || parsed.caFinalGroup1Year || parsed.caFinalYear) {
        setCaFinal(prev => {
          const next = { ...prev };
          if (parsed.caFinalBothGroups1stAttempt !== undefined) {
            next.bothGroups1stAttempt = parsed.caFinalBothGroups1stAttempt;
          }
          if (parsed.caFinalGroup1Attempts) next.group1Attempts = parsed.caFinalGroup1Attempts;
          if (parsed.caFinalGroup1Month) next.group1Month = parsed.caFinalGroup1Month;
          if (parsed.caFinalGroup1Year) next.group1Year = parsed.caFinalGroup1Year;
          if (parsed.caFinalGroup2Attempts) next.group2Attempts = parsed.caFinalGroup2Attempts;
          if (parsed.caFinalGroup2Month) next.group2Month = parsed.caFinalGroup2Month;
          if (parsed.caFinalGroup2Year) next.group2Year = parsed.caFinalGroup2Year;
          if (parsed.caFinalRanker) next.ranker = parsed.caFinalRanker;
          if (parsed.caFinalCompletionMonth) next.completionSessionMonth = parsed.caFinalCompletionMonth;
          if (parsed.caFinalCompletionYear) next.completionSessionYear = parsed.caFinalCompletionYear;
          return next;
        });
        extracted.push('CA Final Details');
      }

      setScannedFields(extracted);

      if (extracted.length > 0) {
        toast.success(
          `Resume scanned! Auto-filled: ${extracted.join(', ')}. Please set a password to register.`,
          { duration: 6000, icon: '⚡' }
        );
      } else {
        toast.success('Resume attached successfully! Please fill in the details below.', { icon: '📄' });
      }
    } catch (error) {
      console.error('Failed to parse resume:', error);
      toast.success('Resume attached! Please complete your details below.', { icon: '📄' });
    } finally {
      setIsScanningResume(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormError('');
    let uploadedResumeUrl = '';

    if (role === 'candidate') {
      if (!phone || !currentCity) {
        setFormError('Please fill in all mandatory candidate fields (Phone, City).');
        toast.error('Please fill in all mandatory candidate fields.');
        return;
      }

      if (!dateOfBirth) {
        setFormError('Please select your Date of Birth.');
        toast.error('Please select your Date of Birth.');
        return;
      }

      if (!caInter.group1Month || !caInter.group1Year || !caInter.group2Month || !caInter.group2Year || !caInter.completionSessionMonth || !caInter.completionSessionYear) {
        setFormError('Please complete all mandatory CA Intermediate qualification details.');
        toast.error('Please complete all mandatory CA Intermediate qualification details.');
        return;
      }

      if (!caFinal.group1Month || !caFinal.group1Year || !caFinal.group2Month || !caFinal.group2Year || !caFinal.completionSessionMonth || !caFinal.completionSessionYear) {
        setFormError('Please complete all mandatory CA Final examination details.');
        toast.error('Please complete all mandatory CA Final examination details.');
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
          setFormError('Failed to upload resume. Please try again.');
          toast.error('Failed to upload resume. Please try again.');
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
      linkedinUrl: linkedinUrl.trim(),
      ...(role === 'candidate' && {
        phone,
        currentCity,
        dateOfBirth,
        isFresherCA: workStatus === 'fresher',
        resumeUrl: uploadedResumeUrl,
        caInter: {
          bothGroups1stAttempt: caInter.bothGroups1stAttempt,
          group1Attempts: caInter.group1Attempts || '1',
          group1Month: caInter.group1Month || 'May',
          group1Year: caInter.group1Year || '2020',
          group2Attempts: caInter.group2Attempts || '1',
          group2Month: caInter.group2Month || 'May',
          group2Year: caInter.group2Year || '2020',
          ranker: caInter.ranker || 'No',
          completionSessionMonth: caInter.completionSessionMonth || 'May',
          completionSessionYear: caInter.completionSessionYear || '2020',
        },
        caFinal: {
          bothGroups1stAttempt: caFinal.bothGroups1stAttempt,
          group1Attempts: caFinal.group1Attempts || '1',
          group1Month: caFinal.group1Month || 'May',
          group1Year: caFinal.group1Year || '2023',
          group2Attempts: caFinal.group2Attempts || '1',
          group2Month: caFinal.group2Month || 'May',
          group2Year: caFinal.group2Year || '2023',
          ranker: caFinal.ranker || 'No',
          completionSessionMonth: caFinal.completionSessionMonth || 'May',
          completionSessionYear: caFinal.completionSessionYear || '2023',
        },
      }),
    };

    const resultAction = await dispatch(register(userData));
    if (register.rejected.match(resultAction)) {
      const err = (resultAction.payload as string) || 'Registration failed. Please check your details.';
      setFormError(err);
      toast.error(err, { duration: 6000 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/25 to-slate-100 flex flex-col justify-between pt-24 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full pt-2 pb-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-9">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {role === 'candidate' ? 'Create Candidate Account' : 'Create Employer Account'}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
              {role === 'candidate'
                ? 'Join Fast Careers - Direct interviews for Qualified CAs & Finance professionals'
                : 'Hire top-tier Chartered Accountants & Finance leadership talent'}
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    role === 'candidate'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <GraduationCap size={16} className={role === 'candidate' ? 'text-blue-600' : 'text-slate-400'} />
                  <span>Candidate (CA / Finance)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('employer')}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    role === 'employer'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Building2 size={16} className={role === 'employer' ? 'text-blue-600' : 'text-slate-400'} />
                  <span>Employer / Recruiter</span>
                </button>
              </div>

              {/* Resume 1-Click Auto-Fill Scanner Box (Candidate Mode) */}
              {role === 'candidate' && (
                <div className="mb-5">
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                      isScanningResume
                        ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                        : isDragOver
                        ? 'border-blue-500 bg-blue-50/80 shadow-md scale-[1.01]'
                        : resumeFile
                        ? 'border-emerald-400 bg-emerald-50/40'
                        : 'border-blue-200 hover:border-blue-400 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-blue-50/50 hover:bg-blue-50/70 shadow-2xs'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          processResumeFile(e.target.files[0]);
                        }
                      }}
                    />

                    {isScanningResume ? (
                      <div className="flex flex-col items-center justify-center py-2 space-y-2">
                        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <div className="text-xs font-bold text-blue-900">
                          Scanning resume & auto-filling form details...
                        </div>
                        <div className="text-[11px] text-blue-600">
                          Extracting Name, Email, Phone, City, LinkedIn & Experience
                        </div>
                      </div>
                    ) : resumeFile ? (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={22} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                              <span>Resume Auto-Filled:</span>
                              <span className="text-emerald-700 font-semibold truncate">{resumeFile.name}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {scannedFields.length > 0
                                ? `✓ Extracted: ${scannedFields.join(', ')}`
                                : `${(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to verify`}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0 cursor-pointer"
                        >
                          Change CV
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-800 text-[10.5px] font-bold">
                          <Sparkles size={12} className="text-blue-600" />
                          <span>Auto-Fill Form in 1-Click</span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <UploadCloud size={18} className="text-blue-600" />
                          <span>Upload Resume to Auto-Fill Registration</span>
                        </div>
                        <p className="text-[11px] text-slate-500 max-w-md">
                          Drop your PDF or DOCX file here. We'll automatically scan and fill your Name, Contact, City & LinkedIn details.
                        </p>
                        <div className="pt-0.5">
                          <span className="inline-block px-3 py-1 bg-white border border-blue-200 hover:border-blue-400 text-blue-700 font-semibold text-xs rounded-lg shadow-2xs transition-all">
                            Browse CV
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Registration Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                
                {formError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200/90 rounded-2xl flex items-start gap-3 text-rose-800 text-sm shadow-2xs animate-in fade-in slide-in-from-top-2 duration-200">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-bold text-rose-900 text-xs uppercase tracking-wider">Registration Issue</div>
                      <div className="text-xs sm:text-sm text-rose-700 mt-0.5 font-medium">{formError}</div>
                    </div>
                  </div>
                )}
                
                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Rahul"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Verma"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Email and Mobile row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work / Personal Email *</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@ca.org.in"
                        className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Number *</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required={role === 'candidate'}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        maxLength={10}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Password and DOB / Location row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Create Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        minLength={6}
                        className="w-full pl-3.5 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {role === 'candidate' ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required={role === 'candidate'}
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-slate-900 cursor-pointer"
                      />
                    </div>
                  ) : (
                    /* Searchable City Location for Employer */
                    <div className="relative" ref={cityDropdownRef}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Current Location *
                      </label>
                      <div
                        onClick={() => {
                          setCityDropdownOpen(prev => !prev);
                          setTimeout(() => cityInputRef.current?.focus(), 100);
                        }}
                        className={`w-full px-3.5 py-2.5 border rounded-xl flex items-center justify-between cursor-pointer bg-white transition-all shadow-2xs ${
                          cityDropdownOpen ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MapPin size={16} className={currentCity ? 'text-primary shrink-0' : 'text-slate-400 shrink-0'} />
                          <span className={`block truncate text-sm ${currentCity ? 'font-medium text-slate-900' : 'text-slate-400'}`}>
                            {currentCity || 'Select Primary City'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 ml-1.5">
                          {currentCity && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentCity('');
                                setCitySearchQuery('');
                              }}
                              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                              title="Clear city"
                            >
                              <X size={13} />
                            </button>
                          )}
                          <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${cityDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                        </div>
                      </div>
                      <input
                        type="text"
                        tabIndex={-1}
                        value={currentCity}
                        required
                        onChange={() => {}}
                        className="opacity-0 absolute inset-x-0 bottom-0 h-0 pointer-events-none"
                      />
                    </div>
                  )}
                </div>

                {/* Candidate Location & LinkedIn row */}
                {role === 'candidate' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Searchable City Location */}
                    <div className="relative" ref={cityDropdownRef}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Current Location <span className="text-red-500">*</span>
                      </label>

                      {/* Trigger Box */}
                      <div
                        onClick={() => {
                          setCityDropdownOpen(prev => !prev);
                          setTimeout(() => cityInputRef.current?.focus(), 100);
                        }}
                        className={`w-full px-3.5 py-2.5 border rounded-xl flex items-center justify-between cursor-pointer bg-white transition-all shadow-2xs ${
                          cityDropdownOpen ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MapPin size={16} className={currentCity ? 'text-primary shrink-0' : 'text-slate-400 shrink-0'} />
                          <span className={`block truncate text-sm ${currentCity ? 'font-medium text-slate-900' : 'text-slate-400'}`}>
                            {currentCity || 'Select Primary City'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 ml-1.5">
                          {currentCity && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentCity('');
                                setCitySearchQuery('');
                              }}
                              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                              title="Clear city"
                            >
                              <X size={13} />
                            </button>
                          )}
                          <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${cityDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                        </div>
                      </div>

                      {/* Hidden input for HTML5 form validation */}
                      <input
                        type="text"
                        tabIndex={-1}
                        value={currentCity}
                        required={role === 'candidate'}
                        onChange={() => {}}
                        className="opacity-0 absolute inset-x-0 bottom-0 h-0 pointer-events-none"
                      />

                      {/* Dropdown Menu */}
                      {cityDropdownOpen && (
                        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                          <div className="p-2.5 border-b border-slate-100 bg-slate-50/80">
                            <div className="relative">
                              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input
                                ref={cityInputRef}
                                type="text"
                                value={citySearchQuery}
                                onChange={(e) => setCitySearchQuery(e.target.value)}
                                placeholder="Type city (e.g. Pune, Jaipur...)"
                                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              />
                              {citySearchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setCitySearchQuery('')}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                  <X size={13} />
                                </button>
                              )}
                            </div>
                          </div>

                          {!citySearchQuery.trim() && (
                            <div className="p-2.5 border-b border-slate-100 bg-white">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                Popular Cities
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {POPULAR_CITIES.slice(0, 10).map(city => (
                                  <button
                                    key={city}
                                    type="button"
                                    onClick={() => {
                                      setCurrentCity(city);
                                      setCityDropdownOpen(false);
                                      setCitySearchQuery('');
                                    }}
                                    className={`px-2 py-0.5 text-[11px] rounded-md font-medium transition-all ${
                                      currentCity === city
                                        ? 'bg-primary text-white font-semibold'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                  >
                                    {city}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="max-h-52 overflow-y-auto divide-y divide-slate-50">
                            <div className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 z-10 flex justify-between items-center">
                              <span>{citySearchQuery.trim() ? `Search Results` : 'All Indian Cities (A-Z)'}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {filteredCities.length} cities
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
                                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between hover:bg-blue-50/70 transition-colors ${
                                    currentCity === city ? 'bg-blue-50 font-semibold text-primary' : 'text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <MapPin size={13} className={currentCity === city ? 'text-primary' : 'text-slate-400'} />
                                    <span>{city}</span>
                                  </div>
                                  {currentCity === city && <Check size={14} className="text-primary" />}
                                </button>
                              ))
                            ) : (
                              <div className="p-3 text-center">
                                <p className="text-xs text-slate-500 mb-2">No cities found for "{citySearchQuery}"</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCurrentCity(citySearchQuery.trim());
                                    setCityDropdownOpen(false);
                                    setCitySearchQuery('');
                                  }}
                                  className="px-3 py-1 text-xs font-semibold bg-blue-50 text-primary border border-primary/20 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                  Use "{citySearchQuery.trim()}" as city
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* LinkedIn Profile ID / URL (Optional) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          LinkedIn Profile URL <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                        </label>
                        <span className="text-[10.5px] text-slate-400 font-medium">e.g. linkedin.com/in/username</span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 fill-[#0077b5]" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                          </svg>
                        </div>
                        <input
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          placeholder="https://www.linkedin.com/in/your-profile"
                          className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Candidate Career Stage & Resume Upload */}
                {role === 'candidate' && (
                  <>
                    {/* Qualification & Career Stage */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">
                        Current Qualification & Career Stage *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Experienced Card */}
                        <div
                          onClick={() => setWorkStatus('experienced')}
                          className={`border rounded-2xl p-3.5 cursor-pointer flex items-center justify-between transition-all ${
                            workStatus === 'experienced'
                              ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              workStatus === 'experienced' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <Briefcase size={18} />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">Experienced CA</div>
                              <div className="text-[11px] text-slate-500">Post-qualification exp.</div>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                            workStatus === 'experienced'
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-300'
                          }`}>
                            {workStatus === 'experienced' && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>

                        {/* Fresher Card */}
                        <div
                          onClick={() => setWorkStatus('fresher')}
                          className={`border rounded-2xl p-3.5 cursor-pointer flex items-center justify-between transition-all ${
                            workStatus === 'fresher'
                              ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              workStatus === 'fresher' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <GraduationCap size={18} />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">Fresher / Semi-CA</div>
                              <div className="text-[11px] text-slate-500">Recent pass / Articleship</div>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                            workStatus === 'fresher'
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-300'
                          }`}>
                            {workStatus === 'fresher' && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CA Intermediate Qualification Card */}
                    <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/80 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                              CA Intermediate Qualification Details <span className="text-red-500">*</span>
                            </h3>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Auto-filled from resume if mentioned, or select manually (Mandatory)
                          </p>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer bg-indigo-50/90 px-3.5 py-1.5 rounded-xl border border-indigo-200/80 hover:bg-indigo-100/70 transition-colors shrink-0">
                          <input 
                            type="checkbox" 
                            checked={caInter.bothGroups1stAttempt} 
                            onChange={(e) => handleCaInterChange('bothGroups1stAttempt', e.target.checked)} 
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" 
                          />
                          <span className="text-xs text-indigo-950 font-bold">Both Groups - 1st Attempt</span>
                        </label>
                      </div>

                      {/* Group I & Group II Grids */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Group I */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Group I</span>
                            <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">Required</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Attempts *</label>
                              <select 
                                disabled={caInter.bothGroups1stAttempt} 
                                value={caInter.group1Attempts} 
                                onChange={(e) => handleCaInterChange('group1Attempts', e.target.value)} 
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 font-medium bg-white cursor-pointer"
                              >
                                {ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Month *</label>
                              <select 
                                value={caInter.group1Month} 
                                onChange={(e) => handleCaInterChange('group1Month', e.target.value)} 
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 font-medium bg-white cursor-pointer"
                              >
                                <option value="">Month</option>
                                {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Year *</label>
                              <select 
                                value={caInter.group1Year} 
                                onChange={(e) => handleCaInterChange('group1Year', e.target.value)} 
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 font-medium bg-white cursor-pointer"
                              >
                                <option value="">Year</option>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Group II */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Group II</span>
                            <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">Required</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Attempts *</label>
                              <select 
                                disabled={caInter.bothGroups1stAttempt} 
                                value={caInter.group2Attempts} 
                                onChange={(e) => handleCaInterChange('group2Attempts', e.target.value)} 
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 font-medium bg-white cursor-pointer"
                              >
                                {ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Month *</label>
                              <select 
                                disabled={caInter.bothGroups1stAttempt} 
                                value={caInter.group2Month} 
                                onChange={(e) => handleCaInterChange('group2Month', e.target.value)} 
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 font-medium bg-white cursor-pointer"
                              >
                                <option value="">Month</option>
                                {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Year *</label>
                              <select 
                                disabled={caInter.bothGroups1stAttempt} 
                                value={caInter.group2Year} 
                                onChange={(e) => handleCaInterChange('group2Year', e.target.value)} 
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 font-medium bg-white cursor-pointer"
                              >
                                <option value="">Year</option>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ranker & Completion Session */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Ranker *</label>
                          <select 
                            value={caInter.ranker} 
                            onChange={(e) => handleCaInterChange('ranker', e.target.value)} 
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 font-medium bg-white cursor-pointer"
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes (Ranker)</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Completion Session *</label>
                          <div className="grid grid-cols-2 gap-2">
                            <select 
                              disabled={caInter.bothGroups1stAttempt} 
                              value={caInter.completionSessionMonth} 
                              onChange={(e) => handleCaInterChange('completionSessionMonth', e.target.value)} 
                              className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 font-medium bg-white cursor-pointer"
                            >
                              <option value="">Month</option>
                              {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select 
                              disabled={caInter.bothGroups1stAttempt} 
                              value={caInter.completionSessionYear} 
                              onChange={(e) => handleCaInterChange('completionSessionYear', e.target.value)} 
                              className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 font-medium bg-white cursor-pointer"
                            >
                              <option value="">Year</option>
                              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CA Final Qualification Card (Image 3) */}
                    <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/80 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                              CA Final Qualification Details <span className="text-red-500">*</span>
                            </h3>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Auto-filled from resume if mentioned, or select manually (Mandatory)
                          </p>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer bg-blue-50/90 px-3.5 py-1.5 rounded-xl border border-blue-200/80 hover:bg-blue-100/70 transition-colors shrink-0">
                          <input 
                            type="checkbox" 
                            checked={caFinal.bothGroups1stAttempt} 
                            onChange={(e) => handleCaFinalChange('bothGroups1stAttempt', e.target.checked)} 
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                          />
                          <span className="text-xs text-blue-950 font-bold">Both Groups - 1st Attempt</span>
                        </label>
                      </div>

                      {/* Group I & Group II Grids */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Group I */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Group I</span>
                            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">Required</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Attempts *</label>
                              <select 
                                disabled={caFinal.bothGroups1stAttempt} 
                                value={caFinal.group1Attempts} 
                                onChange={(e) => handleCaFinalChange('group1Attempts', e.target.value)} 
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-400 font-medium bg-white cursor-pointer"
                              >
                                {ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Month *</label>
                              <select 
                                value={caFinal.group1Month} 
                                onChange={(e) => handleCaFinalChange('group1Month', e.target.value)} 
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-medium bg-white cursor-pointer"
                              >
                                <option value="">Month</option>
                                {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Year *</label>
                              <select 
                                value={caFinal.group1Year} 
                                onChange={(e) => handleCaFinalChange('group1Year', e.target.value)} 
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-medium bg-white cursor-pointer"
                              >
                                <option value="">Year</option>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Group II */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Group II</span>
                            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">Required</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Attempts *</label>
                              <select 
                                disabled={caFinal.bothGroups1stAttempt} 
                                value={caFinal.group2Attempts} 
                                onChange={(e) => handleCaFinalChange('group2Attempts', e.target.value)} 
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-400 font-medium bg-white cursor-pointer"
                              >
                                {ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Month *</label>
                              <select 
                                disabled={caFinal.bothGroups1stAttempt} 
                                value={caFinal.group2Month} 
                                onChange={(e) => handleCaFinalChange('group2Month', e.target.value)} 
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-400 font-medium bg-white cursor-pointer"
                              >
                                <option value="">Month</option>
                                {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Year *</label>
                              <select 
                                disabled={caFinal.bothGroups1stAttempt} 
                                value={caFinal.group2Year} 
                                onChange={(e) => handleCaFinalChange('group2Year', e.target.value)} 
                                className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-400 font-medium bg-white cursor-pointer"
                              >
                                <option value="">Year</option>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ranker & Completion Session */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Ranker *</label>
                          <select 
                            value={caFinal.ranker} 
                            onChange={(e) => handleCaFinalChange('ranker', e.target.value)} 
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-medium bg-white cursor-pointer"
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes (Ranker)</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Completion Session *</label>
                          <div className="grid grid-cols-2 gap-2">
                            <select 
                              disabled={caFinal.bothGroups1stAttempt} 
                              value={caFinal.completionSessionMonth} 
                              onChange={(e) => handleCaFinalChange('completionSessionMonth', e.target.value)} 
                              className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-400 font-medium bg-white cursor-pointer"
                            >
                              <option value="">Month</option>
                              {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select 
                              disabled={caFinal.bothGroups1stAttempt} 
                              value={caFinal.completionSessionYear} 
                              onChange={(e) => handleCaFinalChange('completionSessionYear', e.target.value)} 
                              className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-400 font-medium bg-white cursor-pointer"
                            >
                              <option value="">Year</option>
                              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resume Upload Dropzone */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Upload Resume / CV (PDF or DOCX)
                        </label>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                          <Zap size={11} className="text-emerald-600 fill-emerald-600" />
                          Boost shortlists 80%
                        </span>
                      </div>

                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-3.5 cursor-pointer flex items-center justify-between transition-all ${
                          isDragOver
                            ? 'border-blue-500 bg-blue-50/70'
                            : resumeFile
                            ? 'border-emerald-300 bg-emerald-50/30'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              processResumeFile(e.target.files[0]);
                            }
                          }}
                        />

                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            resumeFile ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'
                          }`}>
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {resumeFile ? resumeFile.name : 'Drag CV here or select file'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {resumeFile
                                ? `${(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to verify`
                                : 'Max 5MB (Direct CA verification engine)'}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0 ml-2"
                        >
                          {resumeFile ? 'Change' : 'Browse'}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="w-full bg-[#0b1c33] hover:bg-[#081424] text-white py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/15 hover:shadow-xl transition-all duration-200 cursor-pointer disabled:opacity-70"
                  >
                    {isUploading ? (
                      <span>Uploading Resume...</span>
                    ) : isLoading ? (
                      <span>Registering Profile...</span>
                    ) : (
                      <>
                        <span>{role === 'candidate' ? 'Create Free Candidate Profile' : 'Create Employer Account'}</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>

                {/* Terms Disclaimer */}
                <div className="pt-2 text-center space-y-1">
                  <p className="text-[11px] text-slate-500">
                    By clicking Create Profile, you agree to our{' '}
                    <Link to="/terms" className="text-blue-600 font-semibold hover:underline">Terms</Link> &{' '}
                    <Link to="/privacy" className="text-blue-600 font-semibold hover:underline">Privacy Policy</Link>.
                  </p>
                  <p className="text-xs text-slate-600 font-medium pt-1">
                    Already registered on Fast Careers?{' '}
                    <Link to="/login" className="text-blue-600 font-bold hover:underline">
                      Sign In here
                    </Link>
                  </p>
                </div>

              </form>
            </div>
          </div>

      {/* ─── Page Footer ─── */}
      <footer className="max-w-7xl mx-auto w-full pt-8 pb-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2 font-bold text-slate-800 tracking-wider">
          <ShieldCheck size={18} className="text-blue-600" />
          <span>FAST CAREERS</span>
        </div>
        <p className="text-center sm:text-right text-[11px] text-slate-400">
          © {new Date().getFullYear()} Fast Careers Inc. Premier Chartered Accountant & Financial Leadership Network. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
