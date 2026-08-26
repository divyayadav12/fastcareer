import React from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

export const ImpDownloads = () => {
  const documents = [
    { id: 1, name: "Interview Preparation Guide", desc: "Top 50 frequently asked questions and how to answer them.", type: "PDF", size: "2.4 MB" },
    { id: 2, name: "Salary Negotiation Tips", desc: "Proven strategies to negotiate the best compensation package.", type: "PDF", size: "1.1 MB" },
    { id: 3, name: "LinkedIn Profile Optimization", desc: "Step-by-step guide to make your profile stand out to recruiters.", type: "PDF", size: "3.5 MB" },
    { id: 4, name: "Career Transition Blueprint", desc: "How to successfully switch industries or domains.", type: "PDF", size: "4.2 MB" },
  ];

  return (
    <CandidateLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Important Downloads</h1>
        <p className="text-gray-500">Access exclusive guides and materials to accelerate your career growth.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 text-red-500 rounded-xl shrink-0 mt-1">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-text mb-1">{doc.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{doc.desc}</p>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  {doc.type} • {doc.size}
                </span>
              </div>
            </div>
            <button className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors shrink-0">
              <Download size={20} />
            </button>
          </div>
        ))}
      </div>
    </CandidateLayout>
  );
};
