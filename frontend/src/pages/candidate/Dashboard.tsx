import React, { useState, useEffect } from 'react';
import { User, FileText, CheckCircle2, ChevronRight, Upload, MapPin, GraduationCap, Briefcase, Eye, EyeOff } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getResumeUrl } from '../../utils/urlHelper';
import type { RootState } from '../../store';
import axios from 'axios';
import { Button } from '../../components/Button';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { STATES, STATE_CITY_MAP, ALL_CITIES, YEARS, MONTHS, CA_EXAM_MONTHS, NATURE_OF_WORK, COLLEGES, PREFERRED_CAMPUS_CITIES, ARTICLESHIP_TYPES, CA_FIRMS, BOARDS } from '../../utils/constants';

const STATE_CITY_MAP_INTERNAL: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
    "Other"
  ],
  "Arunachal Pradesh": [
    "Itanagar",
    "Naharlagun",
    "Other"
  ],
  "Assam": [
    "Guwahati",
    "Silchar",
    "Dibrugarh",
    "Jorhat",
    "Other"
  ],
  "Bihar": [
    "Patna",
    "Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Other"
  ],
  "Chhattisgarh": [
    "Raipur",
    "Bhilai",
    "Bilaspur",
    "Korba",
    "Other"
  ],
  "Goa": [
    "Panaji",
    "Margao",
    "Vasco da Gama",
    "Other"
  ],
  "Gujarat": [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Gandhinagar",
    "Other"
  ],
  "Haryana": [
    "Faridabad",
    "Gurugram",
    "Panipat",
    "Ambala",
    "Other"
  ],
  "Himachal Pradesh": [
    "Shimla",
    "Dharamshala",
    "Mandi",
    "Other"
  ],
  "Jharkhand": [
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro",
    "Other"
  ],
  "Karnataka": [
    "Bangalore",
    "Mysore",
    "Hubli",
    "Mangalore",
    "Belgaum",
    "Other"
  ],
  "Kerala": [
    "Thiruvananthapuram",
    "Kochi",
    "Kozhikode",
    "Thrissur",
    "Other"
  ],
  "Madhya Pradesh": [
    "Indore",
    "Bhopal",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Other"
  ],
  "Maharashtra": [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Aurangabad",
    "Other"
  ],
  "Manipur": [
    "Imphal",
    "Other"
  ],
  "Meghalaya": [
    "Shillong",
    "Other"
  ],
  "Mizoram": [
    "Aizawl",
    "Other"
  ],
  "Nagaland": [
    "Dimapur",
    "Kohima",
    "Other"
  ],
  "Odisha": [
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Berhampur",
    "Other"
  ],
  "Punjab": [
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Other"
  ],
  "Rajasthan": [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Bikaner",
    "Other"
  ],
  "Sikkim": [
    "Gangtok",
    "Other"
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Other"
  ],
  "Telangana": [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Other"
  ],
  "Tripura": [
    "Agartala",
    "Other"
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Ghaziabad",
    "Agra",
    "Varanasi",
    "Noida",
    "Other"
  ],
  "Uttarakhand": [
    "Dehradun",
    "Haridwar",
    "Roorkee",
    "Other"
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Darjeeling",
    "Siliguri",
    "Other"
  ],
  "Delhi": [
    "New Delhi",
    "Other"
  ],
  "Jammu and Kashmir": [
    "Srinagar",
    "Jammu",
    "Other"
  ],
  "Chandigarh": [
    "Chandigarh",
    "Other"
  ],
  "Other": [
    "Other"
  ]
};

const ATTEMPT_YEARS = ['Sept\'25', 'Jan\'26', 'May\'25', 'Nov\'24', 'May\'24', 'Nov\'23', 'May\'23', 'Nov\'22', 'May\'22', 'Nov\'21', 'May\'21', 'Nov\'20', 'May\'20'];
const ATTEMPT_MONTHS = ['May', 'Nov'];
const AUDIT_EXPERIENCE_OPTIONS = ['Audit of Listed Companies', 'Statutory Audit', 'Internal Audit', 'Internal Financial Control (IFC Clause 49 work)', 'Standard Operating Procedures SOP Drafting', 'Statutory Bank Audits', 'Tax Audit assignments of companies', 'Concurrent audit of banks', 'Revenue Audits', 'Stock Audits', 'Other', 'None'];



const ATTEMPTS = ['0', '1', '2', '3', '4', '5', '6+'];

export const CandidateDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [savingProfile, setSavingProfile] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [popup, setPopup] = useState<{show: boolean, type: 'success'|'error', title: string, message: string, action?: string}>({ show: false, type: 'success', title: '', message: '' });

  // Form State
  const [personal, setPersonal] = useState({
    phone: '', password: '', confirmPassword: '',
    alternatePhone: '', currentAddress: '', currentState: '', currentCity: '',
    permanentAddressSameAsCurrent: false, permanentAddress: '', permanentState: '', permanentCity: '',
    dateOfBirth: '', gender: 'Male', maritalStatus: 'Unmarried', preferredCampusCity: '',
    prefCity1: '', prefCity2: '', prefCity3: ''
  });

  const [caPortfolio, setCaPortfolio] = useState({
    isFresherCA: false,
    caInter: { bothGroups1stAttempt: false, group1Attempts: '1', group1Month: 'May', group1Year: '2020', group2Attempts: '1', group2Month: 'May', group2Year: '2020', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2020', percentage: '' },
    caFinal: { bothGroups1stAttempt: false, group1Attempts: '1', group1Month: 'May', group1Year: '2023', group2Attempts: '1', group2Month: 'May', group2Year: '2023', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2023', percentage: '' },
    articleships: [{ type: 'Articleship', firmName: '', city: '', noOfPartners: '2', noOfMonths: '36' }],
    articleshipCompletionDateMonth: 'May',
    articleshipCompletionDateYear: '2023',
    gmcsCompleted: 'Yes',
    big4Articleship: 'No',
    industrialTrainee: 'No',
    listedCompanyWork: 'No',
    natureOfWork: ''
  });

  const [qualifications, setQualifications] = useState({
    graduation: { completed: 'Yes', yearOfCompletion: '2019', percentage: '', college: '', type: 'REGULAR' },
    class12: { percentage: '', year: '2016', board: '' },
    class10: { percentage: '', year: '2014', board: '' }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        const data = res.data;
        if (data.resumeUrl) setResumeUrl(data.resumeUrl);
        if (data.phone) setPersonal(prev => ({ ...prev, phone: data.phone }));
        if (data.personalDetails) setPersonal(prev => ({ ...prev, ...data.personalDetails }));
        if (data.caPortfolio) {
          const fetchedCaPortfolio = data.caPortfolio;
          if (!fetchedCaPortfolio.articleships || fetchedCaPortfolio.articleships.length === 0) {
            fetchedCaPortfolio.articleships = [{ type: 'Articleship', firmName: '', city: '', noOfPartners: '2', noOfMonths: '36' }];
          }
          setCaPortfolio(prev => ({ ...prev, ...fetchedCaPortfolio }));
        }
        if (data.qualifications) setQualifications(prev => ({ ...prev, ...data.qualifications }));
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
      setPopup({ show: true, type: 'success', title: 'Upload Successful', message: 'Resume uploaded successfully!' });
    } catch (error) {
      setPopup({ show: true, type: 'error', title: 'Upload Failed', message: 'Failed to upload resume.' });
    } finally {
      setUploading(false);
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && !resumeUrl) {
      alert('Resume is required. Please upload your resume to proceed.');
      return;
    }
    setSavingProfile(true);
    try {
      const payload: any = {
        phone: personal.phone,
        password: personal.password || undefined,
        personalDetails: personal
      };
      
      // Save CA Portfolio on step 2
      if (step === 2) {
        payload.caPortfolio = {
          ...caPortfolio,
          articleshipCompletionDate: `${caPortfolio.articleshipCompletionDateMonth} ${caPortfolio.articleshipCompletionDateYear}`
        };
      }

      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, payload, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert('Failed to save data. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        phone: personal.phone,
        password: personal.password || undefined,
        personalDetails: personal,
        caPortfolio: {
          ...caPortfolio,
          articleshipCompletionDate: `${caPortfolio.articleshipCompletionDateMonth} ${caPortfolio.articleshipCompletionDateYear}`
        },
        qualifications
      };
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, payload, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setPopup({ show: true, type: 'success', title: 'Success!', message: 'Your profile has been successfully saved and updated.', action: 'navigate_profile' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setPopup({ show: true, type: 'error', title: 'Save Failed', message: 'Failed to save profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  // Helper for Same as Current Address
  const handleSameAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setPersonal(prev => ({
      ...prev,
      permanentAddressSameAsCurrent: checked,
      permanentAddress: checked ? prev.currentAddress : prev.permanentAddress,
      permanentState: checked ? prev.currentState : prev.permanentState,
      permanentCity: checked ? prev.currentCity : prev.permanentCity,
    }));
  };

  const handlePrev = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CandidateLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text">Update Profile</h1>
      </div>

      {/* Stepper Progress */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-100'}`}>1</div>
          <span className="text-sm font-medium">Personal Details</span>
        </div>
        <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-100'}`}></div>
        <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-100'}`}>2</div>
          <span className="text-sm font-medium">CA Portfolio</span>
        </div>
        <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-gray-100'}`}></div>
        <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-100'}`}>3</div>
          <span className="text-sm font-medium">Qualifications</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        {step === 1 && (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (step === 1 && personal.password !== personal.confirmPassword) {
              setPopup({ show: true, type: 'error', title: 'Error', message: 'Passwords do not match' });
              return;
            }
            handleNext(e);
          }} className="space-y-6">
            <h3 className="text-lg font-bold border-b pb-2 mb-4 text-primary">Personal Details</h3>
            
            {/* Resume Upload - Only visible in Step 1 */}
            <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg mb-6">
              <label className="block text-sm font-semibold text-blue-900 mb-2">Resume Upload *</label>
              <div className="flex items-center gap-4">
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={uploading} className="text-sm" />
                {resumeUrl && <a href={getResumeUrl(resumeUrl)} target="_blank" className="text-blue-600 hover:underline font-medium text-sm flex items-center gap-1"><FileText size={16}/> View Current Resume</a>}
              </div>
            </div>

            <div className="grid grid-grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input type="text" value={user?.firstName || ''} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" value={user?.lastName || ''} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Id *</label>
                <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No. *</label>
                <input type="tel" required pattern="[0-9]{10}" maxLength={10} title="Please enter a valid 10-digit mobile number" value={personal.phone} onChange={(e) => setPersonal({...personal, phone: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Set Login Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} minLength={6} value={personal.password} onChange={(e) => setPersonal({...personal, password: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 pr-10" placeholder="Leave blank to keep unchanged" />
                  <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Re-type Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} value={personal.confirmPassword} onChange={(e) => setPersonal({...personal, confirmPassword: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 pr-10" placeholder="Re-type new password" />
                  <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Campus City</label>
                <select className="w-full border border-gray-200 rounded-lg p-2 pr-2 text-sm bg-white" value={personal.preferredCampusCity} onChange={(e) => setPersonal({...personal, preferredCampusCity: e.target.value})}>
                  <option value="">Select</option>
                  {PREFERRED_CAMPUS_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Land Line / Alternate No.</label>
                <input type="tel" pattern="[0-9]{10,11}" maxLength={11} title="Please enter 10 or 11 digits" value={personal.alternatePhone} onChange={(e) => setPersonal({...personal, alternatePhone: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" placeholder="10-11 Digits" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input type="date" required value={personal.dateOfBirth} onChange={(e) => setPersonal({...personal, dateOfBirth: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>

              {/* Addresses */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Address *</label>
                    <textarea required rows={2} value={personal.currentAddress} onChange={(e) => setPersonal({...personal, currentAddress: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">State *</label>
                      <select required value={personal.currentState} onChange={(e) => setPersonal({...personal, currentState: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20">
                        <option value="">Select</option>
                        {Object.keys(STATE_CITY_MAP).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                      <select required className="w-full px-4 py-2 pr-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" value={(personal.currentCity === 'Other' || (personal.currentCity && personal.currentState && STATE_CITY_MAP[personal.currentState] && !STATE_CITY_MAP[personal.currentState].includes(personal.currentCity))) ? 'Other' : personal.currentCity} onChange={(e) => setPersonal({...personal, currentCity: e.target.value})} disabled={!personal.currentState}>
                        <option value="">Select City...</option>
                        {(personal.currentState ? STATE_CITY_MAP[personal.currentState] || ALL_CITIES : ALL_CITIES).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {(personal.currentCity === 'Other' || (personal.currentCity && personal.currentState && STATE_CITY_MAP[personal.currentState] && !STATE_CITY_MAP[personal.currentState].includes(personal.currentCity))) && (
                        <input type="text" required placeholder="Enter your city" className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" value={personal.currentCity === 'Other' ? '' : personal.currentCity} onChange={(e) => setPersonal({...personal, currentCity: e.target.value})} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">Permanent Address *</label>
                      <label className="flex items-center gap-1 text-xs text-primary cursor-pointer">
                        <input type="checkbox" checked={personal.permanentAddressSameAsCurrent} onChange={handleSameAddress} /> Same as above
                      </label>
                    </div>
                    <textarea required rows={2} value={personal.permanentAddress} onChange={(e) => setPersonal({...personal, permanentAddress: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" disabled={personal.permanentAddressSameAsCurrent}/>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">State *</label>
                      <select required value={personal.permanentState} onChange={(e) => setPersonal({...personal, permanentState: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20" disabled={personal.permanentAddressSameAsCurrent}>
                        <option value="">Select</option>
                        {Object.keys(STATE_CITY_MAP).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                      <select required className="w-full px-4 py-2 pr-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" value={(personal.permanentCity === 'Other' || (personal.permanentCity && personal.permanentState && STATE_CITY_MAP[personal.permanentState] && !STATE_CITY_MAP[personal.permanentState].includes(personal.permanentCity))) ? 'Other' : personal.permanentCity} onChange={(e) => setPersonal({...personal, permanentCity: e.target.value})} disabled={personal.permanentAddressSameAsCurrent || !personal.permanentState}>
                        <option value="">Select City...</option>
                        {(personal.permanentState ? STATE_CITY_MAP[personal.permanentState] || ALL_CITIES : ALL_CITIES).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {(personal.permanentCity === 'Other' || (personal.permanentCity && personal.permanentState && STATE_CITY_MAP[personal.permanentState] && !STATE_CITY_MAP[personal.permanentState].includes(personal.permanentCity))) && (
                        <input type="text" required placeholder="Enter your city" className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" value={personal.permanentCity === 'Other' ? '' : personal.permanentCity} onChange={(e) => setPersonal({...personal, permanentCity: e.target.value})} disabled={personal.permanentAddressSameAsCurrent} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select required value={personal.gender} onChange={(e) => setPersonal({...personal, gender: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status *</label>
                <select required value={personal.maritalStatus} onChange={(e) => setPersonal({...personal, maritalStatus: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20">
                  <option value="Unmarried">Unmarried</option>
                  <option value="Married">Married</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">City Where do u wanted to participate in Fast Campuses *</label>
                <input type="text" list="allCitiesList" placeholder="Pref. City 1" value={personal.prefCity1} onChange={(e) => setPersonal({...personal, prefCity1: e.target.value})} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
                <input type="text" list="allCitiesList" placeholder="Pref. City 2 (Opt)" value={personal.prefCity2} onChange={(e) => setPersonal({...personal, prefCity2: e.target.value})} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
                <input type="text" list="allCitiesList" placeholder="Pref. City 3 (Opt)" value={personal.prefCity3} onChange={(e) => setPersonal({...personal, prefCity3: e.target.value})} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
                
                {/* Global Datalist for Cities */}
                <datalist id="allCitiesList">
                  {ALL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </datalist>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button type="submit">{savingProfile ? 'Saving...' : 'Save & Next >>'}</Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-8">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-bold text-primary">Candidate Portfolio - CA</h3>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-md border border-gray-200">
                <input type="checkbox" checked={caPortfolio.isFresherCA} onChange={(e) => setCaPortfolio({...caPortfolio, isFresherCA: e.target.checked})} />
                Tick if fresher CA
              </label>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-gray-200 min-w-[900px]">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 border">Exam</th>
                    <th className="p-3 border text-center">Both Groups 1st Attempt</th>
                    <th className="p-3 border" colSpan={3}>Group I (Attempts, Month & Year)</th>
                    <th className="p-3 border" colSpan={3}>Group II (Attempts, Month & Year)</th>
                    <th className="p-3 border">Ranker</th>
                    <th className="p-3 border" colSpan={2}>Completion Session</th>
                    <th className="p-3 border">%</th>
                  </tr>
                </thead>
                <tbody>
                  {['caInter', 'caFinal'].map((examKey, idx) => (
                    <tr key={examKey}>
                      <td className="p-3 border font-medium">{idx === 0 ? 'CA Inter (IPCC)' : 'CA Final'}</td>
                      <td className="p-3 border text-center">
                        <input type="checkbox" checked={(caPortfolio as any)[examKey].bothGroups1stAttempt} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], bothGroups1stAttempt: e.target.checked}})} />
                      </td>
                      <td className="p-2 border">
                        <input type="text" list="attemptsList" className="w-full border-gray-200 rounded p-1 text-xs text-center min-w-[50px]" value={(caPortfolio as any)[examKey].group1Attempts} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], group1Attempts: e.target.value}})} placeholder="0" />
                      </td>
                      <td className="p-2 border">
                        <select className="w-full border border-gray-200 rounded p-1 pr-8 text-xs text-center bg-white min-w-[110px]" value={(caPortfolio as any)[examKey].group1Month} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], group1Month: e.target.value}})}>
                          <option value="">Month</option>
                          {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </td>
                      <td className="p-2 border">
                        <input type="text" list="yearsList" className="w-full border-gray-200 rounded p-1 text-xs text-center min-w-[60px]" value={(caPortfolio as any)[examKey].group1Year} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], group1Year: e.target.value}})} placeholder="Year" />
                      </td>
                      <td className="p-2 border">
                        <input type="text" list="attemptsList" className="w-full border-gray-200 rounded p-1 text-xs text-center min-w-[50px]" value={(caPortfolio as any)[examKey].group2Attempts} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], group2Attempts: e.target.value}})} placeholder="0" />
                      </td>
                      <td className="p-2 border">
                        <select className="w-full border border-gray-200 rounded p-1 pr-8 text-xs text-center bg-white min-w-[110px]" value={(caPortfolio as any)[examKey].group2Month} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], group2Month: e.target.value}})}>
                          <option value="">Month</option>
                          {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </td>
                      <td className="p-2 border">
                        <input type="text" list="yearsList" className="w-full border-gray-200 rounded p-1 text-xs text-center min-w-[60px]" value={(caPortfolio as any)[examKey].group2Year} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], group2Year: e.target.value}})} placeholder="Year" />
                      </td>
                      <td className="p-2 border">
                        <input type="text" list="rankerList" className="w-full border-gray-200 rounded p-1 text-xs text-center" value={(caPortfolio as any)[examKey].ranker} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], ranker: e.target.value}})} placeholder="No" />
                      </td>
                      <td className="p-2 border" colSpan={2}>
                        <div className="flex gap-1">
                          <select className="w-1/2 border border-gray-200 rounded p-1 pr-8 text-xs bg-white min-w-[110px]" value={(caPortfolio as any)[examKey].completionSessionMonth} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], completionSessionMonth: e.target.value}})}>
                            <option value="">Month</option>
                            {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <select className="w-1/2 border border-gray-200 rounded p-1 pr-8 text-xs bg-white min-w-[110px]" value={(caPortfolio as any)[examKey].completionSessionYear} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], completionSessionYear: e.target.value}})}>
                            <option value="">Year</option>
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="p-2 border">
                        <input type="number" min="0" max="100" step="0.01" required placeholder="%" className="w-16 border-gray-200 rounded p-1 text-xs" value={(caPortfolio as any)[examKey].percentage} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], percentage: e.target.value}})} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <datalist id="attemptsList">{ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}</datalist>
              <datalist id="monthsList">{MONTHS.map(a => <option key={a} value={a}>{a}</option>)}</datalist>
              <datalist id="yearsList">{YEARS.map(a => <option key={a} value={a}>{a}</option>)}</datalist>
              <datalist id="rankerList"><option value="No">No</option><option value="Yes">Yes</option></datalist>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="text-sm text-gray-800">Articleship (You can add multiple firms here starting with latest)</h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[900px]">
                  <thead>
                    <tr className="text-gray-600 font-medium">
                      <th className="pb-2 text-center font-normal">Type</th>
                      <th className="pb-2 text-center font-normal">Name</th>
                      <th className="pb-2 text-center font-normal">City</th>
                      <th className="pb-2 text-center font-normal">No. of Partners</th>
                      <th className="pb-2 text-center font-normal">No. of Months</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(caPortfolio.articleships || []).map((art, idx) => (
                      <tr key={idx}>
                        <td className="pr-2 pb-2">
                          <select required className="w-full border border-gray-300 rounded p-1 pr-8 text-sm bg-white min-w-[120px]" value={art.type || 'Articleship'} onChange={(e) => { const newArt = [...caPortfolio.articleships]; newArt[idx].type = e.target.value; setCaPortfolio({...caPortfolio, articleships: newArt})}}>
                            {ARTICLESHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </td>
                        <td className="pr-2 pb-2 min-w-[200px]">
                          <select required className="w-full border border-gray-300 rounded p-1 pr-8 text-sm bg-white mb-1 min-w-[180px]" value={CA_FIRMS.includes(art.firmName || '') && art.firmName !== 'Other' ? art.firmName : (art.firmName ? 'Other' : '')} onChange={(e) => { const newArt = [...caPortfolio.articleships]; newArt[idx].firmName = e.target.value; setCaPortfolio({...caPortfolio, articleships: newArt})}}>
                            <option value="">Select firm name</option>
                            {CA_FIRMS.map(firm => <option key={firm} value={firm}>{firm}</option>)}
                          </select>
                          {(!CA_FIRMS.includes(art.firmName || '') || art.firmName === 'Other') && art.firmName && (
                            <input required type="text" pattern="[A-Za-z0-9\s\.\,\&\/\-]+" title="Only alphanumeric characters, spaces, and . , & / - are allowed" className="w-full border border-gray-300 rounded p-1 text-sm bg-white" placeholder="Type firm name" value={art.firmName === 'Other' ? '' : art.firmName} onChange={(e) => { const newArt = [...caPortfolio.articleships]; newArt[idx].firmName = e.target.value; setCaPortfolio({...caPortfolio, articleships: newArt})}}/>
                          )}
                        </td>
                        <td className="pr-2 pb-2">
                          <select required className="w-full border border-gray-300 rounded p-1 pr-8 text-sm bg-white min-w-[120px]" value={art.city} onChange={(e) => { const newArt = [...caPortfolio.articleships]; newArt[idx].city = e.target.value; setCaPortfolio({...caPortfolio, articleships: newArt})}}>
                            <option value="">Select</option>
                            {ALL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td className="pr-2 pb-2 min-w-[100px]">
                          <select required className="w-full border border-gray-300 rounded p-1 pr-8 text-sm bg-white min-w-[90px]" value={art.noOfPartners} onChange={(e) => { const newArt = [...caPortfolio.articleships]; newArt[idx].noOfPartners = e.target.value; setCaPortfolio({...caPortfolio, articleships: newArt})}}>
                            <option value="">Select</option>
                            {Array.from({length: 10}, (_, i) => String(i+1)).map(n => <option key={n} value={n}>{n}</option>)}
                            <option value="11-20">11-20</option>
                            <option value="20+">20+</option>
                          </select>
                        </td>
                        <td className="pr-2 pb-2 w-20">
                          <input required type="number" min="1" max="120" className="w-full border border-gray-300 rounded p-1 text-sm bg-white text-center" value={art.noOfMonths} onChange={(e) => { const newArt = [...caPortfolio.articleships]; newArt[idx].noOfMonths = parseInt(e.target.value) || 0; setCaPortfolio({...caPortfolio, articleships: newArt})}}/>
                        </td>
                        <td className="pb-2">
                          {idx === caPortfolio.articleships.length - 1 && caPortfolio.articleships.reduce((sum, a) => sum + (parseInt(a.noOfMonths as any) || 0), 0) < 36 && (
                            <button type="button" onClick={() => setCaPortfolio({...caPortfolio, articleships: [...caPortfolio.articleships, { type: 'Articleship', firmName: '', city: '', noOfPartners: '2', noOfMonths: 0 }]})} className="bg-[#1a446c] text-white px-3 py-1 text-xs font-medium rounded hover:bg-[#123150] transition-colors whitespace-nowrap">
                              Click Here To Confirm
                            </button>
                          )}
                          {idx > 0 && (
                            <button type="button" onClick={() => { const newArt = [...caPortfolio.articleships]; newArt.splice(idx, 1); setCaPortfolio({...caPortfolio, articleships: newArt})}} className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded hover:bg-red-600 transition-colors ml-2" title="Remove">
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(!caPortfolio.articleships || caPortfolio.articleships.length === 0) && (
                      <tr>
                        <td colSpan={6} className="text-center p-4">
                          <button type="button" onClick={() => setCaPortfolio({...caPortfolio, articleships: [{ type: 'Articleship', firmName: '', city: '', noOfPartners: '2', noOfMonths: 0 }]})} className="bg-[#1a446c] text-white px-3 py-1 text-xs font-medium rounded hover:bg-[#123150] transition-colors whitespace-nowrap">
                            Add Firm
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
              <div className="flex justify-between items-center">
                <span>Articleship Completion Date / Due Date:</span>
                <div className="flex gap-2">
                  <select className="border-gray-200 rounded p-1 pr-2 text-xs" value={caPortfolio.articleshipCompletionDateMonth} onChange={(e) => setCaPortfolio({...caPortfolio, articleshipCompletionDateMonth: e.target.value})}>{MONTHS.map(a=><option key={a}>{a}</option>)}</select>
                  <select className="border-gray-200 rounded p-1 pr-2 text-xs" value={caPortfolio.articleshipCompletionDateYear} onChange={(e) => setCaPortfolio({...caPortfolio, articleshipCompletionDateYear: e.target.value})}>{YEARS.map(a=><option key={a}>{a}</option>)}</select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Articleship Months:</span>
                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">{(caPortfolio.articleships || []).reduce((acc, curr) => acc + (curr.noOfMonths || 0), 0)}</span>
              </div>

              {[
                { label: 'GMCS Program Completed', key: 'gmcsCompleted' },
                { label: 'Whether Articleship from BIG4 (anytime in 3 years)', key: 'big4Articleship' },
                { label: 'Whether Industrial Trainee (in last 12 Months)', key: 'industrialTrainee' },
                { label: 'Whether Done Listed Company Work', key: 'listedCompanyWork' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span>* {item.label}:</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1"><input type="radio" name={item.key} value="Yes" checked={(caPortfolio as any)[item.key] === 'Yes'} onChange={(e) => setCaPortfolio({...caPortfolio, [item.key]: e.target.value})} /> Yes</label>
                    <label className="flex items-center gap-1"><input type="radio" name={item.key} value="No" checked={(caPortfolio as any)[item.key] === 'No'} onChange={(e) => setCaPortfolio({...caPortfolio, [item.key]: e.target.value})} /> No</label>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">* Nature of Work Done During Articleship:</label>
              <select required className="w-full px-4 py-2 pr-2 border border-gray-200 rounded-lg text-sm bg-white mb-2" value={NATURE_OF_WORK.includes(caPortfolio.natureOfWork || '') && caPortfolio.natureOfWork !== 'Other' ? caPortfolio.natureOfWork : (caPortfolio.natureOfWork ? 'Other' : '')} onChange={(e) => setCaPortfolio({...caPortfolio, natureOfWork: e.target.value})}>
                <option value="">Select Nature of Work</option>
                {NATURE_OF_WORK.map(work => (
                  <option key={work} value={work}>{work}</option>
                ))}
              </select>
              {(!NATURE_OF_WORK.includes(caPortfolio.natureOfWork || '') || caPortfolio.natureOfWork === 'Other') && caPortfolio.natureOfWork && (
                <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white" placeholder="Type nature of work" value={caPortfolio.natureOfWork === 'Other' ? '' : caPortfolio.natureOfWork} onChange={(e) => setCaPortfolio({...caPortfolio, natureOfWork: e.target.value})} />
              )}
            </div>



            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={handlePrev}>&lt;&lt; Previous</Button>
              <Button type="submit">{savingProfile ? 'Saving...' : 'Save & Next >>'}</Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <h3 className="text-lg font-bold border-b pb-2 mb-4 text-primary">Graduation & Other Qualification</h3>
            
            <div className="space-y-6">
              {/* Graduation */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 pb-2 border-b">Graduation & Other Qualification</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col justify-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Whether Completed</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1 text-sm"><input type="radio" name="gradCompleted" value="Yes" checked={qualifications.graduation.completed === 'Yes'} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, completed: e.target.value}})} /> Yes</label>
                      <label className="flex items-center gap-1 text-sm"><input type="radio" name="gradCompleted" value="No/Pursuing" checked={qualifications.graduation.completed === 'No/Pursuing'} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, completed: e.target.value}})} /> No/Pursuing</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Completion</label>
                    <select className="w-full px-3 py-2 pr-2 border border-gray-200 rounded-lg text-sm bg-white" value={qualifications.graduation.yearOfCompletion} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, yearOfCompletion: e.target.value}})}>
                      {YEARS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">% (Avg of 3 years)</label>
                    <input type="number" min="0" max="100" step="0.01" required placeholder="Graduation %" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={qualifications.graduation.percentage} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, percentage: e.target.value}})} />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correspondence / College Name</label>
                    <select required className="w-full px-3 py-2 pr-2 border border-gray-200 rounded-lg text-sm bg-white" value={qualifications.graduation.college} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, college: e.target.value}})}>
                      <option value="">Select College</option>
                      {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-1 text-sm uppercase"><input type="radio" name="gradType" value="REGULAR" checked={qualifications.graduation.type === 'REGULAR'} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, type: e.target.value}})} /> Regular</label>
                      <label className="flex items-center gap-1 text-sm uppercase"><input type="radio" name="gradType" value="CORRESPONDENCE" checked={qualifications.graduation.type === 'CORRESPONDENCE'} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, type: e.target.value}})} /> Correspondence</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Class 12 & 10 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class 12 */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-4">Class XII</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">XII Percentage (%)</label>
                      <input type="number" min="0" max="100" step="0.01" required placeholder="e.g. 85" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20" value={qualifications.class12.percentage} onChange={(e) => setQualifications({...qualifications, class12: {...qualifications.class12, percentage: e.target.value}})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">XII Year</label>
                      <select className="w-full px-3 py-2 pr-2 border border-gray-200 rounded-lg text-sm bg-white" value={qualifications.class12.year} onChange={(e) => setQualifications({...qualifications, class12: {...qualifications.class12, year: e.target.value}})}>
                        {YEARS.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">XII Board Name</label>
                      <select required className="w-full px-3 py-2 pr-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20" value={qualifications.class12.board} onChange={(e) => setQualifications({...qualifications, class12: {...qualifications.class12, board: e.target.value}})}>
                        <option value="">Select Board</option>
                        {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Class 10 */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-4">Class X</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">X Percentage (%)</label>
                      <input type="number" min="0" max="100" step="0.01" required placeholder="e.g. 90" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20" value={qualifications.class10.percentage} onChange={(e) => setQualifications({...qualifications, class10: {...qualifications.class10, percentage: e.target.value}})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">X Year</label>
                      <select className="w-full px-3 py-2 pr-2 border border-gray-200 rounded-lg text-sm bg-white" value={qualifications.class10.year} onChange={(e) => setQualifications({...qualifications, class10: {...qualifications.class10, year: e.target.value}})}>
                        {YEARS.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">X Board Name</label>
                      <select required className="w-full px-3 py-2 pr-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20" value={qualifications.class10.board} onChange={(e) => setQualifications({...qualifications, class10: {...qualifications.class10, board: e.target.value}})}>
                        <option value="">Select Board</option>
                        {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-red-500 font-medium text-center">Note: Please fill details accurately as these shall be printed on your site generated resume. Also for saving data please click on Submit button.</p>

            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={handlePrev}>&lt;&lt; Previous</Button>
              <Button type="submit" isLoading={savingProfile}>Submit All Details</Button>
            </div>
          </form>
        )}
      </div>

      {/* Unified Popup */}
      {popup.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${popup.type === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
              <CheckCircle2 size={40} className={popup.type === 'success' ? 'block' : 'hidden'} />
              <div className={popup.type === 'error' ? 'text-4xl font-bold block' : 'hidden'}>!</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{popup.title}</h3>
            <p className="text-gray-500 mb-8">{popup.message}</p>
            <Button 
              className="w-full py-3 text-lg" 
              onClick={() => {
                setPopup(p => ({ ...p, show: false }));
                if (popup.action === 'navigate_profile') {
                  navigate('/candidate/resume-print');
                }
              }}
            >
              {popup.action === 'navigate_profile' ? 'View My Profile' : 'OK'}
            </Button>
          </div>
        </div>
      )}

    </CandidateLayout>
  );
};
