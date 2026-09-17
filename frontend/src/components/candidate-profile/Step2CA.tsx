import React from 'react';
import { ATTEMPTS, CA_EXAM_MONTHS, YEARS } from '../../utils/constants';

export const Step2CA = ({ caPortfolio, setCaPortfolio }) => {

  const handleGroupLogic = (exam, field, value) => {
    let newData = { ...caPortfolio[exam], [field]: value };
    
    // Auto selection logic for both groups 1st attempt
    if (field === 'bothGroups1stAttempt' && value === true) {
      newData.group1Attempts = '1';
      newData.group2Attempts = '1';
      if (newData.group1Month) newData.group2Month = newData.group1Month;
      if (newData.group1Year) newData.group2Year = newData.group1Year;
      if (newData.group1Month) newData.completionSessionMonth = newData.group1Month;
      if (newData.group1Year) newData.completionSessionYear = newData.group1Year;
    }
    
    // If Both Groups is checked and we change G1 date, auto update G2 and Completion Date
    if (newData.bothGroups1stAttempt) {
      if (field === 'group1Month') {
        newData.group2Month = value;
        newData.completionSessionMonth = value;
      }
      if (field === 'group1Year') {
        newData.group2Year = value;
        newData.completionSessionYear = value;
      }
    }

    setCaPortfolio({ ...caPortfolio, [exam]: newData });
  };

  const renderExamCard = (examKey, title) => {
    const data = caPortfolio[examKey];
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-5 gap-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <label className="flex items-center gap-2 cursor-pointer bg-blue-50/50 px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors">
            <input 
              type="checkbox" 
              checked={data.bothGroups1stAttempt} 
              onChange={(e) => handleGroupLogic(examKey, 'bothGroups1stAttempt', e.target.checked)} 
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
            />
            <span className="text-sm text-blue-900 font-medium">Both Groups - 1st Attempt</span>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Group 1 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Group I</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Attempts</label>
                <select disabled={data.bothGroups1stAttempt} value={data.group1Attempts} onChange={(e) => handleGroupLogic(examKey, 'group1Attempts', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-400">
                  {ATTEMPTS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Month</label>
                <select value={data.group1Month} onChange={(e) => handleGroupLogic(examKey, 'group1Month', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20">
                  <option value="">Month</option>
                  {CA_EXAM_MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Year</label>
                <select value={data.group1Year} onChange={(e) => handleGroupLogic(examKey, 'group1Year', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20">
                  <option value="">Year</option>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Group 2 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Group II</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Attempts</label>
                <select disabled={data.bothGroups1stAttempt} value={data.group2Attempts} onChange={(e) => handleGroupLogic(examKey, 'group2Attempts', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-400">
                  {ATTEMPTS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Month</label>
                <select disabled={data.bothGroups1stAttempt} value={data.group2Month} onChange={(e) => handleGroupLogic(examKey, 'group2Month', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-400">
                  <option value="">Month</option>
                  {CA_EXAM_MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Year</label>
                <select disabled={data.bothGroups1stAttempt} value={data.group2Year} onChange={(e) => handleGroupLogic(examKey, 'group2Year', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-400">
                  <option value="">Year</option>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ranker</label>
            <select value={data.ranker} onChange={(e) => handleGroupLogic(examKey, 'ranker', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20">
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Completion Session</label>
            <div className="grid grid-cols-2 gap-3">
              <select disabled={data.bothGroups1stAttempt} value={data.completionSessionMonth} onChange={(e) => handleGroupLogic(examKey, 'completionSessionMonth', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-400">
                <option value="">Month</option>
                {CA_EXAM_MONTHS.map(m => <option key={m}>{m}</option>)}
              </select>
              <select disabled={data.bothGroups1stAttempt} value={data.completionSessionYear} onChange={(e) => handleGroupLogic(examKey, 'completionSessionYear', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-400">
                <option value="">Year</option>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CA Qualification</h2>
          <p className="text-gray-500 text-sm mt-1">Please provide details about your CA examinations.</p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:border-primary/50 transition-colors">
          <input 
            type="checkbox" 
            checked={caPortfolio.isFresherCA} 
            onChange={(e) => setCaPortfolio({...caPortfolio, isFresherCA: e.target.checked})} 
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
          />
          <span className="text-sm text-gray-700 font-bold">Tick if Fresher CA</span>
        </label>
      </div>

      {renderExamCard('caInter', 'CA Inter (IPCC)')}
      {renderExamCard('caFinal', 'CA Final')}
    </div>
  );
};
