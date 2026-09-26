import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

          {/* Desktop Auth/Actions */}
          <div className="hidden lg:flex items-center space-x-3.5">
            {user ? (
              <>
                <Link 
                  to={`/${user.role}/dashboard`} 
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors px-2 py-1.5"
                >
                  <LayoutDashboard size={17} className="text-blue-600" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-rose-600 px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-rose-300 hover:bg-rose-50 transition-all shadow-2xs"
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
          <div className="lg:hidden flex items-center">
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
                  to={`/${user.role}/dashboard`} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="flex items-center justify-center gap-2 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl py-2.5"
                >
                  <LayoutDashboard size={16} className="text-blue-600" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={onLogout}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-rose-600 border border-rose-200 bg-rose-50 rounded-xl py-2.5"
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
    </header>
  );
};
