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
import { EmployerDashboard } from './pages/employer/Dashboard';
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
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
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
