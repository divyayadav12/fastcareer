import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Building2,
  Zap,
  TrendingUp,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { login, reset } from '../../store/authSlice';
import type { AppDispatch, RootState } from '../../store';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeRole, setActiveRole] = useState<'candidate' | 'employer'>('candidate');

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      if (user?.role === 'candidate') {
        navigate('/candidate/dashboard');
      } else if (user?.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    const userData = {
      email: email.trim(),
      password,
    };
    dispatch(login(userData));
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast(
      'To reset your password, please check your registered email or contact support@fastcareers.com',
      {
        icon: '🔑',
        duration: 5000,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/25 to-slate-100 flex flex-col justify-between pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full pt-1 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ─── LEFT COLUMN: Marketing & Value Proposition ─── */}
          <div className="lg:col-span-5 space-y-6 pt-1">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-blue-900 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              India's #1 CA & Finance Career Network
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-[1.2] tracking-tight">
              Land your dream role at{' '}
              <span className="text-blue-600">Big 4 & Global MNCs</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-sm leading-relaxed">
              Direct fast-track interviews for Qualified CAs, Semi-Qualified, and Articleship candidates. Get discovered by top partners.
            </p>

            {/* 3 Metrics Row */}
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200/80 p-4 shadow-sm grid grid-cols-3 divide-x divide-slate-100 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">25,000+</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">CAs Placed</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">98%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Call Rate</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">14.5 LPA</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Avg Package</div>
              </div>
            </div>

            {/* 3 Value Proposition Features */}
            <div className="space-y-3.5 pt-1">
              <div className="flex items-start gap-3.5 bg-white/70 p-3 rounded-xl border border-slate-100/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Exclusive Big 4 & MNC Roles</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Statutory Audit, Direct Tax, M&A Advisory, and FP&A suites
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white/70 p-3 rounded-xl border border-slate-100/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">3x Faster Shortlisting</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Verified ICAI registration badge directly prioritizes your CV
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white/70 p-3 rounded-xl border border-slate-100/80 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Salary Benchmark Analytics</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Insight on ₹18-35 LPA bands for 1st attempt & rank holders
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote Card */}
            <div className="bg-blue-50/70 border border-blue-100/80 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                alt="Priya Sharma"
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="flex text-amber-400 text-xs">
                    {'★★★★★'}
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    Rank 14
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-snug">
                  "Placed at EY within 12 days via verified match."
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Priya Sharma • Senior Associate, Assurance
                </p>
              </div>
            </div>

            {/* Hiring Partners Strip */}
            <div className="pt-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                500+ Top Hiring Partners Including:
              </div>
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs font-semibold text-slate-500">
                <span>Deloitte.</span>
                <span>PwC</span>
                <span>EY</span>
                <span>KPMG</span>
                <span>Grant Thornton</span>
                <span>BDO</span>
                <span className="text-blue-600 font-bold">+500 More</span>
              </div>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: High-Converting Login Card ─── */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8 w-full">
              
              {/* Card Header */}
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Sign in to your account
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                  Welcome back! Or{' '}
                  <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                    create a new account
                  </Link>
                </p>
              </div>

              {/* Role Switcher Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => setActiveRole('candidate')}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    activeRole === 'candidate'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <GraduationCap size={16} className={activeRole === 'candidate' ? 'text-blue-600' : 'text-slate-400'} />
                  <span>Candidate (CA / Finance)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRole('employer')}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    activeRole === 'employer'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Building2 size={16} className={activeRole === 'employer' ? 'text-blue-600' : 'text-slate-400'} />
                  <span>Employer / Recruiter</span>
                </button>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => toast('LinkedIn sign-in is coming soon!', { icon: 'ℹ️' })}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-blue-100 bg-blue-50/40 hover:bg-blue-50 text-[#0077b5] rounded-xl text-xs font-semibold transition-colors"
                >
                  <svg className="w-4 h-4 fill-[#0077b5]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span>Quick with LinkedIn</span>
                </button>
                <button
                  type="button"
                  onClick={() => toast('Google sign-in is coming soon!', { icon: 'ℹ️' })}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center mb-5">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium">or sign in with email</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                
                {/* Email input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder={activeRole === 'candidate' ? 'e.g. rahul@ca.org.in' : 'e.g. hr@company.com'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 font-medium">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Forgot your password?
                  </button>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all hover:shadow-slate-900/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Account</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>

                {/* Footer disclaimer */}
                <div className="pt-3 text-center space-y-2">
                  <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>256-bit encrypted secure session</span>
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    Don't have an account on Fast Careers?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                      Register free
                    </Link>
                  </p>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Page Footer ─── */}
      <footer className="max-w-7xl mx-auto w-full pt-8 pb-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2 font-bold text-slate-800 tracking-wider">
          <ShieldCheck size={18} className="text-blue-600" />
          <span>FAST CAREERS</span>
        </div>
        <p className="text-center sm:text-right text-[11px] text-slate-400">
          © {new Date().getFullYear()} Fast Careers Inc. Premier Chartered Accountant & Financial Leadership Network. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
