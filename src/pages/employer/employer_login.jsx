import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus, Phone, Lock, Mail, Building2, X, KeyRound, RefreshCw, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import EmployerPhoneVerificationModal from './EmployerPhoneVerificationModal';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EmployerLogin = ({ onLogin }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  
  const [authMethod, setAuthMethod] = useState('otp');
  const [otpSent, setOtpSent] = useState(false);
  
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetStep, setResetStep] = useState('phone');
  const [resetPhone, setResetPhone] = useState('');
  const [resetOtp, setResetOtp] = useState(['', '', '', '', '', '']);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState({ type: '', text: '' });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetTimeLeft, setResetTimeLeft] = useState(0);
  
  const [reactivationModalOpen, setReactivationModalOpen] = useState(false);
  const [reactivationLoading, setReactivationLoading] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState(null);
  
  const [suspendedModalOpen, setSuspendedModalOpen] = useState(false);
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const modalRef = useRef(null);
  
  // Phone verification states
  const [showPhoneVerificationModal, setShowPhoneVerificationModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (resetTimeLeft > 0) {
      const timerId = setTimeout(() => setResetTimeLeft(resetTimeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resetTimeLeft]);

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
    // Check if phone is verified
    if (!user.phoneVerified) {
      setPendingUser(user);
      setShowPhoneVerificationModal(true);
      return;
    }
    if (onLogin) onLogin(user);
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'employer') navigate('/employer');
    else navigate(user.name ? '/' : '/profile-setup');
  };

  const handlePhoneVerified = (updatedUser) => {
    setShowPhoneVerificationModal(false);
    if (onLogin) onLogin(updatedUser);
    if (updatedUser.role === 'admin') navigate('/admin');
    else if (updatedUser.role === 'employer') navigate('/employer');
    else navigate(updatedUser.name ? '/' : '/profile-setup');
  };

  // Send OTP
  const handleSendOtp = async () => {
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employer/send-otp`, {
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
        if (res.status === 403 && data.code === 'account_deactivated') {
          setPendingCredentials({ phone: loginId });
          setReactivationModalOpen(true);
          return;
        }
        if (res.status === 403 && data.code === 'account_suspended') {
          setSuspendedModalOpen(true);
          return;
        }
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
    }
  };

  // Password login
  const handlePasswordLogin = async () => {
    setError('');
    setMessage('');
    if (!loginId.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/employer-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginId, password })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403 && data.code === 'account_deactivated') {
          setPendingCredentials({ phone: loginId, password });
          setReactivationModalOpen(true);
          return;
        }
        if (response.status === 403 && data.code === 'account_suspended') {
          setSuspendedModalOpen(true);
          return;
        }
        throw new Error(data.error || 'Login failed');
      }
      routeUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // OTP login
  const handleOtpLogin = async () => {
    setError('');
    setMessage('');
    const finalOtp = otp.join('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employer/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginId, otp: finalOtp })
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403 && data.code === 'account_deactivated') {
          setPendingCredentials({ phone: loginId, otp: finalOtp });
          setReactivationModalOpen(true);
          return;
        }
        if (res.status === 403 && data.code === 'account_suspended') {
          setSuspendedModalOpen(true);
          return;
        }
        throw new Error(data.error || 'Authentication failed');
      }
      routeUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReactivateAccount = async () => {
    setReactivationLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employer/reactivate-account`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginId })
      });
      const data = await res.json();
      if (res.ok) {
        setReactivationModalOpen(false);
        if (pendingCredentials) {
          if (pendingCredentials.password) {
            await handlePasswordLogin();
          } else if (pendingCredentials.otp) {
            setOtp(['', '', '', '', '', '']);
            setOtpSent(false);
            setMessage('Account reactivated! Please request a new OTP to log in.');
            setPendingCredentials(null);
          } else {
            setMessage('Account reactivated! Please request a new OTP.');
            setPendingCredentials(null);
          }
        } else {
          setMessage('Account reactivated! Please log in again.');
        }
      } else {
        throw new Error(data.error || 'Reactivation failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setReactivationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (forgotPasswordMode) return;
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
    if (value !== '' && index < 5) otpRefs.current[index + 1]?.focus();
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

  // Forgot Password Flow
  const resetOtpRefs = useRef([]);

  const handleResetSendOtp = async () => {
    if (!resetPhone) {
      setResetMessage({ type: 'error', text: 'Phone number is required' });
      return;
    }
    setResetLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employer/send-otp`, {
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
      const res = await fetch(`${API_BASE_URL}/api/auth/employer/verify-otp`, {
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
      const res = await fetch(`${API_BASE_URL}/api/auth/employer/reset-password`, {
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
          <div><label className="text-sm font-semibold text-slate-700">Mobile Number</label><div className="relative mt-1"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" /><input type="tel" className="w-full py-3 pl-10 pr-4 border border-slate-200 rounded-lg text-sm" placeholder="+91..." value={resetPhone} onChange={(e) => setResetPhone(e.target.value)} /></div></div>
          <button onClick={handleResetSendOtp} disabled={resetLoading} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all">{resetLoading ? 'Sending...' : 'Send OTP'}</button>
          <button onClick={resetForgotPassword} className="text-sm text-indigo-600 hover:underline text-center">Back to Login</button>
        </div>
      )}

      {resetStep === 'verify' && (
        <div className="flex flex-col gap-4">
          <div><label className="text-sm font-semibold text-slate-700">Enter OTP</label><div className="flex gap-2 justify-between mt-2">{resetOtp.map((digit, index) => (<input key={index} ref={el => resetOtpRefs.current[index] = el} type="text" maxLength={1} className="w-full aspect-square max-w-[45px] text-center text-xl font-bold border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" value={digit} onChange={(e) => handleResetOtpChange(index, e.target.value)} onKeyDown={(e) => handleResetOtpKeyDown(index, e)} />))}</div><div className="flex justify-end mt-2"><button type="button" className="text-xs text-indigo-600 hover:underline disabled:text-slate-400" onClick={handleResetSendOtp} disabled={resetTimeLeft > 0}>{resetTimeLeft > 0 ? `Resend in ${resetTimeLeft}s` : 'Resend OTP'}</button></div></div>
          <button onClick={handleResetVerifyOtp} disabled={resetLoading} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all">{resetLoading ? 'Verifying...' : 'Verify OTP'}</button>
          <button onClick={resetForgotPassword} className="text-sm text-indigo-600 hover:underline text-center">Back to Login</button>
        </div>
      )}

      {resetStep === 'reset' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">New Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
              <input type={showNewPassword ? 'text' : 'password'} className="w-full py-3 pl-10 pr-10 border border-slate-200 rounded-lg text-sm" placeholder="Min. 6 characters" value={resetNewPassword} onChange={(e) => setResetNewPassword(e.target.value)} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowNewPassword(!showNewPassword)}>
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
              <input type={showConfirmPassword ? 'text' : 'password'} className="w-full py-3 pl-10 pr-10 border border-slate-200 rounded-lg text-sm" placeholder="Re-enter new password" value={resetConfirmPassword} onChange={(e) => setResetConfirmPassword(e.target.value)} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button onClick={handleResetPassword} disabled={resetLoading} className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all">{resetLoading ? 'Resetting...' : 'Reset Password'}</button>
          <button onClick={resetForgotPassword} className="text-sm text-indigo-600 hover:underline text-center">Back to Login</button>
        </div>
      )}
    </div>
  );

  const renderLogin = () => (
    <div className="w-full max-w-[400px] bg-white rounded-2xl py-6 px-8 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] border border-white/50 flex flex-col gap-5 animate-[fadeIn_0.4s_ease-out]">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(79,70,229,0.1)]">
          <ShieldCheck size={24} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">Employer Login</h1>
        <p className="text-sm font-medium text-slate-500">Access your RozgarDo account</p>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        <button 
          type="button"
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all ${
            authMethod === 'otp' 
              ? 'bg-white text-indigo-600 shadow-[0_2px_6px_rgba(0,0,0,0.05)]' 
              : 'bg-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => { setAuthMethod('otp'); setOtpSent(false); setError(''); setMessage(''); setOtp(['','','','','','']); }}
        >
          Login via OTP
        </button>
        <button 
          type="button"
          className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all ${
            authMethod === 'password' 
              ? 'bg-white text-indigo-600 shadow-[0_2px_6px_rgba(0,0,0,0.05)]' 
              : 'bg-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => { setAuthMethod('password'); setError(''); setMessage(''); }}
        >
          Login via Password
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            {authMethod === 'otp' ? "Mobile Number" : "Mobile / Email ID"}
          </label>
          <div className="relative flex items-center">
            {authMethod === 'otp' ? (
              <Phone className="absolute left-3 text-slate-400 pointer-events-none w-[18px] h-[18px]" />
            ) : (
              <Mail className="absolute left-3 text-slate-400 pointer-events-none w-[18px] h-[18px]" />
            )}
            <input 
              type={authMethod === 'otp' ? "tel" : "text"}
              className={`w-full py-3 pl-10 pr-4 border rounded-lg text-sm text-slate-900 bg-white transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 placeholder:text-slate-300 ${
                error && !otpSent ? 'border-red-500 focus:ring-red-100' : 'border-slate-200'
              }`}
              placeholder={authMethod === 'otp' ? "+91..." : "Enter Mobile"}
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              disabled={authMethod === 'otp' && otpSent}
              required
            />
          </div>
        </div>

        {authMethod === 'password' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-slate-400 pointer-events-none w-[18px] h-[18px]" />
              <input 
                type={showPassword ? 'text' : 'password'}
                className="w-full py-3 pl-10 pr-10 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        {authMethod === 'otp' && otpSent && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Enter OTP</label>
            <div className="flex gap-2 justify-between mt-1">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => otpRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  className="w-full aspect-square max-w-[45px] text-center text-xl font-bold border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
          <div className="py-2 px-3 rounded-lg text-sm font-medium text-center bg-emerald-50 text-emerald-700 border border-emerald-100">
            {message}
          </div>
        )}
        {error && (
          <div className="py-2 px-3 rounded-lg text-sm font-medium text-center bg-red-50 text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="w-full py-3 px-5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 mt-1 active:translate-y-0"
        >
          {authMethod === 'otp' ? (otpSent ? 'Verify & Login' : 'Get OTP') : 'Login'}
        </button>

        <div className="text-center mt-2">
          <button
            type="button"
            onClick={() => setForgotPasswordMode(true)}
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            Forgot Password?
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-1">
          New to RozgarDo? 
          <button type="button" className="text-indigo-600 font-bold ml-1 hover:underline" onClick={() => setSignupModalOpen(true)}>
            Register for Free
          </button>
        </p>
      </form>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
      {forgotPasswordMode ? renderForgotPassword() : renderLogin()}

      {/* Signup Modal */}
      {signupModalOpen && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div ref={modalRef} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl" style={{ animation: 'modalFadeIn 0.2s ease-out' }}>
              <div className="relative p-6 text-center">
                <button onClick={() => setSignupModalOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="text-indigo-600" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Join RozgarDo</h2>
                <p className="text-gray-500 mb-6">Choose how you want to get started</p>
                <div className="space-y-3">
                  <button onClick={() => handleSignupAs('employee')} className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition group">
                    <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition">
                      <UserPlus size={22} className="text-indigo-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-800">I'm a Job Seeker</div>
                      <div className="text-xs text-gray-500">Find jobs, apply instantly</div>
                    </div>
                    <span className="text-gray-400 group-hover:text-indigo-500 transition">→</span>
                  </button>
                  <button onClick={() => handleSignupAs('employer')} className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition group">
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
                <button onClick={() => setSignupModalOpen(false)} className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Reactivation Modal */}
      {reactivationModalOpen && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="text-amber-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Account Deactivated</h3>
              <p className="text-gray-600 mb-6">Your employer account is currently deactivated. Do you want to reactivate it and log in?</p>
              <div className="flex gap-3">
                <button onClick={() => setReactivationModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button onClick={handleReactivateAccount} disabled={reactivationLoading} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                  {reactivationLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} Reactivate & Login
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Suspended Account Modal */}
      {suspendedModalOpen && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Account Suspended</h3>
              <p className="text-gray-600 mb-4">
                Your employer account has been temporarily suspended.
                <br />
                Please contact <a href="mailto:support@rozgardo.com" className="text-indigo-600 hover:underline">support@rozgardo.com</a> for assistance.
              </p>
              <button
                onClick={() => setSuspendedModalOpen(false)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Phone Verification Modal */}
      {showPhoneVerificationModal && pendingUser && (
        <EmployerPhoneVerificationModal
          user={pendingUser}
          onVerified={handlePhoneVerified}
        />
      )}
    </div>
  );
};

export default EmployerLogin;