import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, UserCircle, LogOut, Menu, X, User, Settings, ChevronDown } from 'lucide-react';
import logo from '../assets/RozgarDo_Logo.png';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Logged Out (Guest) Links from your screenshot
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

  return (
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

        {/* CENTER LINKS (Conditional) */}
        {/* <div className="navbar-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {!user ? (
            // Links shown only when Logged Out
            guestLinks.map(link => (
              <Link key={link.to} to={link.to} style={navLinkStyle(link.to)}>
                {link.label}
              </Link>
            ))
          ) : (
            // Links shown only when Logged In
            getNavLinks().map(link => (
              <Link key={link.to} to={link.to} style={navLinkStyle(link.to)}>
                {link.label}
              </Link>
            ))
          )}
        </div> */}

        {/* RIGHT SIDE (Profile or Auth Buttons) */}
        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {!user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Link to="/login" style={{ 
                textDecoration: 'none', fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' 
              }}>
                Log in
              </Link>
              <Link to="/register" style={{ 
                textDecoration: 'none', fontWeight: 600, color: 'white', fontSize: '0.85rem',
                background: '#4F46E5', padding: '0.6rem 1.4rem', borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
              }}>
                Sign up
              </Link>
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
  );
};

export default Navbar;