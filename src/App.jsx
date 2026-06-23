import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

import EmployeeHome from './pages/employee/Home';

import JobDetails from './pages/employee/JobDetails';
import Applications from './pages/employee/Applications';
import AllJobs from './pages/employee/AllJobs';
import EmployerDashboard from './pages/employer/Dashboard';
import PostJob from './pages/employer/PostJob';
import AdminDashboard from './pages/admin/Dashboard';
import Landing from './pages/legal/Landing';

import Onboarding from './pages/onboarding/Onboarding';
import Registration from './pages/registration/Registration';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Contact from './pages/legal/Contact';
import EmployeeRegistration from './pages/employee/employee_registration';
import EmployerRegistration from './pages/employer/employer_registration';

import EmployeeLogin from './pages/employee/employee_login';
import EmployerLogin from './pages/employer/employer_login';
import AdminLogin from './pages/admin/AdminLogin';

import TrustedEmployers from './pages/legal/TrustedEmployeers';


import EmployeeProfile from './pages/employee/EmployeeProfile';
import EmployerProfile from './pages/employer/EmployerProfile';

import ConnectEmployees from './pages/employer/ConnectEmployees';

import EmployeeSettings from './pages/employee/EmployeeSettings';
import EmployerSettings from './pages/employer/EmployerSettings';
import AdminSettings from './pages/admin/AdminSettings';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const PrivateRoute = ({ children, user, requiredRole }) => {
  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent({ user, setUser, handleLogin, handleLogout }) {
  const location = useLocation();
  // const hideNavbar = location.pathname === '/login';////////////////////////Check

  return (
    <div className="flex flex-col min-h-screen">
      {/* {!hideNavbar && ( */}
        <div className="sticky top-0 z-20">
          <Navbar user={user} onLogout={handleLogout} />
        </div>
      {/* )} */}

      {/* Main content – grows to push footer down */}
      <main className="flex-1">
        <Routes>
          <Route 
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
          />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/trusted-employers" element={<TrustedEmployers />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/employee-registration" element={<EmployeeRegistration />} />
          <Route path="/employer-registration" element={<EmployerRegistration />} />
          <Route path="/employee-profile" element={<EmployeeProfile user={user} setUser={setUser} />} />
          <Route path="/employer-profile" element={<EmployerProfile user={user} setUser={setUser} />} />

          <Route
            path="/employer/connect-employees"
            element={
              user === undefined ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : user?.role === 'employer' ? (
                <ConnectEmployees user={user} />
              ) : (
                <Navigate to="/employer-login" replace />
              )
            }
          />
          
          <Route path="/employee-login" element={user ? <Navigate to="/" replace /> : <EmployeeLogin onLogin={handleLogin} />} />
          <Route path="/employer-login" element={user ? <Navigate to="/" replace /> : <EmployerLogin onLogin={handleLogin} />} />

          <Route 
            path="/jobs/:id" 
            element={
              user?.role === 'employee' ? (
                <JobDetails user={user} />
              ) : (
                <Navigate to="/employee-login" replace />
              )
            } 
          />
          <Route 
            path="/applications" 
            element={
              user?.role === 'employee' ? (
                <Applications user={user} />
              ) : (
                <Navigate to="/employee-login" replace />
              )
            } 
          />
          <Route 
            path="/all-jobs" 
            element={
              user?.role === 'employee' ? (
                <AllJobs user={user} />
              ) : (
                <Navigate to="/employee-login" replace />
              )
            } 
          />

          <Route path="/employer" element={user?.role === 'employer' ? <EmployerDashboard user={user} /> : <Navigate to="/employer-login" />} />
          <Route path="/employer/post-job" element={user?.role === 'employer' ? <PostJob user={user} /> : <Navigate to="/" />} />
          
          <Route path="/admin/login"  element={<AdminLogin onLogin={handleLogin} user={user} />} />

          <Route
            path="/admin"
            element={
              user?.role === 'admin' ? (
                <AdminDashboard user={user} />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />

          <Route path="*" element={<Navigate to="/onboarding" replace />} />

          <Route
            path="/employee-settings"
            element={
              user?.role === 'employee' ? (
                <EmployeeSettings user={user} setUser={setUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/employer-settings"
            element={
              user?.role === 'employer' ? (
                <EmployerSettings user={user} setUser={setUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/admin-settings"
            element={
              <PrivateRoute user={user} requiredRole="admin">
                <AdminSettings user={user} setUser={setUser} />
              </PrivateRoute>
            }
          />

        </Routes>
        <Footer />
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Token validation function (new)
  const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // No token – clear any stale user data
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        console.warn('🔐 Token invalid – logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } else if (res.ok) {
        // Token is valid – keep the existing user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        // Other error – treat as invalid
        console.error('Token validation error:', await res.text());
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (err) {
      console.error('Network error during token validation:', err);
      // Don't clear on network error – might be temporary
      // Keep existing user and token
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    // First, load user from localStorage quickly
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
        localStorage.removeItem('user');
      }
    }
    // Then validate the token asynchronously
    validateToken();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Token is already stored by the login component
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // ✅ Also clear token
  };

  // ✅ Show loading spinner during token validation
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <AppContent
        user={user}
        setUser={setUser}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    </Router>
  );
}

export default App;