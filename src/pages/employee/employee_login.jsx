import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { ShieldCheck, UserPlus, Phone, Lock, Mail, Building2, X, KeyRound } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EmployeeLogin = ({ onLogin }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  
  const [authMethod, setAuthMethod] = useState('otp');
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetStep, setResetStep] = useState('phone'); // 'phone', 'verify', 'reset'
  const [resetPhone, setResetPhone] = useState('');
  const [resetOtp, setResetOtp] = useState(['', '', '', '', '', '']);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetMessage, setResetMessage] = useState({ type: '', text: '' });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetTimeLeft, setResetTimeLeft] = useState(0);

  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const modalRef = useRef(null);
  
  const navigate = useNavigate();

  // Timer for normal OTP resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Timer for reset OTP
  useEffect(() => {
    if (resetTimeLeft > 0) {
      const timerId = setTimeout(() => setResetTimeLeft(resetTimeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resetTimeLeft]);

  // Close modal on outside click
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
    if (onLogin) onLogin(user);
    navigate('/employee-dashboard');
  };

  // Send OTP (normal login)
  const handleSendOtp = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employee/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginId })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setMessage(data.message);
        setTimeLeft(30);
      } else {
        if (res.status === 404) {
          setError('Mobile number not found. Please register.');
          setSignupModalOpen(true);
        } else {
          throw new Error(data.error || data.message || 'Failed to send OTP');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login service unavailable. Try password login.');
    } finally {
      setLoading(false);
    }
  };

  // Password login
  const handlePasswordLogin = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    if (!loginId.trim()) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }
    if (!password) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/employee-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginId, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      routeUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // OTP login
  const handleOtpLogin = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    const finalOtp = otp.join('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employee/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginId, otp: finalOtp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      routeUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (forgotPasswordMode) return; // handled separately
    if (authMethod === 'password') {
      await handlePasswordLogin();
    } else {
      if (!otpSent) {
        await handleSendOtp();
      } else {
        await handleOtpLogin();
      }
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
    if (selectedRole === 'employee') navigate('/employee-registration');
    else navigate('/employer-registration');
  };

  // --- Forgot Password Handlers ---
  const resetOtpRefs = useRef([]);

  const handleResetSendOtp = async () => {
    if (!resetPhone) {
      setResetMessage({ type: 'error', text: 'Phone number is required' });
      return;
    }
    setResetLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employee/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: resetPhone })
      });
      const data = await res.json();
      if (res.ok) {
        setResetMessage({ type: 'success', text: 'OTP sent successfully!' });
        setResetTimeLeft(30);
        setResetStep('verify');
      } else {
        if (res.status === 404) {
          setResetMessage({ type: 'error', text: 'No account found with this phone number.' });
        } else {
          throw new Error(data.error || 'Failed to send OTP');
        }
      }
    } catch (err) {
      setResetMessage({ type: 'error', text: err.message });
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetVerifyOtp = async () => {
    const finalOtp = resetOtp.join('');
    if (finalOtp.length !== 6) {
      setResetMessage({ type: 'error', text: 'Please enter the 6-digit OTP' });
      return;
    }
    setResetLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employee/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: resetPhone, otp: finalOtp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      setResetMessage({ type: 'success', text: 'OTP verified! Please set your new password.' });
      setResetStep('reset');
    } catch (err) {
      setResetMessage({ type: 'error', text: err.message });
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetNewPassword || resetNewPassword.length < 6) {
      setResetMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setResetMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setResetLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employee/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: resetPhone, newPassword: resetNewPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      setResetMessage({ type: 'success', text: 'Password reset successfully! Please log in.' });
      setTimeout(() => {
        setForgotPasswordMode(false);
        setResetStep('phone');
        setResetPhone('');
        setResetOtp(['', '', '', '', '', '']);
        setResetNewPassword('');
        setResetConfirmPassword('');
        setResetMessage({ type: '', text: '' });
      }, 2000);
    } catch (err) {
      setResetMessage({ type: 'error', text: err.message });
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...resetOtp];
    newOtp[index] = value;
    setResetOtp(newOtp);
    if (value !== '' && index < 5) {
      resetOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleResetOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !resetOtp[index] && index > 0) {
      resetOtpRefs.current[index - 1]?.focus();
    }
  };

  const resetForgotPassword = () => {
    setForgotPasswordMode(false);
    setResetStep('phone');
    setResetPhone('');
    setResetOtp(['', '', '', '', '', '']);
    setResetNewPassword('');
    setResetConfirmPassword('');
    setResetMessage({ type: '', text: '' });
    setError('');
    setMessage('');
  };

  // Forgot Password UI
  const renderForgotPassword = () => (
    <div className="w-full max-w-[400px] bg-white rounded-2xl py-6 px-8 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] border border-white/50 animate-[fadeIn_0.4s_ease-out]">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center rounded-full">
          <KeyRound size={24} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Reset Password</h2>
        <p className="text-sm text-slate-500 mt-1">
          {resetStep === 'phone' && 'Enter your registered mobile number'}
          {resetStep === 'verify' && 'Enter the OTP sent to your phone'}
          {resetStep === 'reset' && 'Create a new password'}
        </p>
      </div>

      {resetMessage.text && (
        <div className={`py-2 px-3 rounded-lg text-sm font-medium text-center mb-4 ${
          resetMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {resetMessage.text}
        </div>
      )}

      {resetStep === 'phone' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
              <input
                type="tel"
                className="w-full py-3 pl-10 pr-4 border border-slate-200 rounded-lg text-sm"
                placeholder="9876543210"
                value={resetPhone}
                onChange={(e) => setResetPhone(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleResetSendOtp}
            disabled={resetLoading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all"
          >
            {resetLoading ? 'Sending...' : 'Send OTP'}
          </button>
          <button onClick={resetForgotPassword} className="text-sm text-indigo-600 hover:underline text-center">
            Back to Login
          </button>
        </div>
      )}

      {resetStep === 'verify' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Enter OTP</label>
            <div className="flex gap-2 justify-between mt-2">
              {resetOtp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => resetOtpRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  className="w-full aspect-square max-w-[45px] text-center text-xl font-bold border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  value={digit}
                  onChange={(e) => handleResetOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleResetOtpKeyDown(index, e)}
                />
              ))}
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                className="text-xs text-indigo-600 hover:underline disabled:text-slate-400"
                onClick={handleResetSendOtp}
                disabled={resetTimeLeft > 0}
              >
                {resetTimeLeft > 0 ? `Resend in ${resetTimeLeft}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
          <button
            onClick={handleResetVerifyOtp}
            disabled={resetLoading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all"
          >
            {resetLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button onClick={resetForgotPassword} className="text-sm text-indigo-600 hover:underline text-center">
            Back to Login
          </button>
        </div>
      )}

      {resetStep === 'reset' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">New Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
              <input
                type="password"
                className="w-full py-3 pl-10 pr-4 border border-slate-200 rounded-lg text-sm"
                placeholder="Min. 6 characters"
                value={resetNewPassword}
                onChange={(e) => setResetNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
              <input
                type="password"
                className="w-full py-3 pl-10 pr-4 border border-slate-200 rounded-lg text-sm"
                placeholder="Re-enter new password"
                value={resetConfirmPassword}
                onChange={(e) => setResetConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleResetPassword}
            disabled={resetLoading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all"
          >
            {resetLoading ? 'Resetting...' : 'Reset Password'}
          </button>
          <button onClick={resetForgotPassword} className="text-sm text-indigo-600 hover:underline text-center">
            Back to Login
          </button>
        </div>
      )}
    </div>
  );

  // Normal login UI
  const renderLogin = () => (
    <div className="w-full max-w-[400px] bg-white rounded-2xl py-6 px-8 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] border border-white/50 flex flex-col gap-5 animate-[fadeIn_0.4s_ease-out]">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(79,70,229,0.1)]">
          <ShieldCheck size={24} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">Employee Login</h1>
        <p className="text-sm font-medium text-slate-500">Sign in to your RozgarDo account</p>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        <button 
          type="button"
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-300 ${
            authMethod === 'otp' 
              ? 'bg-white text-indigo-600 shadow-[0_2px_6px_rgba(0,0,0,0.05)]' 
              : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-white/40'
          }`}
          onClick={() => { setAuthMethod('otp'); setOtpSent(false); setError(''); setMessage(''); setOtp(['','','','','','']); }}
        >
          Login via OTP
        </button>
        <button 
          type="button"
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-300 ${
            authMethod === 'password' 
              ? 'bg-white text-indigo-600 shadow-[0_2px_6px_rgba(0,0,0,0.05)]' 
              : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-white/40'
          }`}
          onClick={() => { setAuthMethod('password'); setError(''); setMessage(''); }}
        >
          Login via Password
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
          <div className="relative flex items-center">
            <Phone className="absolute left-3 text-slate-400 pointer-events-none w-[18px] h-[18px]" />
            <input 
              type="tel"
              className={`w-full py-3 pl-10 pr-4 border rounded-lg text-sm text-slate-900 bg-white transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 placeholder:text-slate-300 ${
                error && !otpSent ? 'border-red-500 focus:ring-red-100' : 'border-slate-200'
              }`}
              placeholder="9876543210"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              disabled={authMethod === 'otp' && otpSent}
              required
            />
          </div>
        </div>

        {authMethod === 'password' && (
          <div className="flex flex-col gap-1.5 animate-[fadeIn_0.3s_ease-out]">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-slate-400 pointer-events-none w-[18px] h-[18px]" />
              <input 
                type="password"
                className="w-full py-3 pl-10 pr-4 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 placeholder:text-slate-300"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {authMethod === 'otp' && otpSent && (
          <div className="flex flex-col gap-1.5 animate-[fadeIn_0.3s_ease-out]">
            <label className="text-sm font-semibold text-slate-700">Enter OTP</label>
            <div className="flex gap-2 justify-between mt-1">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => otpRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  className="w-full aspect-square max-w-[45px] text-center text-xl font-bold border border-slate-200 rounded-lg text-slate-900 bg-white transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                />
              ))}
            </div>
            <div className="flex justify-end items-center text-xs text-slate-500 mt-1">
              Didn't receive OTP?
              <button 
                type="button" 
                className="text-indigo-600 font-semibold ml-1 hover:underline disabled:text-slate-400 disabled:cursor-not-allowed"
                onClick={handleSendOtp}
                disabled={timeLeft > 0}
              >
                {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend'}
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="py-2 px-3 rounded-lg text-sm font-medium text-center bg-emerald-50 text-emerald-700 border border-emerald-100 animate-[fadeIn_0.3s_ease-out]">
            {message}
          </div>
        )}
        {error && (
          <div className="py-2 px-3 rounded-lg text-sm font-medium text-center bg-red-50 text-red-600 border border-red-100 animate-[fadeIn_0.3s_ease-out]">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 px-5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 mt-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : (authMethod === 'otp' ? (otpSent ? 'Verify & Login' : 'Get OTP') : 'Login')}
        </button>

        <div className="text-center mt-1">
          <button
            type="button"
            onClick={() => setForgotPasswordMode(true)}
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            Forgot Password?
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-1">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-indigo-600 font-bold hover:underline bg-none border-none cursor-pointer"
            onClick={() => setSignupModalOpen(true)}
          >
            Register Now
          </button>
        </p>
      </form>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {forgotPasswordMode ? renderForgotPassword() : renderLogin()}

      {/* Signup Modal (same as before) */}
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

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Join RozgarDo</h2>
                <p className="text-gray-500 mb-6">Choose how you want to get started</p>

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
    </div>
  );
};

export default EmployeeLogin;