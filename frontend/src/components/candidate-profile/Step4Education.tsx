import React from 'react';
import { COLLEGES, YEARS, BOARDS } from '../../utils/constants';

export const Step4Education = ({ qualifications, setQualifications }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Graduation & Education</h2>
        <p className="text-gray-500 text-sm mt-1">Provide details of your academic qualifications.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Graduation & Other Qualification</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Whether Completed</label>
            <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
              <button type="button" onClick={() => setQualifications({...qualifications, graduation: {...qualifications.graduation, completed: 'Yes'}})} className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-all ${qualifications.graduation.completed === 'Yes' ? 'bg-white shadow-sm text-primary border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}>Yes</button>
              <button type="button" onClick={() => setQualifications({...qualifications, graduation: {...qualifications.graduation, completed: 'No/Pursuing'}})} className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-all ${qualifications.graduation.completed === 'No/Pursuing' ? 'bg-white shadow-sm text-primary border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}>No / Pursuing</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
              <button type="button" onClick={() => setQualifications({...qualifications, graduation: {...qualifications.graduation, type: 'REGULAR'}})} className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-all ${qualifications.graduation.type === 'REGULAR' ? 'bg-white shadow-sm text-primary border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}>Regular</button>
              <button type="button" onClick={() => setQualifications({...qualifications, graduation: {...qualifications.graduation, type: 'CORRESPONDENCE'}})} className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-all ${qualifications.graduation.type === 'CORRESPONDENCE' ? 'bg-white shadow-sm text-primary border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}>Correspondence</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
            <input type="text" list="collegesList" value={qualifications.graduation.college} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, college: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Enter or select college" />
            <datalist id="collegesList">
              {COLLEGES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          {qualifications.graduation.completed === 'Yes' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year of Completion</label>
                <select value={qualifications.graduation.yearOfCompletion} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, yearOfCompletion: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                  <option value="">Select Year</option>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">% (Avg of 3 years)</label>
                <input type="text" value={qualifications.graduation.percentage} onChange={(e) => setQualifications({...qualifications, graduation: {...qualifications.graduation, percentage: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" placeholder="e.g. 75.5" />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-5">Class XII</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Percentage (%)</label>
              <input type="text" value={qualifications.class12.percentage} onChange={(e) => setQualifications({...qualifications, class12: {...qualifications.class12, percentage: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" placeholder="e.g. 85" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year</label>
                <select value={qualifications.class12.year} onChange={(e) => setQualifications({...qualifications, class12: {...qualifications.class12, year: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
                <input type="text" list="boardsList" value={qualifications.class12.board} onChange={(e) => setQualifications({...qualifications, class12: {...qualifications.class12, board: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Select Board" />
                <datalist id="boardsList">
                  {BOARDS.map(b => <option key={b} value={b} />)}
                </datalist>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-5">Class X</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Percentage (%)</label>
              <input type="text" value={qualifications.class10.percentage} onChange={(e) => setQualifications({...qualifications, class10: {...qualifications.class10, percentage: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" placeholder="e.g. 90" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year</label>
                <select value={qualifications.class10.year} onChange={(e) => setQualifications({...qualifications, class10: {...qualifications.class10, year: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
                <input type="text" list="boardsList" value={qualifications.class10.board} onChange={(e) => setQualifications({...qualifications, class10: {...qualifications.class10, board: e.target.value}})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Select Board" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
