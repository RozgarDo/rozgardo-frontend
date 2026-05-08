import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployerRegistration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    companyName: '',
    officeLocation: '',
    hrFirstName: '',
    hrLastName: '',
    officialEmail: '',
    contactNumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.officeLocation.trim()) newErrors.officeLocation = 'Office location is required';
    if (!formData.hrFirstName.trim()) newErrors.hrFirstName = 'HR first name is required';
    if (!formData.hrLastName.trim()) newErrors.hrLastName = 'HR last name is required';
    if (!formData.officialEmail.trim()) newErrors.officialEmail = 'Official email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.officialEmail)) newErrors.officialEmail = 'Enter a valid email address';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    else if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = 'Contact number must be 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${API_URL}/api/auth/employer-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName,
          officeLocation: formData.officeLocation,
          hrFirstName: formData.hrFirstName,
          hrLastName: formData.hrLastName,
          officialEmail: formData.officialEmail,
          contactNumber: formData.contactNumber,
          password: formData.password
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      navigate('/employer-login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (error) {
      console.error('Fetch error:', error);
      setErrors({ api: error.message });
    } finally {
      setLoading(false);
    }
  };

  // ---------- Icons (same as original) ----------
  const Icon = ({ path, size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {path}
    </svg>
  );

  const paths = {
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    building: <><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" /></>,
    mapPin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
    award: <><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-medium group">
          <Icon path={paths.arrowLeft} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>

        <div className="bg-white rounded-[32px] shadow-2xl shadow-indigo-100/50 overflow-hidden border border-slate-100">
          <div className="grid md:grid-cols-12 gap-0">
            {/* LEFT COLUMN - Branding */}
            <div className="md:col-span-5 bg-[#F1F4FF] p-10 lg:p-12 border-r border-slate-100">
              <div className="flex items-center gap-2 mb-10">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><Icon path={paths.shield} size={22} className="fill-current" /></div>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">RozgarDo</span>
              </div>
              <div className="space-y-2 mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">Hire <span className="text-indigo-600 font-black italic underline decoration-indigo-200">Faster.</span></h1>
                <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">Hire <span className="text-indigo-600 font-black italic underline decoration-indigo-200">Better.</span></h1>
                <p className="text-slate-500 text-lg mt-4 max-w-sm">Join India's leading platform to connect with verified talent.</p>
              </div>
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm mb-10">
                <h3 className="flex items-center gap-2 text-indigo-900 font-bold mb-4"><Icon path={paths.award} className="text-indigo-600" /> Why RozgarDo?</h3>
                <div className="space-y-4">
                  {[{ text: 'Verified Job Seekers', color: 'bg-green-100 text-green-700' }, { text: 'Unlimited Job Postings', color: 'bg-blue-100 text-blue-700' }, { text: 'Direct Contact Access', color: 'bg-purple-100 text-purple-700' }].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${item.color}`}><Icon path={paths.check} size={14} /></div>
                      <span className="text-slate-700 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-slate-200">
                <p className="text-slate-500">Already a partner?</p>
                <button onClick={() => navigate('/employer-login')} className="text-indigo-600 font-bold hover:underline mt-1">Employer Login →</button>
              </div>
            </div>

            {/* RIGHT COLUMN - Form */}
            <div className="md:col-span-7 p-10 lg:p-14 bg-white">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Company Profile</h2>
                <p className="text-slate-500 mt-2">Fill in your business details to start hiring</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Name & Location */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Company Name *</label>
                    <div className="relative group">
                      <Icon path={paths.building} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.companyName ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none`} placeholder="e.g. ABC Logistics" />
                    </div>
                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Office Location *</label>
                    <div className="relative group">
                      <Icon path={paths.mapPin} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" name="officeLocation" value={formData.officeLocation} onChange={handleInputChange} className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.officeLocation ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none`} placeholder="City, Area" />
                    </div>
                    {errors.officeLocation && <p className="text-red-500 text-xs mt-1">{errors.officeLocation}</p>}
                  </div>
                </div>

                {/* HR Names */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">HR First Name *</label>
                    <div className="relative group">
                      <Icon path={paths.user} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" name="hrFirstName" value={formData.hrFirstName} onChange={handleInputChange} className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.hrFirstName ? 'border-red-500' : 'border-slate-200'} rounded-xl`} placeholder="First Name" />
                    </div>
                    {errors.hrFirstName && <p className="text-red-500 text-xs mt-1">{errors.hrFirstName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">HR Last Name *</label>
                    <div className="relative group">
                      <Icon path={paths.user} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" name="hrLastName" value={formData.hrLastName} onChange={handleInputChange} className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.hrLastName ? 'border-red-500' : 'border-slate-200'} rounded-xl`} placeholder="Last Name" />
                    </div>
                    {errors.hrLastName && <p className="text-red-500 text-xs mt-1">{errors.hrLastName}</p>}
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Official Email *</label>
                    <div className="relative group">
                      <Icon path={paths.mail} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="email" name="officialEmail" value={formData.officialEmail} onChange={handleInputChange} className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.officialEmail ? 'border-red-500' : 'border-slate-200'} rounded-xl`} placeholder="hr@company.com" />
                    </div>
                    {errors.officialEmail && <p className="text-red-500 text-xs mt-1">{errors.officialEmail}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Contact Number *</label>
                    <div className="relative group">
                      <Icon path={paths.phone} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.contactNumber ? 'border-red-500' : 'border-slate-200'} rounded-xl`} placeholder="9876543210" />
                    </div>
                    {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Password *</label>
                    <div className="relative group">
                      <Icon path={paths.lock} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className={`w-full pl-11 pr-11 py-3 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Icon path={paths.eye} /></button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password *</label>
                    <div className="relative group">
                      <Icon path={paths.lock} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full pl-11 pr-11 py-3 bg-slate-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} rounded-xl`} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Icon path={paths.eye} /></button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {errors.api && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-xl">{errors.api}</div>}

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-3 mt-4">
                  {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Register as Employer'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};





export default EmployerRegistration;