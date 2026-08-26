import React, { useState, useEffect } from 'react';
import { User, FileText, CheckCircle2, ChevronRight, Upload, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import axios from 'axios';
import { Button } from '../../components/Button';
import { CandidateLayout } from '../../layouts/CandidateLayout';

const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh'];
const CITIES = ['Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Ahmedabad', 'Chennai', 'Lucknow', 'Jaipur', 'Indore', 'Other'];
const YEARS = Array.from({length: 30}, (_, i) => String(new Date().getFullYear() - i));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ATTEMPTS = ['0', '1', '2', '3', '4', '5', '6+'];
const COLLEGES = ['ICAI', 'Delhi University', 'Mumbai University', 'Pune University', 'IGNOU', 'Other'];
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'Other'];

export const CandidateDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [savingProfile, setSavingProfile] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [personal, setPersonal] = useState({
    phone: '', password: '', confirmPassword: '',
    alternatePhone: '', currentAddress: '', currentState: '', currentCity: '',
    permanentAddressSameAsCurrent: false, permanentAddress: '', permanentState: '', permanentCity: '',
    dateOfBirth: '', gender: 'Male', maritalStatus: 'Unmarried', preferredCampusCity: ''
  });

  const [caPortfolio, setCaPortfolio] = useState({
    isFresherCA: false,
    caInter: { bothGroups1stAttempt: false, group1Attempts: '1', group1Month: 'May', group1Year: '2020', group2Attempts: '1', group2Month: 'May', group2Year: '2020', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2020', percentage: '' },
    caFinal: { bothGroups1stAttempt: false, group1Attempts: '1', group1Month: 'May', group1Year: '2023', group2Attempts: '1', group2Month: 'May', group2Year: '2023', ranker: 'No', completionSessionMonth: 'May', completionSessionYear: '2023', percentage: '' },
    articleships: [{ firmType: 'Medium', firmName: '', city: '', noOfPartners: '2', noOfMonths: '36' }],
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
        if (data.caPortfolio) setCaPortfolio(prev => ({ ...prev, ...data.caPortfolio }));
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
      alert('Resume uploaded successfully!');
    } catch (error) {
      alert('Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
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
      setShowSuccess(true);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile.');
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
            if (personal.password && personal.password !== personal.confirmPassword) {
              alert('Passwords do not match');
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
                {resumeUrl && <a href={resumeUrl.startsWith('http') ? resumeUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${resumeUrl}`} target="_blank" className="text-blue-600 hover:underline font-medium text-sm flex items-center gap-1"><FileText size={16}/> View Current Resume</a>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <input type="password" minLength={6} value={personal.password} onChange={(e) => setPersonal({...personal, password: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" placeholder="Leave blank to keep unchanged" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Re-type Password</label>
                <input type="password" value={personal.confirmPassword} onChange={(e) => setPersonal({...personal, confirmPassword: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" placeholder="Re-type new password" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Land Line / Alternate No.</label>
                <input type="tel" pattern="[0-9]{10,11}" maxLength={11} title="Please enter 10 or 11 digits" value={personal.alternatePhone} onChange={(e) => setPersonal({...personal, alternatePhone: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" placeholder="10-11 Digits" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input type="date" required value={personal.dateOfBirth} onChange={(e) => setPersonal({...personal, dateOfBirth: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
              </div>

              {/* Completed CA Final */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-red-600">* Completed CA Final In (Session & Year)</label>
                  <div className="flex gap-2">
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg" value={caPortfolio.caFinal.completionSessionMonth} onChange={(e) => setCaPortfolio({...caPortfolio, caFinal: {...caPortfolio.caFinal, completionSessionMonth: e.target.value}})}>
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg" value={caPortfolio.caFinal.completionSessionYear} onChange={(e) => setCaPortfolio({...caPortfolio, caFinal: {...caPortfolio.caFinal, completionSessionYear: e.target.value}})}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-red-600">* Completed CA Final Percentage (%)</label>
                  <input type="number" min="0" max="100" step="0.01" required value={caPortfolio.caFinal.percentage} onChange={(e) => setCaPortfolio({...caPortfolio, caFinal: {...caPortfolio.caFinal, percentage: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" placeholder="e.g. 75" />
                </div>
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
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                      <select required value={personal.currentCity} onChange={(e) => setPersonal({...personal, currentCity: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20">
                        <option value="">Select</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
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
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                      <select required value={personal.permanentCity} onChange={(e) => setPersonal({...personal, permanentCity: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20" disabled={personal.permanentAddressSameAsCurrent}>
                        <option value="">Select</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
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
                <select required value={personal.preferredCampusCity} onChange={(e) => setPersonal({...personal, preferredCampusCity: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20">
                  <option value="">Select City</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button type="submit">Next &gt;&gt;</Button>
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
              <table className="w-full text-sm text-left border border-gray-200">
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
                        <select className="w-full border-gray-200 rounded p-1 text-xs" value={(caPortfolio as any)[examKey].group1Attempts} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], group1Attempts: e.target.value}})}>
                          {ATTEMPTS.map(a => <option key={a}>{a}</option>)}
                        </select>
                      </td>
                      <td className="p-2 border">
                        <select className="w-full border-gray-200 rounded p-1 text-xs" value={(caPortfolio as any)[examKey].group1Month} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], group1Month: e.target.value}})}>
                          <option value="">Month</option>
                          {MONTHS.map(a => <option key={a}>{a}</option>)}
                        </select>
                      </td>
                      <td className="p-2 border">
                        <select className="w-full border-gray-200 rounded p-1 text-xs" value={(caPortfolio as any)[examKey].group1Year} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], group1Year: e.target.value}})}>
                          {YEARS.map(a => <option key={a}>{a}</option>)}
                        </select>
                      </td>
                      <td className="p-2 border">
                        <select className="w-full border-gray-200 rounded p-1 text-xs" value={(caPortfolio as any)[examKey].group2Attempts} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], group2Attempts: e.target.value}})}>
                          {ATTEMPTS.map(a => <option key={a}>{a}</option>)}
                        </select>
                      </td>
                      <td className="p-2 border">
                        <select className="w-full border-gray-200 rounded p-1 text-xs" value={(caPortfolio as any)[examKey].group2Month} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], group2Month: e.target.value}})}>
                          <option value="">Month</option>
                          {MONTHS.map(a => <option key={a}>{a}</option>)}
                        </select>
                      </td>
                      <td className="p-2 border">
                        <select className="w-full border-gray-200 rounded p-1 text-xs" value={(caPortfolio as any)[examKey].group2Year} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], group2Year: e.target.value}})}>
                          {YEARS.map(a => <option key={a}>{a}</option>)}
                        </select>
                      </td>
                      <td className="p-2 border">
                        <select className="w-full border-gray-200 rounded p-1 text-xs" value={(caPortfolio as any)[examKey].ranker} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], ranker: e.target.value}})}>
                          <option>No</option><option>Yes</option>
                        </select>
                      </td>
                      <td className="p-2 border">
                        <select className="w-full border-gray-200 rounded p-1 text-xs" value={(caPortfolio as any)[examKey].completionSessionMonth} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], completionSessionMonth: e.target.value}})}>
                          {MONTHS.map(a => <option key={a}>{a}</option>)}
                        </select>
                      </td>
                      <td className="p-2 border">
                        <select className="w-full border-gray-200 rounded p-1 text-xs" value={(caPortfolio as any)[examKey].completionSessionYear} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], completionSessionYear: e.target.value}})}>
                          {YEARS.map(a => <option key={a}>{a}</option>)}
                        </select>
                      </td>
                      <td className="p-2 border">
                        <input type="number" min="0" max="100" step="0.01" required placeholder="%" className="w-16 border-gray-200 rounded p-1 text-xs" value={(caPortfolio as any)[examKey].percentage} onChange={(e) => setCaPortfolio({...caPortfolio, [examKey]: {...(caPortfolio as any)[examKey], percentage: e.target.value}})} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="text-sm text-gray-800">Articleship (You can add multiple firms here starting with latest)</h4>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
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
                    {caPortfolio.articleships.map((art, idx) => (
                      <tr key={idx}>
                        <td className="pr-2 pb-2">
                          <select required className="w-full border border-gray-300 rounded p-1 text-sm bg-white" value={art.firmType} onChange={(e) => { const newArt = [...caPortfolio.articleships]; newArt[idx].firmType = e.target.value; setCaPortfolio({...caPortfolio, articleships: newArt})}}>
                            <option value="Medium">Medium</option>
                            <option value="Big4">Big4</option>
                            <option value="Small">Small</option>
                          </select>
                        </td>
                        <td className="pr-2 pb-2 min-w-[200px]">
                          <input required type="text" pattern="[A-Za-z0-9\s\.\,\&]+" title="Only alphanumeric characters, spaces, and . , & are allowed" className="w-full border border-gray-300 rounded p-1 text-sm bg-white" value={art.firmName} onChange={(e) => { const newArt = [...caPortfolio.articleships]; newArt[idx].firmName = e.target.value; setCaPortfolio({...caPortfolio, articleships: newArt})}}/>
                        </td>
                        <td className="pr-2 pb-2">
                          <select required className="w-full border border-gray-300 rounded p-1 text-sm bg-white" value={art.city} onChange={(e) => { const newArt = [...caPortfolio.articleships]; newArt[idx].city = e.target.value; setCaPortfolio({...caPortfolio, articleships: newArt})}}>
                            <option value="">Select</option>
                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td className="pr-2 pb-2 min-w-[100px]">
                          <select required className="w-full border border-gray-300 rounded p-1 text-sm bg-white" value={art.noOfPartners} onChange={(e) => { const newArt = [...caPortfolio.articleships]; newArt[idx].noOfPartners = e.target.value; setCaPortfolio({...caPortfolio, articleships: newArt})}}>
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
                          {idx === caPortfolio.articleships.length - 1 && (
                            <button type="button" onClick={() => setCaPortfolio({...caPortfolio, articleships: [...caPortfolio.articleships, { firmType: 'Medium', firmName: '', city: '', noOfPartners: '2', noOfMonths: 0 }]})} className="bg-[#1a446c] text-white px-3 py-1 text-xs font-medium rounded hover:bg-[#123150] transition-colors whitespace-nowrap">
                              Click Here To Confirm
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
              <div className="flex justify-between items-center">
                <span>Articleship Completion Date / Due Date:</span>
                <div className="flex gap-2">
                  <select className="border-gray-200 rounded p-1 text-xs" value={caPortfolio.articleshipCompletionDateMonth} onChange={(e) => setCaPortfolio({...caPortfolio, articleshipCompletionDateMonth: e.target.value})}>{MONTHS.map(a=><option key={a}>{a}</option>)}</select>
                  <select className="border-gray-200 rounded p-1 text-xs" value={caPortfolio.articleshipCompletionDateYear} onChange={(e) => setCaPortfolio({...caPortfolio, articleshipCompletionDateYear: e.target.value})}>{YEARS.map(a=><option key={a}>{a}</option>)}</select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Articleship Months:</span>
                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">{caPortfolio.articleships.reduce((acc, curr) => acc + (curr.noOfMonths || 0), 0)}</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">* Briefly Explain Other Nature of Work Done During Articleship (Min 100 words):</label>
              <textarea required rows={4} minLength={100} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Mention type of audits & other assignment list of key clients etc. This will be printed on system generated resume" value={caPortfolio.natureOfWork} onChange={(e) => setCaPortfolio({...caPortfolio, natureOfWork: e.target.value})}></textarea>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={handlePrev}>&lt;&lt; Previous</Button>
              <Button type="submit">Next &gt;&gt;</Button>
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
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={qualifications.graduation.yearOfCompletion} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, yearOfCompletion: e.target.value}})}>
                      {YEARS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">% (Avg of 3 years)</label>
                    <input type="number" min="0" max="100" step="0.01" required placeholder="Graduation %" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={qualifications.graduation.percentage} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, percentage: e.target.value}})} />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correspondence / College Name</label>
                    <select required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={qualifications.graduation.college} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, college: e.target.value}})}>
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
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={qualifications.class12.year} onChange={(e) => setQualifications({...qualifications, class12: {...qualifications.class12, year: e.target.value}})}>
                        {YEARS.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">XII Board Name</label>
                      <select required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20" value={qualifications.class12.board} onChange={(e) => setQualifications({...qualifications, class12: {...qualifications.class12, board: e.target.value}})}>
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
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={qualifications.class10.year} onChange={(e) => setQualifications({...qualifications, class10: {...qualifications.class10, year: e.target.value}})}>
                        {YEARS.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">X Board Name</label>
                      <select required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20" value={qualifications.class10.board} onChange={(e) => setQualifications({...qualifications, class10: {...qualifications.class10, board: e.target.value}})}>
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

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-500 mb-8">Your profile has been successfully saved and updated.</p>
            <Button 
              className="w-full py-3 text-lg" 
              onClick={() => {
                setShowSuccess(false);
                navigate('/candidate/resume-print');
              }}
            >
              View My Profile
            </Button>
          </div>
        </div>
      )}

    </CandidateLayout>
  );
};
