import React from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { PlusCircle, Briefcase } from 'lucide-react';
import { Button } from '../../components/Button';

export const ManageJobs = () => {
  return (
    <EmployerLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-text">Manage Jobs</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle size={18} /> Post a New Job
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase size={32} />
        </div>
        <h2 className="text-lg font-bold text-text mb-2">No jobs posted yet</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-6">You haven't posted any jobs. Start posting jobs to find the right candidates for your company.</p>
        <Button>Post Your First Job</Button>
      </div>
    </EmployerLayout>
  );
};
