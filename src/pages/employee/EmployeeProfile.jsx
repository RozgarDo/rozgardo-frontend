import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pencil, X, MapPin, Phone, Mail, Briefcase,
  FileText, Star, Loader2, Check, Camera, Trash2, Plus,
  GraduationCap, Globe
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EmployeeProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingSection, setEditingSection] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    country: 'India',
    bio: '',
    photo_url: '',
    skills: [],
    experience: [],
    job_type: 'Full-time',
    preferred_location: '',
    expected_salary: '',
    highest_qualification: '',
    job_types: [],
    preferred_languages: [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [newJobType, setNewJobType] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [showNewJobInput, setShowNewJobInput] = useState(false);
  const [showNewLangInput, setShowNewLangInput] = useState(false);

  const qualificationsList = [
    'No Formal Education', 'Below 10th', '10th Pass', '12th Pass',
    'ITI', 'Diploma', 'Graduate', 'Post Graduate'
  ];
  const jobTypesList = ['Driver', 'Delivery Boy / Rider', 'Chef / Cook', 'Housekeeping Staff',
    'Cleaner', 'Kitchen Helper', 'Electrician', 'Waiter / Steward', 'Security', 'Telecaller'];
  const languagesList = ['Hindi', 'English', 'Bengali', 'Nepali', 'Kannada'];

  // Fetch fresh user data on mount and when user.id changes
  useEffect(() => {
    if (user?.id && user.role === 'employee') {
      fetchLatestUserData();
    }
  }, [user?.id]);

  const fetchLatestUserData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        const latestUser = data.user;
        // Update local user state and localStorage
        setUser(latestUser);
        localStorage.setItem('user', JSON.stringify(latestUser));
        // Update form data
        setFormData({
          first_name: latestUser.first_name || latestUser.name?.split(' ')[0] || '',
          last_name: latestUser.last_name || latestUser.name?.split(' ').slice(1).join(' ') || '',
          email: latestUser.email || '',
          phone: latestUser.phone || '',
          location: latestUser.location || '',
          country: latestUser.country || 'India',
          bio: latestUser.bio || '',
          photo_url: latestUser.photo_url || '',
          skills: latestUser.skills || [],
          experience: latestUser.experience || [],
          job_type: latestUser.job_type || 'Full-time',
          preferred_location: latestUser.preferred_location || '',
          expected_salary: latestUser.expected_salary || '',
          highest_qualification: latestUser.highest_qualification || '',
          job_types: latestUser.job_types || [],
          preferred_languages: latestUser.preferred_languages || [],
        });
      }
    } catch (err) {
      console.error('Failed to fetch latest profile:', err);
    }
  };

  // Redirect non-employees
  useEffect(() => {
    if (user && user.role !== 'employee') {
      navigate('/');
    }
  }, [user, navigate]);

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

  // Skills
  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, s] }));
      setNewSkill('');
    }
  };
  const removeSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  // Experience
  const updateExperience = (idx, field, value) => {
    setFormData(prev => {
      const exp = [...prev.experience];
      exp[idx] = { ...exp[idx], [field]: value };
      return { ...prev, experience: exp };
    });
  };
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '' }]
    }));
  };
  const removeExperience = (idx) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx)
    }));
  };

  // Job Types
  const addJobType = () => {
    const j = newJobType.trim();
    if (j && !formData.job_types.includes(j)) {
      setFormData(prev => ({ ...prev, job_types: [...prev.job_types, j] }));
      setNewJobType('');
      setShowNewJobInput(false);
    }
  };
  const removeJobType = (job) => {
    setFormData(prev => ({ ...prev, job_types: prev.job_types.filter(j => j !== job) }));
  };

  // Languages
  const addLanguage = () => {
    const l = newLanguage.trim();
    if (l && !formData.preferred_languages.includes(l)) {
      setFormData(prev => ({ ...prev, preferred_languages: [...prev.preferred_languages, l] }));
      setNewLanguage('');
      setShowNewLangInput(false);
    }
  };
  const removeLanguage = (lang) => {
    setFormData(prev => ({ ...prev, preferred_languages: prev.preferred_languages.filter(l => l !== lang) }));
  };

  const completionPct = useMemo(() => {
    const fields = [
      formData.first_name, formData.last_name, formData.email, formData.phone,
      formData.location, formData.bio, formData.photo_url,
      formData.skills.length > 0, formData.experience.length > 0,
      formData.expected_salary, formData.highest_qualification,
      formData.job_types.length > 0, formData.preferred_languages.length > 0
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const payload = {
      ...formData,
      name: `${formData.first_name} ${formData.last_name}`.trim(),
      skills: formData.skills.join(', '),
      experience: JSON.stringify(formData.experience),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Refresh form data with latest
        setFormData({
          first_name: data.user.first_name || data.user.name?.split(' ')[0] || '',
          last_name: data.user.last_name || data.user.name?.split(' ').slice(1).join(' ') || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          location: data.user.location || '',
          country: data.user.country || 'India',
          bio: data.user.bio || '',
          photo_url: data.user.photo_url || '',
          skills: data.user.skills || [],
          experience: data.user.experience || [],
          job_type: data.user.job_type || 'Full-time',
          preferred_location: data.user.preferred_location || '',
          expected_salary: data.user.expected_salary || '',
          highest_qualification: data.user.highest_qualification || '',
          job_types: data.user.job_types || [],
          preferred_languages: data.user.preferred_languages || [],
        });
      } else {
        throw new Error(data.error || 'Update failed');
      }
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

  // Styles (unchanged from previous)
  const cardStyle = {
    background: 'white', borderRadius: '1rem', border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '1.5rem', position: 'relative',
  };
  const editBtnStyle = {
    position: 'absolute', top: '1.25rem', right: '1.25rem',
    background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.5rem',
    padding: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s',
  };
  const labelStyle = { fontSize: '0.7rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' };
  const inputStyle = {
    width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem',
    fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', background: '#F8FAFC',
  };
  const tagStyle = {
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    padding: '0.35rem 0.75rem', borderRadius: '9999px',
    fontSize: '0.8rem', fontWeight: 600, background: '#EEF2FF', color: '#4338CA',
    border: '1px solid #C7D2FE',
  };
  const primaryBtnStyle = {
    padding: '0.6rem 1.5rem', background: '#4F46E5', color: 'white', border: 'none',
    borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.35rem',
  };
  const ghostBtnStyle = {
    padding: '0.6rem 1.5rem', background: 'white', color: '#374151',
    border: '1px solid #E2E8F0', borderRadius: '0.5rem', fontWeight: 600,
    fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit',
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>Employee Profile</h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Manage your personal information, skills, qualifications and job preferences.</p>
        </div>
        {!editingSection ? (
          <button onClick={() => setEditingSection('personal')} style={primaryBtnStyle}>
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
        {completionPct < 100 && (
          <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.5rem' }}>Complete your profile to get better job matches.</p>
        )}
      </div>

      {/* ==================== PERSONAL INFORMATION ==================== */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {!isEditing('personal') && (
          <button style={editBtnStyle} onClick={() => setEditingSection('personal')}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: formData.photo_url ? 'transparent' : 'linear-gradient(135deg, #4F46E5, #6366F1)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #E5E7EB', position: 'relative' }}>
            {formData.photo_url ? (
              <img src={formData.photo_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1.75rem' }}>{(formData.first_name || 'U').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{formData.first_name} {formData.last_name}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Job Seeker</div>
          </div>
          {isEditing('personal') && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
              <button onClick={() => fileInputRef.current?.click()} style={{ ...ghostBtnStyle, padding: '0.4rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Camera size={14} /> Change
              </button>
              {formData.photo_url && (
                <button onClick={() => setFormData(p => ({ ...p, photo_url: '' }))} style={{ ...ghostBtnStyle, padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>
        {isEditing('personal') ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><div style={labelStyle}>First Name</div><input name="first_name" value={formData.first_name} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Last Name</div><input name="last_name" value={formData.last_name} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Email</div><input name="email" value={formData.email} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Phone</div><input name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Location</div><input name="location" value={formData.location} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Country</div><select name="country" value={formData.country} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}><option>India</option><option>USA</option><option>UK</option><option>Canada</option></select></div>
            <div style={{ gridColumn: '1 / -1' }}><div style={labelStyle}>Bio</div><textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Tell us about yourself..." style={{ ...inputStyle, resize: 'none', minHeight: '80px' }} /></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem' }}>
            <InfoField icon={<Mail size={15} color="#94A3B8" />} label="Email" value={formData.email || 'Not set'} missing={!formData.email} />
            <InfoField icon={<Phone size={15} color="#94A3B8" />} label="Phone" value={formData.phone || 'Not set'} missing={!formData.phone} />
            <InfoField icon={<MapPin size={15} color="#94A3B8" />} label="Location" value={formData.location ? `${formData.location}, ${formData.country}` : 'Not set'} missing={!formData.location} />
            {formData.bio && <div style={{ gridColumn: '1 / -1' }}><div style={labelStyle}>Bio</div><p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>{formData.bio}</p></div>}
          </div>
        )}
      </div>

      {/* ==================== HIGHEST QUALIFICATION ==================== */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {!isEditing('qualification') && (
          <button style={editBtnStyle} onClick={() => setEditingSection('qualification')}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GraduationCap size={18} color="#4F46E5" /> Highest Qualification
        </h3>
        {isEditing('qualification') ? (
          <select name="highest_qualification" value={formData.highest_qualification} onChange={handleChange} style={{ ...inputStyle, width: '100%' }}>
            <option value="">Select qualification</option>
            {qualificationsList.map(q => <option key={q}>{q}</option>)}
          </select>
        ) : (
          <InfoField label="Qualification" value={formData.highest_qualification || 'Not set'} missing={!formData.highest_qualification} />
        )}
      </div>

      {/* ==================== JOB TYPES LOOKING FOR ==================== */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {!isEditing('jobTypes') && (
          <button style={editBtnStyle} onClick={() => setEditingSection('jobTypes')}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={18} color="#4F46E5" /> Job Types Looking For
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {formData.job_types.map(job => (
            <span key={job} style={tagStyle}>
              {job}
              {isEditing('jobTypes') && (
                <button onClick={() => removeJobType(job)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <X size={13} color="#4338CA" />
                </button>
              )}
            </span>
          ))}
          {formData.job_types.length === 0 && <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic' }}>No job types added yet.</span>}
        </div>
        {isEditing('jobTypes') && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {jobTypesList.map(job => (
                <button key={job} type="button" onClick={() => {
                  if (!formData.job_types.includes(job)) {
                    setFormData(prev => ({ ...prev, job_types: [...prev.job_types, job] }));
                  }
                }} style={{ ...tagStyle, background: '#F1F5F9', color: '#334155' }}>{job}</button>
              ))}
              <button type="button" onClick={() => setShowNewJobInput(true)} style={{ ...tagStyle, background: '#F1F5F9' }}><Plus size={12} /> Add custom</button>
            </div>
            {showNewJobInput && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input type="text" value={newJobType} onChange={e => setNewJobType(e.target.value)} onKeyDown={e => e.key === 'Enter' && addJobType()} placeholder="Type job role" style={inputStyle} />
                <button onClick={addJobType} style={primaryBtnStyle}>Add</button>
                <button onClick={() => { setShowNewJobInput(false); setNewJobType(''); }} style={ghostBtnStyle}>Cancel</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================== PREFERRED LANGUAGES ==================== */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {!isEditing('languages') && (
          <button style={editBtnStyle} onClick={() => setEditingSection('languages')}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={18} color="#4F46E5" /> Preferred Languages
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {formData.preferred_languages.map(lang => (
            <span key={lang} style={tagStyle}>
              {lang}
              {isEditing('languages') && (
                <button onClick={() => removeLanguage(lang)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <X size={13} color="#4338CA" />
                </button>
              )}
            </span>
          ))}
          {formData.preferred_languages.length === 0 && <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic' }}>No languages added yet.</span>}
        </div>
        {isEditing('languages') && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {languagesList.map(lang => (
                <button key={lang} type="button" onClick={() => {
                  if (!formData.preferred_languages.includes(lang)) {
                    setFormData(prev => ({ ...prev, preferred_languages: [...prev.preferred_languages, lang] }));
                  }
                }} style={{ ...tagStyle, background: '#F1F5F9', color: '#334155' }}>{lang}</button>
              ))}
              <button type="button" onClick={() => setShowNewLangInput(true)} style={{ ...tagStyle, background: '#F1F5F9' }}><Plus size={12} /> Add custom</button>
            </div>
            {showNewLangInput && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input type="text" value={newLanguage} onChange={e => setNewLanguage(e.target.value)} onKeyDown={e => e.key === 'Enter' && addLanguage()} placeholder="Type language" style={inputStyle} />
                <button onClick={addLanguage} style={primaryBtnStyle}>Add</button>
                <button onClick={() => { setShowNewLangInput(false); setNewLanguage(''); }} style={ghostBtnStyle}>Cancel</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================== SKILLS ==================== */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {!isEditing('skills') && <button style={editBtnStyle} onClick={() => setEditingSection('skills')}><Pencil size={15} color="#64748B" /></button>}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={18} color="#4F46E5" /> Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: isEditing('skills') ? '1rem' : 0 }}>
          {formData.skills.map(skill => <span key={skill} style={tagStyle}>{skill}{isEditing('skills') && <button onClick={() => removeSkill(skill)}><X size={13} /></button>}</span>)}
          {formData.skills.length === 0 && <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic' }}>No skills added yet.</span>}
        </div>
        {isEditing('skills') && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="Add a skill..." style={{ ...inputStyle, flex: 1 }} />
            <button onClick={addSkill} style={{ ...primaryBtnStyle, padding: '0.5rem 1rem' }}><Plus size={16} /> Add</button>
          </div>
        )}
      </div>

      {/* ==================== EXPERIENCE ==================== */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {!isEditing('experience') && <button style={editBtnStyle} onClick={() => setEditingSection('experience')}><Pencil size={15} color="#64748B" /></button>}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={18} color="#4F46E5" /> Experience</h3>
        {formData.experience.map((exp, idx) => (
          <div key={idx} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '0.75rem', marginBottom: '0.75rem', position: 'relative' }}>
            {isEditing('experience') ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input value={exp.title} onChange={e => updateExperience(idx, 'title', e.target.value)} placeholder="Job title" style={inputStyle} />
                  <input value={exp.company} onChange={e => updateExperience(idx, 'company', e.target.value)} placeholder="Company" style={inputStyle} />
                  <input value={exp.duration} onChange={e => updateExperience(idx, 'duration', e.target.value)} placeholder="Duration" style={inputStyle} />
                </div>
                <button onClick={() => removeExperience(idx)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}><Trash2 size={14} color="#DC2626" /></button>
              </>
            ) : (
              <><div style={{ fontWeight: 700 }}>{exp.title || 'Untitled Role'}</div><div style={{ fontSize: '0.8rem', color: '#64748B' }}>{exp.company} &middot; {exp.duration}</div></>
            )}
          </div>
        ))}
        {formData.experience.length === 0 && <p style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic' }}>No experience added yet.</p>}
        {isEditing('experience') && <button onClick={addExperience} style={ghostBtnStyle}><Plus size={15} /> Add Experience</button>}
      </div>

      {/* ==================== JOB PREFERENCES ==================== */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {!isEditing('preferences') && <button style={editBtnStyle} onClick={() => setEditingSection('preferences')}><Pencil size={15} color="#64748B" /></button>}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={18} color="#4F46E5" /> Job Preferences</h3>
        {isEditing('preferences') ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <select name="job_type" value={formData.job_type} onChange={handleChange} style={inputStyle}><option>Full-time</option><option>Part-time</option><option>Contract</option></select>
            <input name="preferred_location" value={formData.preferred_location} onChange={handleChange} placeholder="Preferred location" style={inputStyle} />
            <input name="expected_salary" value={formData.expected_salary} onChange={handleChange} placeholder="Expected salary (monthly)" style={inputStyle} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem' }}>
            <InfoField label="Job Type" value={formData.job_type} />
            <InfoField label="Preferred Location" value={formData.preferred_location || 'Not set'} missing={!formData.preferred_location} />
            <InfoField label="Expected Salary" value={formData.expected_salary ? `₹ ${formData.expected_salary}/mo` : 'Not set'} missing={!formData.expected_salary} />
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
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
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

export default EmployeeProfile;