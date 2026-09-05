import toast from 'react-hot-toast';
import React, { useState, useEffect, useRef } from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { Search, Filter, MapPin, GraduationCap, Download, DownloadCloud, FileSpreadsheet, CheckSquare, Square, UploadCloud, X, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getResumeUrl } from '../../utils/urlHelper';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { STATES, STATE_CITY_MAP, ALL_CITIES } from '../../utils/constants';

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  headline?: string;
  skills?: string[];
  experience?: number;
  resumeUrl?: string;
  hasResume?: boolean;
  personalDetails?: {
    currentCity?: string;
    currentState?: string;
    gender?: string;
    maritalStatus?: string;
  };
  qualifications?: {
    graduation?: {
      completed?: string;
      type?: string;
      courseName?: string;
      collegeName?: string;
      yearOfCompletion?: string;
    };
  };
  caPortfolio?: {
    isFresherCA?: boolean;
    caInter?: {
      bothGroups1stAttempt?: boolean;
      group1Attempts?: string;
      group2Attempts?: string;
      ranker?: string;
    };
    caFinal?: {
      bothGroups1stAttempt?: boolean;
      group1Attempts?: string;
      group2Attempts?: string;
      ranker?: string;
    };
    articleships?: Array<{ firmType?: string }>;
    big4Articleship?: string;
    gmcsCompleted?: string;
    industrialTrainee?: string;
    listedCompanyWork?: string;
  };
}

export const EmployerCandidates = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Excel Matching States
  const [isExcelMode, setIsExcelMode] = useState(false);
  const [excelFileName, setExcelFileName] = useState('');
  const [matchedCandidates, setMatchedCandidates] = useState<Candidate[]>([]);
  const [excelStats, setExcelStats] = useState<{
    totalEmails: number;
    matchedCandidates: number;
    resumesAvailable: number;
    resumesUnavailable: number;
    notFound: number;
  } | null>(null);
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [zipStep, setZipStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCity, setFilterCity] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterMaritalStatus, setFilterMaritalStatus] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterFresherCA, setFilterFresherCA] = useState('');
  const [filterInter1stAttempt, setFilterInter1stAttempt] = useState('');
  const [filterInterGroup1Attempts, setFilterInterGroup1Attempts] = useState('');
  const [filterInterGroup2Attempts, setFilterInterGroup2Attempts] = useState('');
  const [filterInterRanker, setFilterInterRanker] = useState('');
  const [filterFinal1stAttempt, setFilterFinal1stAttempt] = useState('');
  const [filterFinalGroup1Attempts, setFilterFinalGroup1Attempts] = useState('');
  const [filterFinalGroup2Attempts, setFilterFinalGroup2Attempts] = useState('');
  const [filterFinalRanker, setFilterFinalRanker] = useState('');
  const [filterBig4, setFilterBig4] = useState('');
  const [filterFirmType, setFilterFirmType] = useState('');
  const [filterGmcs, setFilterGmcs] = useState('');
  const [filterIndustrialTrainee, setFilterIndustrialTrainee] = useState('');
  const [filterListedCompany, setFilterListedCompany] = useState('');
  const [filterGradCompleted, setFilterGradCompleted] = useState('');
  const [filterGradType, setFilterGradType] = useState('');
  
  // New Filters
  const [filterFinalPassMonth, setFilterFinalPassMonth] = useState('');
  const [filterFinalPassYear, setFilterFinalPassYear] = useState('');
  const [filterResumeFromDate, setFilterResumeFromDate] = useState('');
  const [filterResumeToDate, setFilterResumeToDate] = useState('');
  
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

  const candidateHasResume = (c: Candidate): boolean => {
    if (c.hasResume !== undefined) return c.hasResume;
    return !!(c.resumeUrl && c.resumeUrl.trim().length > 0);
  };

  const toggleSelection = (candidate: Candidate) => {
    if (!candidateHasResume(candidate)) {
      toast.error('Resume not available for this candidate.');
      return;
    }
    const newSelected = new Set(selectedIds);
    if (newSelected.has(candidate._id)) {
      newSelected.delete(candidate._id);
    } else {
      newSelected.add(candidate._id);
    }
    setSelectedIds(newSelected);
  };

  // Base list depending on whether Excel filter is active
  const baseCandidates = isExcelMode ? matchedCandidates : candidates;

  const filteredCandidates = baseCandidates.filter(c => {
    const term = searchTerm.toLowerCase();
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const city = c.personalDetails?.currentCity?.toLowerCase() || '';
    const course = c.qualifications?.graduation?.courseName?.toLowerCase() || '';
    
    const matchesSearch = fullName.includes(term) || city.includes(term) || course.includes(term) || c.email.toLowerCase().includes(term);
    const matchesCity = filterCity ? city.includes(filterCity.toLowerCase()) : true;
    const matchesState = filterState ? c.personalDetails?.currentState === filterState : true;
    const matchesCourse = filterCourse ? course.includes(filterCourse.toLowerCase()) : true;
    const matchesGender = filterGender ? c.personalDetails?.gender === filterGender : true;
    const matchesMaritalStatus = filterMaritalStatus ? c.personalDetails?.maritalStatus === filterMaritalStatus : true;
    
    const isFresher = c.caPortfolio?.isFresherCA ? 'Yes' : 'No';
    const matchesFresher = filterFresherCA ? isFresher === filterFresherCA : true;
    
    const inter1st = c.caPortfolio?.caInter?.bothGroups1stAttempt ? 'Yes' : 'No';
    const matchesInter1st = filterInter1stAttempt ? inter1st === filterInter1stAttempt : true;
    const matchesInterG1 = filterInterGroup1Attempts ? c.caPortfolio?.caInter?.group1Attempts === filterInterGroup1Attempts : true;
    const matchesInterG2 = filterInterGroup2Attempts ? c.caPortfolio?.caInter?.group2Attempts === filterInterGroup2Attempts : true;
    const matchesInterRanker = filterInterRanker ? c.caPortfolio?.caInter?.ranker === filterInterRanker : true;

    const final1st = c.caPortfolio?.caFinal?.bothGroups1stAttempt ? 'Yes' : 'No';
    const matchesFinal1st = filterFinal1stAttempt ? final1st === filterFinal1stAttempt : true;
    
    const matchesFinalMonth = filterFinalPassMonth ? c.caPortfolio?.caFinal?.completionSessionMonth === filterFinalPassMonth : true;
    const matchesFinalYear = filterFinalPassYear ? c.caPortfolio?.caFinal?.completionSessionYear === filterFinalPassYear : true;
    
    // Date filter (assuming updatedAt is when resume was uploaded/profile modified)
    let matchesDate = true;
    if (filterResumeFromDate || filterResumeToDate) {
      const uploadDate = new Date(c.updatedAt || c.createdAt);
      if (filterResumeFromDate) {
        matchesDate = matchesDate && uploadDate >= new Date(filterResumeFromDate);
      }
      if (filterResumeToDate) {
        // Set to end of the day for accurate inclusive filtering
        const toDate = new Date(filterResumeToDate);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && uploadDate <= toDate;
      }
    }
    const matchesFinalG1 = filterFinalGroup1Attempts ? c.caPortfolio?.caFinal?.group1Attempts === filterFinalGroup1Attempts : true;
    const matchesFinalG2 = filterFinalGroup2Attempts ? c.caPortfolio?.caFinal?.group2Attempts === filterFinalGroup2Attempts : true;
    const matchesFinalRanker = filterFinalRanker ? c.caPortfolio?.caFinal?.ranker === filterFinalRanker : true;

    const big4 = (c.caPortfolio?.big4Articleship && c.caPortfolio.big4Articleship !== 'No' && c.caPortfolio.big4Articleship !== 'none' && c.caPortfolio.big4Articleship !== '') ? 'Yes' : 'No';
    const matchesBig4 = filterBig4 ? big4 === filterBig4 : true;
    
    const hasFirmType = c.caPortfolio?.articleships?.some(a => a.firmType === filterFirmType);
    const matchesFirmType = filterFirmType ? hasFirmType : true;
    
    const matchesGmcs = filterGmcs ? c.caPortfolio?.gmcsCompleted === filterGmcs : true;
    const matchesInd = filterIndustrialTrainee ? c.caPortfolio?.industrialTrainee === filterIndustrialTrainee : true;
    const matchesListed = filterListedCompany ? c.caPortfolio?.listedCompanyWork === filterListedCompany : true;
    
    const matchesGradComp = filterGradCompleted ? c.qualifications?.graduation?.completed === filterGradCompleted : true;
    const matchesGradType = filterGradType ? c.qualifications?.graduation?.type === filterGradType : true;

    return matchesSearch && matchesCity && matchesState && matchesCourse && matchesGender && matchesMaritalStatus && matchesFresher && matchesInter1st && matchesInterG1 && matchesInterG2 && matchesInterRanker && matchesFinal1st && matchesFinalG1 && matchesFinalG2 && matchesFinalRanker && matchesBig4 && matchesFirmType && matchesGmcs && matchesInd && matchesListed && matchesGradComp && matchesGradType;
  });

  const exportToCSV = () => {
    if (filteredCandidates.length === 0) return;
    setIsExporting(true);
    
    // Create CSV Header
    const headers = ['First Name', 'Last Name', 'Email', 'Gender', 'Marital Status', 'State', 'City', 'Graduation Completed', 'Graduation Type', 'Graduation Course', 'Fresher CA', 'CA Inter 1st Att. Both', 'CA Inter Grp1', 'CA Inter Grp2', 'CA Inter Ranker', 'CA Final 1st Att. Both', 'CA Final Grp1', 'CA Final Grp2', 'CA Final Ranker', 'Articleship Firm', 'Big4 Articleship', 'GMCS', 'Industrial Trainee', 'Listed Company', 'Resume Link'];
    
    // Create rows
    const rows = filteredCandidates.map(c => {
      const gender = c.personalDetails?.gender || 'N/A';
      const maritalStatus = c.personalDetails?.maritalStatus || 'N/A';
      const city = c.personalDetails?.currentCity || 'N/A';
      const state = c.personalDetails?.currentState || 'N/A';
      
      const gradComp = c.qualifications?.graduation?.completed || 'N/A';
      const gradType = c.qualifications?.graduation?.type || 'N/A';
      const grad = c.qualifications?.graduation?.courseName || 'N/A';
      
      const isFresher = c.caPortfolio?.isFresherCA ? 'Yes' : 'No';
      const inter1st = c.caPortfolio?.caInter?.bothGroups1stAttempt ? 'Yes' : 'No';
      const interG1 = c.caPortfolio?.caInter?.group1Attempts || 'N/A';
      const interG2 = c.caPortfolio?.caInter?.group2Attempts || 'N/A';
      const interRanker = c.caPortfolio?.caInter?.ranker || 'N/A';
      
      const final1st = c.caPortfolio?.caFinal?.bothGroups1stAttempt ? 'Yes' : 'No';
      const finalG1 = c.caPortfolio?.caFinal?.group1Attempts || 'N/A';
      const finalG2 = c.caPortfolio?.caFinal?.group2Attempts || 'N/A';
      const finalRanker = c.caPortfolio?.caFinal?.ranker || 'N/A';
      
      const firm = c.caPortfolio?.articleships?.[0]?.firmType || 'N/A';
      const big4 = (c.caPortfolio?.big4Articleship && c.caPortfolio.big4Articleship !== 'No' && c.caPortfolio.big4Articleship !== 'none' && c.caPortfolio.big4Articleship !== '') ? 'Yes' : 'No';
      const gmcs = c.caPortfolio?.gmcsCompleted || 'N/A';
      const indTrainee = c.caPortfolio?.industrialTrainee || 'N/A';
      const listed = c.caPortfolio?.listedCompanyWork || 'N/A';

      const resume = c.resumeUrl ? getResumeUrl(c.resumeUrl) : 'No Resume';
      
      return [c.firstName, c.lastName, c.email, gender, maritalStatus, state, city, gradComp, gradType, grad, isFresher, inter1st, interG1, interG2, interRanker, final1st, finalG1, finalG2, finalRanker, firm, big4, gmcs, indTrainee, listed, resume]
        .map(field => `"${String(field).replace(/"/g, '""')}"`) // Escape quotes
        .join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
    
    setIsExporting(false);
  };

  const candidatesWithResumes = filteredCandidates.filter(candidateHasResume);

  const toggleSelectAll = () => {
    if (selectedIds.size === candidatesWithResumes.length && candidatesWithResumes.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(candidatesWithResumes.map(c => c._id)));
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      toast.error('Please upload a valid Excel file (.xlsx or .xls).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsProcessingExcel(true);
    setProcessingStep('Uploading Excel...');

    try {
      const stepTimer1 = setTimeout(() => setProcessingStep('Reading emails...'), 500);
      const stepTimer2 = setTimeout(() => setProcessingStep('Matching candidates...'), 1000);
      const stepTimer3 = setTimeout(() => setProcessingStep('Preparing resumes...'), 1500);

      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/candidates/match-excel`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = res.data;
      setIsExcelMode(true);
      setExcelFileName(file.name);
      setExcelStats({
        totalEmails: data.totalEmails,
        matchedCandidates: data.matchedCandidates,
        resumesAvailable: data.resumesAvailable,
        resumesUnavailable: data.resumesUnavailable,
        notFound: data.notFound,
      });
      setMatchedCandidates(data.candidates || []);

      // Auto-select all matched candidates that have a resume
      const availableIds = new Set<string>(
        (data.candidates || [])
          .filter((c: Candidate) => candidateHasResume(c))
          .map((c: Candidate) => c._id)
      );
      setSelectedIds(availableIds);

      toast.success(
        `${data.matchedCandidates} candidates matched from Excel (${data.resumesAvailable} resumes ready to download).`
      );
    } catch (err: any) {
      console.error('Error matching Excel file:', err);
      const msg = err.response?.data?.message || 'Failed to match candidates from Excel file.';
      toast.error(msg);
    } finally {
      setIsProcessingExcel(false);
      setProcessingStep('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearExcelMode = () => {
    setIsExcelMode(false);
    setExcelFileName('');
    setExcelStats(null);
    setMatchedCandidates([]);
    setSelectedIds(new Set());
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Returned to full candidates list.');
  };

  const downloadSelectedAsZip = async () => {
    if (selectedIds.size === 0) {
      toast.error('Please select at least one candidate to download.');
      return;
    }
    
    const selectedCandidates = baseCandidates.filter(
      c => selectedIds.has(c._id) && candidateHasResume(c)
    );
    
    if (selectedCandidates.length === 0) {
      toast.error('None of the selected candidates have resumes.');
      return;
    }

    setIsZipping(true);
    setZipStep('Preparing ZIP...');

    try {
      // 1. First attempt backend API call
      setZipStep('Downloading...');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/candidates/download-resumes-zip`,
        { candidateIds: Array.from(selectedIds) },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'application/zip' });
      saveAs(blob, `FAST_Careers_Resumes_${new Date().toISOString().split('T')[0]}.zip`);
      toast.success(`${selectedCandidates.length} resumes downloaded successfully.`);
    } catch (backendError) {
      console.warn('Backend ZIP download encountered an issue, running client-side package fallback:', backendError);

      // 2. Client-side JSZip fallback
      try {
        setZipStep('Packaging resumes...');
        const zip = new JSZip();
        const folder = zip.folder("candidates_resumes") || zip;
        const nameTracker = new Map<string, number>();

        const fetchPromises = selectedCandidates.map(async (candidate) => {
          const url = getResumeUrl(candidate.resumeUrl!);
          const sanitize = (s: string) => s.replace(/[/\\?%*:|"<>]/g, '').trim().replace(/\s+/g, '_');
          let base = `${sanitize(candidate.firstName || 'Candidate')}_${sanitize(candidate.lastName || '')}`.replace(/_+$/, '');
          if (!base) base = `Candidate_${candidate._id.slice(-6)}`;

          let fileName = '';
          if (!nameTracker.has(base)) {
            nameTracker.set(base, 1);
            fileName = `${base}.pdf`;
          } else {
            const count = (nameTracker.get(base) || 1) + 1;
            nameTracker.set(base, count);
            fileName = `${base}_${count}.pdf`;
          }

          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network error');
            const blob = await response.blob();
            folder.file(fileName, blob);
          } catch (err) {
            console.error(`Failed to fetch resume for ${candidate.firstName}`, err);
            folder.file(`${base}_fetch_error.txt`, `Failed to download PDF from: ${url}`);
          }
        });

        await Promise.all(fetchPromises);
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `FAST_Careers_Resumes_${new Date().toISOString().split('T')[0]}.zip`);
        toast.success(`${selectedCandidates.length} resumes downloaded successfully.`);
      } catch (clientErr) {
        console.error('Error creating ZIP on client:', clientErr);
        toast.error('An error occurred while creating the ZIP file.');
      }
    } finally {
      setIsZipping(false);
      setZipStep('');
    }
  };

  const resetFilters = () => {
    setFilterCity('');
    setFilterState('');
    setFilterMaritalStatus('');
    setFilterCourse('');
    setFilterGender('');
    setFilterFresherCA('');
    setFilterInter1stAttempt('');
    setFilterInterGroup1Attempts('');
    setFilterInterGroup2Attempts('');
    setFilterInterRanker('');
    setFilterFinal1stAttempt('');
    setFilterFinalGroup1Attempts('');
    setFilterFinalGroup2Attempts('');
    setFilterFinalRanker('');
    setFilterBig4('');
    setFilterFirmType('');
    setFilterGmcs('');
    setFilterIndustrialTrainee('');
    setFilterListedCompany('');
    setFilterGradCompleted('');
    setFilterGradType('');
  };

  return (
    <EmployerLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text mb-2">Search Candidates</h1>
          <p className="text-gray-500">
            {isExcelMode ? 'Viewing candidates matched from uploaded Excel sheet' : 'Find the perfect match for your open positions'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleExcelUpload}
            accept=".xlsx, .xls"
            className="hidden"
          />

          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingExcel}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50"
            title="Upload Excel with candidate emails (.xlsx, .xls)"
          >
            <UploadCloud size={18} /> {isProcessingExcel ? (processingStep || 'Processing...') : 'Upload Excel'}
          </button>

          <button 
            onClick={exportToCSV}
            disabled={isExporting || filteredCandidates.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet size={18} /> {isExporting ? 'Exporting...' : 'Export to Excel'}
          </button>
          
          <button 
            onClick={downloadSelectedAsZip}
            disabled={isZipping || selectedIds.size === 0}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
          >
            <DownloadCloud size={18} /> {isZipping ? (zipStep || 'Zipping...') : `Download ZIP (${selectedIds.size})`}
          </button>
        </div>
      </div>

      {/* Excel Matching Summary Banner */}
      {isExcelMode && excelStats && (
        <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm mb-6 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-primary rounded-xl">
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                  Excel Match Results
                  <span className="text-xs bg-blue-100 text-primary font-semibold px-2.5 py-0.5 rounded-full">
                    {excelFileName}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Showing only candidates whose email matches the uploaded Excel sheet.
                </p>
              </div>
            </div>
            <button
              onClick={clearExcelMode}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors self-start sm:self-auto cursor-pointer"
            >
              <X size={16} /> Reset / Show All Candidates
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
            <div className="bg-white border border-gray-200 p-3.5 rounded-xl shadow-2xs">
              <p className="text-xs font-medium text-gray-500">Total Emails</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{excelStats.totalEmails}</p>
            </div>
            <div className="bg-white border border-green-200 p-3.5 rounded-xl shadow-2xs bg-green-50/20">
              <p className="text-xs font-medium text-green-700">Matched Candidates</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{excelStats.matchedCandidates}</p>
            </div>
            <div className="bg-white border border-emerald-200 p-3.5 rounded-xl shadow-2xs bg-emerald-50/20">
              <p className="text-xs font-medium text-emerald-700">Resumes Available</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{excelStats.resumesAvailable}</p>
            </div>
            <div className="bg-white border border-amber-200 p-3.5 rounded-xl shadow-2xs bg-amber-50/20">
              <p className="text-xs font-medium text-amber-700">Resume Not Available</p>
              <p className="text-2xl font-bold text-amber-700 mt-1">{excelStats.resumesUnavailable}</p>
            </div>
            <div className="bg-white border border-gray-200 p-3.5 rounded-xl shadow-2xs bg-gray-50/50 col-span-2 sm:col-span-1">
              <p className="text-xs font-medium text-gray-500">Not Found</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{excelStats.notFound}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by skills, title, or keyword" 
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
          <Filter size={18} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">Advanced Filters</h3>
            <button onClick={resetFilters} className="text-sm text-primary hover:underline">Reset All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">State</label>
              <input type="text" list="statesList" value={filterState} onChange={e => {setFilterState(e.target.value); setFilterCity('');}} placeholder="e.g. Maharashtra" className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20" />
              <datalist id="statesList">
                {STATES.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">City</label>
              <input type="text" list="citiesList" value={filterCity} onChange={e => setFilterCity(e.target.value)} placeholder="e.g. Mumbai" className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20" />
              <datalist id="citiesList">
                {(filterState ? STATE_CITY_MAP[filterState] || ALL_CITIES : ALL_CITIES).map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Gender</label>
              <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Male">Male</option><option value="Female">Female</option></select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Marital Status</label>
              <select value={filterMaritalStatus} onChange={e => setFilterMaritalStatus(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Unmarried">Unmarried</option><option value="Married">Married</option></select>
            </div>
            
            {/* Qualification Filters */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Graduation Completed</label>
              <select value={filterGradCompleted} onChange={e => setFilterGradCompleted(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Yes">Yes</option><option value="No/Pursuing">No/Pursuing</option></select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Graduation Type</label>
              <select value={filterGradType} onChange={e => setFilterGradType(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="REGULAR">Regular</option><option value="CORRESPONDENCE">Correspondence</option></select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Education / Course</label>
              <input type="text" value={filterCourse} onChange={e => setFilterCourse(e.target.value)} placeholder="e.g. B.Com" className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20" />
            </div>

            {/* CA Inter Filters */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fresher CA</label>
              <select value={filterFresherCA} onChange={e => setFilterFresherCA(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Yes">Yes</option><option value="No">No</option></select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">CA Inter Both Grps (1st Att)</label>
              <select value={filterInter1stAttempt} onChange={e => setFilterInter1stAttempt(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Yes">Yes</option><option value="No">No</option></select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">CA Inter Grp 1 Attempts</label>
              <select value={filterInterGroup1Attempts} onChange={e => setFilterInterGroup1Attempts(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option>{['0','1','2','3','4','5','6+'].map(a=><option key={a} value={a}>{a}</option>)}</select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">CA Inter Grp 2 Attempts</label>
              <select value={filterInterGroup2Attempts} onChange={e => setFilterInterGroup2Attempts(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option>{['0','1','2','3','4','5','6+'].map(a=><option key={a} value={a}>{a}</option>)}</select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">CA Inter Ranker</label>
              <select value={filterInterRanker} onChange={e => setFilterInterRanker(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Yes">Yes</option><option value="No">No</option></select>
            </div>

            {/* CA Final Filters */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">CA Final Passing Month (Batch)</label>
              <select value={filterFinalPassMonth} onChange={e => setFilterFinalPassMonth(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">All</option>
                <option value="May">May</option>
                <option value="November">November</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">CA Final Passing Year</label>
              <input type="number" placeholder="e.g. 2024" value={filterFinalPassYear} onChange={e => setFilterFinalPassYear(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Resume Uploaded (From Date)</label>
              <input type="date" value={filterResumeFromDate} onChange={e => setFilterResumeFromDate(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Resume Uploaded (To Date)</label>
              <input type="date" value={filterResumeToDate} onChange={e => setFilterResumeToDate(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">CA Final Both Grps (1st Att)</label>
              <select value={filterFinal1stAttempt} onChange={e => setFilterFinal1stAttempt(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Yes">Yes</option><option value="No">No</option></select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">CA Final Grp 1 Attempts</label>
              <select value={filterFinalGroup1Attempts} onChange={e => setFilterFinalGroup1Attempts(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option>{['0','1','2','3','4','5','6+'].map(a=><option key={a} value={a}>{a}</option>)}</select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">CA Final Grp 2 Attempts</label>
              <select value={filterFinalGroup2Attempts} onChange={e => setFilterFinalGroup2Attempts(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option>{['0','1','2','3','4','5','6+'].map(a=><option key={a} value={a}>{a}</option>)}</select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">CA Final Ranker</label>
              <select value={filterFinalRanker} onChange={e => setFilterFinalRanker(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Yes">Yes</option><option value="No">No</option></select>
            </div>

            {/* Articleship & Others */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Articleship Firm Type</label>
              <select value={filterFirmType} onChange={e => setFilterFirmType(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Big4">Big4</option><option value="Medium">Medium</option><option value="Small">Small</option></select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Big 4 Articleship (Anytime)</label>
              <select value={filterBig4} onChange={e => setFilterBig4(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Yes">Yes</option><option value="No">No</option></select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">GMCS Completed</label>
              <select value={filterGmcs} onChange={e => setFilterGmcs(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Yes">Yes</option><option value="No">No</option></select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Industrial Trainee</label>
              <select value={filterIndustrialTrainee} onChange={e => setFilterIndustrialTrainee(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Yes">Yes</option><option value="No">No</option></select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Listed Company Work</label>
              <select value={filterListedCompany} onChange={e => setFilterListedCompany(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20"><option value="">All</option><option value="Yes">Yes</option><option value="No">No</option></select>
            </div>
          </div>
        </div>
      )}

      {!loading && filteredCandidates.length > 0 && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-2xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSelectAll} 
              disabled={candidatesWithResumes.length === 0}
              className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {selectedIds.size > 0 && selectedIds.size === candidatesWithResumes.length ? (
                <CheckSquare size={20} className="text-primary"/>
              ) : (
                <Square size={20} className="text-gray-400" />
              )}
              Select All Available Resumes
            </button>
            <span className="text-gray-400 text-sm font-normal">
              ({selectedIds.size} of {candidatesWithResumes.length} ready to download)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              Showing {filteredCandidates.length} candidate{filteredCandidates.length === 1 ? '' : 's'}
              {isExcelMode && ' (from Excel match)'}
            </div>
            {selectedIds.size > 0 && (
              <button
                onClick={downloadSelectedAsZip}
                disabled={isZipping}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                <DownloadCloud size={14} /> Download Selected ZIP ({selectedIds.size})
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500">Loading candidates...</p>
        ) : filteredCandidates.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white border border-gray-100 rounded-xl">
            {isExcelMode ? 'No matched candidates found in database.' : 'No candidates match your selected filters.'}
          </div>
        ) : (
          filteredCandidates.map(candidate => {
            const isSelected = selectedIds.has(candidate._id);
            const hasResume = candidateHasResume(candidate);

            return (
              <div 
                key={candidate._id} 
                className={`bg-white border-2 rounded-2xl p-6 shadow-sm transition-all ${
                  hasResume ? 'cursor-pointer' : 'cursor-default opacity-85'
                } ${isSelected ? 'border-primary bg-blue-50/30' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'}`}
                onClick={() => hasResume && toggleSelection(candidate)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg uppercase">
                      {candidate.firstName?.[0] || 'C'}{candidate.lastName?.[0] || ''}
                    </div>
                    <div>
                      <h3 className="font-bold text-text">{candidate.firstName} {candidate.lastName}</h3>
                      {candidate.headline ? (
                        <p className="text-sm font-medium text-gray-700 truncate w-48" title={candidate.headline}>{candidate.headline}</p>
                      ) : (
                        <p className="text-sm text-gray-500 truncate w-48" title={candidate.email}>{candidate.email}</p>
                      )}
                    </div>
                  </div>
                  <div 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (hasResume) toggleSelection(candidate); 
                    }} 
                    className={hasResume ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'}
                    title={hasResume ? (isSelected ? 'Deselect candidate' : 'Select candidate for ZIP') : 'Resume not available'}
                  >
                    {isSelected ? <CheckSquare size={24} className="text-primary"/> : <Square size={24} className="text-gray-300"/>}
                  </div>
                </div>

                <div className="mb-4">
                  {hasResume ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Resume Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Resume Not Available
                    </span>
                  )}
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
                          {(candidate.caPortfolio?.caFinal?.group1Attempts || candidate.caPortfolio?.caFinal?.group2Attempts || candidate.caPortfolio?.caFinal?.bothGroups1stAttempt) ? 'CA Final' 
                              : (candidate.caPortfolio?.caInter?.group1Attempts || candidate.caPortfolio?.caInter?.group2Attempts || candidate.caPortfolio?.caInter?.bothGroups1stAttempt) ? 'CA Inter'
                              : candidate.qualifications?.graduation?.college ? `Graduation - ${candidate.qualifications.graduation.yearOfCompletion || ''}` 
                              : 'Education not provided'}
                        </span>
                      </div>
                    </div>
                    
                    {candidate.experience !== undefined && candidate.experience !== null && (
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Experience:</span> {candidate.experience} years
                      </div>
                    )}

                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {candidate.skills.slice(0, 4).map((skill, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium border border-gray-200">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 4 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium border border-gray-200">
                            +{candidate.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                <div onClick={e => e.stopPropagation()}>
                  {hasResume ? (
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
