import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { Shield, Users, Building, Briefcase, FileText, Settings, Activity, Download, MapPin, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import axios from 'axios';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getResumeUrl } from '../../utils/urlHelper';

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
  createdAt: string;
}

export const AdminDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

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

  const handleBulkDownload = async () => {
    if (candidates.length === 0) {
      toast.error('No candidates available to download.');
      return;
    }
    
    setDownloading(true);

    try {
      const zip = new JSZip();
      
      // 1. Prepare data for Excel
      const excelData = candidates.map(candidate => ({
        'First Name': candidate.firstName,
        'Last Name': candidate.lastName,
        'Email': candidate.email,
        'Registered On': new Date(candidate.createdAt).toLocaleDateString(),
        'Location': candidate.personalDetails?.currentCity ? `${candidate.personalDetails.currentCity}, ${candidate.personalDetails.currentState || ''}` : 'Not provided',
        'Education': candidate.qualifications?.graduation?.collegeName 
                      ? `${candidate.qualifications.graduation.courseName || 'Graduation'} from ${candidate.qualifications.graduation.collegeName} (${candidate.qualifications.graduation.yearOfCompletion})` 
                      : 'Not provided',
        'Completion Year': candidate.qualifications?.graduation?.yearOfCompletion || '',
        'Resume Link': candidate.resumeUrl ? getResumeUrl(candidate.resumeUrl) : 'Not uploaded'
      }));

      // 2. Generate Excel file and add to ZIP
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      zip.file("Candidates_List.xlsx", excelBuffer);

      // 3. Create a folder for resumes
      const resumesFolder = zip.folder("Resumes");

      // 4. Fetch all PDFs and add to ZIP
      if (resumesFolder) {
        const fetchPromises = candidates.map(async (candidate) => {
          if (candidate.resumeUrl) {
            try {
              const resumeUrl = getResumeUrl(candidate.resumeUrl);
              const response = await axios.get(resumeUrl, { responseType: 'arraybuffer' });
              const fileName = candidate.resumeUrl.split('/').pop() || `${candidate.firstName}_${candidate.lastName}_Resume.pdf`;
              resumesFolder.file(fileName, response.data);
            } catch (error) {
              console.error(`Failed to fetch resume for ${candidate.firstName}:`, error);
            }
          }
        });

        // Wait for all PDFs to be fetched and added
        await Promise.all(fetchPromises);
      }

      // 5. Generate final ZIP file and trigger download
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, "Candidates_Data_and_Resumes.zip");
      
    } catch (error) {
      console.error('Error generating bulk download:', error);
      toast.error('Failed to generate bulk download.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white shrink-0 h-auto md:min-h-[calc(100vh-64px)]">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold">FAST Admin</h3>
              <p className="text-xs text-gray-400">Superuser</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-gray-800 text-white">
              <Activity size={18} /> Overview
            </Link>
            <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Users size={18} /> Candidates
            </Link>
            <Link to="/admin/employers" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Building size={18} /> Employers
            </Link>
            <Link to="/admin/jobs" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Briefcase size={18} /> Jobs
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Settings size={18} /> System Settings
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-text">Candidates Management</h1>
          <button 
            onClick={handleBulkDownload}
            disabled={downloading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${downloading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            <Download size={16} /> {downloading ? 'Generating ZIP...' : 'Download All (Excel + PDFs)'}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Education</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered On</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading candidates...</td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No candidates found.</td>
                  </tr>
                ) : (
                  candidates.map((candidate) => (
                    <tr key={candidate._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                            {candidate.firstName[0]}{candidate.lastName[0]}
                          </div>
                          <div>
                            <div className="font-medium text-text">{candidate.firstName} {candidate.lastName}</div>
                            <div className="text-xs text-gray-500">{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                      {candidate.personalDetails?.currentCity ? (
                        <div className="flex items-center gap-1 text-gray-600"><MapPin size={14}/> {candidate.personalDetails.currentCity}, {candidate.personalDetails.currentState}</div>
                      ) : (
                        <span className="text-gray-400 text-sm italic">Not provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {candidate.qualifications?.graduation?.collegeName ? (
                        <div>
                          <div className="font-medium text-gray-800 flex items-center gap-1"><GraduationCap size={14}/> {candidate.qualifications.graduation.courseName || 'Graduation'}</div>
                          <div className="text-xs text-gray-500">{candidate.qualifications.graduation.collegeName} ({candidate.qualifications.graduation.yearOfCompletion})</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic">Not provided</span>
                      )}
                    </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(candidate.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {candidate.resumeUrl ? (
                          <a 
                            href={getResumeUrl(candidate.resumeUrl)} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-1 text-primary hover:text-blue-700 text-sm font-medium"
                          >
                            <FileText size={16} /> View / Download
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400 italic">Not uploaded</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
