import React, { useState, useEffect } from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { Database, Download, Star, Briefcase, RefreshCw, MessageSquareQuote } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export const PlatformData = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'feedbacks' | 'referrals' | 'jobchanges' | 'sharedjobs'>('feedbacks');
  
  const [data, setData] = useState({
    feedbacks: [],
    referrals: [],
    jobchanges: [],
    sharedjobs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${user?.token}` };
        
        const [fbRes, refRes, jcRes, sjRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/candidate/feedback`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/candidate/referrals`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/candidate/job-change`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shared-jobs`, { headers })
        ]);

        setData({
          feedbacks: fbRes.data,
          referrals: refRes.data,
          jobchanges: jcRes.data,
          sharedjobs: sjRes.data
        });
      } catch (error) {
        console.error('Failed to fetch platform data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.token]);

  const tabs = [
    { id: 'feedbacks', label: 'Feedbacks', icon: <MessageSquareQuote size={18} /> },
    { id: 'referrals', label: 'Referrals', icon: <Database size={18} /> },
    { id: 'jobchanges', label: 'Job Change Requests', icon: <RefreshCw size={18} /> },
    { id: 'sharedjobs', label: 'Shared Jobs', icon: <Briefcase size={18} /> },
  ];

  return (
    <EmployerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Platform Submissions (Admin)</h1>
        <p className="text-gray-500">View and manage all data submitted by candidates across the platform.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? 'border-primary text-primary bg-blue-50/50' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon} {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {data[tab.id as keyof typeof data]?.length || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading data...</div>
          ) : (
            <div className="overflow-x-auto">
              
              {/* Feedbacks Table */}
              {activeTab === 'feedbacks' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm">
                      <th className="p-4 font-semibold border-b">Candidate</th>
                      <th className="p-4 font-semibold border-b">Rating</th>
                      <th className="p-4 font-semibold border-b w-1/2">Message</th>
                      <th className="p-4 font-semibold border-b">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.feedbacks.map((fb: any) => (
                      <tr key={fb._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-text">{fb.submittedBy?.firstName} {fb.submittedBy?.lastName}</div>
                          <div className="text-xs text-gray-500">{fb.submittedBy?.email}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < fb.rating ? 'fill-current' : 'text-gray-300'} />
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-700">{fb.message}</td>
                        <td className="p-4 text-sm text-gray-500">{new Date(fb.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {data.feedbacks.length === 0 && (
                      <tr><td colSpan={4} className="text-center py-8 text-gray-500">No feedbacks found.</td></tr>
                    )}
                  </tbody>
                </table>
              )}

              {/* Referrals Table */}
              {activeTab === 'referrals' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm">
                      <th className="p-4 font-semibold border-b">Referred By</th>
                      <th className="p-4 font-semibold border-b">Friend Details</th>
                      <th className="p-4 font-semibold border-b">Status</th>
                      <th className="p-4 font-semibold border-b">Resume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.referrals.map((ref: any) => (
                      <tr key={ref._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-text">{ref.referredBy?.firstName} {ref.referredBy?.lastName}</div>
                          <div className="text-xs text-gray-500">{ref.referredBy?.email}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-text">{ref.friendName}</div>
                          <div className="text-xs text-gray-500">{ref.friendEmail} • {ref.friendPhone}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            {ref.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {ref.resumeUrl ? (
                            <a href={ref.resumeUrl.startsWith('http') ? ref.resumeUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${ref.resumeUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium">
                              <Download size={14} /> Download
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {data.referrals.length === 0 && (
                      <tr><td colSpan={4} className="text-center py-8 text-gray-500">No referrals found.</td></tr>
                    )}
                  </tbody>
                </table>
              )}

              {/* Job Changes Table */}
              {activeTab === 'jobchanges' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm">
                      <th className="p-4 font-semibold border-b">Candidate</th>
                      <th className="p-4 font-semibold border-b">Current Role</th>
                      <th className="p-4 font-semibold border-b">CTC (Cur -&gt; Exp)</th>
                      <th className="p-4 font-semibold border-b">Notice Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.jobchanges.map((jc: any) => (
                      <tr key={jc._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-text">{jc.requestedBy?.firstName} {jc.requestedBy?.lastName}</div>
                          <div className="text-xs text-gray-500">{jc.requestedBy?.email}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-text">{jc.currentDesignation}</div>
                          <div className="text-xs text-gray-500">@ {jc.currentCompany}</div>
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {jc.currentCTC}L <span className="text-gray-400 mx-1">➔</span> {jc.expectedCTC}L
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {jc.noticePeriod}
                        </td>
                      </tr>
                    ))}
                    {data.jobchanges.length === 0 && (
                      <tr><td colSpan={4} className="text-center py-8 text-gray-500">No job change requests found.</td></tr>
                    )}
                  </tbody>
                </table>
              )}

              {/* Shared Jobs Table */}
              {activeTab === 'sharedjobs' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm">
                      <th className="p-4 font-semibold border-b">Company & Role</th>
                      <th className="p-4 font-semibold border-b">Location</th>
                      <th className="p-4 font-semibold border-b">Contact Info</th>
                      <th className="p-4 font-semibold border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.sharedjobs.map((sj: any) => (
                      <tr key={sj._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-text">{sj.companyName}</div>
                          <div className="text-xs text-gray-500">{sj.industry}</div>
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {sj.location}, {sj.region}
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium text-text">{sj.concernedPerson}</div>
                          <div className="text-xs text-gray-500">{sj.emailId} • {sj.mobileNo}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {sj.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {data.sharedjobs.length === 0 && (
                      <tr><td colSpan={4} className="text-center py-8 text-gray-500">No shared jobs found.</td></tr>
                    )}
                  </tbody>
                </table>
              )}

            </div>
          )}
        </div>
      </div>
    </EmployerLayout>
  );
};
