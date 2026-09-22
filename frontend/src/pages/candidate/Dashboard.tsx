import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getResumeUrl } from '../../utils/urlHelper';
import { STATE_CITY_MAP } from '../../utils/constants';
import { viewCandidateResume } from '../../utils/clientPdfGenerator';
import type { RootState, AppDispatch } from '../../store';

import api from '../../services/api';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Button } from '../../components/Button';
import { ArrowLeft, ArrowRight, Save, Check } from 'lucide-react';

import { Stepper } from '../../components/candidate-profile/Stepper';
import { Step1Personal } from '../../components/candidate-profile/Step1Personal';
import { Step2CA } from '../../components/candidate-profile/Step2CA';
import { Step3Articleship } from '../../components/candidate-profile/Step3Articleship';
import { Step4Education } from '../../components/candidate-profile/Step4Education';
import { Step5Experience } from '../../components/candidate-profile/Step5Experience';
import { Step6Review } from '../../components/candidate-profile/Step6Review';
import { parseResumeFile, parseResumeFromUrl, type ParsedResumeData } from '../../utils/resumeParser';

export const CandidateDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [step, setStep] = useState(1);
  const [savingProfile, setSavingProfile] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [scanningResume, setScanningResume] = useState(false);
  const [popup, setPopup] = useState<{show: boolean, type: 'success'|'error', title: string, message: string, action?: string}>({ show: false, type: 'success', title: '', message: '' });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [personal, setPersonal] = useState({
    phone: '', password: '', confirmPassword: '',
    alternatePhone: '', currentAddress: '', currentState: '', currentCity: '',
    permanentAddressSameAsCurrent: false, permanentAddress: '', permanentState: '', permanentCity: '',
    dateOfBirth: '', gender: 'Male', maritalStatus: 'Unmarried', preferredCampusCity: '',
    prefCity1: '', prefCity2: '', prefCity3: '', prefCity4: '', prefCity5: ''
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

  const [experienceInfo, setExperienceInfo] = useState({
    isExperienced: false,
    experienceYears: '',
    currentCompanyName: '',
    currentCTC: '',
    expectedCTC: '',
    currentDesignation: '',
    workProfile: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.resumeUrl) setResumeUrl(user.resumeUrl);
    if (user.personalDetails) {
        let pd = { ...user.personalDetails };
        if (pd.currentCity && !pd.currentState) {
          for (const [state, cities] of Object.entries(STATE_CITY_MAP)) {
            if (cities.includes(pd.currentCity)) {
              pd.currentState = state;
              break;
            }
          }
        }
        setPersonal(prev => ({ ...prev, ...pd }));
      }
      if (user.phone) setPersonal(prev => ({ ...prev, phone: user.phone }));
    if (user.caPortfolio) setCaPortfolio(prev => ({ ...prev, ...user.caPortfolio }));
    if (user.qualifications) setQualifications(prev => ({ ...prev, ...user.qualifications }));
    if (user.experienceInfo) setExperienceInfo(prev => ({ ...prev, ...user.experienceInfo }));

  }, [user, navigate]);

  const applyParsedDataToProfile = (parsed: ParsedResumeData) => {
    const updatedSections: string[] = [];

    // 1. Personal Details
    setPersonal(prev => {
      let next = { ...prev };
      if (parsed.phone && !prev.phone) {
        next.phone = parsed.phone;
        updatedSections.push('Phone');
      }
      if (parsed.alternatePhone && !prev.alternatePhone) {
        next.alternatePhone = parsed.alternatePhone;
        updatedSections.push('Alternate Phone');
      }
      if (parsed.city && !prev.currentCity) {
        next.currentCity = parsed.city;
        if (parsed.state) next.currentState = parsed.state;
        updatedSections.push('Current City');
      }
      if (parsed.currentAddress && !prev.currentAddress) {
        next.currentAddress = parsed.currentAddress;
        updatedSections.push('Address');
      }
      if (parsed.dateOfBirth && !prev.dateOfBirth) {
        next.dateOfBirth = parsed.dateOfBirth;
        updatedSections.push('Date of Birth');
      }
      if (parsed.gender && !prev.gender) {
        next.gender = parsed.gender;
        updatedSections.push('Gender');
      }
      if (parsed.maritalStatus && !prev.maritalStatus) {
        next.maritalStatus = parsed.maritalStatus;
        updatedSections.push('Marital Status');
      }
      return next;
    });

    // 2. CA Portfolio
    setCaPortfolio(prev => {
      let next = { ...prev };
      if (parsed.isFresherCA !== undefined) {
        next.isFresherCA = parsed.isFresherCA;
      }
      if (parsed.big4Articleship) {
        next.big4Articleship = parsed.big4Articleship;
        updatedSections.push('Big 4 Articleship');
      }
      if (parsed.articleshipFirm) {
        next.articleships = [{
          type: 'Articleship',
          firmName: parsed.articleshipFirm,
          city: parsed.articleshipCity || parsed.city || '',
          noOfPartners: '2',
          noOfMonths: '36'
        }];
        updatedSections.push('Articleship Firm');
      }
      if (parsed.natureOfWork && !prev.natureOfWork) {
        next.natureOfWork = parsed.natureOfWork;
        updatedSections.push('Nature of Work');
      }
      if (parsed.industrialTrainee) {
        next.industrialTrainee = parsed.industrialTrainee;
      }
      if (parsed.gmcsCompleted) {
        next.gmcsCompleted = parsed.gmcsCompleted;
      }
      return next;
    });

    // 3. Qualifications
    setQualifications(prev => {
      let next = { ...prev };
      if (parsed.graduationCollege && !prev.graduation.college) {
        next.graduation.college = parsed.graduationCollege;
        updatedSections.push('Graduation College');
      }
      if (parsed.graduationYear && !prev.graduation.yearOfCompletion) {
        next.graduation.yearOfCompletion = parsed.graduationYear;
      }
      if (parsed.graduationPercentage && !prev.graduation.percentage) {
        next.graduation.percentage = parsed.graduationPercentage;
        updatedSections.push('Graduation %');
      }
      if (parsed.class12Percentage && !prev.class12.percentage) {
        next.class12.percentage = parsed.class12Percentage;
        updatedSections.push('Class 12 %');
      }
      if (parsed.class12Board && !prev.class12.board) {
        next.class12.board = parsed.class12Board;
      }
      if (parsed.class10Percentage && !prev.class10.percentage) {
        next.class10.percentage = parsed.class10Percentage;
        updatedSections.push('Class 10 %');
      }
      if (parsed.class10Board && !prev.class10.board) {
        next.class10.board = parsed.class10Board;
      }
      return next;
    });

    // 4. Experience Info
    setExperienceInfo(prev => {
      let next = { ...prev };
      if (parsed.isExperienced !== undefined) {
        next.isExperienced = parsed.isExperienced;
      }
      if (parsed.experienceYears && !prev.experienceYears) {
        next.experienceYears = parsed.experienceYears;
        updatedSections.push('Experience Years');
      }
      if (parsed.currentCompanyName && !prev.currentCompanyName) {
        next.currentCompanyName = parsed.currentCompanyName;
        updatedSections.push('Company');
      }
      if (parsed.currentDesignation && !prev.currentDesignation) {
        next.currentDesignation = parsed.currentDesignation;
        updatedSections.push('Designation');
      }
      if (parsed.workProfile && !prev.workProfile) {
        next.workProfile = parsed.workProfile;
      }
      return next;
    });

    return updatedSections;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPopup({ show: true, type: 'error', title: 'File Too Large', message: 'Resume size must be less than 5MB.' });
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    setScanningResume(true);
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeUrl(response.data.url);

      let updated: string[] = [];
      try {
        const parsed = await parseResumeFile(file);
        updated = applyParsedDataToProfile(parsed);
      } catch (parseErr) {
        console.error('Resume scanning error:', parseErr);
      }

      if (updated.length > 0) {
        setPopup({
          show: true,
          type: 'success',
          title: 'Resume Uploaded & Profile Auto-Filled! ⚡',
          message: `Resume scanned! Auto-filled fields: ${updated.join(', ')}. Please review each section.`
        });
      } else {
        setPopup({ show: true, type: 'success', title: 'Upload Successful', message: 'Your resume has been uploaded.' });
      }
    } catch (error) {
      setPopup({ show: true, type: 'error', title: 'Upload Failed', message: 'Could not upload resume.' });
    } finally {
      setUploading(false);
      setScanningResume(false);
    }
  };

  const handleAutoFillFromResume = async () => {
    if (!resumeUrl) {
      setPopup({
        show: true,
        type: 'error',
        title: 'No Resume Found',
        message: 'Please upload a resume first to scan and auto-fill.'
      });
      return;
    }

    setScanningResume(true);
    try {
      const parsed = await parseResumeFromUrl(resumeUrl);
      const updated = applyParsedDataToProfile(parsed);
      if (updated.length > 0) {
        setPopup({
          show: true,
          type: 'success',
          title: 'Profile Auto-Filled from Resume! ✨',
          message: `Extracted ${updated.length} fields: ${updated.join(', ')}. Please review each step.`
        });
      } else {
        setPopup({
          show: true,
          type: 'success',
          title: 'Resume Analyzed',
          message: 'Resume text was analyzed. Your existing profile fields are already populated.'
        });
      }
    } catch (err) {
      console.error('Error auto-filling from resume URL:', err);
      setPopup({
        show: true,
        type: 'error',
        title: 'Auto-Fill Notice',
        message: 'Could not scan the remote file directly. Please select your resume file above to auto-fill.'
      });
    } finally {
      setScanningResume(false);
    }
  };

  const handleSaveProgress = async (goToNext = true, isFinal = false) => {
    if (step === 1 && personal.password && personal.password !== personal.confirmPassword) {
      setPopup({ show: true, type: 'error', title: 'Password Mismatch', message: 'Your passwords do not match. Please correct them before proceeding.' });
      return;
    }
    if (step === 1 && !resumeUrl) {
      setPopup({ show: true, type: 'error', title: 'Missing Resume', message: 'Resume is required to proceed.' });
      return;
    }
    
    setSavingProfile(true);
    try {
      const payload: any = {
        phone: personal.phone,
        password: personal.password || undefined,
        personalDetails: personal,
        caPortfolio: {
          ...caPortfolio,
          articleshipCompletionDate: `${caPortfolio.articleshipCompletionDateMonth} ${caPortfolio.articleshipCompletionDateYear}`
        },
        qualifications,
        experienceInfo
      };

      const res = await api.put('/users/profile', payload);
      
      // Keep local user and token up-to-date
      if (res.data) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            const merged = { ...parsed, ...res.data };
            localStorage.setItem('user', JSON.stringify(merged));
          } catch (_) {}
        }
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
      }

      setLastSaved(new Date());

      if (isFinal) {
        setPopup({ show: true, type: 'success', title: 'Profile Submitted!', message: 'Your profile has been saved successfully.', action: 'jobs' });
        return;
      }

      if (goToNext && step < 5) {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error('Profile save error:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save data. Please try again.';
      setPopup({ show: true, type: 'error', title: 'Error', message: msg });
    } finally {
      setSavingProfile(false);
    }
  };

  const steps = ['Personal Details', 'CA Qualification', 'Articleship', 'Education & Experience', 'Review'];

  
  const calculateProfileCompletion = () => {
    let score = 0;
    let total = 6;
    if (user?.firstName && user?.lastName) score += 1;
    if (personal.phone) score += 1;
    if (personal.currentCity) score += 1;
    if (resumeUrl) score += 1;
    if (caPortfolio.caFinal?.group1Attempts || caPortfolio.caInter?.group1Attempts) score += 1;
    if (caPortfolio.articleshipFirmName) score += 1;
    
    return Math.round((score / total) * 100);
  };
  
  const completionPercentage = calculateProfileCompletion();

  return (
    <CandidateLayout>
      <div className="max-w-5xl mx-auto w-full pb-32">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-gray-900">Profile Completion</h3>
            <span className="text-sm font-semibold text-primary">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${completionPercentage}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {completionPercentage === 100 ? "Your profile is fully complete! You are ready to apply for jobs." : "Complete your profile to stand out to employers."}
          </p>
        </div>

          <Stepper currentStep={step} totalSteps={5} steps={steps} onStepClick={setStep} />

        <div className="relative">
          {step === 1 && (
            <Step1Personal
              personal={personal}
              setPersonal={setPersonal}
              user={user}
              resumeUrl={resumeUrl}
              handleFileUpload={handleFileUpload}
              uploading={uploading}
              viewCandidateResume={() => viewCandidateResume({ ...user, resumeUrl, personalDetails: personal, caPortfolio, qualifications })}
              handleAutoFillFromResume={handleAutoFillFromResume}
              scanningResume={scanningResume}
            />
          )}
          {step === 2 && <Step2CA caPortfolio={caPortfolio} setCaPortfolio={setCaPortfolio} />}
          {step === 3 && <Step3Articleship caPortfolio={caPortfolio} setCaPortfolio={setCaPortfolio} />}
          {step === 4 && (
            <div className="space-y-12">
              <Step4Education qualifications={qualifications} setQualifications={setQualifications} />
              <div className="border-t border-gray-200"></div>
              <Step5Experience experienceInfo={experienceInfo} setExperienceInfo={setExperienceInfo} personal={personal} setPersonal={setPersonal} />
            </div>
          )}
          {step === 5 && <Step6Review personal={personal} caPortfolio={caPortfolio} qualifications={qualifications} experienceInfo={experienceInfo} setStep={setStep} user={user} />}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => { setStep(step - 1); window.scrollTo(0,0); }} disabled={step === 1 || savingProfile} className="gap-2">
              <ArrowLeft size={18} /> <span className="hidden sm:inline">Previous</span>
            </Button>
            
            {lastSaved && (
              <span className="hidden md:inline text-xs font-medium text-gray-400">
                Draft saved ✓
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => handleSaveProgress(false)} disabled={savingProfile} className="hidden sm:flex gap-2">
              <Save size={18} /> Save Draft
            </Button>
            
            {step < 5 ? (
              <Button onClick={() => handleSaveProgress(true)} disabled={savingProfile || uploading} className="gap-2 min-w-[140px] justify-center bg-primary hover:bg-blue-700 text-white shadow-lg shadow-primary/30">
                {savingProfile ? 'Saving...' : 'Save & Continue'} <ArrowRight size={18} />
              </Button>
            ) : (
              <Button onClick={() => handleSaveProgress(true, true)} disabled={savingProfile} className="gap-2 min-w-[160px] justify-center bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30">
                {savingProfile ? 'Submitting...' : 'Confirm & Submit'} <Check size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {popup.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center transform animate-in zoom-in-95 duration-200">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${popup.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <Check size={24} strokeWidth={3} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{popup.title}</h3>
            <p className="text-gray-600 mb-6">{popup.message}</p>
            <Button onClick={() => {
                setPopup({ ...popup, show: false });
                if (popup.action === 'jobs') {
                  navigate('/candidate/openings');
                }
              }} className="w-full justify-center">
              Okay
            </Button>
          </div>
        </div>
      )}
    </CandidateLayout>
  );
};
