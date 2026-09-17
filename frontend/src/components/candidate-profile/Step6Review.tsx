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

      <Section title="CA Qualification" icon={FileText} step={2}>
        <DataItem label="Fresher CA" value={caPortfolio.isFresherCA ? 'Yes' : 'No'} />
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 mt-2">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="text-xs font-bold text-gray-500 mb-2">CA Inter</div>
            <div className="text-sm">Group I: {caPortfolio.caInter.group1Month} {caPortfolio.caInter.group1Year} ({caPortfolio.caInter.group1Attempts} attempt)</div>
            <div className="text-sm">Group II: {caPortfolio.caInter.group2Month} {caPortfolio.caInter.group2Year} ({caPortfolio.caInter.group2Attempts} attempt)</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="text-xs font-bold text-gray-500 mb-2">CA Final</div>
            <div className="text-sm">Group I: {caPortfolio.caFinal.group1Month} {caPortfolio.caFinal.group1Year} ({caPortfolio.caFinal.group1Attempts} attempt)</div>
            <div className="text-sm">Group II: {caPortfolio.caFinal.group2Month} {caPortfolio.caFinal.group2Year} ({caPortfolio.caFinal.group2Attempts} attempt)</div>
          </div>
        </div>
      </Section>

      <Section title="Articleship" icon={Building} step={3}>
        <DataItem label="Total Experience" value={`${caPortfolio.articleships.reduce((acc, curr) => acc + (parseInt(curr.noOfMonths) || 0), 0)} Months`} />
        <DataItem label="Completion Date" value={`${caPortfolio.articleshipCompletionDateMonth} ${caPortfolio.articleshipCompletionDateYear}`} />
        <div className="col-span-1 md:col-span-2">
          <DataItem label="Nature of Work" value={caPortfolio.natureOfWork} />
        </div>
      </Section>

      <Section title="Education" icon={GraduationCap} step={4}>
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
