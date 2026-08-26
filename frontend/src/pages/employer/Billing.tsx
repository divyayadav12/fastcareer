import React from 'react';
import { EmployerLayout } from '../../layouts/EmployerLayout';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { Button } from '../../components/Button';

export const EmployerBilling = () => {
  return (
    <EmployerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Billing & Plans</h1>
        <p className="text-gray-500">Manage your subscription and billing details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Current Plan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-text">Current Plan</h2>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Active</span>
          </div>
          
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-primary mb-1">Free Trial</h3>
            <p className="text-gray-500 text-sm">Expires in 14 days</p>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle2 size={16} className="text-green-500" /> 5 Active Job Posts
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle2 size={16} className="text-green-500" /> Unlimited Candidate Searches
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle2 size={16} className="text-green-500" /> Basic Company Profile
            </li>
          </ul>

          <Button className="w-full">Upgrade Plan</Button>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-text">Payment Method</h2>
          </div>
          
          <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                <CreditCard className="text-gray-500" size={20} />
              </div>
              <div>
                <p className="font-medium text-text text-sm">No payment method added</p>
                <p className="text-xs text-gray-500">Add a card for uninterrupted service</p>
              </div>
            </div>
          </div>
          
          <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
            + Add Payment Method
          </button>
        </div>
      </div>
    </EmployerLayout>
  );
};
