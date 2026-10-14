import React, { useState } from 'react';
import { User, FileText, Briefcase, GraduationCap, Building, X, Check, Edit3, Sparkles, Save, MapPin, Plus, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { STATES, STATE_CITY_MAP, ATTEMPTS, CA_EXAM_MONTHS, YEARS, ARTICLESHIP_TYPES, CA_FIRMS, ALL_CITIES, MONTHS, NATURE_OF_WORK, PARTNER_OPTIONS, ARTICLESHIP_CITIES } from '../../utils/constants';

interface Step6ReviewProps {
  personal: any;
  setPersonal: React.Dispatch<React.SetStateAction<any>>;
  caPortfolio: any;
  setCaPortfolio: React.Dispatch<React.SetStateAction<any>>;
  qualifications: any;
  experienceInfo: any;
  setStep: (step: number) => void;
  user: any;
}

export const Step6Review: React.FC<Step6ReviewProps> = ({
  personal,
  setPersonal,
  caPortfolio,
  setCaPortfolio,
  qualifications,
  experienceInfo,
  setStep,
  user
}) => {
  // Modal states for direct editing
  const [editPersonalModal, setEditPersonalModal] = useState(false);
  const [editCaModal, setEditCaModal] = useState(false);
  const [editArticleshipModal, setEditArticleshipModal] = useState(false);

  const [tempArticleship, setTempArticleship] = useState({
    articleships: caPortfolio.articleships ? JSON.parse(JSON.stringify(caPortfolio.articleships)) : [{ type: 'Articleship', firmName: '', city: '', noOfPartners: '1 to 10', noOfMonths: '36' }],
    articleshipCompletionDateMonth: caPortfolio.articleshipCompletionDateMonth || 'May',
    articleshipCompletionDateYear: caPortfolio.articleshipCompletionDateYear || '2023',
    gmcsCompleted: caPortfolio.gmcsCompleted || 'Yes',
    industrialTrainee: caPortfolio.industrialTrainee || 'No',
    listedCompanyWork: caPortfolio.listedCompanyWork || 'No',
    natureOfWork: caPortfolio.natureOfWork || ''
  });

  // Temporary edit states
  const [tempPersonal, setTempPersonal] = useState({
    phone: personal.phone || '',
    dateOfBirth: personal.dateOfBirth || '',
    gender: personal.gender || 'Male',
    maritalStatus: personal.maritalStatus || 'Unmarried',
    currentState: personal.currentState || '',
    currentCity: personal.currentCity || ''
  });

  const [tempCa, setTempCa] = useState({
    isFresherCA: caPortfolio.isFresherCA || false,
    caInter: {
      bothGroups1stAttempt: caPortfolio.caInter?.bothGroups1stAttempt || false,
      group1Attempts: caPortfolio.caInter?.group1Attempts || '1',
      group1Month: caPortfolio.caInter?.group1Month || 'May',
      group1Year: caPortfolio.caInter?.group1Year || '2020',
      group2Attempts: caPortfolio.caInter?.group2Attempts || '1',
      group2Month: caPortfolio.caInter?.group2Month || 'May',
      group2Year: caPortfolio.caInter?.group2Year || '2020',
      ranker: caPortfolio.caInter?.ranker || 'No',
      completionSessionMonth: caPortfolio.caInter?.completionSessionMonth || 'May',
      completionSessionYear: caPortfolio.caInter?.completionSessionYear || '2020',
    },
    caFinal: {
      bothGroups1stAttempt: caPortfolio.caFinal?.bothGroups1stAttempt || false,
      group1Attempts: caPortfolio.caFinal?.group1Attempts || '1',
      group1Month: caPortfolio.caFinal?.group1Month || 'May',
      group1Year: caPortfolio.caFinal?.group1Year || '2023',
      group2Attempts: caPortfolio.caFinal?.group2Attempts || '1',
      group2Month: caPortfolio.caFinal?.group2Month || 'May',
      group2Year: caPortfolio.caFinal?.group2Year || '2023',
      ranker: caPortfolio.caFinal?.ranker || 'No',
      completionSessionMonth: caPortfolio.caFinal?.completionSessionMonth || 'May',
      completionSessionYear: caPortfolio.caFinal?.completionSessionYear || '2023',
    }
  });

  const openPersonalModal = () => {
    setTempPersonal({
      phone: personal.phone || '',
      dateOfBirth: personal.dateOfBirth || '',
      gender: personal.gender || 'Male',
      maritalStatus: personal.maritalStatus || 'Unmarried',
      currentState: personal.currentState || '',
      currentCity: personal.currentCity || ''
    });
    setEditPersonalModal(true);
  };

  const savePersonalModal = () => {
    setPersonal(prev => ({
      ...prev,
      ...tempPersonal
    }));
    setEditPersonalModal(false);
    toast.success('Personal details updated successfully!', { icon: '✓' });
  };

  const openCaModal = () => {
    setTempCa({
      isFresherCA: caPortfolio.isFresherCA || false,
      caInter: {
        bothGroups1stAttempt: caPortfolio.caInter?.bothGroups1stAttempt || false,
        group1Attempts: caPortfolio.caInter?.group1Attempts || '1',
        group1Month: caPortfolio.caInter?.group1Month || 'May',
        group1Year: caPortfolio.caInter?.group1Year || '2020',
        group2Attempts: caPortfolio.caInter?.group2Attempts || '1',
        group2Month: caPortfolio.caInter?.group2Month || 'May',
        group2Year: caPortfolio.caInter?.group2Year || '2020',
        ranker: caPortfolio.caInter?.ranker || 'No',
        completionSessionMonth: caPortfolio.caInter?.completionSessionMonth || 'May',
        completionSessionYear: caPortfolio.caInter?.completionSessionYear || '2020',
      },
      caFinal: {
        bothGroups1stAttempt: caPortfolio.caFinal?.bothGroups1stAttempt || false,
        group1Attempts: caPortfolio.caFinal?.group1Attempts || '1',
        group1Month: caPortfolio.caFinal?.group1Month || 'May',
        group1Year: caPortfolio.caFinal?.group1Year || '2023',
        group2Attempts: caPortfolio.caFinal?.group2Attempts || '1',
        group2Month: caPortfolio.caFinal?.group2Month || 'May',
        group2Year: caPortfolio.caFinal?.group2Year || '2023',
        ranker: caPortfolio.caFinal?.ranker || 'No',
        completionSessionMonth: caPortfolio.caFinal?.completionSessionMonth || 'May',
        completionSessionYear: caPortfolio.caFinal?.completionSessionYear || '2023',
      }
    });
    setEditCaModal(true);
  };

  const handleTempCaChange = (exam: 'caInter' | 'caFinal', field: string, value: any) => {
    setTempCa(prev => {
      const examData = { ...prev[exam], [field]: value };
      if (field === 'bothGroups1stAttempt' && value === true) {
        examData.group1Attempts = '1';
        examData.group2Attempts = '1';
        if (examData.group1Month) examData.group2Month = examData.group1Month;
        if (examData.group1Year) examData.group2Year = examData.group1Year;
        if (examData.group1Month) examData.completionSessionMonth = examData.group1Month;
        if (examData.group1Year) examData.completionSessionYear = examData.group1Year;
      }
      if (examData.bothGroups1stAttempt) {
        if (field === 'group1Month') {
          examData.group2Month = value;
          examData.completionSessionMonth = value;
        }
        if (field === 'group1Year') {
          examData.group2Year = value;
          examData.completionSessionYear = value;
        }
      }
      return { ...prev, [exam]: examData };
    });
  };

  const saveCaModal = () => {
    setCaPortfolio(prev => ({
      ...prev,
      isFresherCA: tempCa.isFresherCA,
      caInter: { ...prev.caInter, ...tempCa.caInter },
      caFinal: { ...prev.caFinal, ...tempCa.caFinal }
    }));
    setEditCaModal(false);
    toast.success('CA Qualification details updated successfully!', { icon: '✓' });
  };

  const openArticleshipModal = () => {
    setTempArticleship({
      articleships: caPortfolio.articleships && caPortfolio.articleships.length > 0
        ? JSON.parse(JSON.stringify(caPortfolio.articleships))
        : [{ type: 'Articleship', firmName: '', city: '', noOfPartners: '1 to 10', noOfMonths: '36' }],
      articleshipCompletionDateMonth: caPortfolio.articleshipCompletionDateMonth || 'May',
      articleshipCompletionDateYear: caPortfolio.articleshipCompletionDateYear || '2023',
      gmcsCompleted: caPortfolio.gmcsCompleted || 'Yes',
      industrialTrainee: caPortfolio.industrialTrainee || 'No',
      listedCompanyWork: caPortfolio.listedCompanyWork || 'No',
      natureOfWork: caPortfolio.natureOfWork || ''
    });
    setEditArticleshipModal(true);
  };

  const saveArticleshipModal = () => {
    setCaPortfolio(prev => ({
      ...prev,
      ...tempArticleship,
      articleshipCompletionDate: `${tempArticleship.articleshipCompletionDateMonth} ${tempArticleship.articleshipCompletionDateYear}`
    }));
    setEditArticleshipModal(false);
    toast.success('Articleship & Training details updated successfully!', { icon: '✓' });
  };

  const addTempFirm = () => {
    setTempArticleship(prev => ({
      ...prev,
      articleships: [...prev.articleships, { type: 'Articleship', firmName: '', city: '', noOfPartners: '1 to 10', noOfMonths: '0' }]
    }));
  };

  const removeTempFirm = (index: number) => {
    setTempArticleship(prev => ({
      ...prev,
      articleships: prev.articleships.filter((_, i) => i !== index)
    }));
  };

  const updateTempFirm = (index: number, field: string, value: any) => {
    setTempArticleship(prev => {
      const next = [...prev.articleships];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, articleships: next };
    });
  };

  const toggleTempNatureOfWork = (work: string) => {
    setTempArticleship(prev => {
      let works = prev.natureOfWork ? prev.natureOfWork.split(',').map((w: string) => w.trim()).filter(Boolean) : [];
      if (works.includes(work)) {
        works = works.filter(w => w !== work);
      } else {
        works.push(work);
      }
      return { ...prev, natureOfWork: works.join(', ') };
    });
  };

  const Section = ({ title, icon: Icon, onEdit, step, children }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
      <button
        type="button"
        onClick={() => {
          if (onEdit) onEdit();
          else if (step !== undefined) setStep(step);
        }}
        className="absolute top-5 right-5 text-xs font-semibold text-primary hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
      >
        <Edit3 size={13} />
        <span>Edit</span>
      </button>
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
        <div className="p-2 bg-blue-50 text-primary rounded-xl">
          <Icon size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {children}
      </div>
    </div>
  );

  const DataItem = ({ label, value }: { label: string; value: any }) => (
    <div>
      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || '-'}</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Profile</h2>
        <p className="text-gray-500 text-sm mt-1">Please verify your information before submitting. Click "Edit" on any section to make changes directly.</p>
      </div>

      {/* 1. Personal Details Section */}
      <Section title="Personal Details" icon={User} onEdit={openPersonalModal}>
        <DataItem label="Name" value={`${user?.firstName || ''} ${user?.lastName || ''}`} />
        <DataItem label="Email" value={user?.email} />
        <DataItem label="Phone" value={personal.phone} />
        <DataItem label="Gender & Marital Status" value={`${personal.gender || '-'}, ${personal.maritalStatus || '-'}`} />
        <DataItem label="Date of Birth" value={personal.dateOfBirth} />
        <DataItem label="Current Location" value={`${personal.currentCity || ''}${personal.currentState ? `, ${personal.currentState}` : ''}`} />
      </Section>

      {/* 2. CA Qualification Section */}
      <Section title="CA Qualification" icon={FileText} onEdit={openCaModal}>
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
          {/* CA Inter Card */}
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">CA Intermediate</span>
              {caPortfolio.caInter?.bothGroups1stAttempt && (
                <span className="text-[10.5px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  ✓ Both Groups 1st Attempt
                </span>
              )}
            </div>
            <div className="text-xs text-slate-700 space-y-1 pt-1">
              <div><span className="font-semibold text-slate-900">Group I:</span> {caPortfolio.caInter?.group1Month || '-'} {caPortfolio.caInter?.group1Year || '-'} ({caPortfolio.caInter?.group1Attempts || '1'} {parseInt(caPortfolio.caInter?.group1Attempts || '1') > 1 ? 'attempts' : 'attempt'})</div>
              <div><span className="font-semibold text-slate-900">Group II:</span> {caPortfolio.caInter?.group2Month || '-'} {caPortfolio.caInter?.group2Year || '-'} ({caPortfolio.caInter?.group2Attempts || '1'} {parseInt(caPortfolio.caInter?.group2Attempts || '1') > 1 ? 'attempts' : 'attempt'})</div>
              <div><span className="font-semibold text-slate-900">Ranker:</span> {caPortfolio.caInter?.ranker || 'No'}</div>
              <div><span className="font-semibold text-slate-900">Completion:</span> {caPortfolio.caInter?.completionSessionMonth || '-'} {caPortfolio.caInter?.completionSessionYear || '-'}</div>
            </div>
          </div>

          {/* CA Final Card */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">CA Final</span>
              {caPortfolio.caFinal?.bothGroups1stAttempt && (
                <span className="text-[10.5px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  ✓ Both Groups 1st Attempt
                </span>
              )}
            </div>
            <div className="text-xs text-slate-700 space-y-1 pt-1">
              <div><span className="font-semibold text-slate-900">Group I:</span> {caPortfolio.caFinal?.group1Month || '-'} {caPortfolio.caFinal?.group1Year || '-'} ({caPortfolio.caFinal?.group1Attempts || '1'} {parseInt(caPortfolio.caFinal?.group1Attempts || '1') > 1 ? 'attempts' : 'attempt'})</div>
              <div><span className="font-semibold text-slate-900">Group II:</span> {caPortfolio.caFinal?.group2Month || '-'} {caPortfolio.caFinal?.group2Year || '-'} ({caPortfolio.caFinal?.group2Attempts || '1'} {parseInt(caPortfolio.caFinal?.group2Attempts || '1') > 1 ? 'attempts' : 'attempt'})</div>
              <div><span className="font-semibold text-slate-900">Ranker:</span> {caPortfolio.caFinal?.ranker || 'No'}</div>
              <div><span className="font-semibold text-slate-900">Completion:</span> {caPortfolio.caFinal?.completionSessionMonth || '-'} {caPortfolio.caFinal?.completionSessionYear || '-'}</div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. Articleship Section (Only for Fresher candidates) */}
      {!experienceInfo?.isExperienced && (
        <Section title="Articleship & Training" icon={Building} onEdit={openArticleshipModal}>
          <DataItem label="Total Experience" value={`${caPortfolio.articleships?.reduce((acc: number, curr: any) => acc + (parseInt(curr.noOfMonths) || 0), 0) || 0} Months`} />
          <DataItem label="Completion Date" value={`${caPortfolio.articleshipCompletionDateMonth || ''} ${caPortfolio.articleshipCompletionDateYear || ''}`} />
          <DataItem label="GMCS Completed" value={caPortfolio.gmcsCompleted || 'Yes'} />
          <DataItem label="Industrial Trainee" value={caPortfolio.industrialTrainee || 'No'} />
          <DataItem label="Listed Company Work" value={caPortfolio.listedCompanyWork || 'No'} />
          <div className="col-span-1 md:col-span-2">
            <DataItem label="Nature of Work" value={caPortfolio.natureOfWork} />
          </div>
          {caPortfolio.articleships && caPortfolio.articleships.length > 0 && (
            <div className="col-span-1 md:col-span-2 mt-2 space-y-2">
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Firms Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {caPortfolio.articleships.map((f: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                    <div className="font-bold text-slate-800">{f.firmName || 'Firm'} ({f.type || 'Articleship'})</div>
                    <div className="text-slate-500 mt-0.5">{f.city ? `City: ${f.city}` : ''} • {f.noOfMonths ? `${f.noOfMonths} Mos` : ''} • {f.noOfPartners ? `${f.noOfPartners} Partners` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* 4. Education Section */}
      <Section title="Education" icon={GraduationCap} step={2}>
        <DataItem label="Graduation" value={`${qualifications.graduation?.type || ''} - ${qualifications.graduation?.college || ''} (${qualifications.graduation?.percentage || ''}%)`} />
        <DataItem label="Class XII" value={`${qualifications.class12?.percentage || ''}% (${qualifications.class12?.year || ''})`} />
        <DataItem label="Class X" value={`${qualifications.class10?.percentage || ''}% (${qualifications.class10?.year || ''})`} />
      </Section>

      {/* 5. Placement Preferences Section */}
      <Section title="Placement Preferences" icon={MapPin} step={3}>
        <DataItem label="Preferred Campus City" value={personal.preferredCampusCity || '-'} />
        <DataItem label="Preferred Job Cities" value={[personal.prefCity1, personal.prefCity2, personal.prefCity3].filter(Boolean).join(', ') || '-'} />
      </Section>

      {/* 6. Work Experience Section (Only for Experienced candidates) */}
      {experienceInfo?.isExperienced && (
        <Section title="Corporate Work Experience" icon={Briefcase}>
          <DataItem label="Total Experience" value={experienceInfo.experienceYears} />
          {experienceInfo.caFinalCompletionYear && (
            <DataItem label="CA Final Year" value={experienceInfo.caFinalCompletionYear} />
          )}
          <DataItem label="Current Company" value={experienceInfo.currentCompanyName} />
          <DataItem label="Designation" value={experienceInfo.currentDesignation} />
          {experienceInfo.workProfile && (
            <DataItem label="Work Profile" value={experienceInfo.workProfile} />
          )}
          {experienceInfo.currentCTC && (
            <DataItem label="Current CTC" value={experienceInfo.currentCTC} />
          )}
          {experienceInfo.expectedCTC && (
            <DataItem label="Expected CTC" value={experienceInfo.expectedCTC} />
          )}
        </Section>
      )}

      {/* ═══════════════ EDIT PERSONAL DETAILS MODAL ═══════════════ */}
      {editPersonalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-primary rounded-xl">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Edit Personal Details</h3>
                  <p className="text-xs text-gray-500">Update your contact & personal information</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditPersonalModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mobile Number *</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={tempPersonal.phone}
                  onChange={(e) => setTempPersonal({ ...tempPersonal, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date of Birth *</label>
                <input
                  type="date"
                  value={tempPersonal.dateOfBirth}
                  onChange={(e) => setTempPersonal({ ...tempPersonal, dateOfBirth: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Gender *</label>
                <select
                  value={tempPersonal.gender || 'Male'}
                  onChange={(e) => setTempPersonal({ ...tempPersonal, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Marital Status *</label>
                <select
                  value={tempPersonal.maritalStatus}
                  onChange={(e) => setTempPersonal({ ...tempPersonal, maritalStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white cursor-pointer"
                >
                  <option>Unmarried</option>
                  <option>Married</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">State *</label>
                <select
                  value={tempPersonal.currentState}
                  onChange={(e) => setTempPersonal({ ...tempPersonal, currentState: e.target.value, currentCity: '' })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white cursor-pointer"
                >
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Current City *</label>
                <select
                  value={(STATE_CITY_MAP[tempPersonal.currentState] || []).includes(tempPersonal.currentCity) ? tempPersonal.currentCity : (tempPersonal.currentCity ? 'Other' : '')}
                  onChange={(e) => setTempPersonal({ ...tempPersonal, currentCity: e.target.value })}
                  disabled={!tempPersonal.currentState}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white disabled:bg-gray-50 cursor-pointer"
                >
                  <option value="">Select City</option>
                  {(STATE_CITY_MAP[tempPersonal.currentState] || []).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {(tempPersonal.currentCity === 'Other' || (tempPersonal.currentCity && !(STATE_CITY_MAP[tempPersonal.currentState] || []).filter(c => c !== 'Other').includes(tempPersonal.currentCity))) && (
                  <input
                    type="text"
                    placeholder="Enter city name"
                    value={tempPersonal.currentCity === 'Other' ? '' : tempPersonal.currentCity}
                    onChange={(e) => setTempPersonal({ ...tempPersonal, currentCity: e.target.value })}
                    className="mt-2 w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditPersonalModal(false)}
                className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={savePersonalModal}
                className="px-5 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ EDIT CA QUALIFICATION MODAL ═══════════════ */}
      {editCaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Edit CA Qualification Details</h3>
                  <p className="text-xs text-gray-500">Update your CA Intermediate & CA Final examination records</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditCaModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Fresher CA Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <div className="text-xs font-bold text-slate-900">Fresher CA Status</div>
                <div className="text-[11px] text-slate-500">Tick if you recently qualified and looking for fresher roles</div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={tempCa.isFresherCA}
                  onChange={(e) => setTempCa({ ...tempCa, isFresherCA: e.target.checked })}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">Fresher CA</span>
              </label>
            </div>

            {/* ─── CA Intermediate Card ─── */}
            <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                  <GraduationCap size={18} className="text-indigo-600" />
                  <span>CA Intermediate Qualification</span>
                </h4>
                <label className="flex items-center gap-2 cursor-pointer bg-indigo-100/70 px-3 py-1 rounded-lg border border-indigo-200 text-xs font-bold text-indigo-900">
                  <input
                    type="checkbox"
                    checked={tempCa.caInter.bothGroups1stAttempt}
                    onChange={(e) => handleTempCaChange('caInter', 'bothGroups1stAttempt', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                  <span>Both Groups - 1st Attempt</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Inter G1 */}
                <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Group I</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Attempts</label>
                      <select
                        disabled={tempCa.caInter.bothGroups1stAttempt}
                        value={tempCa.caInter.group1Attempts}
                        onChange={(e) => handleTempCaChange('caInter', 'group1Attempts', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                      >
                        {ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Month</label>
                      <select
                        value={tempCa.caInter.group1Month}
                        onChange={(e) => handleTempCaChange('caInter', 'group1Month', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                      >
                        {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Year</label>
                      <select
                        value={tempCa.caInter.group1Year}
                        onChange={(e) => handleTempCaChange('caInter', 'group1Year', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                      >
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Inter G2 */}
                <div className="bg-white p-3.5 rounded-xl border border-indigo-100 space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Group II</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Attempts</label>
                      <select
                        disabled={tempCa.caInter.bothGroups1stAttempt}
                        value={tempCa.caInter.group2Attempts}
                        onChange={(e) => handleTempCaChange('caInter', 'group2Attempts', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                      >
                        {ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Month</label>
                      <select
                        disabled={tempCa.caInter.bothGroups1stAttempt}
                        value={tempCa.caInter.group2Month}
                        onChange={(e) => handleTempCaChange('caInter', 'group2Month', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                      >
                        {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Year</label>
                      <select
                        disabled={tempCa.caInter.bothGroups1stAttempt}
                        value={tempCa.caInter.group2Year}
                        onChange={(e) => handleTempCaChange('caInter', 'group2Year', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                      >
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inter Ranker & Completion */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-indigo-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ranker</label>
                  <select
                    value={tempCa.caInter.ranker}
                    onChange={(e) => handleTempCaChange('caInter', 'ranker', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (Ranker)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CA Inter Completion Session</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      disabled={tempCa.caInter.bothGroups1stAttempt}
                      value={tempCa.caInter.completionSessionMonth}
                      onChange={(e) => handleTempCaChange('caInter', 'completionSessionMonth', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                    >
                      {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select
                      disabled={tempCa.caInter.bothGroups1stAttempt}
                      value={tempCa.caInter.completionSessionYear}
                      onChange={(e) => handleTempCaChange('caInter', 'completionSessionYear', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                    >
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── CA Final Card ─── */}
            <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                <h4 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                  <GraduationCap size={18} className="text-blue-600" />
                  <span>CA Final Qualification</span>
                </h4>
                <label className="flex items-center gap-2 cursor-pointer bg-blue-100/70 px-3 py-1 rounded-lg border border-blue-200 text-xs font-bold text-blue-900">
                  <input
                    type="checkbox"
                    checked={tempCa.caFinal.bothGroups1stAttempt}
                    onChange={(e) => handleTempCaChange('caFinal', 'bothGroups1stAttempt', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span>Both Groups - 1st Attempt</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Final G1 */}
                <div className="bg-white p-3.5 rounded-xl border border-blue-100 space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Group I</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Attempts</label>
                      <select
                        disabled={tempCa.caFinal.bothGroups1stAttempt}
                        value={tempCa.caFinal.group1Attempts}
                        onChange={(e) => handleTempCaChange('caFinal', 'group1Attempts', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                      >
                        {ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Month</label>
                      <select
                        value={tempCa.caFinal.group1Month}
                        onChange={(e) => handleTempCaChange('caFinal', 'group1Month', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                      >
                        {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Year</label>
                      <select
                        value={tempCa.caFinal.group1Year}
                        onChange={(e) => handleTempCaChange('caFinal', 'group1Year', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                      >
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Final G2 */}
                <div className="bg-white p-3.5 rounded-xl border border-blue-100 space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Group II</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Attempts</label>
                      <select
                        disabled={tempCa.caFinal.bothGroups1stAttempt}
                        value={tempCa.caFinal.group2Attempts}
                        onChange={(e) => handleTempCaChange('caFinal', 'group2Attempts', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                      >
                        {ATTEMPTS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Month</label>
                      <select
                        disabled={tempCa.caFinal.bothGroups1stAttempt}
                        value={tempCa.caFinal.group2Month}
                        onChange={(e) => handleTempCaChange('caFinal', 'group2Month', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                      >
                        {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Year</label>
                      <select
                        disabled={tempCa.caFinal.bothGroups1stAttempt}
                        value={tempCa.caFinal.group2Year}
                        onChange={(e) => handleTempCaChange('caFinal', 'group2Year', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                      >
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Ranker & Completion */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-blue-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ranker</label>
                  <select
                    value={tempCa.caFinal.ranker}
                    onChange={(e) => handleTempCaChange('caFinal', 'ranker', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (Ranker)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CA Final Completion Session</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      disabled={tempCa.caFinal.bothGroups1stAttempt}
                      value={tempCa.caFinal.completionSessionMonth}
                      onChange={(e) => handleTempCaChange('caFinal', 'completionSessionMonth', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                    >
                      {CA_EXAM_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select
                      disabled={tempCa.caFinal.bothGroups1stAttempt}
                      value={tempCa.caFinal.completionSessionYear}
                      onChange={(e) => handleTempCaChange('caFinal', 'completionSessionYear', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white disabled:bg-gray-50"
                    >
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditCaModal(false)}
                className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveCaModal}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ═══════════════ EDIT ARTICLESHIP MODAL ═══════════════ */}
      {editArticleshipModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-primary rounded-xl">
                  <Building size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Edit Articleship & Training</h3>
                  <p className="text-xs text-gray-500">Update your firm details, duration & nature of work</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditArticleshipModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Firms List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Firms Details</label>
                <button
                  type="button"
                  onClick={addTempFirm}
                  className="text-xs font-semibold text-primary hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus size={13} /> Add Firm
                </button>
              </div>

              {tempArticleship.articleships.map((firm: any, idx: number) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Building size={14} className="text-primary" /> Firm #{idx + 1}
                    </span>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removeTempFirm(idx)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Type</label>
                      <select
                        value={firm.type}
                        onChange={(e) => updateTempFirm(idx, 'type', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                      >
                        {ARTICLESHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Firm Name</label>
                      <input
                        type="text"
                        list={`reviewFirmsList-${idx}`}
                        value={firm.firmName}
                        onChange={(e) => updateTempFirm(idx, 'firmName', e.target.value)}
                        placeholder="Enter or select"
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                      />
                      <datalist id={`reviewFirmsList-${idx}`}>
                        {CA_FIRMS.map(f => <option key={f} value={f} />)}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">City</label>
                      <input
                        type="text"
                        list={`reviewCitiesList-${idx}`}
                        value={firm.city}
                        onChange={(e) => updateTempFirm(idx, 'city', e.target.value)}
                        placeholder="City"
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                      />
                      <datalist id={`reviewCitiesList-${idx}`}>
                        {ARTICLESHIP_CITIES.map(c => <option key={c} value={c} />)}
                      </datalist>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Ahmedabad', 'Kolkata'].map(topCity => (
                          <button
                            key={topCity}
                            type="button"
                            onClick={() => updateTempFirm(idx, 'city', topCity)}
                            className={`px-1.5 py-0.5 text-[9.5px] rounded transition-colors ${
                              firm.city === topCity
                                ? 'bg-primary text-white font-medium shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {topCity}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Partners</label>
                      <select
                        value={firm.noOfPartners || '1 to 10'}
                        onChange={(e) => updateTempFirm(idx, 'noOfPartners', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                      >
                        {PARTNER_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt} Partners</option>
                        ))}
                        {firm.noOfPartners && !PARTNER_OPTIONS.includes(firm.noOfPartners) && (
                          <option value={firm.noOfPartners}>{firm.noOfPartners} Partners</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-500 mb-1">Duration (Mos)</label>
                      <input
                        type="number"
                        min="0"
                        max="36"
                        value={firm.noOfMonths}
                        onChange={(e) => updateTempFirm(idx, 'noOfMonths', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Completion & Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Completion / Due Date</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={tempArticleship.articleshipCompletionDateMonth}
                    onChange={(e) => setTempArticleship({ ...tempArticleship, articleshipCompletionDateMonth: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                  >
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    value={tempArticleship.articleshipCompletionDateYear}
                    onChange={(e) => setTempArticleship({ ...tempArticleship, articleshipCompletionDateYear: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                  >
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GMCS Completed?</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Yes', 'No'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTempArticleship({ ...tempArticleship, gmcsCompleted: opt })}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        tempArticleship.gmcsCompleted === opt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Industrial Trainee?</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Yes', 'No'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTempArticleship({ ...tempArticleship, industrialTrainee: opt })}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        tempArticleship.industrialTrainee === opt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Listed Company Work?</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Yes', 'No'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setTempArticleship({ ...tempArticleship, listedCompanyWork: opt })}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        tempArticleship.listedCompanyWork === opt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nature of Work */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900">
                Nature of Work <span className="text-[11px] font-normal text-slate-500">(You may select multiple)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                {NATURE_OF_WORK.map(work => {
                  const currentWorks = tempArticleship.natureOfWork ? tempArticleship.natureOfWork.split(',').map((w: string) => w.trim()).filter(Boolean) : [];
                  const isSel = currentWorks.includes(work);
                  return (
                    <button
                      key={work}
                      type="button"
                      onClick={() => toggleTempNatureOfWork(work)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {work}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditArticleshipModal(false)}
                className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveArticleshipModal}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
