import React, { useState, useEffect } from 'react';
import { Send, CheckCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EmployeePhoneVerificationModal = ({ user, onVerified, onClose }) => {
  const [step, setStep] = useState('send');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Extract phone number from user object (support both 'phone' and 'phoneNumber')
  const phone = user?.phone || user?.phoneNumber;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') e.preventDefault();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendOtp = async () => {
    if (!phone) {
      setError('Phone number is missing. Please contact support.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employee/send-phone-verification-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setMessage('OTP sent! Check your phone.');
      setStep('verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setError('Please enter OTP');
    if (!phone) return setError('Phone number is missing');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employee/verify-phone-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      // Merge the updated user data (phoneVerified: true)
      const updatedUser = { ...user, phoneVerified: true };
      onVerified(updatedUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000]" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Send className="text-indigo-600" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Phone</h2>
          <p className="text-gray-500 text-sm mt-1">
            Please verify your mobile number to continue:<br />
            <strong className="text-indigo-600">{phone || 'Not provided'}</strong>
          </p>
          <p className="text-xs text-gray-400 mt-2">You cannot close this dialog until verification is complete.</p>
        </div>

        {step === 'send' ? (
          <button onClick={handleSendOtp} disabled={loading || !phone}
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        ) : (
          <div className="space-y-4">
            <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={6} autoFocus />
            <button onClick={handleVerifyOtp} disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-50 transition">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button onClick={() => setStep('send')} className="w-full text-indigo-600 text-sm underline hover:text-indigo-800">
              Resend OTP
            </button>
          </div>
        )}

        {error && <div className="mt-3 text-red-500 text-sm text-center">{error}</div>}
        {message && <div className="mt-3 text-green-600 text-sm text-center flex items-center justify-center gap-1"><CheckCircle size={16} /> {message}</div>}
      </div>
    </div>
  );
};

export default EmployeePhoneVerificationModal;