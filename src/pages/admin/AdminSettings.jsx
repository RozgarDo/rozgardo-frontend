import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Key, AlertCircle, Loader2, Check, Phone, Send } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AdminSettings = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // OTP state
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    if (passwordMessage.text) setPasswordMessage({ type: '', text: '' });
  };

  // ---------- Send OTP ----------
  const handleSendOtp = async () => {
    setOtpLoading(true);
    setOtpMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/auth/admin/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setOtpMessage({ type: 'success', text: 'OTP sent to your phone. Please enter it below.' });
      } else {
        throw new Error(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setOtpMessage({ type: 'error', text: err.message });
    } finally {
      setOtpLoading(false);
    }
  };

  // ---------- Update Password (includes OTP) ----------
  const handleUpdatePassword = async () => {
    // Validate password fields
    if (!passwordData.currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Current password is required' });
      return;
    }
    if (!passwordData.newPassword) {
      setPasswordMessage({ type: 'error', text: 'New password is required' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (!otp) {
      setPasswordMessage({ type: 'error', text: 'Please enter the OTP sent to your phone' });
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/auth/admin/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          otp: otp, // Include OTP
        }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          // Optionally update the user state in App
          if (setUser) {
            setUser((prev) => ({ ...prev, token_version: data.token_version }));
          }
        }
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setOtp('');
        setOtpSent(false);
      } else {
        throw new Error(data.error || 'Failed to update password');
      }
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  // ---------- Styles ----------
  const cardStyle = {
    background: 'white', borderRadius: '1rem', border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '1.5rem', marginBottom: '1.5rem',
  };
  const sectionTitleStyle = {
    fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
  };
  const rowStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.875rem 0', borderBottom: '1px solid #F8FAFC',
  };
  const rowTextStyle = { fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' };
  const inputStyle = {
    padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem',
    fontSize: '0.85rem', background: '#F8FAFC', fontFamily: 'inherit', outline: 'none', width: '100%',
  };
  const primaryBtnStyle = {
    padding: '0.6rem 1rem', background: '#4F46E5', color: 'white', border: 'none',
    borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.35rem',
  };
  const disabledBtnStyle = {
    ...primaryBtnStyle,
    background: '#9CA3AF',
    cursor: 'not-allowed',
  };
  const successBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    background: '#D1FAE5',
    color: '#065F46',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: 600,
  };

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#4F46E5', fontWeight: 600, fontSize: '0.875rem',
          marginBottom: '1rem', padding: 0, fontFamily: 'inherit',
        }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>Admin Settings</h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Manage your admin password and security.</p>
      </div>

      {/* ----- CHANGE PASSWORD SECTION (with OTP) ----- */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>
          <Lock size={20} color="#4F46E5" />
          Change Password
          {otpSent && (
            <span style={successBadgeStyle}><Check size={14} /> OTP Sent</span>
          )}
        </h3>

        {passwordMessage.text && (
          <div style={{
            padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem',
            background: passwordMessage.type === 'success' ? '#F0FDF4' : '#FEF2F2',
            color: passwordMessage.type === 'success' ? '#166534' : '#991B1B',
            border: `1px solid ${passwordMessage.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
            fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            {passwordMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            {passwordMessage.text}
          </div>
        )}

        <div style={{ ...rowStyle, flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
          <div>
            <div style={rowTextStyle}>Current Password</div>
            <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="Enter current password" style={inputStyle} />
          </div>
          <div>
            <div style={rowTextStyle}>New Password</div>
            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Min. 6 characters" style={inputStyle} />
          </div>
          <div>
            <div style={rowTextStyle}>Confirm New Password</div>
            <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Re‑enter new password" style={inputStyle} />
          </div>

          {/* OTP Section */}
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Phone size={18} color="#4F46E5" />
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#475569' }}>
                Enter OTP sent to your phone
              </span>
              <button
                onClick={handleSendOtp}
                disabled={otpLoading}
                style={otpLoading ? disabledBtnStyle : { ...primaryBtnStyle, background: '#10B981' }}
              >
                {otpLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
            </div>
            {otpMessage.text && (
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.8rem',
                color: otpMessage.type === 'success' ? '#166534' : '#DC2626',
              }}>
                {otpMessage.text}
              </div>
            )}
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6‑digit OTP"
              style={{ ...inputStyle, marginTop: '0.5rem', maxWidth: '200px' }}
              disabled={!otpSent}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              onClick={handleUpdatePassword}
              disabled={passwordLoading || !otpSent}
              style={(!otpSent || passwordLoading) ? disabledBtnStyle : primaryBtnStyle}
            >
              {passwordLoading ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
              Update Password
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminSettings;