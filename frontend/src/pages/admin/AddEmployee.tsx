import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { UserCheck, Mail, Lock, User, PlusCircle, Search, Trash2, Phone, Briefcase, ShieldAlert, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

export const AddEmployee = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'Employee@123',
    phone: '',
    designation: 'Staff / Recruiter'
  });

  // Guard: Redirect employees if they try to access employee management
  useEffect(() => {
    if (user && user.role === 'employee') {
      toast.error('Employee accounts do not have permission to manage employees.');
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const fetchEmployees = async () => {
    try {
      setFetching(true);
      const res = await api.get('/users/employees');
      setEmployees(res.data || []);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchEmployees();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.password) {
      toast.error('Please fill in First Name, Email, and Password.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users/employees', formData);
      toast.success(`Employee account for "${formData.firstName}" created successfully!`);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: 'Employee@123',
        phone: '',
        designation: 'Staff / Recruiter'
      });
      setIsModalOpen(false);
      fetchEmployees();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register employee');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove employee "${name}"?`)) return;

    try {
      await api.delete(`/users/employees/${id}`);
      toast.success(`Employee account "${name}" deleted.`);
      fetchEmployees();
    } catch (err: any) {
      toast.error('Failed to delete employee account.');
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const email = (emp.email || '').toLowerCase();
    const desig = (emp.headline || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return fullName.includes(q) || email.includes(q) || desig.includes(q);
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="text-indigo-600" /> Manage Employees
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Register and manage internal staff accounts. Employees can view candidate databases and results, but cannot register new companies or employees.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          <PlusCircle size={18} /> Register New Employee
        </button>
      </div>

      {/* Employees List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-700">Internal Employee Roster</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee Name</th>
                <th className="px-6 py-4 font-semibold">Designation / Role</th>
                <th className="px-6 py-4 font-semibold">Login Email</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fetching ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Loading registered employees...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <UserCheck className="mx-auto text-slate-300 mb-2" size={32} />
                    No internal employees registered yet. Click "Register New Employee" to create an employee account.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                        {(emp.firstName || 'E').charAt(0)}
                      </div>
                      <div>
                        <div>{emp.firstName} {emp.lastName || ''}</div>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded border border-indigo-100 mt-0.5">
                          Employee Account
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{emp.headline || 'Staff Member'}</td>
                    <td className="px-6 py-4 text-slate-700">{emp.email}</td>
                    <td className="px-6 py-4 text-slate-500">{emp.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(emp._id, `${emp.firstName} ${emp.lastName || ''}`.trim())}
                        className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <UserCheck className="text-indigo-600" size={20} /> Register New Employee
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="pl-9 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Login Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="employee@fastcareers.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-9 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-9 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-9 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Designation / Role Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="e.g. Senior Recruiter / Operations Lead"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="pl-9 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-xs text-indigo-700">
                💡 <strong>Permissions:</strong> This employee will be able to view candidate databases, download resumes, view placement/test results, manage jobs, and view shared applications. They will <strong>NOT</strong> have access to register new companies or employees.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Creating...' : 'Create Employee Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
