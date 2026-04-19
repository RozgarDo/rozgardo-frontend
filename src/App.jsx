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
import TestPage from './pages/TestPage';
import Settings from './pages/Settings';
import Onboarding from './pages/onboarding/Onboarding';
import Registration from './pages/registration/Registration';  // <-- new import
import ScrollToTop from './components/ScrollToTop';

function AppContent({ user, handleLogin, handleLogout }) {
  const location = useLocation();

  useEffect(() => {
    const hostname = window.location.hostname;
    const isProduction = hostname.includes('vercel.app') || hostname.includes('rozgardo.com');
    if (isProduction && location.pathname !== "/onboarding") {
      window.location.replace("/onboarding");
    }
  }, [location]);

  // Navbar is shown on all routes except login (if you want)
  const hideNavbar = location.pathname === '/login';
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar user={user} onLogout={handleLogout} />}
      <main className="main-content">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/register" element={<Registration />} />   {/* new route */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path="/home" element={<Landing user={user} />} />
          <Route path="/" element={user?.role === 'admin' ? <Navigate to="/admin" /> : <Landing user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={handleLogin} />} />
          <Route path="/profile-setup" element={<Profile user={user} setUser={handleLogin} />} />
          <Route path="/settings" element={<Settings user={user} />} />
          <Route path="/jobs/:id" element={<JobDetails user={user} />} />
          <Route path="/applications" element={<Applications user={user} />} />
          <Route path="/all-jobs" element={<AllJobs user={user} />} />
          <Route path="/employer" element={<EmployerDashboard user={user} />} />
          <Route path="/employer/post-job" element={<PostJob user={user} />} />
          <Route path="/admin" element={<AdminDashboard user={user} />} />
          <Route path="*" element={<Onboarding />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Router>
      <ScrollToTop />
      <AppContent user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
    </Router>
  );
}

export default App;