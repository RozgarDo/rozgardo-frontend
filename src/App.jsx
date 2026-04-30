import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import EmployeeHome from './pages/employee/Home';
import Profile from './pages/Profile';
import JobDetails from './pages/employee/JobDetails';
import Applications from './pages/employee/Applications';
import AllJobs from './pages/employee/AllJobs';
import EmployerDashboard from './pages/employer/Dashboard';
import PostJob from './pages/employer/PostJob';
import AdminDashboard from './pages/admin/Dashboard';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import Onboarding from './pages/onboarding/Onboarding';
import Registration from './pages/registration/Registration';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';

import EmployeeRegistration from './pages/employee/employee_registration';
import EmployerRegistration from './pages/employer/employer_registration';



// Custom hook for natural overscroll bounce
const useElasticOverscroll = () => {
  const [offsetY, setOffsetY] = useState(0);
  const lastScrollY = useRef(0);
  const isAnimating = useRef(false);
  const animationFrame = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (animationFrame.current) return;
      animationFrame.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const isAtTop = currentScrollY <= 0;
        const isAtBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 2;
        const scrollDelta = currentScrollY - lastScrollY.current;

        // Trigger only when overscrolling (trying to go beyond limits)
        if (!isAnimating.current) {
          if (isAtTop && scrollDelta < -3) {
            // Overscroll at top – pull content down
            isAnimating.current = true;
            setOffsetY(24);
            setTimeout(() => {
              setOffsetY(0);
              setTimeout(() => { isAnimating.current = false; }, 200);
            }, 180);
          } else if (isAtBottom && scrollDelta > 3) {
            // Overscroll at bottom – pull content up
            isAnimating.current = true;
            setOffsetY(-24);
            setTimeout(() => {
              setOffsetY(0);
              setTimeout(() => { isAnimating.current = false; }, 200);
            }, 180);
          }
        }

        lastScrollY.current = currentScrollY;
        animationFrame.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return offsetY;
};

function AppContent({ user, handleLogin, handleLogout }) {
  const location = useLocation();
  const hideNavbar = ['/login'].includes(location.pathname);
  const bounceY = useElasticOverscroll();

  // Smooth transition with natural easing
  const contentStyle = {
    transform: `translateY(${bounceY}px)`,
    transition: 'transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    willChange: 'transform',
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Navbar */}
      {!hideNavbar && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar user={user} onLogout={handleLogout} />
        </div>
      )}

      {/* Spacer to prevent content from hiding under navbar (adjust height to your navbar's actual height) */}
      {!hideNavbar && <div className="h-16 md:h-20" />}

      {/* Scrollable content wrapper with elastic bounce */}
      <div style={contentStyle}>
        <Routes>
          {/* <Route 
            path="/" 
            element={
              !user ? (
                <Landing />
              ) : user.role === 'employer' ? (
                <Navigate to="/employer" replace />
              ) : user.role === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <EmployeeHome user={user} />
              )
            } 
          /> */}
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/employee-registration" element={<EmployeeRegistration />} />
          <Route path="/employer-registration" element={<EmployerRegistration />} />
          <Route path="/home" element={user?.role === 'employee' ? <EmployeeHome user={user} /> : <Navigate to="/login" />} />
          <Route path="/jobs/:id" element={<JobDetails user={user} />} />
          <Route path="/applications" element={<Applications user={user} />} />
          <Route path="/all-jobs" element={<AllJobs user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={handleLogin} />} />
          <Route path="/profile-setup" element={<Profile user={user} setUser={handleLogin} />} />
          <Route path="/settings" element={<Settings user={user} />} />
          <Route path="/employer" element={user?.role === 'employer' ? <EmployerDashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/employer/post-job" element={user?.role === 'employer' ? <PostJob user={user} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) return null;

  return (
    <Router>
      <ScrollToTop />
      <AppContent user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
    </Router>
  );
}

export default App;