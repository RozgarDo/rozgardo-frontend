import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { ShieldCheck, UserPlus, Phone, Lock, Mail, Building2, X } from 'lucide-react';

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

  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const modalRef = useRef(null);
  
  const navigate = useNavigate();

  // Timer for OTP resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

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

  // Send OTP
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

      <div className="w-full max-w-[400px] bg-white rounded-2xl py-6 px-8 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] border border-white/50 flex flex-col gap-5 animate-[fadeIn_0.4s_ease-out]">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(79,70,229,0.1)]">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">Employee Login</h1>
          <p className="text-sm font-medium text-slate-500">Sign in to your RozgarDo account</p>
        </div>

        {/* Toggle Tabs */}
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
          {/* Phone/Login ID Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Mobile Number
            </label>
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

          {/* Password Field (only for password method) */}
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

          {/* OTP Input Field (only when OTP sent) */}
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
                  className="text-indigo-600 font-semibold ml-1 hover:underline disabled:text-slate-400 disabled:cursor-not-allowed disabled:no-underline"
                  onClick={handleSendOtp}
                  disabled={timeLeft > 0}
                >
                  {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend'}
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
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

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 mt-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (authMethod === 'otp' ? (otpSent ? 'Verify & Login' : 'Get OTP') : 'Login')}
          </button>

          {/* Registration Link - OPENS MODAL */}
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

      {/* SIGNUP MODAL (identical to EmployerLogin) */}
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
    </div>
  );
};

export default EmployeeLogin;