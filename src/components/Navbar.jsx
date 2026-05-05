import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Settings, LogOut, Menu, X, ChevronDown, 
  UserPlus, Building2, Shield, CreditCard, Briefcase,
  Home, FileText, LayoutDashboard, PlusCircle 
} from 'lucide-react';
import logo from '../assets/RozgarDo_Logo.png';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (signupModalOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        setSignupModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [signupModalOpen]);

  // Close menus on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    setSignupModalOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Logged In Links
  const getNavLinks = () => {
    if (!user) return [];
    if (user.role === 'employee') {
      return [
        { to: '/', label: 'Home', icon: Home },
        { to: '/all-jobs', label: 'All Jobs', icon: Briefcase },
        { to: '/applications', label: 'My Applications', icon: FileText },
      ];
    } else if (user.role === 'employer') {
      return [
        { to: '/employer', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/employer/post-job', label: 'Post Job', icon: PlusCircle },
      ];
    } else if (user.role === 'admin') {
      return [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard }];
    }
    return [];
  };

  // Guest Links
  const guestLinks = [
    // { to: '/employee-registration', label: 'Find Jobs' },
    // { to: '/employer-registration', label: 'For Employers' },
    // // { to: '/how-it-works', label: 'How It Works' },
    // // { to: '/resources', label: 'Resources' },
    // { to: '/contact', label: 'Contact Us' },
  ];

  const handleSignupAs = (role) => {
    setSignupModalOpen(false);
    if (role === 'employee') {
      navigate('/employee-registration');
    } else if (role === 'employer') {
      navigate('/employer-registration');
    }
  };

  const getRoleLabel = () => {
    if (!user) return '';
    if (user.role === 'employee') return 'Job Seeker';
    if (user.role === 'employer') return 'Employer';
    if (user.role === 'admin') return 'Administrator';
    return user.role;
  };

  return (
    <>
      <nav className="sticky top-0 z-100 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-[72px] px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="RozgarDo" className="h-[52px] w-auto" />
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden lg:flex items-center gap-8">
            {!user
              ? guestLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-semibold transition-colors ${
                      isActive(link.to)
                        ? 'text-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))
              : getNavLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-semibold transition-colors ${
                      isActive(link.to)
                        ? 'text-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {/* Desktop Auth Buttons (hidden on mobile) */}
            <div className="hidden lg:block">
              {/* {!user ? (
                <div className="flex items-center gap-5">
                  <Link
                    to="/login"
                    className="font-bold text-gray-800 text-sm hover:text-indigo-600 transition"
                  >
                    Log in
                  </Link>
                  <button
                    onClick={() => setSignupModalOpen(true)}
                    className="bg-indigo-600 text-white font-semibold text-sm px-5 py-2 rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
                  >
                    Sign up
                  </button>
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition ${
                      profileDropdownOpen
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                      {(user.name || user.phone || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {user.name || user.phone}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${
                        profileDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-xl z-50 animate-[dropdownFade_150ms_ease-out]">
                      <div className="flex items-center gap-3 p-3 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-bold">
                          {(user.name || user.phone || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-gray-900 truncate">
                            {user.name || user.phone}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {getRoleLabel()}
                          </div>
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        <User size={16} className="text-gray-500" /> My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Settings size={16} className="text-gray-500" /> Settings
                      </Link>
                      <Link
                        to="/security"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Shield size={16} className="text-gray-500" /> Security
                      </Link>
                      <Link
                        to="/billing"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        <CreditCard size={16} className="text-gray-500" /> Billing Plan
                      </Link>

                      <div className="h-px bg-gray-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )} */}
            </div>

            {/* Mobile Menu Toggle */}
            {/* <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="block lg:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button> */}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-gray-200 shadow-md p-6 flex flex-col gap-3 z-50">
            {!user ? (
              <>
                {guestLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2 text-sm font-medium border-b border-gray-100 ${
                      isActive(link.to) ? 'text-indigo-600' : 'text-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-gray-200 my-1" />
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 font-semibold text-indigo-600"
                >
                  Log in
                </Link>
                <button
                  onClick={() => {
                    setSignupModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 font-semibold text-indigo-600"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                {getNavLinks().map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 py-2 text-sm font-medium border-b border-gray-100 ${
                      isActive(link.to) ? 'text-indigo-600' : 'text-gray-700'
                    }`}
                  >
                    {React.createElement(link.icon, {
                      size: 18,
                      className: isActive(link.to) ? 'text-indigo-600' : 'text-gray-400',
                    })}
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-gray-200 my-1" />
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-medium text-gray-700"
                >
                  <User size={18} className="text-gray-400" /> My Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-medium text-gray-700"
                >
                  <Settings size={18} className="text-gray-400" /> Settings
                </Link>
                <Link
                  to="/security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-medium text-gray-700"
                >
                  <Shield size={18} className="text-gray-400" /> Security
                </Link>
                <Link
                  to="/billing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-medium text-gray-700"
                >
                  <CreditCard size={18} className="text-gray-400" /> Billing Plan
                </Link>
                <div className="h-px bg-gray-200 my-1" />
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 py-2 text-sm font-medium text-red-600"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Signup Modal */}
      {signupModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl max-w-md w-[90%] p-8 text-center shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join RozgarDo</h2>
            <p className="text-gray-500 mb-8">Choose how you want to get started</p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleSignupAs('employee')}
                className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition w-full text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <UserPlus size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">I&apos;m a Job Seeker</div>
                  <div className="text-xs text-gray-500">Find jobs, apply instantly</div>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button
                onClick={() => handleSignupAs('employer')}
                className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition w-full text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Building2 size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">I&apos;m an Employer</div>
                  <div className="text-xs text-gray-500">Post jobs, hire talent</div>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>

            <button
              onClick={() => setSignupModalOpen(false)}
              className="mt-6 text-sm text-gray-500 underline hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Animation keyframes for dropdown */}
      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

export default Navbar;