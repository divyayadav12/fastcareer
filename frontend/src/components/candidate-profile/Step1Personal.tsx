import React, { useState } from 'react';
import { STATES, STATE_CITY_MAP } from '../../utils/constants';

export const Step1Personal = ({ personal, setPersonal, user, resumeUrl, handleFileUpload, uploading, viewCandidateResume, handleAutoFillFromResume, scanningResume }: any) => {
  const handleSameAsCurrent = (e: any) => {
    const isChecked = e.target.checked;
    setPersonal((prev: any) => {
      const newState = { ...prev, permanentAddressSameAsCurrent: isChecked };
      if (isChecked) {
        newState.permanentAddress = prev.currentAddress;
      }
      return newState;
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        <p className="text-gray-500 text-sm mt-1">Please provide your basic information and contact details.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Basic Information</h3>
        
        <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-blue-900">
              Resume Upload <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-semibold text-blue-700 bg-blue-100/90 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              ⚡ Auto-Fill Enabled
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading || scanningResume}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            <div className="flex flex-wrap items-center gap-2">
              {resumeUrl && (
                <>
                  <button
                    type="button"
                    onClick={() => viewCandidateResume()}
                    className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-full shadow-xs border border-blue-200 hover:bg-blue-50/50 transition-colors"
                  >
                    View Uploaded Resume
                  </button>
                  {handleAutoFillFromResume && (
                    <button
                      type="button"
                      onClick={() => handleAutoFillFromResume()}
                      disabled={scanningResume}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer px-3.5 py-1.5 rounded-full shadow-xs transition-all disabled:opacity-50"
                    >
                      {scanningResume ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Auto-Filling...</span>
                        </>
                      ) : (
                        <>
                          <span>⚡ Auto-Fill from Resume</span>
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <p className="text-xs text-blue-700/80 mt-2.5">
            💡 Uploading your resume automatically scans and fills your Personal Details, Education, Articleship & Experience across all steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
            <select value={personal.gender} onChange={(e) => setPersonal({...personal, gender: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status <span className="text-red-500">*</span></label>
            <select value={personal.maritalStatus} onChange={(e) => setPersonal({...personal, maritalStatus: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
              <option>Unmarried</option>
              <option>Married</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4">Address Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Address */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Current Address</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></label>
              <textarea value={personal.currentAddress} onChange={(e) => {
                setPersonal({...personal, currentAddress: e.target.value});
                if(personal.permanentAddressSameAsCurrent) setPersonal(p => ({...p, permanentAddress: e.target.value}));
              }} className="w-full px-4 py-2 border border-gray-200 rounded-xl h-24 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Enter your full current address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                <select value={personal.currentState} onChange={(e) => {
                  setPersonal({...personal, currentState: e.target.value, currentCity: ''});
                  
                }} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20">
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                <select value={personal.currentCity} onChange={(e) => {
                  setPersonal({...personal, currentCity: e.target.value});
                  
                }} disabled={!personal.currentState} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50">
                  <option value="">Select City</option>
                  {(STATE_CITY_MAP[personal.currentState] || []).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Permanent Address */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Permanent Address</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={personal.permanentAddressSameAsCurrent} onChange={handleSameAsCurrent} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <span className="text-sm text-gray-600 font-medium">Same as Current</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></label>
              <textarea value={personal.permanentAddress} onChange={(e) => setPersonal({...personal, permanentAddress: e.target.value})} disabled={personal.permanentAddressSameAsCurrent} className="w-full px-4 py-2 border border-gray-200 rounded-xl h-24 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none disabled:bg-gray-50 disabled:text-gray-500" placeholder="Enter your full permanent address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                <select value={personal.permanentState} onChange={(e) => setPersonal({...personal, permanentState: e.target.value, permanentCity: ''})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-500">
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                <select value={personal.permanentCity} onChange={(e) => setPersonal({...personal, permanentCity: e.target.value})} disabled={!personal.permanentState} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-500">
                  <option value="">Select City</option>
                  {(STATE_CITY_MAP[personal.permanentState] || []).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
