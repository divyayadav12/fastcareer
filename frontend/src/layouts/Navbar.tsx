import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    { name: 'Services', path: '/services' },
    { name: 'Expertise', path: '/expertise' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Employers', path: '/employers' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-200 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="FAST CAREERS" className="h-12 md:h-16" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="text-text hover:text-primary transition-colors font-medium text-sm"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth/Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to={`/${user.role}/dashboard`} className="text-sm font-medium text-text hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-text hover:text-primary transition-colors">
                  Login
                </Link>
                <Button variant="primary" size="sm">Find a Job</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 top-full flex flex-col px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-text hover:text-primary font-medium px-2 py-1"
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-4 flex flex-col space-y-3 px-2">
            {user ? (
              <>
                <Link to={`/${user.role}/dashboard`} onClick={() => setMobileMenuOpen(false)} className="text-text font-medium text-center border rounded-md py-2">
                  Dashboard
                </Link>
                <Button variant="outline" className="w-full" onClick={onLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-text font-medium text-center border rounded-md py-2">
                  Login
                </Link>
                <Button variant="primary" className="w-full">Find a Job</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
