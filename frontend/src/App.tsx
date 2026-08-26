import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './layouts/Navbar';
import { Footer } from './layouts/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Expertise } from './pages/Expertise';
import { Employers } from './pages/Employers';
import { Contact } from './pages/Contact';
import { JobListings } from './pages/JobListings';
import { JobDetails } from './pages/JobDetails';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
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
import { ManageJobs } from './pages/employer/ManageJobs';
import { EmployerCandidates } from './pages/employer/Candidates';
import { EmployerBilling } from './pages/employer/Billing';
import { CompanyProfile } from './pages/employer/CompanyProfile';
import { PlatformData } from './pages/employer/PlatformData';
import { AdminDashboard } from './pages/admin/Dashboard';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/expertise" element={<Expertise />} />
            <Route path="/employers" element={<Employers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Candidate Routes */}
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
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
            <Route path="/employer/jobs" element={<ManageJobs />} />
            <Route path="/employer/candidates" element={<EmployerCandidates />} />
            <Route path="/employer/billing" element={<EmployerBilling />} />
            <Route path="/employer/settings" element={<CompanyProfile />} />
            <Route path="/employer/platform-data" element={<PlatformData />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Add more routes as we build out the pages */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
