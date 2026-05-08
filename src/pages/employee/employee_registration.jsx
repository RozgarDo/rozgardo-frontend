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

  // Custom input toggle states
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

  const jobTypesList = ['Driver', 'Delivery', 'Cook', 'Cleaner', 'Helper', 'Electrician', 'Plumber', 'Security', 'Office Boy'];
  const languagesList = ['Hindi', 'English', 'Bengali', 'Nepali', 'Kannada'];
  const qualificationsList = ['Select qualification', 'No Formal Education', 'Below 10th', '10th Pass', '12th Pass', 'ITI', 'Diploma', 'Graduate', 'Post Graduate'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleToggleItem = (field, item) => {
    setFormData(prev => {
      const current = [...prev[field]];
      const updated = current.includes(item) ? current.filter(i => i !== item) : [...current, item];
      return { ...prev, [field]: updated };
    });
  };

  const handleAddCustom = (field, input, setInput, setShowInput) => {
    const trimmed = input.trim();
    if (trimmed && !formData[field].includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], trimmed]
      }));
    }
    setInput('');
    setShowInput(false);
  };

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

    // Use Vite environment variable
    // Make sure your .env file contains VITE_API_URL=http://localhost:5001
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

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
            
            {/* LEFT COLUMN - Branded Sidebar */}
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
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Full Name *</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type="text" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.fullName ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none`} 
                        placeholder="Ramesh Kumar" 
                      />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number *</label>
                    <div className="relative group">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type="tel" 
                        name="phoneNumber" 
                        value={formData.phoneNumber} 
                        onChange={handleInputChange} 
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.phoneNumber ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none`} 
                        placeholder="9876543210" 
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Email (Optional)</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none`} 
                        placeholder="ramesh@example.com" 
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Current Location *</label>
                    <div className="relative group">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type="text" 
                        name="currentLocation" 
                        value={formData.currentLocation} 
                        onChange={handleInputChange} 
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.currentLocation ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none`} 
                        placeholder="City, Area" 
                      />
                    </div>
                    {errors.currentLocation && <p className="text-red-500 text-xs mt-1">{errors.currentLocation}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Highest Qualification *</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <select 
                      name="highestQualification" 
                      value={formData.highestQualification} 
                      onChange={handleInputChange} 
                      className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errors.highestQualification ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none appearance-none`}
                    >
                      {qualificationsList.map(qual => <option key={qual} value={qual}>{qual}</option>)}
                    </select>
                  </div>
                  {errors.highestQualification && <p className="text-red-500 text-xs mt-1">{errors.highestQualification}</p>}
                </div>

                {/* Job Types */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Job Types Looking For *</label>
                  <div className="flex flex-wrap gap-2">
                    {jobTypesList.map(job => (
                      <button 
                        type="button" 
                        key={job} 
                        onClick={() => handleToggleItem('jobTypes', job)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${formData.jobTypes.includes(job) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                      >
                        {job}
                      </button>
                    ))}
                    {!showCustomJobInput ? (
                      <button type="button" onClick={() => setShowCustomJobInput(true)} className="px-4 py-2 rounded-xl text-sm font-medium border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50">
                        <Plus size={14} className="inline mr-1" /> Others
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input 
                          autoFocus 
                          type="text" 
                          value={customJobInput} 
                          onChange={(e) => setCustomJobInput(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCustom('jobTypes', customJobInput, setCustomJobInput, setShowCustomJobInput)} 
                          className="px-3 py-1.5 text-sm border-2 border-indigo-500 rounded-lg outline-none" 
                          placeholder="Enter role..." 
                        />
                        <button type="button" onClick={() => handleAddCustom('jobTypes', customJobInput, setCustomJobInput, setShowCustomJobInput)} className="text-indigo-600"><Check size={20} /></button>
                        <button type="button" onClick={() => { setShowCustomJobInput(false); setCustomJobInput(''); }} className="text-slate-400"><X size={20} /></button>
                      </div>
                    )}
                  </div>
                  {errors.jobTypes && <p className="text-red-500 text-xs mt-1">{errors.jobTypes}</p>}
                </div>

                {/* Languages */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Preferred Languages *</label>
                  <div className="flex flex-wrap gap-2">
                    {languagesList.map(lang => (
                      <button 
                        type="button" 
                        key={lang} 
                        onClick={() => handleToggleItem('preferredLanguages', lang)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${formData.preferredLanguages.includes(lang) ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                      >
                        {formData.preferredLanguages.includes(lang) && <Check size={14} className="inline mr-1" />}{lang}
                      </button>
                    ))}
                    {!showCustomLangInput ? (
                      <button type="button" onClick={() => setShowCustomLangInput(true)} className="px-4 py-2 rounded-xl text-sm font-medium border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50">
                        <Plus size={14} className="inline mr-1" /> Others
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input 
                          autoFocus 
                          type="text" 
                          value={customLangInput} 
                          onChange={(e) => setCustomLangInput(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCustom('preferredLanguages', customLangInput, setCustomLangInput, setShowCustomLangInput)} 
                          className="px-3 py-1.5 text-sm border-2 border-indigo-500 rounded-lg outline-none" 
                          placeholder="Enter language..." 
                        />
                        <button type="button" onClick={() => handleAddCustom('preferredLanguages', customLangInput, setCustomLangInput, setShowCustomLangInput)} className="text-indigo-600"><Check size={20} /></button>
                        <button type="button" onClick={() => { setShowCustomLangInput(false); setCustomLangInput(''); }} className="text-slate-400"><X size={20} /></button>
                      </div>
                    )}
                  </div>
                  {errors.preferredLanguages && <p className="text-red-500 text-xs mt-1">{errors.preferredLanguages}</p>}
                </div>

                {/* Passwords */}
                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Password *</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        name="password" 
                        value={formData.password}
                        onChange={handleInputChange} 
                        className={`w-full pl-11 pr-11 py-3 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none`} 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password *</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        name="confirmPassword" 
                        value={formData.confirmPassword}
                        onChange={handleInputChange} 
                        className={`w-full pl-11 pr-11 py-3 bg-slate-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none`} 
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {errors.api && (
                  <div className="text-red-600 text-sm mt-2 text-center bg-red-50 p-3 rounded-xl">{errors.api}</div>
                )}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all disabled:opacity-70 flex items-center justify-center gap-3 mt-4"
                >
                  {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Register as Job Seeker'}
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