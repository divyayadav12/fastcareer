import React from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

export const ResumeDownloads = () => {
  const templates = [
    { id: 1, name: "IT Professional Template", type: "DOCX", size: "1.2 MB", style: "Modern & Clean" },
    { id: 2, name: "Sales Executive Template", type: "DOCX", size: "1.5 MB", style: "Result Oriented" },
    { id: 3, name: "Fresh Graduate Template", type: "DOCX", size: "0.8 MB", style: "Education Focused" },
    { id: 4, name: "Creative Designer Template", type: "PDF", size: "2.1 MB", style: "Visual & Bold" },
    { id: 5, name: "Managerial Role Template", type: "DOCX", size: "1.1 MB", style: "Executive Classic" },
    { id: 6, name: "Finance Specialist Template", type: "PDF", size: "1.4 MB", style: "Data Driven" }
  ];

  return (
    <CandidateLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Resume Downloads</h1>
        <p className="text-gray-500">Download premium resume templates tailored for different industries.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${template.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                <FileText size={24} />
              </div>
              <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                {template.type}
              </span>
            </div>
            
            <h3 className="font-bold text-text mb-1">{template.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{template.style}</p>
            
            <ul className="space-y-2 mb-6 flex-1">
              <li className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 size={14} className="text-green-500" /> ATS Friendly
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 size={14} className="text-green-500" /> Easily Editable
              </li>
            </ul>
            
            <button className="w-full flex items-center justify-center gap-2 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">
              <Download size={16} /> Download ({template.size})
            </button>
          </div>
        ))}
      </div>
    </CandidateLayout>
  );
};
