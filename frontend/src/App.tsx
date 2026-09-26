import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './layouts/Navbar';
import { Footer } from './layouts/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { OurTeam } from './pages/OurTeam';
import { Services } from './pages/Services';
import { Expertise } from './pages/Expertise';
import { Employers } from './pages/Employers';
import { Contact } from './pages/Contact';
import { JobListings } from './pages/JobListings';
import { JobDetails } from './pages/JobDetails';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { PlacementDriveForm } from './pages/PlacementDriveForm';
import { PlacementResults } from './pages/PlacementResults';
import { CandidateDashboard } from './pages/candidate/Dashboard';
import { JobFair } from './pages/candidate/JobFair';
import { CurrentOpenings } from './pages/candidate/CurrentOpenings';
import { ResumeDownloads } from './pages/candidate/ResumeDownloads';
import { ResumePrint } from './pages/candidate/ResumePrint';
import { Feedback } from './pages/candidate/Feedback';
import { ImpDownloads } from './pages/candidate/ImpDownloads';
import { ReferFriend } from './pages/candidate/ReferFriend';
import { CompaniesRegistered } from './pages/candidate/CompaniesRegistered';
import { WantToChangeJob } from './pages/candidate/WantToChangeJob';
import { PlacementHistory } from './pages/candidate/PlacementHistory';
import { ShareJob } from './pages/candidate/ShareJob';
import { EmployerDashboard } from './pages/employer/Dashboard';
import { EmployerApplications } from './pages/employer/Applications';
import { ManageJobs } from './pages/employer/ManageJobs';
import { EmployerCandidates } from './pages/employer/Candidates';
import { EmployerBilling } from './pages/employer/Billing';
import { CompanyProfile } from './pages/employer/CompanyProfile';
import { PlatformData } from './pages/employer/PlatformData';
import { AdminDashboard } from './pages/admin/Dashboard';
import { FastSelectionTest } from './pages/candidate/FastSelectionTest';
import { CandidateTestResults } from './pages/admin/CandidateTestResults';
import { ScrollToTop } from './components/ScrollToTop';

// Lazy Loaded Routes
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const OurTeam = lazy(() => import('./pages/OurTeam').then(m => ({ default: m.OurTeam })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const Expertise = lazy(() => import('./pages/Expertise').then(m => ({ default: m.Expertise })));
const Employers = lazy(() => import('./pages/Employers').then(m => ({ default: m.Employers })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const JobListings = lazy(() => import('./pages/JobListings').then(m => ({ default: m.JobListings })));
const JobDetails = lazy(() => import('./pages/JobDetails').then(m => ({ default: m.JobDetails })));
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(m => ({ default: m.Register })));
const PlacementDriveForm = lazy(() => import('./pages/PlacementDriveForm').then(m => ({ default: m.PlacementDriveForm })));
const PlacementResults = lazy(() => import('./pages/PlacementResults').then(m => ({ default: m.PlacementResults })));
const CandidateDashboard = lazy(() => import('./pages/candidate/Dashboard').then(m => ({ default: m.CandidateDashboard })));
const JobFair = lazy(() => import('./pages/candidate/JobFair').then(m => ({ default: m.JobFair })));
const CurrentOpenings = lazy(() => import('./pages/candidate/CurrentOpenings').then(m => ({ default: m.CurrentOpenings })));
const ResumeDownloads = lazy(() => import('./pages/candidate/ResumeDownloads').then(m => ({ default: m.ResumeDownloads })));
const ResumePrint = lazy(() => import('./pages/candidate/ResumePrint').then(m => ({ default: m.ResumePrint })));
const Feedback = lazy(() => import('./pages/candidate/Feedback').then(m => ({ default: m.Feedback })));
const ImpDownloads = lazy(() => import('./pages/candidate/ImpDownloads').then(m => ({ default: m.ImpDownloads })));
const ReferFriend = lazy(() => import('./pages/candidate/ReferFriend').then(m => ({ default: m.ReferFriend })));
const CompaniesRegistered = lazy(() => import('./pages/candidate/CompaniesRegistered').then(m => ({ default: m.CompaniesRegistered })));
const WantToChangeJob = lazy(() => import('./pages/candidate/WantToChangeJob').then(m => ({ default: m.WantToChangeJob })));
const PlacementHistory = lazy(() => import('./pages/candidate/PlacementHistory').then(m => ({ default: m.PlacementHistory })));
const ShareJob = lazy(() => import('./pages/candidate/ShareJob').then(m => ({ default: m.ShareJob })));
const EmployerDashboard = lazy(() => import('./pages/employer/Dashboard').then(m => ({ default: m.EmployerDashboard })));
const EmployerApplications = lazy(() => import('./pages/employer/Applications').then(m => ({ default: m.EmployerApplications })));
const ManageJobs = lazy(() => import('./pages/employer/ManageJobs').then(m => ({ default: m.ManageJobs })));
const EmployerCandidates = lazy(() => import('./pages/employer/Candidates').then(m => ({ default: m.EmployerCandidates })));
const EmployerBilling = lazy(() => import('./pages/employer/Billing').then(m => ({ default: m.EmployerBilling })));
const CompanyProfile = lazy(() => import('./pages/employer/CompanyProfile').then(m => ({ default: m.CompanyProfile })));
const PlatformData = lazy(() => import('./pages/employer/PlatformData').then(m => ({ default: m.PlatformData })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const FastSelectionTest = lazy(() => import('./pages/candidate/FastSelectionTest').then(m => ({ default: m.FastSelectionTest })));
const CandidateTestResults = lazy(() => import('./pages/admin/CandidateTestResults').then(m => ({ default: m.CandidateTestResults })));

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#0f172a',
            color: '#fff',
            fontWeight: 500,
            fontSize: '13.5px',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            maxWidth: '420px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-semibold text-slate-500">Loading Fast Careers...</p>
              </div>
            }>
              <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<OurTeam />} />
            <Route path="/our-team" element={<OurTeam />} />
            <Route path="/services" element={<Services />} />
            <Route path="/expertise" element={<Expertise />} />
            <Route path="/employers" element={<Employers />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/placement-drive" element={<PlacementDriveForm />} />
            <Route path="/placement-results" element={<PlacementResults />} />
            <Route path="/ca-results" element={<PlacementResults />} />
            
            {/* Candidate Routes */}
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/fast-selection" element={<FastSelectionTest />} />
            <Route path="/candidate/job-fair" element={<JobFair />} />
            <Route path="/candidate/openings" element={<CurrentOpenings />} />
            <Route path="/candidate/resume-downloads" element={<ResumeDownloads />} />
            <Route path="/candidate/resume-print" element={<ResumePrint />} />
            <Route path="/candidate/feedback" element={<Feedback />} />
            <Route path="/candidate/imp-downloads" element={<ImpDownloads />} />
            <Route path="/candidate/refer" element={<ReferFriend />} />
            <Route path="/candidate/companies" element={<CompaniesRegistered />} />
            <Route path="/candidate/change-job" element={<WantToChangeJob />} />
            <Route path="/candidate/share-job" element={<ShareJob />} />
            <Route path="/candidate/placements" element={<PlacementHistory />} />
            
            {/* Employer Routes */}
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/employer/applications" element={<EmployerApplications />} />
            <Route path="/employer/jobs" element={<ManageJobs />} />
            <Route path="/employer/candidates" element={<EmployerCandidates />} />
            <Route path="/employer/billing" element={<EmployerBilling />} />
            <Route path="/employer/settings" element={<CompanyProfile />} />
            <Route path="/employer/platform-data" element={<PlatformData />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<EmployerApplications />} />
            <Route path="/admin/test-results" element={<CandidateTestResults />} />
                        </Routes>
            </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
