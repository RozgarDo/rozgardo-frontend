import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Key, AlertCircle, Loader2, Check } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AdminSettings = ({ user }) => {
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    if (passwordMessage.text) setPasswordMessage({ type: '', text: '' });
  };

  const handleUpdatePassword = async () => {
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
      const res = await fetch(`${API_BASE_URL}/api/auth/admin/change-password`, {
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
        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Manage your admin password.</p>
      </div>

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
          <div><div style={rowTextStyle}>Current Password</div><input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="Enter current password" style={inputStyle} /></div>
          <div><div style={rowTextStyle}>New Password</div><input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Min. 6 characters" style={inputStyle} /></div>
          <div><div style={rowTextStyle}>Confirm New Password</div><input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Re‑enter new password" style={inputStyle} /></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button onClick={handleUpdatePassword} disabled={passwordLoading} style={primaryBtnStyle}>
              {passwordLoading ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />} Update Password
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminSettings;