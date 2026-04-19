import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Building2, Check, Sparkles, TrendingUp, Clock, MapPin, Phone, Mail, 
  User, Shield, Award, Plus, X, Link2, GraduationCap, Users as UsersIcon, 
  MapPin as MapPinIcon, Rocket, DollarSign, Map, Users as UsersIcon2, UserCheck, 
  HardHat, Smartphone, ArrowLeft
} from 'lucide-react';
import Footer from '../../components/Footer';  // <-- FIXED: two levels up

const Registration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('employee');

  // Employee Form State
  const [employeeForm, setEmployeeForm] = useState({
    fullName: '', phone: '', email: '', currentLocation: '',
    highestQualification: '', customQualification: '',
    selectedJobTypes: [], preferredLanguages: []
  });

  // HR Form State
  const [hrForm, setHrForm] = useState({
    companyName: '', officeLocation: '', hrFirstName: '', hrLastName: '',
    hrEmail: '', hrPhone: '', linkedinProfile: '', totalCandidatesRequired: '',
    jobLocation: '', selectedJobCategories: []
  });

  const [employeeErrors, setEmployeeErrors] = useState({});
  const [hrErrors, setHrErrors] = useState({});
  const [employeeSuccess, setEmployeeSuccess] = useState(false);
  const [hrSuccess, setHrSuccess] = useState(false);

  // Custom inputs
  const [customJobInput, setCustomJobInput] = useState('');
  const [showCustomJobInput, setShowCustomJobInput] = useState(false);
  const [customLanguageInput, setCustomLanguageInput] = useState('');
  const [showCustomLanguageInput, setShowCustomLanguageInput] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [showCustomQualificationInput, setShowCustomQualificationInput] = useState(false);

  const jobOptions = ['Driver', 'Delivery', 'Cook', 'Cleaner', 'Helper', 'Electrician', 'Plumber', 'Security', 'Office Boy'];
  const predefinedLanguages = ['Hindi', 'English', 'Bengali', 'Nepali','Kannada'];
  const predefinedCategories = ['Driver', 'Delivery', 'Cook', 'Cleaner', 'Helper', 'Electrician', 'Plumber', 'Security', 'Office Staff', 'Warehouse'];
  const qualificationOptions = [
    'No Formal Education', 'Primary School (up to 5th)', 'Middle School (up to 8th)',
    'High School (10th)', 'Intermediate (12th)', 'Diploma', 'Bachelor\'s Degree',
    'Master\'s Degree', 'PhD', 'Others'
  ];

  // --- Employee handlers ---
  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm(prev => ({ ...prev, [name]: value }));
    if (employeeErrors[name]) setEmployeeErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'highestQualification' && value !== 'Others') {
      setEmployeeForm(prev => ({ ...prev, customQualification: '' }));
      setShowCustomQualificationInput(false);
    }
    if (name === 'highestQualification' && value === 'Others') {
      setShowCustomQualificationInput(true);
    }
  };

  const handleCustomQualificationChange = (e) => {
    setEmployeeForm(prev => ({ ...prev, customQualification: e.target.value }));
    if (employeeErrors.highestQualification) setEmployeeErrors(prev => ({ ...prev, highestQualification: '' }));
  };

  const togglePredefinedJob = (job) => {
    setEmployeeForm(prev => ({
      ...prev,
      selectedJobTypes: prev.selectedJobTypes.includes(job)
        ? prev.selectedJobTypes.filter(j => j !== job)
        : [...prev.selectedJobTypes, job]
    }));
    if (employeeErrors.selectedJobTypes) setEmployeeErrors(prev => ({ ...prev, selectedJobTypes: '' }));
  };

  const removeSelectedJob = (job) => {
    setEmployeeForm(prev => ({ ...prev, selectedJobTypes: prev.selectedJobTypes.filter(j => j !== job) }));
  };

  const handleOthersJobClick = () => setShowCustomJobInput(true);
  const handleAddCustomJob = (e) => {
    if (e.key === 'Enter' && customJobInput.trim()) {
      const newJob = customJobInput.trim();
      if (!employeeForm.selectedJobTypes.includes(newJob)) {
        setEmployeeForm(prev => ({ ...prev, selectedJobTypes: [...prev.selectedJobTypes, newJob] }));
      }
      setCustomJobInput('');
      setShowCustomJobInput(false);
      if (employeeErrors.selectedJobTypes) setEmployeeErrors(prev => ({ ...prev, selectedJobTypes: '' }));
    }
  };
  const cancelCustomJob = () => { setCustomJobInput(''); setShowCustomJobInput(false); };

  // Language handlers
  const togglePredefinedLanguage = (lang) => {
    setEmployeeForm(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.includes(lang)
        ? prev.preferredLanguages.filter(l => l !== lang)
        : [...prev.preferredLanguages, lang]
    }));
    if (employeeErrors.preferredLanguages) setEmployeeErrors(prev => ({ ...prev, preferredLanguages: '' }));
  };
  const removeSelectedLanguage = (lang) => {
    setEmployeeForm(prev => ({ ...prev, preferredLanguages: prev.preferredLanguages.filter(l => l !== lang) }));
  };
  const handleOthersLanguageClick = () => setShowCustomLanguageInput(true);
  const handleAddCustomLanguage = (e) => {
    if (e.key === 'Enter' && customLanguageInput.trim()) {
      const newLang = customLanguageInput.trim();
      if (!employeeForm.preferredLanguages.includes(newLang)) {
        setEmployeeForm(prev => ({ ...prev, preferredLanguages: [...prev.preferredLanguages, newLang] }));
      }
      setCustomLanguageInput('');
      setShowCustomLanguageInput(false);
      if (employeeErrors.preferredLanguages) setEmployeeErrors(prev => ({ ...prev, preferredLanguages: '' }));
    }
  };
  const cancelCustomLanguage = () => { setCustomLanguageInput(''); setShowCustomLanguageInput(false); };

  // HR handlers
  const handleHrChange = (e) => {
    const { name, value } = e.target;
    setHrForm(prev => ({ ...prev, [name]: value }));
    if (hrErrors[name]) setHrErrors(prev => ({ ...prev, [name]: '' }));
  };
  const togglePredefinedCategory = (cat) => {
    setHrForm(prev => ({
      ...prev,
      selectedJobCategories: prev.selectedJobCategories.includes(cat)
        ? prev.selectedJobCategories.filter(c => c !== cat)
        : [...prev.selectedJobCategories, cat]
    }));
    if (hrErrors.selectedJobCategories) setHrErrors(prev => ({ ...prev, selectedJobCategories: '' }));
  };
  const removeSelectedCategory = (cat) => {
    setHrForm(prev => ({ ...prev, selectedJobCategories: prev.selectedJobCategories.filter(c => c !== cat) }));
  };
  const handleOthersCategoryClick = () => setShowCustomCategoryInput(true);
  const handleAddCustomCategory = (e) => {
    if (e.key === 'Enter' && customCategoryInput.trim()) {
      const newCat = customCategoryInput.trim();
      if (!hrForm.selectedJobCategories.includes(newCat)) {
        setHrForm(prev => ({ ...prev, selectedJobCategories: [...prev.selectedJobCategories, newCat] }));
      }
      setCustomCategoryInput('');
      setShowCustomCategoryInput(false);
      if (hrErrors.selectedJobCategories) setHrErrors(prev => ({ ...prev, selectedJobCategories: '' }));
    }
  };
  const cancelCustomCategory = () => { setCustomCategoryInput(''); setShowCustomCategoryInput(false); };

  // Validation
  const validateEmployeeForm = () => {
    const errors = {};
    if (!employeeForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!employeeForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(employeeForm.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }
    if (employeeForm.email.trim() && !/^\S+@\S+\.\S+$/.test(employeeForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!employeeForm.currentLocation.trim()) errors.currentLocation = 'Current location is required';
    if (!employeeForm.highestQualification) {
      errors.highestQualification = 'Please select your highest qualification';
    } else if (employeeForm.highestQualification === 'Others' && !employeeForm.customQualification.trim()) {
      errors.highestQualification = 'Please specify your qualification';
    }
    if (employeeForm.selectedJobTypes.length === 0) errors.selectedJobTypes = 'Please select at least one job type';
    if (employeeForm.preferredLanguages.length === 0) errors.preferredLanguages = 'Please select at least one preferred language';
    setEmployeeErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateHrForm = () => {
    const errors = {};
    if (!hrForm.companyName.trim()) errors.companyName = 'Company name is required';
    if (!hrForm.officeLocation.trim()) errors.officeLocation = 'Office location is required';
    if (!hrForm.hrFirstName.trim()) errors.hrFirstName = 'First name is required';
    if (!hrForm.hrLastName.trim()) errors.hrLastName = 'Last name is required';
    if (!hrForm.hrEmail.trim()) {
      errors.hrEmail = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(hrForm.hrEmail)) {
      errors.hrEmail = 'Please enter a valid email address';
    }
    if (!hrForm.hrPhone.trim()) {
      errors.hrPhone = 'Contact number is required';
    } else if (!/^\d{10}$/.test(hrForm.hrPhone)) {
      errors.hrPhone = 'Contact number must be exactly 10 digits';
    }
    if (!hrForm.totalCandidatesRequired) {
      errors.totalCandidatesRequired = 'Please enter number of candidates required';
    } else if (parseInt(hrForm.totalCandidatesRequired) < 1) {
      errors.totalCandidatesRequired = 'Must be at least 1 candidate';
    }
    if (!hrForm.jobLocation.trim()) errors.jobLocation = 'Job location is required';
    if (hrForm.selectedJobCategories.length === 0) errors.selectedJobCategories = 'Please select at least one job category';
    setHrErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmployeeSubmit = (e) => {
    e.preventDefault();
    if (validateEmployeeForm()) {
      const submissionData = {
        ...employeeForm,
        highestQualification: employeeForm.highestQualification === 'Others' 
          ? employeeForm.customQualification 
          : employeeForm.highestQualification
      };
      console.log('Employee Registration:', submissionData);
      setEmployeeSuccess(true);
      setTimeout(() => setEmployeeSuccess(false), 3000);
    }
  };

  const handleHrSubmit = (e) => {
    e.preventDefault();
    if (validateHrForm()) {
      console.log('HR Registration:', hrForm);
      setHrSuccess(true);
      setTimeout(() => setHrSuccess(false), 3000);
    }
  };

  // Particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${15 + Math.random() * 20}s`,
    size: `${2 + Math.random() * 5}px`,
    opacity: 0.08 + Math.random() * 0.15
  }));

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Background elements */}
      <div className="fixed inset-0 bg-gradient-to-r from-indigo-100/20 via-purple-100/20 to-blue-100/20 animate-gradient-xy"></div>
      <div className="fixed inset-0 pointer-events-none">
        {particles.map(p => (
          <div key={p.id} className="absolute rounded-full bg-indigo-400/30 blur-sm animate-float"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity }} />
        ))}
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Main content - flex-1 pushes footer down */}
      <main className="relative z-10 flex-1">
        <div className="relative z-10">
          {/* Back button */}
          <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-6">
            <button
              onClick={() => navigate('/onboarding')}
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
              <span>Back</span>
            </button>
          </div>

          {/* Tab Toggle and Forms */}
          <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8 md:py-12">
            <div className="flex justify-center mb-12">
              <div className="relative bg-white/60 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-white/50 flex w-full max-w-2xl mx-auto">
                <div className="absolute top-1.5 bottom-1.5 left-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl transition-transform duration-300 ease-out"
                  style={{ width: 'calc(50% - 6px)', transform: activeTab === 'employee' ? 'translateX(0)' : 'translateX(100%)' }} />
                <button onClick={() => setActiveTab('employee')}
                  className="relative z-10 flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap text-sm md:text-lg"
                  style={{ color: activeTab === 'employee' ? 'white' : '#334155' }}>
                  <Briefcase size={20} /> <span>I am looking for a Job</span>
                </button>
                <button onClick={() => setActiveTab('hr')}
                  className="relative z-10 flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors duration-300 whitespace-nowrap text-sm md:text-lg"
                  style={{ color: activeTab === 'hr' ? 'white' : '#334155' }}>
                  <Building2 size={20} /> <span>I am Hiring</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
              {/* Left infographics */}
              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Bridge to <span className="text-indigo-600">Better Opportunities</span></h1>
                  <p className="text-slate-600 text-base">India's fastest-growing platform connecting blue-collar workers with verified employers.</p>
                </div>
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50">
                  <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-indigo-600" /> Why RozgarDo?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-green-600" /><span className="text-slate-700 text-sm">Verified Employers</span></div>
                    <div className="flex items-center gap-3"><Rocket className="w-5 h-5 text-indigo-500" /><span className="text-slate-700 text-sm">Fast Hiring Process</span></div>
                    <div className="flex items-center gap-3"><DollarSign className="w-5 h-5 text-emerald-600" /><span className="text-slate-700 text-sm">Zero Fees for Workers</span></div>
                    <div className="flex items-center gap-3"><Map className="w-5 h-5 text-blue-500" /><span className="text-slate-700 text-sm">Local Job Matching</span></div>
                    <div className="flex items-center gap-3"><UsersIcon2 className="w-5 h-5 text-purple-500" /><span className="text-slate-700 text-sm">No Middlemen</span></div>
                    <div className="flex items-center gap-3"><UserCheck className="w-5 h-5 text-orange-500" /><span className="text-slate-700 text-sm">Direct Hiring</span></div>
                    <div className="flex items-center gap-3"><HardHat className="w-5 h-5 text-amber-600" /><span className="text-slate-700 text-sm">Blue-Collar Focused</span></div>
                    <div className="flex items-center gap-3"><Smartphone className="w-5 h-5 text-teal-500" /><span className="text-slate-700 text-sm">Simple to Use</span></div>
                  </div>
                </div>

              </div>

              {/* Right Column - Forms */}
              <div className="transition-all duration-500 ease-in-out">
                {activeTab === 'employee' && (
                  <div key="employee-form" className="animate-fadeInUp">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-100 rounded-xl"><Sparkles className="w-6 h-6 text-indigo-600" /></div>
                        <div><h2 className="text-2xl md:text-3xl font-bold text-slate-800">Create your profile</h2><p className="text-slate-500 mt-1">Get discovered by top employers hiring in your area.</p></div>
                      </div>
                      <form onSubmit={handleEmployeeSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" name="fullName" value={employeeForm.fullName} onChange={handleEmployeeChange} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${employeeErrors.fullName ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base`} placeholder="e.g., Ramesh Kumar" /></div>{employeeErrors.fullName && <p className="text-red-500 text-xs mt-1">{employeeErrors.fullName}</p>}</div>
                          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="tel" name="phone" value={employeeForm.phone} onChange={handleEmployeeChange} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${employeeErrors.phone ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base`} placeholder="10-digit mobile number" /></div>{employeeErrors.phone && <p className="text-red-500 text-xs mt-1">{employeeErrors.phone}</p>}</div>
                        </div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address <span className="text-slate-400 text-xs font-normal">(optional)</span></label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="email" name="email" value={employeeForm.email} onChange={handleEmployeeChange} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${employeeErrors.email ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base`} placeholder="you@example.com" /></div>{employeeErrors.email && <p className="text-red-500 text-xs mt-1">{employeeErrors.email}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Current Location *</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" name="currentLocation" value={employeeForm.currentLocation} onChange={handleEmployeeChange} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${employeeErrors.currentLocation ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base`} placeholder="City, Area (e.g., Delhi, Noida)" /></div>{employeeErrors.currentLocation && <p className="text-red-500 text-xs mt-1">{employeeErrors.currentLocation}</p>}</div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Highest Educational Qualification *</label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select name="highestQualification" value={employeeForm.highestQualification} onChange={handleEmployeeChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${employeeErrors.highestQualification ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base appearance-none`}>
                              <option value="">Select qualification</option>
                              {qualificationOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                            </select>
                          </div>
                          {employeeErrors.highestQualification && <p className="text-red-500 text-xs mt-1">{employeeErrors.highestQualification}</p>}
                          {showCustomQualificationInput && (
                            <div className="mt-3 animate-fadeIn">
                              <input type="text" value={employeeForm.customQualification} onChange={handleCustomQualificationChange}
                                placeholder="Please specify your qualification"
                                className="w-full px-4 py-2 rounded-xl border border-indigo-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm" />
                            </div>
                          )}
                        </div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-2">Types of Jobs looking for *</label><div className="flex flex-wrap gap-3 mb-3">{jobOptions.map(job => (<button type="button" key={job} onClick={() => togglePredefinedJob(job)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${employeeForm.selectedJobTypes.includes(job) ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' : 'bg-white/80 text-slate-700 hover:bg-indigo-50 border border-slate-200'}`}>{employeeForm.selectedJobTypes.includes(job) && <Check size={14} className="inline mr-1.5" />}{job}</button>))}<button type="button" onClick={handleOthersJobClick} className="px-4 py-2 rounded-full text-sm font-medium bg-white/80 text-slate-700 hover:bg-indigo-50 border border-slate-200 transition-all duration-200 hover:scale-105"><Plus size={14} className="inline mr-1.5" />Others</button></div>{showCustomJobInput && (<div className="mt-3 flex items-center gap-2 animate-fadeIn"><div className="relative flex-1"><Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" /><input type="text" value={customJobInput} onChange={(e) => setCustomJobInput(e.target.value)} onKeyDown={handleAddCustomJob} placeholder="Type custom job role and press Enter..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-indigo-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm" autoFocus /></div><button type="button" onClick={cancelCustomJob} className="text-slate-400 hover:text-slate-600 text-sm px-2">Cancel</button></div>)}{employeeForm.selectedJobTypes.length > 0 && (<div className="mt-3 pt-3 border-t border-slate-200"><p className="text-xs font-medium text-slate-500 mb-2">Selected Job Types:</p><div className="flex flex-wrap gap-2">{employeeForm.selectedJobTypes.map(job => (<span key={job} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700">{job}<button type="button" onClick={() => removeSelectedJob(job)} className="hover:bg-indigo-200 rounded-full p-0.5 transition"><X size={14} /></button></span>))}</div></div>)}{employeeErrors.selectedJobTypes && <p className="text-red-500 text-xs mt-1">{employeeErrors.selectedJobTypes}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-2">Preferred Languages *</label><div className="flex flex-wrap gap-3 mb-3">{predefinedLanguages.map(lang => (<button type="button" key={lang} onClick={() => togglePredefinedLanguage(lang)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${employeeForm.preferredLanguages.includes(lang) ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' : 'bg-white/80 text-slate-700 hover:bg-indigo-50 border border-slate-200'}`}>{employeeForm.preferredLanguages.includes(lang) && <Check size={14} className="inline mr-1.5" />}{lang}</button>))}<button type="button" onClick={handleOthersLanguageClick} className="px-4 py-2 rounded-full text-sm font-medium bg-white/80 text-slate-700 hover:bg-indigo-50 border border-slate-200 transition-all duration-200 hover:scale-105"><Plus size={14} className="inline mr-1.5" />Others</button></div>{showCustomLanguageInput && (<div className="mt-3 flex items-center gap-2 animate-fadeIn"><div className="relative flex-1"><Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" /><input type="text" value={customLanguageInput} onChange={(e) => setCustomLanguageInput(e.target.value)} onKeyDown={handleAddCustomLanguage} placeholder="Type custom language and press Enter..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-indigo-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm" autoFocus /></div><button type="button" onClick={cancelCustomLanguage} className="text-slate-400 hover:text-slate-600 text-sm px-2">Cancel</button></div>)}{employeeForm.preferredLanguages.length > 0 && (<div className="mt-3 pt-3 border-t border-slate-200"><p className="text-xs font-medium text-slate-500 mb-2">Selected Languages:</p><div className="flex flex-wrap gap-2">{employeeForm.preferredLanguages.map(lang => (<span key={lang} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700">{lang}<button type="button" onClick={() => removeSelectedLanguage(lang)} className="hover:bg-indigo-200 rounded-full p-0.5 transition"><X size={14} /></button></span>))}</div></div>)}{employeeErrors.preferredLanguages && <p className="text-red-500 text-xs mt-1">{employeeErrors.preferredLanguages}</p>}</div>
                        <button type="submit" className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-4 text-white font-semibold text-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"><span className="relative z-10 flex items-center justify-center gap-2">Register as Job Seeker <Sparkles size={18} className="group-hover:animate-pulse" /></span><span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span></button>
                        {employeeSuccess && <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50/80 p-3 rounded-xl animate-fadeIn"><Check size={18} /><span className="text-sm font-medium">Registration successful! We'll contact you soon.</span></div>}
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === 'hr' && (
                  <div key="hr-form" className="animate-fadeInUp">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-100 rounded-xl"><TrendingUp className="w-6 h-6 text-indigo-600" /></div>
                        <div><h2 className="text-2xl md:text-3xl font-bold text-slate-800">Company Hiring Profile</h2><p className="text-slate-500 mt-1">Find skilled blue-collar talent across India.</p></div>
                      </div>
                      <form onSubmit={handleHrSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name *</label><div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" name="companyName" value={hrForm.companyName} onChange={handleHrChange} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${hrErrors.companyName ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base`} placeholder="e.g., ABC Logistics Pvt Ltd" /></div>{hrErrors.companyName && <p className="text-red-500 text-xs mt-1">{hrErrors.companyName}</p>}</div>
                          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Office Location *</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" name="officeLocation" value={hrForm.officeLocation} onChange={handleHrChange} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${hrErrors.officeLocation ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base`} placeholder="City, Full address" /></div>{hrErrors.officeLocation && <p className="text-red-500 text-xs mt-1">{hrErrors.officeLocation}</p>}</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">HR First Name *</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" name="hrFirstName" value={hrForm.hrFirstName} onChange={handleHrChange} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${hrErrors.hrFirstName ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base`} placeholder="First name" /></div>{hrErrors.hrFirstName && <p className="text-red-500 text-xs mt-1">{hrErrors.hrFirstName}</p>}</div>
                          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">HR Last Name *</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" name="hrLastName" value={hrForm.hrLastName} onChange={handleHrChange} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${hrErrors.hrLastName ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base`} placeholder="Last name" /></div>{hrErrors.hrLastName && <p className="text-red-500 text-xs mt-1">{hrErrors.hrLastName}</p>}</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Official Email ID *</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="email" name="hrEmail" value={hrForm.hrEmail} onChange={handleHrChange} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${hrErrors.hrEmail ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base`} placeholder="hr@company.com" /></div>{hrErrors.hrEmail && <p className="text-red-500 text-xs mt-1">{hrErrors.hrEmail}</p>}</div>
                          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Contact Number *</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="tel" name="hrPhone" value={hrForm.hrPhone} onChange={handleHrChange} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${hrErrors.hrPhone ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base`} placeholder="10-digit mobile" /></div>{hrErrors.hrPhone && <p className="text-red-500 text-xs mt-1">{hrErrors.hrPhone}</p>}</div>
                        </div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn Profile <span className="text-slate-400 text-xs font-normal">(optional)</span></label><div className="relative"><Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" name="linkedinProfile" value={hrForm.linkedinProfile} onChange={handleHrChange} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base" placeholder="https://linkedin.com/in/yourprofile" /></div></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Total Candidates Required *</label><div className="relative"><UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="number" name="totalCandidatesRequired" value={hrForm.totalCandidatesRequired} onChange={handleHrChange} min="1" className={`w-full pl-10 pr-4 py-3 rounded-xl border ${hrErrors.totalCandidatesRequired ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base`} placeholder="e.g., 5" /></div>{hrErrors.totalCandidatesRequired && <p className="text-red-500 text-xs mt-1">{hrErrors.totalCandidatesRequired}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Job Location *</label><div className="relative"><MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="text" name="jobLocation" value={hrForm.jobLocation} onChange={handleHrChange} className={`w-full pl-10 pr-4 py-3 rounded-xl border ${hrErrors.jobLocation ? 'border-red-400' : 'border-slate-200'} bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base`} placeholder="e.g., Mumbai, Delhi, Bangalore" /></div>{hrErrors.jobLocation && <p className="text-red-500 text-xs mt-1">{hrErrors.jobLocation}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-2">Job Category you usually hire for *</label><div className="flex flex-wrap gap-3 mb-3">{predefinedCategories.map(cat => (<button type="button" key={cat} onClick={() => togglePredefinedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${hrForm.selectedJobCategories.includes(cat) ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' : 'bg-white/80 text-slate-700 hover:bg-indigo-50 border border-slate-200'}`}>{hrForm.selectedJobCategories.includes(cat) && <Check size={14} className="inline mr-1.5" />}{cat}</button>))}<button type="button" onClick={handleOthersCategoryClick} className="px-4 py-2 rounded-full text-sm font-medium bg-white/80 text-slate-700 hover:bg-indigo-50 border border-slate-200 transition-all duration-200 hover:scale-105"><Plus size={14} className="inline mr-1.5" />Others</button></div>{showCustomCategoryInput && (<div className="mt-3 flex items-center gap-2 animate-fadeIn"><div className="relative flex-1"><Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" /><input type="text" value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} onKeyDown={handleAddCustomCategory} placeholder="Type custom job category and press Enter..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-indigo-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm" autoFocus /></div><button type="button" onClick={cancelCustomCategory} className="text-slate-400 hover:text-slate-600 text-sm px-2">Cancel</button></div>)}{hrForm.selectedJobCategories.length > 0 && (<div className="mt-3 pt-3 border-t border-slate-200"><p className="text-xs font-medium text-slate-500 mb-2">Selected Categories:</p><div className="flex flex-wrap gap-2">{hrForm.selectedJobCategories.map(cat => (<span key={cat} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700">{cat}<button type="button" onClick={() => removeSelectedCategory(cat)} className="hover:bg-indigo-200 rounded-full p-0.5 transition"><X size={14} /></button></span>))}</div></div>)}{hrErrors.selectedJobCategories && <p className="text-red-500 text-xs mt-1">{hrErrors.selectedJobCategories}</p>}</div>
                        <button type="submit" className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-4 text-white font-semibold text-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"><span className="relative z-10 flex items-center justify-center gap-2">Register as Employer <Clock size={18} className="group-hover:animate-spin" /></span><span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span></button>
                        {hrSuccess && <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50/80 p-3 rounded-xl animate-fadeIn"><Check size={18} /><span className="text-sm font-medium">Company registered! Our team will verify and contact you.</span></div>}
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Registration;