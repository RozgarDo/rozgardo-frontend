import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, UserCircle, LogOut, Menu, X, User, Settings, ChevronDown, UserPlus, Building2 } from 'lucide-react';
import logo from '../assets/RozgarDo_Logo.png';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  // Close dropdown when clicking outside
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
        { to: '/', label: 'Home' },
        { to: '/all-jobs', label: 'All Jobs' },
        { to: '/applications', label: 'My Applications' },
      ];
    } else if (user.role === 'employer') {
      return [{ to: '/employer', label: 'Dashboard' }];
    }
    return [];
  };

  // Logged Out (Guest) Links
  const guestLinks = [
    { to: '/all-jobs', label: 'Find Jobs' },
    { to: '/for-employers', label: 'For Employers' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/resources', label: 'Resources' },
    { to: '/about', label: 'About Us' },
  ];

  const navLinkStyle = (path) => ({
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: isActive(path) ? '#4F46E5' : '#374151',
    transition: 'color 0.2s',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  // Handle signup selection
  const handleSignupAs = (role) => {
    setSignupModalOpen(false);
    if (role === 'employee') {
      navigate('/employee-registration');
    } else if (role === 'employer') {
      navigate('/employer-registration');
    }
  };

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #F1F5F9',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          height: '72px', padding: '0 1.5rem',
        }}>

          {/* LOGO */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="RozgarDo" style={{ height: '52px', width: 'auto' }} />
          </Link>

          {/* CENTER LINKS */}
          {/* <div className="navbar-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {!user ? (
              guestLinks.map(link => (
                <Link key={link.to} to={link.to} style={navLinkStyle(link.to)}>
                  {link.label}
                </Link>
              ))
            ) : (
              getNavLinks().map(link => (
                <Link key={link.to} to={link.to} style={navLinkStyle(link.to)}>
                  {link.label}
                </Link>
              ))
            )}
          </div> */}

          {/* RIGHT SIDE */}
          {/* <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {!user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <Link to="/login" style={{ 
                  textDecoration: 'none', fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' 
                }}>
                  Log in
                </Link>
                <button
                  onClick={() => setSignupModalOpen(true)}
                  style={{ 
                    textDecoration: 'none', fontWeight: 600, color: 'white', fontSize: '0.85rem',
                    background: '#4F46E5', padding: '0.6rem 1.4rem', borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)', border: 'none', cursor: 'pointer'
                  }}
                >
                  Sign up
                </button>
              </div>
            ) : (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: '#F8FAFC', padding: '0.35rem 0.75rem 0.35rem 0.4rem',
                    borderRadius: '9999px', border: '1px solid #E2E8F0', cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: '#4F46E5', color: 'white', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem',
                  }}>
                    {(user.name || user.phone || 'U').charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} color="#64748B" />
                </button>

                {profileDropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
                    width: '200px', background: 'white', borderRadius: '0.75rem',
                    border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    padding: '0.5rem', zIndex: 200
                  }}>
                    <button onClick={handleLogout} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.6rem', color: '#DC2626', background: 'none', border: 'none',
                      fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                    }}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div> */}
        </div>

        <style>{`
          @media (max-width: 992px) {
            .navbar-desktop-links { display: none !important; }
            .navbar-mobile-toggle { display: block !important; }
          }
        `}</style>
      </nav>

      {/* SIGNUP MODAL */}
      {signupModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div ref={modalRef} style={{
            background: 'white', borderRadius: '1.5rem', maxWidth: '400px', width: '90%',
            padding: '2rem', textAlign: 'center', boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1E293B' }}>
              Join RozgarDo
            </h2>
            <p style={{ color: '#64748B', marginBottom: '2rem' }}>
              Choose how you want to get started
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={() => handleSignupAs('employee')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem',
                  background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '1rem',
                  cursor: 'pointer', transition: 'all 0.2s', width: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#F8FAFC'}
              >
                <div style={{
                  background: '#4F46E5', width: '48px', height: '48px', borderRadius: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <UserPlus size={24} color="white" />
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1E293B' }}>I'm a Job Seeker</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Find jobs, apply instantly</div>
                </div>
                <span style={{ color: '#94A3B8' }}>→</span>
              </button>

              <button
                onClick={() => handleSignupAs('employer')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem',
                  background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '1rem',
                  cursor: 'pointer', transition: 'all 0.2s', width: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#F8FAFC'}
              >
                <div style={{
                  background: '#059669', width: '48px', height: '48px', borderRadius: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Building2 size={24} color="white" />
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1E293B' }}>I'm an Employer</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Post jobs, hire talent</div>
                </div>
                <span style={{ color: '#94A3B8' }}>→</span>
              </button>
            </div>

            <button
              onClick={() => setSignupModalOpen(false)}
              style={{
                marginTop: '1.5rem', background: 'none', border: 'none', color: '#64748B',
                cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;