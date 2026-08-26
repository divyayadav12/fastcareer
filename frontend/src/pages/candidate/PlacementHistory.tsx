import React from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { CheckCircle2, XCircle, Clock, Building2 } from 'lucide-react';

export const PlacementHistory = () => {
  const history = [
    {
      id: 1,
      company: "Google India",
      role: "Frontend Developer",
      date: "August 15, 2026",
      status: "Offer Accepted",
      package: "₹ 24,000,000 / yr"
    },
    {
      id: 2,
      company: "Microsoft",
      role: "React JS Developer",
      date: "July 22, 2026",
      status: "Interview Scheduled",
      package: "Not Disclosed"
    },
    {
      id: 3,
      company: "TCS",
      role: "UI Engineer",
      date: "June 10, 2026",
      status: "Rejected",
      package: "₹ 12,000,000 / yr"
    },
    {
      id: 4,
      company: "Amazon",
      role: "SDE I",
      date: "May 05, 2026",
      status: "Applied",
      package: "Not Disclosed"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Offer Accepted':
        return <CheckCircle2 size={20} className="text-green-500" />;
      case 'Rejected':
        return <XCircle size={20} className="text-red-500" />;
      default:
        return <Clock size={20} className="text-yellow-500" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch(status) {
      case 'Offer Accepted': return 'bg-green-50 border-green-100 text-green-700';
      case 'Rejected': return 'bg-red-50 border-red-100 text-red-700';
      default: return 'bg-yellow-50 border-yellow-100 text-yellow-700';
    }
  };

  return (
    <CandidateLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Placement History</h1>
        <p className="text-gray-500">Track your past job applications, interviews, and final offers.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Company & Role</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Date Applied</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Package / Salary</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <Building2 size={20} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.company}</p>
                        <p className="text-sm text-gray-500">{item.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {item.package}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusBg(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CandidateLayout>
  );
};
