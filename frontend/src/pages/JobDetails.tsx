import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Clock, ArrowLeft, Share2, Bookmark, CheckCircle2, X, Upload } from 'lucide-react';
import { Button } from '../components/Button';
import { mockJobs } from '../data/mockJobs';

export const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [job, setJob] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || (user as any)?.token;
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(res.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Failed to fetch job", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  if (loading) {
    return <div className="min-h-[60vh] flex flex-col items-center justify-center">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-text mb-4">Job Not Found</h2>
        <p className="text-gray-500 mb-8">The job you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate('/jobs')}>Back to Job Listings</Button>
      </div>
    );
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to apply for jobs.');
      navigate('/login');
      return;
    }
    if (!resumeFile && !profileData?.resumeUrl) {
      alert('Please upload a resume.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append('resume', resumeFile);
      } else if (profileData?.resumeUrl) {
        formData.append('existingResumeUrl', profileData.resumeUrl);
      }
      if (coverLetter) {
        formData.append('coverLetter', coverLetter);
      }

      const token = localStorage.getItem('token') || (user as any).token;
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/applications/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      alert('Application submitted successfully!');
      setShowApplyModal(false);
      setResumeFile(null);
      setCoverLetter('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20 relative">
      {/* Job Header */}
      <div className="bg-secondary pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-white">
          <Link to="/jobs" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} className="mr-2" /> Back to jobs
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
          <p className="text-xl text-primary font-medium mb-6">{job.company}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1.5"><MapPin size={18} /> {job.location}</span>
            <span className="flex items-center gap-1.5"><Briefcase size={18} /> {job.type}</span>
            <span className="flex items-center gap-1.5"><IndianRupee size={18} /> {job.salaryMin ? `₹${(job.salaryMin / 100000).toFixed(1)}L - ₹${(job.salaryMax / 100000).toFixed(1)}L` : 'Not disclosed'}</span>
            <span className="flex items-center gap-1.5"><Clock size={18} /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-8 mb-8">
            <div className="flex gap-4">
              <Button onClick={() => setShowApplyModal(true)}>Apply Now</Button>
              <Button variant="outline" className="px-4"><Bookmark size={20} /></Button>
              <Button variant="outline" className="px-4"><Share2 size={20} /></Button>
            </div>
            <p className="text-sm text-gray-500 font-medium">Over 50 applicants</p>
          </div>

          <div className="space-y-10">
            <section>
              <h3 className="text-xl font-bold text-text mb-4">Job Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {job.description}
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-text mb-4">Key Responsibilities</h3>
              <ul className="space-y-3">
                {job.responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-text mb-4">Requirements & Qualifications</h3>
              <ul className="space-y-3">
                {job.requirements.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <h3 className="text-lg font-bold text-text mb-4">Ready to advance your career?</h3>
            <Button size="lg" onClick={() => setShowApplyModal(true)}>Apply for this position</Button>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-text">Apply for {job.title}</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleApply} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume / CV *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    {resumeFile ? <p className="text-sm font-medium text-primary">{resumeFile.name}</p> : profileData?.resumeUrl ? <p className="text-sm font-medium text-primary">Using profile resume (Click to upload new)</p> : <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>}
                    <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 5MB</p>
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" required ref={fileInputRef} onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly explain why you're a great fit for this role..."
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowApplyModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
