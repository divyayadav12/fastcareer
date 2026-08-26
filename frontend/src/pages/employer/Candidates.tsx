import React, { useState, useEffect } from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { Search, Filter, MapPin, GraduationCap, Download, DownloadCloud, FileSpreadsheet, CheckSquare, Square } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getResumeUrl } from '../../utils/urlHelper';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  resumeUrl?: string;
  personalDetails?: {
    currentCity?: string;
    currentState?: string;
  };
  qualifications?: {
    graduation?: {
      courseName?: string;
      collegeName?: string;
      yearOfCompletion?: string;
    };
  };
}

export const EmployerCandidates = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/candidates`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setCandidates(res.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) {
      fetchCandidates();
    }
  }, [user]);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCandidates.length && filteredCandidates.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCandidates.map(c => c._id)));
    }
  };

  const filteredCandidates = candidates.filter(c => {
    const term = searchTerm.toLowerCase();
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const city = c.personalDetails?.currentCity?.toLowerCase() || '';
    const course = c.qualifications?.graduation?.courseName?.toLowerCase() || '';
    return fullName.includes(term) || city.includes(term) || course.includes(term);
  });

  const exportToCSV = () => {
    if (filteredCandidates.length === 0) return;
    setIsExporting(true);
    
    // Create CSV Header
    const headers = ['First Name', 'Last Name', 'Email', 'City', 'State', 'Graduation', 'Resume Link'];
    
    // Create rows
    const rows = filteredCandidates.map(c => {
      const city = c.personalDetails?.currentCity || 'N/A';
      const state = c.personalDetails?.currentState || 'N/A';
      const grad = c.qualifications?.graduation?.courseName || 'N/A';
      const resume = c.resumeUrl ? getResumeUrl(c.resumeUrl) : 'No Resume';
      
      return [c.firstName, c.lastName, c.email, city, state, grad, resume]
        .map(field => `"${String(field).replace(/"/g, '""')}"`) // Escape quotes
        .join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
    
    setIsExporting(false);
  };

  const downloadSelectedAsZip = async () => {
    if (selectedIds.size === 0) {
      alert('Please select at least one candidate to download.');
      return;
    }
    
    setIsZipping(true);
    const zip = new JSZip();
    const folder = zip.folder("candidates_resumes");
    
    const selectedCandidates = candidates.filter(c => selectedIds.has(c._id) && c.resumeUrl);
    
    if (selectedCandidates.length === 0) {
      alert('None of the selected candidates have resumes.');
      setIsZipping(false);
      return;
    }

    try {
      // Fetch all PDFs in parallel
      const fetchPromises = selectedCandidates.map(async (candidate) => {
        const url = getResumeUrl(candidate.resumeUrl!);
        try {
          // Note: Browser CORS must allow this fetch, or Cloudinary must have CORS enabled.
          const response = await fetch(url);
          if (!response.ok) throw new Error('Network error');
          const blob = await response.blob();
          
          // Generate file name e.g., Divya_Yadav_Resume.pdf
          const fileName = `${candidate.firstName}_${candidate.lastName}_Resume.pdf`.replace(/\s+/g, '_');
          folder?.file(fileName, blob);
        } catch (err) {
          console.error(`Failed to fetch resume for ${candidate.firstName}`, err);
          // Fallback: put a text file explaining it failed
          folder?.file(`${candidate.firstName}_${candidate.lastName}_error.txt`, `Failed to download PDF from: ${url}`);
        }
      });

      await Promise.all(fetchPromises);
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `FastCareer_Resumes_${new Date().toISOString().split('T')[0]}.zip`);
      
    } catch (error) {
      console.error('Error creating ZIP:', error);
      alert('An error occurred while creating the ZIP file.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <EmployerLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text mb-2">Search Candidates</h1>
          <p className="text-gray-500">Find the perfect match for your open positions</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            disabled={isExporting || candidates.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet size={18} /> {isExporting ? 'Exporting...' : 'Export to Excel'}
          </button>
          
          <button 
            onClick={downloadSelectedAsZip}
            disabled={isZipping || selectedIds.size === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <DownloadCloud size={18} /> {isZipping ? 'Zipping...' : `Download ZIP (${selectedIds.size})`}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
          <Filter size={18} /> Filters
        </button>
      </div>

      {!loading && filteredCandidates.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <button onClick={toggleSelectAll} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
            {selectedIds.size === filteredCandidates.length ? <CheckSquare size={20} className="text-primary"/> : <Square size={20} />}
            Select All
          </button>
          <span className="text-gray-400 text-sm">({selectedIds.size} selected)</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500">Loading candidates...</p>
        ) : filteredCandidates.length === 0 ? (
          <p className="text-gray-500">No candidates match your search.</p>
        ) : (
          filteredCandidates.map(candidate => {
            const isSelected = selectedIds.has(candidate._id);
            return (
              <div 
                key={candidate._id} 
                className={`bg-white border-2 rounded-2xl p-6 shadow-sm transition-all cursor-pointer ${isSelected ? 'border-primary bg-blue-50/30' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'}`}
                onClick={() => toggleSelection(candidate._id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg uppercase">
                      {candidate.firstName[0]}{candidate.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-text">{candidate.firstName} {candidate.lastName}</h3>
                      <p className="text-sm text-gray-500">{candidate.email}</p>
                    </div>
                  </div>
                  <div onClick={e => e.stopPropagation()}>
                    {isSelected ? <CheckSquare size={24} className="text-primary"/> : <Square size={24} className="text-gray-300"/>}
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-1.5 text-gray-600 mb-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-sm">
                        {candidate.personalDetails?.currentCity ? `${candidate.personalDetails.currentCity}, ${candidate.personalDetails.currentState}` : 'Location not provided'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 text-gray-600 mb-4">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap size={16} className="text-gray-400" />
                        <span className="text-sm">
                          {candidate.qualifications?.graduation?.collegeName 
                            ? `${candidate.qualifications.graduation.courseName || 'Graduation'} - ${candidate.qualifications.graduation.yearOfCompletion}` 
                            : 'Education not provided'}
                        </span>
                      </div>
                    </div>
                  </div>

                <div onClick={e => e.stopPropagation()}>
                  {candidate.resumeUrl ? (
                    <a 
                      href={getResumeUrl(candidate.resumeUrl)} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                    >
                      <Download size={16} /> View Resume
                    </a>
                  ) : (
                    <button disabled className="w-full py-2 bg-gray-50 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                      No Resume
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </EmployerLayout>
  );
};
