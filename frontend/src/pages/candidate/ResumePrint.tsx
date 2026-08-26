import React from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Printer, Download, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Button } from '../../components/Button';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export const ResumePrint = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const handlePrint = () => {
    window.print();
  };

  return (
    <CandidateLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-text mb-2">Resume Print (Site)</h1>
          <p className="text-gray-500">Auto-generated resume based on your profile details.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={18} /> Save PDF
          </Button>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer size={18} /> Print Now
          </Button>
        </div>
      </div>

      {/* Resume Preview Box */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-10 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
        
        {/* Header */}
        <div className="border-b-2 border-primary pb-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
            {user?.firstName} {user?.lastName}
          </h1>
          <h2 className="text-xl text-primary font-medium mb-4">Software Developer</h2>
          
          <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Mail size={16} className="text-gray-400" /> {user?.email}</div>
            <div className="flex items-center gap-2"><Phone size={16} className="text-gray-400" /> +91 9876543210</div>
            <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> Mumbai, India</div>
            <div className="flex items-center gap-2"><Globe size={16} className="text-gray-400" /> linkedin.com/in/profile</div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-3">Professional Summary</h3>
          <p className="text-gray-700 leading-relaxed text-sm">
            Dedicated and results-driven professional with a strong background in software development. 
            Proven ability to build scalable web applications and collaborate with cross-functional teams. 
            Eager to bring technical expertise and creative problem-solving skills to a dynamic organization.
          </p>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-3">Work Experience</h3>
          
          <div className="mb-5">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-gray-900">Senior Software Engineer</h4>
              <span className="text-primary font-medium text-sm">Jan 2022 - Present</span>
            </div>
            <div className="text-gray-600 font-medium text-sm mb-2">Tech Solutions Inc. | Mumbai, India</div>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
              <li>Developed and maintained RESTful APIs using Node.js and Express.</li>
              <li>Spearheaded the migration of legacy frontend systems to React.js, improving load times by 40%.</li>
              <li>Mentored junior developers and conducted code reviews.</li>
            </ul>
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-3">Education</h3>
          <div className="flex justify-between items-start mb-1">
            <div>
              <h4 className="font-bold text-gray-900">B.Tech in Computer Science</h4>
              <div className="text-gray-600 font-medium text-sm">Indian Institute of Technology, Bombay</div>
            </div>
            <span className="text-primary font-medium text-sm">2018 - 2022</span>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-3">Core Skills</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">JavaScript</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">React.js</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">Node.js</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">MongoDB</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">TypeScript</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">Tailwind CSS</span>
          </div>
        </div>

      </div>
    </CandidateLayout>
  );
};
