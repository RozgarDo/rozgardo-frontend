import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Globe, MapPin, Eye, EyeOff, Trash2, UserX,
  ArrowLeft, MessageSquare, Mail, Smartphone, Save, Check,
  Lock, Key, AlertCircle, Loader2
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EmployeeSettings = ({ user, setUser, onLogout }) => {
  const navigate = useNavigate();

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Deactivation loading state
  const [actionLoading, setActionLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    if (passwordMessage.text) setPasswordMessage({ type: '', text: '' });
  };

  const handleUpdatePassword = async () => {
    // ... same as before (unchanged)
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

    setPasswordLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error(data.error || 'Failed to update password');
      }
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!window.confirm('Deactivating your account will hide your profile from employers. You can reactivate anytime. Proceed?')) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employee/deactivate-account`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Account deactivated. You will be logged out.');
        if (onLogout) onLogout();
        navigate('/');
      } else {
        throw new Error(data.error || 'Deactivation failed');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employee/delete-account`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Your account has been deleted permanently.');
        if (onLogout) onLogout();
        navigate('/');
      } else {
        throw new Error(data.error || 'Deletion failed');
      }
    } catch (err) {
      alert('Error deleting account: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Styles (same as before)
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
  const rowLabelStyle = {
    display: 'flex', alignItems: 'center', gap: '0.625rem',
  };
  const rowTextStyle = { fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' };
  const rowSubStyle = { fontSize: '0.75rem', color: '#94A3B8', fontWeight: 400, marginTop: '0.125rem' };
  const inputStyle = {
    padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem',
    fontSize: '0.85rem', background: '#F8FAFC', fontFamily: 'inherit', outline: 'none', width: '200px',
  };
  const dangerBtnStyle = {
    padding: '0.6rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.85rem',
    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
  };
  const primaryBtnStyle = {
    padding: '0.6rem 1rem', background: '#4F46E5', color: 'white', border: 'none',
    borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.35rem',
  };

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#4F46E5', fontWeight: 600, fontSize: '0.875rem',
          marginBottom: '1rem', padding: 0, fontFamily: 'inherit',
        }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>Employee Settings</h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Manage your password and account settings.</p>
      </div>

      {/* Password Change Section */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}><Lock size={20} color="#4F46E5" /> Change Password</h3>
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
            <div style={{ ...rowTextStyle, marginBottom: '0.25rem' }}>Current Password</div>
            <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="Enter current password" style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div>
            <div style={{ ...rowTextStyle, marginBottom: '0.25rem' }}>New Password</div>
            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Min. 6 characters" style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div>
            <div style={{ ...rowTextStyle, marginBottom: '0.25rem' }}>Confirm New Password</div>
            <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Re‑enter new password" style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button onClick={handleUpdatePassword} disabled={passwordLoading} style={primaryBtnStyle}>
              {passwordLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Key size={16} />}
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}><UserX size={20} color="#DC2626" /> Account Settings</h3>

        {/* Deactivate Account */}
        <div style={rowStyle}>
          <div style={rowLabelStyle}>
            <UserX size={18} color="#64748B" />
            <div><div style={rowTextStyle}>Deactivate Account</div><div style={rowSubStyle}>Temporarily hide your profile. You can reactivate later.</div></div>
          </div>
          <button
            onClick={handleDeactivateAccount}
            disabled={actionLoading}
            style={{ ...dangerBtnStyle, background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FDE68A'}
            onMouseLeave={e => e.currentTarget.style.background = '#FEF3C7'}
          >
            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : 'Deactivate'}
          </button>
        </div>

        {/* Delete Account (permanent) */}
        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <div style={rowLabelStyle}>
            <Trash2 size={18} color="#DC2626" />
            <div><div style={rowTextStyle}>Delete Account</div><div style={rowSubStyle}>Permanently remove all your data. Cannot be undone.</div></div>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={actionLoading}
            style={{ ...dangerBtnStyle, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
            onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
          >
            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : 'Delete'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EmployeeSettings;