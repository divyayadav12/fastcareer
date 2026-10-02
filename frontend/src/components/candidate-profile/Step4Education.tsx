import React from 'react';
import { COLLEGES, YEARS, BOARDS } from '../../utils/constants';
import toast from 'react-hot-toast';

export const Step4Education = ({ qualifications, setQualifications }: any) => {
  const class10YearNum = parseInt(qualifications.class10?.year || '0', 10);
  const class12YearNum = parseInt(qualifications.class12?.year || '0', 10);

  // Filter 12th Class passing years (must be >= 10th passing year)
  const validClass12Years = YEARS.filter(y => !class10YearNum || parseInt(y, 10) >= class10YearNum);

  // Filter Graduation completion years (must be >= 12th passing year or 10th passing year)
  const minGradYear = class12YearNum || class10YearNum || 0;
  const validGradYears = YEARS.filter(y => !minGradYear || parseInt(y, 10) >= minGradYear);

  const handleClass10YearChange = (new10Year: string) => {
    const new10Num = parseInt(new10Year, 10);
    let updated12Year = qualifications.class12?.year;
    let updatedGradYear = qualifications.graduation?.yearOfCompletion;

    if (new10Num && updated12Year && parseInt(updated12Year, 10) < new10Num) {
      updated12Year = String(new10Num + 2);
      toast.error(`Class 12th Passing Year cannot be earlier than Class 10th Year (${new10Year}). Auto-updated to ${updated12Year}.`);
    }

    const minGrad = parseInt(updated12Year || new10Year || '0', 10);
    if (minGrad && updatedGradYear && parseInt(updatedGradYear, 10) < minGrad) {
      updatedGradYear = String(minGrad + 3);
      toast.error(`Graduation Year cannot be earlier than High School Year. Auto-updated to ${updatedGradYear}.`);
    }

    setQualifications({
      ...qualifications,
      class10: { ...qualifications.class10, year: new10Year },
      class12: { ...qualifications.class12, year: updated12Year },
      graduation: { ...qualifications.graduation, yearOfCompletion: updatedGradYear }
    });
  };

  const handleClass12YearChange = (new12Year: string) => {
    const new12Num = parseInt(new12Year, 10);
    if (class10YearNum && new12Num && new12Num < class10YearNum) {
      toast.error(`Class 12th Passing Year (${new12Year}) cannot be earlier than Class 10th Year (${qualifications.class10.year}).`);
      return;
    }

    let updatedGradYear = qualifications.graduation?.yearOfCompletion;
    if (new12Num && updatedGradYear && parseInt(updatedGradYear, 10) < new12Num) {
      updatedGradYear = String(new12Num + 3);
      toast.error(`Graduation Year cannot be earlier than Class 12th Year (${new12Year}). Auto-updated to ${updatedGradYear}.`);
    }

    setQualifications({
      ...qualifications,
      class12: { ...qualifications.class12, year: new12Year },
      graduation: { ...qualifications.graduation, yearOfCompletion: updatedGradYear }
    });
  };

  const handleGraduationYearChange = (newGradYear: string) => {
    const newGradNum = parseInt(newGradYear, 10);
    const minYear = class12YearNum || class10YearNum || 0;

    if (minYear && newGradNum && newGradNum < minYear) {
      toast.error(`Graduation Year (${newGradYear}) cannot be earlier than Class 12th/10th Passing Year (${minYear}).`);
      return;
    }

    setQualifications({
      ...qualifications,
      graduation: { ...qualifications.graduation, yearOfCompletion: newGradYear }
    });
  };

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
                <select value={qualifications.graduation.yearOfCompletion} onChange={(e) => handleGraduationYearChange(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                  <option value="">Select Year</option>
                  {validGradYears.map(y => <option key={y}>{y}</option>)}
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
                <select value={qualifications.class12.year} onChange={(e) => handleClass12YearChange(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                  <option value="">Select Year</option>
                  {validClass12Years.map(y => <option key={y}>{y}</option>)}
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
                <select value={qualifications.class10.year} onChange={(e) => handleClass10YearChange(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm">
                  <option value="">Select Year</option>
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
