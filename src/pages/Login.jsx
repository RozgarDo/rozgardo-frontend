import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus, Phone, Lock, Mail, Building2, X } from 'lucide-react';
import './Login.css';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const Login = ({ onLogin }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  
  const [authMethod, setAuthMethod] = useState('otp');
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const modalRef = useRef(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (signupModalOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        setSignupModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [signupModalOpen]);

  const routeUser = (user) => {
    onLogin(user);
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'employer') navigate('/employer');
    else navigate(user.name ? '/' : '/profile-setup');
  };

  const handleSendOtp = async () => {
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginId })
      });
      if (res.ok) {
        const data = await res.json();
        setOtpSent(true);
        setMessage(data.message);
        setTimeLeft(30);
      } else {
        if (res.status === 404) {
          setError('Mobile number not found. Please register.');
          setSignupModalOpen(true);
        } else {
          const data = await res.json();
          throw new Error(data.message || 'Failed to send OTP');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Login service unavailable fallback. Mocking OTP.');
      setOtpSent(true);
      setMessage('OTP Sent. Use 123456');
      setTimeLeft(30);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    let finalOtp = Array.isArray(otp) ? otp.join('') : otp;

    try {
      const endpoint = `${API_BASE_URL}/api/auth/login`;
      const body = { loginId, type: authMethod, password, otp: finalOtp };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Authentication failed');
      }

      routeUser(data.user);
      
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'Login failed. Please check your credentials or network.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSignupAs = (selectedRole) => {
    setSignupModalOpen(false);
    if (selectedRole === 'employee') {
      navigate('/employee-registration');
    } else {
      navigate('/employer-registration');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-container">
            <ShieldCheck size={28} />
          </div>
          <h1 className="login-title">Login</h1>
          <p className="login-subtitle">Access your RozgarDo account</p>
        </div>

        <div className="login-toggle-container">
          <button 
            type="button"
            className={`login-toggle-btn ${authMethod === 'otp' ? 'active' : 'inactive'}`}
            onClick={() => { setAuthMethod('otp'); setOtpSent(false); setError(''); setMessage(''); setOtp(['','','','','','']); }}
          >
            Login via OTP
          </button>
          <button 
            type="button"
            className={`login-toggle-btn ${authMethod === 'password' ? 'active' : 'inactive'}`}
            onClick={() => { setAuthMethod('password'); setError(''); setMessage(''); }}
          >
            Login via Password
          </button>
        </div>

        <form onSubmit={authMethod === 'otp' && !otpSent ? (e) => { e.preventDefault(); handleSendOtp(); } : handleSubmit} className="flex flex-col gap-3 form-fade-enter">
          
          <div className="login-form-group">
            <label className="login-label">
              {authMethod === 'otp' ? "Mobile Number" : "Mobile / Email ID"}
            </label>
            <div className="login-input-wrapper">
              {authMethod === 'otp' ? (
                <Phone className="login-input-icon" />
              ) : (
                <Mail className="login-input-icon" />
              )}
              <input 
                type={authMethod === 'otp' ? "tel" : "text"}
                className={`login-input ${error && !(Array.isArray(otp) ? otp.join('') : '') ? 'error' : ''}`}
                placeholder={authMethod === 'otp' ? "+91..." : "Enter Mobile or Email"}
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                disabled={otpSent}
                required
              />
            </div>
          </div>

          {authMethod === 'password' && (
            <div className="login-form-group form-fade-enter">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" />
                <input 
                  type="password"
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {authMethod === 'otp' && otpSent && (
            <div className="login-form-group form-fade-enter">
              <label className="login-label">Enter OTP</label>
              <div className="otp-inputs-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => otpRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    className="otp-box"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
              <div className="resend-text-container">
                Didn't receive OTP?
                <button 
                  type="button" 
                  className="resend-link" 
                  onClick={handleSendOtp}
                  disabled={timeLeft > 0}
                >
                  {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend'}
                </button>
              </div>
            </div>
          )}

          {message && <div className="login-message success mt-1">{message}</div>}
          {error && <div className="login-message error mt-1">{error}</div>}

          <button type="submit" className="login-btn-submit">
            {authMethod === 'otp' ? (otpSent ? 'Verify & Login' : 'Get OTP') : 'Login'}
          </button>

          <p className="login-footer-text">
            New to RozgarDo? 
            <button type="button" className="login-register-link" onClick={() => setSignupModalOpen(true)}>
              Register for Free
            </button>
          </p>
        </form>
      </div>

      {/* SIGNUP MODAL - Rendered via Portal to ensure viewport centering */}
      {signupModalOpen && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div 
            ref={modalRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl" style={{ animation: 'modalFadeIn 0.2s ease-out' }}>
              <div className="relative p-6 text-center">
                <button
                  onClick={() => setSignupModalOpen(false)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="text-indigo-600" size={28} />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Join RozgarDo
                </h2>
                <p className="text-gray-500 mb-6">
                  Choose how you want to get started
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => handleSignupAs('employee')}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-200 group"
                  >
                    <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition">
                      <UserPlus size={22} className="text-indigo-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-800">I'm a Job Seeker</div>
                      <div className="text-xs text-gray-500">Find jobs, apply instantly</div>
                    </div>
                    <span className="text-gray-400 group-hover:text-indigo-500 transition">→</span>
                  </button>

                  <button
                    onClick={() => handleSignupAs('employer')}
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-200 group"
                  >
                    <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition">
                      <Building2 size={22} className="text-green-700" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-800">I'm an Employer</div>
                      <div className="text-xs text-gray-500">Post jobs, hire talent</div>
                    </div>
                    <span className="text-gray-400 group-hover:text-green-600 transition">→</span>
                  </button>
                </div>

                <button
                  onClick={() => setSignupModalOpen(false)}
                  className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;