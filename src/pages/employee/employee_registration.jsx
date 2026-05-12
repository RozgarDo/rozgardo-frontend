import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Phone, Mail, MapPin, GraduationCap,
  Lock, Eye, EyeOff, ArrowLeft, Shield,
  Plus, X, Check, Briefcase, Award, Search, Users, Smartphone, Globe
} from 'lucide-react';

const EmployeeRegistration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Custom input toggles
  const [showCustomJobInput, setShowCustomJobInput] = useState(false);
  const [customJobInput, setCustomJobInput] = useState('');
  const [showCustomLangInput, setShowCustomLangInput] = useState(false);
  const [customLangInput, setCustomLangInput] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    currentLocation: '',
    highestQualification: '',
    jobTypes: [],
    preferredLanguages: [],
    password: '',
    confirmPassword: ''
  });

  const jobTypesList = ['Driver', 'Delivery Boy', 'Chief', 'Cleaner', 'Kitchen Helper', 'Electrician', 'Steward', 'Security', 'Telecaller'];
  const languagesList = ['Hindi', 'English', 'Bengali', 'Nepali', 'Kannada'];
  const qualificationsList = ['Select qualification', 'No Formal Education', 'Below 10th', '10th Pass', '12th Pass', 'ITI', 'Diploma', 'Graduate', 'Post Graduate'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ----- Job Types handlers (chips + remove) -----
  const toggleJobType = (job) => {
    setFormData(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(job)
        ? prev.jobTypes.filter(j => j !== job)
        : [...prev.jobTypes, job]
    }));
    if (errors.jobTypes) setErrors(prev => ({ ...prev, jobTypes: '' }));
  };

  const removeJobType = (job) => {
    setFormData(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.filter(j => j !== job)
    }));
  };

  const addCustomJob = () => {
    const trimmed = customJobInput.trim();
    if (trimmed && !formData.jobTypes.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        jobTypes: [...prev.jobTypes, trimmed]
      }));
      if (errors.jobTypes) setErrors(prev => ({ ...prev, jobTypes: '' }));
    }
    setCustomJobInput('');
    setShowCustomJobInput(false);
  };

  const handleCustomJobKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomJob();
    }
  };

  // ----- Language handlers (chips + remove) -----
  const toggleLanguage = (lang) => {
    setFormData(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.includes(lang)
        ? prev.preferredLanguages.filter(l => l !== lang)
        : [...prev.preferredLanguages, lang]
    }));
    if (errors.preferredLanguages) setErrors(prev => ({ ...prev, preferredLanguages: '' }));
  };

  const removeLanguage = (lang) => {
    setFormData(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.filter(l => l !== lang)
    }));
  };

  const addCustomLanguage = () => {
    const trimmed = customLangInput.trim();
    if (trimmed && !formData.preferredLanguages.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        preferredLanguages: [...prev.preferredLanguages, trimmed]
      }));
      if (errors.preferredLanguages) setErrors(prev => ({ ...prev, preferredLanguages: '' }));
    }
    setCustomLangInput('');
    setShowCustomLangInput(false);
  };

  const handleCustomLanguageKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomLanguage();
    }
  };

  // ----- Validation (unchanged) -----
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.currentLocation.trim()) newErrors.currentLocation = 'Current location is required';
    if (!formData.highestQualification || formData.highestQualification === 'Select qualification')
      newErrors.highestQualification = 'Please select your highest qualification';
    if (formData.jobTypes.length === 0) newErrors.jobTypes = 'Select at least one job type';
    if (formData.preferredLanguages.length === 0) newErrors.preferredLanguages = 'Select at least one language';
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
      const response = await fetch(`${API_URL}/api/auth/employee-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email || undefined,
          currentLocation: formData.currentLocation,
          highestQualification: formData.highestQualification,
          jobTypes: formData.jobTypes,
          preferredLanguages: formData.preferredLanguages,
          password: formData.password
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      navigate('/employee-login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (error) {
      setErrors({ api: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-medium group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>

        <div className="bg-white rounded-[32px] shadow-2xl shadow-indigo-100/50 overflow-hidden border border-slate-100">
          <div className="grid md:grid-cols-12 gap-0">
            {/* LEFT COLUMN - Branded Sidebar (unchanged) */}
            <div className="md:col-span-5 bg-[#F1F4FF] p-10 lg:p-12 border-r border-slate-100">
              <div className="flex items-center gap-2 mb-10">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                  <Shield size={22} fill="currentColor" />
                </div>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">RozgarDo</span>
              </div>

              <div className="space-y-2 mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">Better <span className="text-indigo-600">Jobs.</span></h1>
                <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">Better <span className="text-indigo-600">Hiring.</span></h1>
                <p className="text-slate-500 text-lg mt-4 max-w-sm">India's most trusted platform connecting blue-collar workers with verified employers.</p>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-sm mb-10">
                <h3 className="flex items-center gap-2 text-indigo-900 font-bold mb-4"><Award size={20} className="text-indigo-600" /> Why RozgarDo?</h3>
                <div className="grid grid-cols-1 gap-y-3">
                  {[{ icon: <Shield size={16} />, text: 'Verified Employers', color: 'bg-green-100 text-green-700' },
                    { icon: <Search size={16} />, text: 'Fast Hiring Process', color: 'bg-blue-100 text-blue-700' },
                    { icon: <Users size={16} />, text: 'No Middlemen', color: 'bg-purple-100 text-purple-700' },
                    { icon: <Smartphone size={16} />, text: 'Simple to Use', color: 'bg-orange-100 text-orange-700' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${item.color}`}>{item.icon}</div>
                      <span className="text-slate-700 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <p className="text-slate-500">Already registered?</p>
                <button onClick={() => navigate('/employee-login')} className="text-indigo-600 font-bold hover:underline mt-1">Login to your account →</button>
              </div>
            </div>

            {/* RIGHT COLUMN - Form */}
            <div className="md:col-span-7 p-10 lg:p-14 bg-white">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Create your profile</h2>
                <p className="text-slate-500 mt-2">Fill in your details to get started</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name, Phone, Email, Location, Qualification fields (unchanged) */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Full Name *</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl" placeholder="Ramesh Kumar" />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number *</label>
                    <div className="relative group">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl" placeholder="9876543210" />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Email (Optional)</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl" placeholder="ramesh@example.com" />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Current Location *</label>
                    <div className="relative group">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" name="currentLocation" value={formData.currentLocation} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl" placeholder="City, Area" />
                    </div>
                    {errors.currentLocation && <p className="text-red-500 text-xs">{errors.currentLocation}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Highest Qualification *</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select name="highestQualification" value={formData.highestQualification} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl">
                      {qualificationsList.map(q => <option key={q}>{q}</option>)}
                    </select>
                  </div>
                  {errors.highestQualification && <p className="text-red-500 text-xs">{errors.highestQualification}</p>}
                </div>

                {/* ===== JOB TYPES SECTION (with chips) ===== */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Types Looking For *</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {jobTypesList.map(job => (
                      <button
                        type="button"
                        key={job}
                        onClick={() => toggleJobType(job)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          formData.jobTypes.includes(job)
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {formData.jobTypes.includes(job) && <Check size={12} className="inline mr-1" />}
                        {job}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowCustomJobInput(true)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      <Plus size={12} className="inline mr-1" />Others
                    </button>
                  </div>

                  {showCustomJobInput && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={customJobInput}
                        onChange={(e) => setCustomJobInput(e.target.value)}
                        onKeyDown={handleCustomJobKeyDown}
                        placeholder="Type job role and press Enter..."
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        autoFocus
                      />
                      <button type="button" onClick={addCustomJob} className="text-indigo-600 text-sm px-2">Add</button>
                      <button type="button" onClick={() => { setShowCustomJobInput(false); setCustomJobInput(''); }} className="text-slate-500 text-sm px-2">Cancel</button>
                    </div>
                  )}

                  {formData.jobTypes.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <p className="text-xs font-medium text-slate-500 mb-1">Selected:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.jobTypes.map(job => (
                          <span key={job} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                            {job}
                            <button type="button" onClick={() => removeJobType(job)} className="hover:bg-indigo-200 rounded-full p-0.5">
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.jobTypes && <p className="text-red-500 text-xs mt-1">{errors.jobTypes}</p>}
                </div>

                {/* ===== PREFERRED LANGUAGES SECTION (with chips) ===== */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Languages *</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {languagesList.map(lang => (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          formData.preferredLanguages.includes(lang)
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {formData.preferredLanguages.includes(lang) && <Check size={12} className="inline mr-1" />}
                        {lang}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowCustomLangInput(true)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      <Plus size={12} className="inline mr-1" />Others
                    </button>
                  </div>

                  {showCustomLangInput && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={customLangInput}
                        onChange={(e) => setCustomLangInput(e.target.value)}
                        onKeyDown={handleCustomLanguageKeyDown}
                        placeholder="Type language and press Enter..."
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        autoFocus
                      />
                      <button type="button" onClick={addCustomLanguage} className="text-indigo-600 text-sm px-2">Add</button>
                      <button type="button" onClick={() => { setShowCustomLangInput(false); setCustomLangInput(''); }} className="text-slate-500 text-sm px-2">Cancel</button>
                    </div>
                  )}

                  {formData.preferredLanguages.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <p className="text-xs font-medium text-slate-500 mb-1">Selected:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.preferredLanguages.map(lang => (
                          <span key={lang} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                            {lang}
                            <button type="button" onClick={() => removeLanguage(lang)} className="hover:bg-indigo-200 rounded-full p-0.5">
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.preferredLanguages && <p className="text-red-500 text-xs mt-1">{errors.preferredLanguages}</p>}
                </div>

                {/* Passwords (unchanged) */}
                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Password *</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className="w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-xl" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password *</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full pl-11 pr-11 py-3 bg-slate-50 border rounded-xl" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {errors.api && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-xl">{errors.api}</div>}

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg">
                  {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : 'Register as Job Seeker'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegistration;