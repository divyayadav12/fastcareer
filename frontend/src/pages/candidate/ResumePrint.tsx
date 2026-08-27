import React from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Printer, Download, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Button } from '../../components/Button';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export const ResumePrint = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const handlePrint = () => {
    window.print();
  };

  return (
    <CandidateLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-text mb-2">Resume Print (Site)</h1>
          <p className="text-gray-500">Auto-generated resume based on your profile details.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Download size={18} /> Save PDF
          </Button>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer size={18} /> Print Now
          </Button>
        </div>
      </div>

      {/* Resume Preview Box */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-10 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
        
        {/* Header */}
        <div className="border-b-2 border-primary pb-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
            {user?.firstName} {user?.lastName}
          </h1>
          <h2 className="text-xl text-primary font-medium mb-4">{user?.headline || 'CA Professional'}</h2>
          
          <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Mail size={16} className="text-gray-400" /> {user?.email}</div>
            {user?.phone && <div className="flex items-center gap-2"><Phone size={16} className="text-gray-400" /> +91 {user?.phone}</div>}
            {user?.personalDetails?.currentCity && <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {user?.personalDetails?.currentCity}, {user?.personalDetails?.currentState}</div>}
            {user?.linkedInUrl && <div className="flex items-center gap-2"><Globe size={16} className="text-gray-400" /> {user.linkedInUrl}</div>}
          </div>
        </div>

        {/* Professional Summary */}
        {(user?.summary || user?.caPortfolio?.natureOfWork) && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-3">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
              {user?.summary || user?.caPortfolio?.natureOfWork}
            </p>
          </div>
        )}

        {/* Experience */}
        {user?.experience && user.experience.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-3">Work Experience</h3>
            {user.experience.map((exp, idx) => (
              <div key={idx} className="mb-5">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900">{exp.title}</h4>
                  <span className="text-primary font-medium text-sm">{exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, {month: 'short', year: 'numeric'}) : ''} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, {month: 'short', year: 'numeric'}) : '')}</span>
                </div>
                <div className="text-gray-600 font-medium text-sm mb-2">{exp.company} | {exp.location}</div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Articleship Experience */}
        {user?.caPortfolio?.articleships && user.caPortfolio.articleships.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-3">Articleship Experience</h3>
            {user.caPortfolio.articleships.map((art, idx) => (
              <div key={idx} className="mb-5">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900">{art.firmName}</h4>
                  <span className="text-primary font-medium text-sm">{art.startDate ? new Date(art.startDate).toLocaleDateString(undefined, {month: 'short', year: 'numeric'}) : ''} - {art.endDate ? new Date(art.endDate).toLocaleDateString(undefined, {month: 'short', year: 'numeric'}) : ''}</span>
                </div>
                <div className="text-gray-600 font-medium text-sm mb-2">{art.city}, {art.firmType} Firm ({art.noOfPartners} Partners)</div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{art.workExperience}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education & Qualifications */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-3">Education & Qualifications</h3>
          
          {/* CA Details */}
          {user?.caPortfolio?.caFinal?.bothGroups1stAttempt && (
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h4 className="font-bold text-gray-900">CA Final</h4>
                 <div className="text-gray-600 font-medium text-sm">Both Groups - 1st Attempt {user.caPortfolio.caFinal.ranker === 'Yes' ? '(Ranker)' : ''}</div>
               </div>
               <span className="text-primary font-medium text-sm">{user.caPortfolio.caFinal.completionSessionMonth} {user.caPortfolio.caFinal.completionSessionYear}</span>
             </div>
          )}
          
          {!user?.caPortfolio?.caFinal?.bothGroups1stAttempt && user?.caPortfolio?.caFinal?.group1Attempts && (
            <div className="flex justify-between items-start mb-2">
               <div>
                 <h4 className="font-bold text-gray-900">CA Final Group 1</h4>
                 <div className="text-gray-600 font-medium text-sm">{user.caPortfolio.caFinal.group1Attempts} Attempt(s)</div>
               </div>
               <span className="text-primary font-medium text-sm">{user.caPortfolio.caFinal.group1Month} {user.caPortfolio.caFinal.group1Year}</span>
             </div>
          )}
          
          {!user?.caPortfolio?.caFinal?.bothGroups1stAttempt && user?.caPortfolio?.caFinal?.group2Attempts && (
            <div className="flex justify-between items-start mb-2">
               <div>
                 <h4 className="font-bold text-gray-900">CA Final Group 2</h4>
                 <div className="text-gray-600 font-medium text-sm">{user.caPortfolio.caFinal.group2Attempts} Attempt(s)</div>
               </div>
               <span className="text-primary font-medium text-sm">{user.caPortfolio.caFinal.group2Month} {user.caPortfolio.caFinal.group2Year}</span>
             </div>
          )}

          {/* CA Inter Details */}
          {user?.caPortfolio?.caInter?.bothGroups1stAttempt && (
             <div className="flex justify-between items-start mb-2 mt-4">
               <div>
                 <h4 className="font-bold text-gray-900">CA Inter</h4>
                 <div className="text-gray-600 font-medium text-sm">Both Groups - 1st Attempt {user.caPortfolio.caInter.ranker === 'Yes' ? '(Ranker)' : ''}</div>
               </div>
               <span className="text-primary font-medium text-sm">{user.caPortfolio.caInter.completionSessionMonth} {user.caPortfolio.caInter.completionSessionYear}</span>
             </div>
          )}

          {!user?.caPortfolio?.caInter?.bothGroups1stAttempt && user?.caPortfolio?.caInter?.group1Attempts && (
            <div className="flex justify-between items-start mb-2 mt-4">
               <div>
                 <h4 className="font-bold text-gray-900">CA Inter Group 1</h4>
                 <div className="text-gray-600 font-medium text-sm">{user.caPortfolio.caInter.group1Attempts} Attempt(s)</div>
               </div>
               <span className="text-primary font-medium text-sm">{user.caPortfolio.caInter.group1Month} {user.caPortfolio.caInter.group1Year}</span>
             </div>
          )}
          
          {!user?.caPortfolio?.caInter?.bothGroups1stAttempt && user?.caPortfolio?.caInter?.group2Attempts && (
            <div className="flex justify-between items-start mb-2">
               <div>
                 <h4 className="font-bold text-gray-900">CA Inter Group 2</h4>
                 <div className="text-gray-600 font-medium text-sm">{user.caPortfolio.caInter.group2Attempts} Attempt(s)</div>
               </div>
               <span className="text-primary font-medium text-sm">{user.caPortfolio.caInter.group2Month} {user.caPortfolio.caInter.group2Year}</span>
             </div>
          )}

          {/* Graduation */}
          {user?.qualifications?.graduation?.college && (
            <div className="flex justify-between items-start mb-2 mt-4">
              <div>
                <h4 className="font-bold text-gray-900">{'Graduation'}</h4>
                <div className="text-gray-600 font-medium text-sm">{user.qualifications.graduation.college}</div>
              </div>
              <span className="text-primary font-medium text-sm">{user.qualifications.graduation.yearOfCompletion}</span>
            </div>
          )}
          
          {/* Class 12 */}
          {user?.qualifications?.class12?.board && (
            <div className="flex justify-between items-start mb-2 mt-4">
              <div>
                <h4 className="font-bold text-gray-900">Class 12th</h4>
                <div className="text-gray-600 font-medium text-sm">{user.qualifications.class12.schoolName} ({user.qualifications.class12.board})</div>
              </div>
              <span className="text-primary font-medium text-sm">{user.qualifications.class12.yearOfCompletion} | {user.qualifications.class12.percentage}%</span>
            </div>
          )}
          
          {/* Class 10 */}
          {user?.qualifications?.class10?.board && (
            <div className="flex justify-between items-start mb-2 mt-4">
              <div>
                <h4 className="font-bold text-gray-900">Class 10th</h4>
                <div className="text-gray-600 font-medium text-sm">{user.qualifications.class10.schoolName} ({user.qualifications.class10.board})</div>
              </div>
              <span className="text-primary font-medium text-sm">{user.qualifications.class10.yearOfCompletion} | {user.qualifications.class10.percentage}%</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {(user?.skills && user.skills.length > 0) && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-3">Core Skills</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {user.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </CandidateLayout>
  );
};
