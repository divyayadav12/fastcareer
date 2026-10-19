import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, LogIn, GraduationCap, Sparkles, Building2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';
import { IndustrialTrainingModal } from '../components/IndustrialTrainingModal';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [industrialModalOpen, setIndustrialModalOpen] = useState(false);
  const [showIndustrialPopup, setShowIndustrialPopup] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Our Placement Result', path: '/placement-results' },
    { name: 'Our Team', path: '/team' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white border-b border-slate-200/90 ${
        isScrolled ? 'shadow-sm py-2.5' : 'py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="FAST CAREERS" className="h-10 sm:h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-sm font-semibold transition-all relative py-1 ${
                    isActive 
                      ? 'text-blue-600 font-bold' 
                      : 'text-slate-700 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth/Actions & Industrial Training Pop-up */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Industrial Training Logo & Button with Floating Pop-up Message near Login */}
            <div className="relative flex items-center">
              {showIndustrialPopup && (
                <div className="absolute -top-12 right-0 z-30 flex items-center">
                  <div 
                    onClick={() => setIndustrialModalOpen(true)}
                    className="cursor-pointer group flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full border border-amber-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap animate-bounce"
                    title="Click to open CA Industrial Training Form"
                  >
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span>If you have or want Industrial Training, please fill this form!</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowIndustrialPopup(false);
                    }}
                    className="ml-1 text-white/80 hover:text-white bg-slate-900/50 hover:bg-slate-900/80 rounded-full p-1 cursor-pointer transition-colors"
                    title="Dismiss"
                    aria-label="Dismiss message"
                  >
                    <X size={10} />
                  </button>
                  {/* Speech bubble pointer arrow */}
                  <div className="absolute -bottom-1 right-12 w-2 h-2 bg-amber-600 rotate-45 transform origin-center"></div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIndustrialModalOpen(true)}
                className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50/80 hover:from-blue-100 hover:to-indigo-100 px-3 py-1.5 rounded-xl border border-blue-200/90 hover:border-blue-400 transition-all shadow-xs hover:shadow-sm cursor-pointer group"
                title="CA Industrial Training Registration Form"
              >
                {/* Logo emblem */}
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <Building2 size={13} className="text-amber-300" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[11.5px] font-extrabold text-blue-950">Industrial Training</span>
                  <span className="text-[9.5px] font-bold text-blue-600 flex items-center gap-1">
                    Fill Form <span className="text-[8px] bg-amber-500 text-white font-black px-1 rounded">HOT</span>
                  </span>
                </div>
              </button>
            </div>

            {user ? (
              <>
                <Link 
                  to={user.role === 'candidate' ? '/candidate/openings' : `/${user.role}/dashboard`} 
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors px-2 py-1.5"
                >
                  <LayoutDashboard size={17} className="text-blue-600" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-rose-600 px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-rose-300 hover:bg-rose-50 transition-all shadow-2xs cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors px-2 py-1.5"
                >
                  <LayoutDashboard size={17} className="text-blue-600" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/login"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-blue-700 px-4 py-1.5 rounded-lg border border-slate-300 hover:border-blue-600 hover:bg-slate-50 transition-all shadow-2xs"
                >
                  <LogIn size={14} className="text-blue-600" />
                  <span>Login</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIndustrialModalOpen(true)}
              className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
            >
              <GraduationCap size={13} />
              <span>Training Form</span>
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl absolute w-full left-0 top-full flex flex-col px-5 py-5 space-y-3 z-50">
          
          {/* Mobile Industrial Training Highlight Box */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIndustrialModalOpen(true);
            }}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <GraduationCap size={16} />
              </div>
              <div className="text-left">
                <p className="font-extrabold text-blue-950">Industrial Training Form</p>
                <p className="text-[10px] text-blue-600 font-medium">Verified Registration for CA Students</p>
              </div>
            </div>
            <span className="bg-amber-400 text-blue-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase shadow-2xs">
              Fill Form →
            </span>
          </button>

          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="border-t border-slate-200 pt-3 flex flex-col space-y-2">
            {user ? (
              <>
                <Link 
                  to={user.role === 'candidate' ? '/candidate/openings' : `/${user.role}/dashboard`} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-center gap-2 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl py-2.5"
                >
                  <LayoutDashboard size={16} className="text-blue-600" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={onLogout}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-rose-600 border border-rose-200 bg-rose-50 rounded-xl py-2.5 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-2.5 shadow-sm"
                >
                  <LogIn size={16} />
                  <span>Login / Dashboard</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Industrial Training Form Modal */}
      <IndustrialTrainingModal 
        isOpen={industrialModalOpen} 
        onClose={() => setIndustrialModalOpen(false)} 
      />
    </header>
  );
};
