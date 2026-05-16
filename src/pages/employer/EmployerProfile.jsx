import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pencil, MapPin, Phone, Mail, Briefcase,
  Loader2, Check, Camera, Trash2, User,
  Globe, Users, Link as LinkIcon
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EmployerProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [initialized, setInitialized] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    hr_first_name: '',
    hr_last_name: '',
    hr_linkedin: '',
    email: '',
    phone: '',
    location: '',
    company_description: '',
    photo_url: '',
    website: '',
    industry: '',
    employee_count: '',
  });

  const industryOptions = [
    'Technology', 'Healthcare', 'Manufacturing', 'Retail',
    'Construction', 'Logistics & Transportation', 'Hospitality',
    'Education', 'Finance', 'Real Estate', 'Agriculture', 'Other'
  ];

  // Redirect non‑employers
  useEffect(() => {
    try {
      if (user && user.role !== 'employer') {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  }, [user, navigate]);

  // Fetch employer data
  useEffect(() => {
    try {
      if (user?.id && user.role === 'employer' && !initialized) {
        fetchLatestData();
      }
    } catch (err) {
      setError(err.message);
    }
  }, [user?.id, user?.role, initialized]);

  const fetchLatestData = async () => {
    try {
      if (!API_BASE_URL) {
        throw new Error('VITE_API_URL environment variable is not set');
      }
      const res = await fetch(`${API_BASE_URL}/api/auth/profile/${user.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      const latestUser = data.user;
      console.log('Fetched employer data:', latestUser); // Debug log
      setUser(latestUser);
      localStorage.setItem('user', JSON.stringify(latestUser));
      setFormData({
        company_name: latestUser.company_name || '',
        hr_first_name: latestUser.hr_first_name || '',
        hr_last_name: latestUser.hr_last_name || '',
        hr_linkedin: latestUser.hr_linkedin || '',
        email: latestUser.email || '',
        phone: latestUser.phone || '',
        location: latestUser.location || '',
        company_description: latestUser.company_description || '',
        photo_url: latestUser.photo_url || '',
        website: latestUser.website || '',
        industry: latestUser.industry || '',
        employee_count: latestUser.employee_count || '',
      });
      setInitialized(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be under 2MB' });
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photo_url: reader.result }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const completionPct = useMemo(() => {
    const fields = [
      formData.company_name, formData.hr_first_name, formData.hr_last_name,
      formData.email, formData.phone, formData.location,
      formData.company_description, formData.photo_url,
      formData.website, formData.industry, formData.employee_count
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const payload = {
      name: formData.company_name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      company_description: formData.company_description,
      photo_url: formData.photo_url,
      hr_first_name: formData.hr_first_name,
      hr_last_name: formData.hr_last_name,
      hr_linkedin: formData.hr_linkedin,
      website: formData.website,
      industry: formData.industry,
      employee_count: formData.employee_count,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Refresh form
      setFormData({
        company_name: data.user.company_name || '',
        hr_first_name: data.user.hr_first_name || '',
        hr_last_name: data.user.hr_last_name || '',
        hr_linkedin: data.user.hr_linkedin || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        location: data.user.location || '',
        company_description: data.user.company_description || '',
        photo_url: data.user.photo_url || '',
        website: data.user.website || '',
        industry: data.user.industry || '',
        employee_count: data.user.employee_count || '',
      });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
      setEditingSection(null);
    }
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setMessage({ type: '', text: '' });
  };

  const isEditing = (section) => editingSection === section;

  // Styles
  const cardStyle = {
    background: 'white', borderRadius: '1rem', border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '1.5rem', position: 'relative',
  };
  const editBtnStyle = {
    position: 'absolute', top: '1.25rem', right: '1.25rem',
    background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.5rem',
    padding: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  const labelStyle = { fontSize: '0.7rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' };
  const inputStyle = {
    width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem',
    fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', background: '#F8FAFC',
  };
  const primaryBtnStyle = {
    padding: '0.6rem 1.5rem', background: '#4F46E5', color: 'white', border: 'none',
    borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.35rem',
  };
  const ghostBtnStyle = {
    padding: '0.6rem 1.5rem', background: 'white', color: '#374151',
    border: '1px solid #E2E8F0', borderRadius: '0.5rem', fontWeight: 600,
    fontSize: '0.85rem', cursor: 'pointer',
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
          <h2 className="text-red-600 font-bold text-xl mb-2">Error Loading Profile</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Reload</button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (user.role !== 'employer') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">This page is only for employers.</p>
          <button onClick={() => navigate('/')} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>Employer Profile</h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Manage your company information and hiring preferences.</p>
        </div>
        {!editingSection ? (
          <button onClick={() => setEditingSection('company')} style={primaryBtnStyle}>
            <Pencil size={15} /> Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={cancelEdit} style={ghostBtnStyle}>Cancel</button>
            <button onClick={handleSave} disabled={loading} style={primaryBtnStyle}>
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          padding: '0.875rem 1rem', borderRadius: '0.75rem', marginBottom: '1.5rem',
          fontSize: '0.875rem', fontWeight: 600,
          background: message.type === 'success' ? '#F0FDF4' : '#FEF2F2',
          color: message.type === 'success' ? '#166534' : '#991B1B',
          border: `1px solid ${message.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
        }}>
          {message.text}
        </div>
      )}

      {/* Profile Completion */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Profile Completion</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: completionPct === 100 ? '#059669' : '#4F46E5' }}>{completionPct}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${completionPct}%`, height: '100%', background: completionPct === 100 ? '#059669' : 'linear-gradient(to right, #4F46E5, #6366F1)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
        </div>
        <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.5rem' }}>Complete your profile to attract better candidates.</p>
      </div>

      {/* COMPANY LOGO & BASIC INFO */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {!isEditing('company') && (
          <button style={editBtnStyle} onClick={() => setEditingSection('company')}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: formData.photo_url ? 'transparent' : 'linear-gradient(135deg, #4F46E5, #6366F1)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #E5E7EB' }}>
            {formData.photo_url ? (
              <img src={formData.photo_url} alt="Company Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1.75rem' }}>{(formData.company_name || 'C').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{formData.company_name || 'Company Name'}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Employer</div>
          </div>
          {isEditing('company') && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
              <button onClick={() => fileInputRef.current?.click()} style={{ ...ghostBtnStyle, padding: '0.4rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Camera size={14} /> Change Logo
              </button>
              {formData.photo_url && (
                <button onClick={() => setFormData(p => ({ ...p, photo_url: '' }))} style={{ ...ghostBtnStyle, padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {isEditing('company') ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><div style={labelStyle}>Company Name</div><input name="company_name" value={formData.company_name} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Email</div><input name="email" value={formData.email} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Phone</div><input name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Location</div><input name="location" value={formData.location} onChange={handleChange} style={inputStyle} /></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem' }}>
            <InfoField icon={<Mail size={15} color="#94A3B8" />} label="Email" value={formData.email || 'Not set'} missing={!formData.email} />
            <InfoField icon={<Phone size={15} color="#94A3B8" />} label="Phone" value={formData.phone || 'Not set'} missing={!formData.phone} />
            <InfoField icon={<MapPin size={15} color="#94A3B8" />} label="Location" value={formData.location || 'Not set'} missing={!formData.location} />
          </div>
        )}
      </div>

      {/* HR CONTACT DETAILS */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {!isEditing('hr') && (
          <button style={editBtnStyle} onClick={() => setEditingSection('hr')}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={18} color="#4F46E5" /> HR Contact Person
        </h3>
        {isEditing('hr') ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><div style={labelStyle}>First Name</div><input name="hr_first_name" value={formData.hr_first_name} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Last Name</div><input name="hr_last_name" value={formData.hr_last_name} onChange={handleChange} style={inputStyle} /></div>
          </div>
        ) : (
          <InfoField icon={<User size={15} color="#94A3B8" />} label="HR Name" value={`${formData.hr_first_name || ''} ${formData.hr_last_name || ''}`.trim() || 'Not set'} missing={!formData.hr_first_name && !formData.hr_last_name} />
        )}
      </div>

      {/* HR LINKEDIN PROFILE - Fixed to show clickable link */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {!isEditing('linkedin') && (
          <button style={editBtnStyle} onClick={() => setEditingSection('linkedin')}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LinkIcon size={18} color="#4F46E5" /> HR LinkedIn Profile
        </h3>
        {isEditing('linkedin') ? (
          <input name="hr_linkedin" value={formData.hr_linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" style={inputStyle} />
        ) : (
          <div>
            <div style={labelStyle}>LinkedIn</div>
            {formData.hr_linkedin ? (
              <a href={formData.hr_linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#4F46E5', textDecoration: 'underline' }}>
                {formData.hr_linkedin}
              </a>
            ) : (
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#CBD5E1', fontStyle: 'italic' }}>Not set</span>
            )}
          </div>
        )}
      </div>

      {/* COMPANY DESCRIPTION */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {!isEditing('description') && (
          <button style={editBtnStyle} onClick={() => setEditingSection('description')}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={18} color="#4F46E5" /> Company Description
        </h3>
        {isEditing('description') ? (
          <textarea name="company_description" value={formData.company_description} onChange={handleChange} rows={4} placeholder="Tell candidates about your company, mission, values, etc." style={{ ...inputStyle, resize: 'vertical' }} />
        ) : (
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {formData.company_description || 'No description provided.'}
          </p>
        )}
      </div>

      {/* ADDITIONAL INFORMATION */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {!isEditing('additional') && (
          <button style={editBtnStyle} onClick={() => setEditingSection('additional')}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={18} color="#4F46E5" /> Additional Information
        </h3>
        {isEditing('additional') ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><div style={labelStyle}>Website</div><input name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" style={inputStyle} /></div>
            <div><div style={labelStyle}>Industry</div><select name="industry" value={formData.industry} onChange={handleChange} style={inputStyle}>
              <option value="">Select industry</option>
              {industryOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select></div>
            <div><div style={labelStyle}>Employee Count</div><input name="employee_count" value={formData.employee_count} onChange={handleChange} placeholder="e.g., 50-100" style={inputStyle} /></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem' }}>
            <InfoField icon={<LinkIcon size={15} color="#94A3B8" />} label="Website" value={formData.website || 'Not set'} missing={!formData.website} />
            <InfoField icon={<Briefcase size={15} color="#94A3B8" />} label="Industry" value={formData.industry || 'Not set'} missing={!formData.industry} />
            <InfoField icon={<Users size={15} color="#94A3B8" />} label="Employee Count" value={formData.employee_count || 'Not set'} missing={!formData.employee_count} />
          </div>
        )}
      </div>

      {editingSection && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1.5rem 0' }}>
          <button onClick={cancelEdit} style={ghostBtnStyle}>Cancel</button>
          <button onClick={handleSave} disabled={loading} style={primaryBtnStyle}>
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
            Save Changes
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const InfoField = ({ icon, label, value, missing }) => (
  <div>
    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
      {icon} {label}
    </div>
    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: missing ? '#CBD5E1' : '#0F172A', fontStyle: missing ? 'italic' : 'normal' }}>
      {value}
    </div>
  </div>
);

export default EmployerProfile;