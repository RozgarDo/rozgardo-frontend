import React, { useState, useEffect } from 'react';
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
import Contact from './pages/Contact';
import EmployeeRegistration from './pages/employee/employee_registration';
import EmployerRegistration from './pages/employer/employer_registration';

import EmployeeLogin from './pages/employee/employee_login';
import EmployerLogin from './pages/employer/employer_login';

import TrustedEmployers from './pages/legal/TrustedEmployeers';

function AppContent({ user, handleLogin, handleLogout }) {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar – sticky at top while scrolling, no layout shift */}
      {!hideNavbar && (
        <div className="sticky top-0 z-20">
          <Navbar user={user} onLogout={handleLogout} />
        </div>
      )}

      {/* Main content – grows to push footer down */}
      <main className="flex-1">
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
          
          <Route path="/employee-login" element={user ? <Navigate to="/" replace /> : <EmployeeLogin onLogin={handleLogin} />} />
          <Route path="/employer-login" element={user ? <Navigate to="/" replace /> : <EmployerLogin onLogin={handleLogin} />} />

          <Route path="/trusted-employers" element={<TrustedEmployers />} />

          <Route path="/home" element={user?.role === 'employee' ? <EmployeeHome user={user} /> : <Navigate to="/login" />} />
          <Route path="/jobs/:id" element={<JobDetails user={user} />} />
          <Route path="/applications" element={<Applications user={user} />} />
          <Route path="/all-jobs" element={<AllJobs user={user} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile user={user} setUser={handleLogin} />} />
          <Route path="/profile-setup" element={<Profile user={user} setUser={handleLogin} />} />
          <Route path="/settings" element={<Settings user={user} />} />

          <Route path="/employer" element={user?.role === 'employer' ? <EmployerDashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/employer/post-job" element={user?.role === 'employer' ? <PostJob user={user} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />} />


          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
        <Footer />
      </main>
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