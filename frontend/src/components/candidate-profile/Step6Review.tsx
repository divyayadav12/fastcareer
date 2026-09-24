import React from 'react';
import { User, FileText, Briefcase, GraduationCap, Building } from 'lucide-react';

export const Step6Review = ({ personal, caPortfolio, qualifications, experienceInfo, setStep, user }) => {
  const Section = ({ title, icon: Icon, step, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
      <button onClick={() => setStep(step)} className="absolute top-6 right-6 text-sm font-medium text-primary hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
        Edit
      </button>
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
        <div className="p-2 bg-blue-50 text-primary rounded-lg">
          <Icon size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {children}
      </div>
    </div>
  );

  const DataItem = ({ label, value }) => (
    <div>
      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || '-'}</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Profile</h2>
        <p className="text-gray-500 text-sm mt-1">Please verify your information before submitting. Click "Edit" on any section to make changes.</p>
      </div>

      <Section title="Personal Details" icon={User} step={1}>
        <DataItem label="Name" value={`${user?.firstName || ''} ${user?.lastName || ''}`} />
        <DataItem label="Email" value={user?.email} />
        <DataItem label="Phone" value={personal.phone} />
        <DataItem label="Gender & Marital Status" value={`${personal.gender}, ${personal.maritalStatus}`} />
        <DataItem label="Date of Birth" value={personal.dateOfBirth} />
        <DataItem label="Current Location" value={`${personal.currentCity}, ${personal.currentState}`} />
      </Section>

      <Section title="CA Qualification (From Registration)" icon={FileText} step={1}>
        <DataItem label="Fresher CA" value={caPortfolio.isFresherCA ? 'Yes (Fresher)' : 'No (Experienced)'} />
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
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

      <Section title="Articleship" icon={Building} step={2}>
        <DataItem label="Total Experience" value={`${caPortfolio.articleships.reduce((acc, curr) => acc + (parseInt(curr.noOfMonths) || 0), 0)} Months`} />
        <DataItem label="Completion Date" value={`${caPortfolio.articleshipCompletionDateMonth} ${caPortfolio.articleshipCompletionDateYear}`} />
        <div className="col-span-1 md:col-span-2">
          <DataItem label="Nature of Work" value={caPortfolio.natureOfWork} />
        </div>
      </Section>

      <Section title="Education" icon={GraduationCap} step={3}>
        <DataItem label="Graduation" value={`${qualifications.graduation.type} - ${qualifications.graduation.college} (${qualifications.graduation.percentage}%)`} />
        <DataItem label="Class XII" value={`${qualifications.class12.percentage}% (${qualifications.class12.year})`} />
      </Section>

      <Section title="Experience" icon={Briefcase} step={4}>
        <DataItem label="Experienced Candidate" value={experienceInfo.isExperienced ? 'Yes' : 'No'} />
        {experienceInfo.isExperienced && (
          <>
            <DataItem label="Current Company" value={experienceInfo.currentCompanyName} />
            <DataItem label="Designation" value={experienceInfo.currentDesignation} />
            <DataItem label="Current CTC" value={experienceInfo.currentCTC} />
          </>
        )}
      </Section>
    </div>
  );
};
