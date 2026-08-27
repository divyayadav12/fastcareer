import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Building, Users, FileText, Settings, Bell, PlusCircle, Briefcase, BarChart2, MapPin, GraduationCap, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import axios from 'axios';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getResumeUrl } from '../../utils/urlHelper';
import { EmployerLayout } from '../../layouts/EmployerLayout';

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

export const EmployerDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token') || (user as any)?.token;
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/applications/employer`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoadingApps(false);
      }
    };
    
    fetchApplications();

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

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      zip.file("Candidates_List.xlsx", excelBuffer);

      const resumesFolder = zip.folder("Resumes");

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
        await Promise.all(fetchPromises);
      }

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
    <EmployerLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-text">Employer Dashboard</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle size={18} /> Post a New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm font-medium">Active Jobs</p>
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><Briefcase size={20} /></div>
          </div>
          <h3 className="text-3xl font-bold text-text">5</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm font-medium">Total Applicants</p>
            <div className="bg-green-50 text-green-600 p-2 rounded-lg"><Users size={20} /></div>
          </div>
          <h3 className="text-3xl font-bold text-text">{candidates.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm font-medium">Shortlisted</p>
            <div className="bg-amber-50 text-amber-600 p-2 rounded-lg"><FileText size={20} /></div>
          </div>
          <h3 className="text-3xl font-bold text-text">18</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-500 text-sm font-medium">Profile Views</p>
            <div className="bg-purple-50 text-purple-600 p-2 rounded-lg"><Building size={20} /></div>
          </div>
          <h3 className="text-3xl font-bold text-text">892</h3>
        </div>
      </div>

      {/* Available Candidates Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-text">Available Candidates on Platform</h2>
          <button 
            onClick={handleBulkDownload}
            disabled={downloading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${downloading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            <Download size={16} /> {downloading ? 'Generating ZIP...' : 'Download All (Excel + PDFs)'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500 bg-gray-50">
                <th className="px-4 py-3 font-medium">Candidate Info</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Education</th>
                <th className="px-4 py-3 font-medium">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="py-8 text-center text-gray-500">Loading candidates...</td></tr>
              ) : candidates.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-gray-500">No candidates available.</td></tr>
              ) : (
                candidates.map(candidate => (
                  <tr key={candidate._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-medium text-text">{candidate.firstName} {candidate.lastName}</div>
                      <div className="text-xs text-gray-500">{candidate.email}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {candidate.personalDetails?.currentCity ? (
                        <div className="flex items-center gap-1"><MapPin size={14}/> {candidate.personalDetails.currentCity}, {candidate.personalDetails.currentState}</div>
                      ) : (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {(candidate.caPortfolio?.caFinal?.group1Attempts || candidate.caPortfolio?.caFinal?.group2Attempts || candidate.caPortfolio?.caFinal?.bothGroups1stAttempt) ? (
                        <div>
                          <div className="font-medium flex items-center gap-1"><GraduationCap size={14}/> CA Final</div>
                          <div className="text-xs text-gray-500">ICAI</div>
                        </div>
                      ) : (candidate.caPortfolio?.caInter?.group1Attempts || candidate.caPortfolio?.caInter?.group2Attempts || candidate.caPortfolio?.caInter?.bothGroups1stAttempt) ? (
                        <div>
                          <div className="font-medium flex items-center gap-1"><GraduationCap size={14}/> CA Inter</div>
                          <div className="text-xs text-gray-500">ICAI</div>
                        </div>
                      ) : candidate.qualifications?.graduation?.college ? (
                        <div>
                          <div className="font-medium flex items-center gap-1"><GraduationCap size={14}/> Graduation</div>
                          <div className="text-xs text-gray-500">{candidate.qualifications.graduation.college} ({candidate.qualifications.graduation.yearOfCompletion || ''})</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {candidate.resumeUrl ? (
                        <a href={getResumeUrl(candidate.resumeUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
                          <Download size={14} /> Download
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">No Resume</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
          {/* Recent Applications Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-8">
        <h2 className="text-lg font-bold text-text mb-6">Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500 bg-gray-50">
                <th className="px-4 py-3 font-medium">Applicant</th>
                <th className="px-4 py-3 font-medium">Job Title</th>
                <th className="px-4 py-3 font-medium">Applied On</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingApps ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">Loading applications...</td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">No applications received yet.</td></tr>
              ) : (
                applications.map(app => (
                  <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-medium text-text">{app.candidate?.firstName} {app.candidate?.lastName}</div>
                      <div className="text-xs text-gray-500">{app.candidate?.email}</div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-primary">
                      {app.job?.title}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {app.status || 'Applied'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {app.resumeUrl ? (
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
                          <Eye size={14}/> View CV
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm italic">No CV</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </EmployerLayout>
  );
};
