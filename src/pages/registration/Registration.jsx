import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Building2, Check, Sparkles, TrendingUp, Clock, MapPin, Phone, Mail, 
  User, Shield, Award, Plus, X, Link2, GraduationCap, Users as UsersIcon, 
  MapPin as MapPinIcon, Rocket, DollarSign, Map, UserCheck, 
  HardHat, Smartphone, ArrowLeft, Handshake, Search, Send, UserPlus, ArrowRight
} from 'lucide-react';
import Footer from '../../components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

  // --- Employee handlers (unchanged) ---
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

  // Validation (unchanged)
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

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmployeeForm()) return;

    const submissionData = {
      fullName: employeeForm.fullName,
      phone: employeeForm.phone,
      email: employeeForm.email,
      currentLocation: employeeForm.currentLocation,
      highestQualification: employeeForm.highestQualification === 'Others' 
        ? employeeForm.customQualification 
        : employeeForm.highestQualification,
      selectedJobTypes: employeeForm.selectedJobTypes,
      preferredLanguages: employeeForm.preferredLanguages
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/onboarding/employee-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      const data = await response.json();
      if (response.ok) {
        setEmployeeSuccess(true);
        setEmployeeForm({
          fullName: '', phone: '', email: '', currentLocation: '',
          highestQualification: '', customQualification: '',
          selectedJobTypes: [], preferredLanguages: []
        });
        setShowCustomQualificationInput(false);
        setEmployeeErrors({});
        setTimeout(() => setEmployeeSuccess(false), 3000);
      } else {
        alert(`Error: ${data.error || 'Submission failed'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please check your connection.');
    }
  };

  const handleHrSubmit = async (e) => {
    e.preventDefault();
    if (!validateHrForm()) return;

    const submissionData = {
      companyName: hrForm.companyName,
      officeLocation: hrForm.officeLocation,
      hrFirstName: hrForm.hrFirstName,
      hrLastName: hrForm.hrLastName,
      hrEmail: hrForm.hrEmail,
      hrPhone: hrForm.hrPhone,
      linkedinProfile: hrForm.linkedinProfile,
      totalCandidatesRequired: hrForm.totalCandidatesRequired,
      jobLocation: hrForm.jobLocation,
      selectedJobCategories: hrForm.selectedJobCategories
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/onboarding/employer-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      const data = await response.json();
      if (response.ok) {
        setHrSuccess(true);
        setHrForm({
          companyName: '', officeLocation: '', hrFirstName: '', hrLastName: '',
          hrEmail: '', hrPhone: '', linkedinProfile: '', totalCandidatesRequired: '',
          jobLocation: '', selectedJobCategories: []
        });
        setShowCustomCategoryInput(false);
        setHrErrors({});
        setTimeout(() => setHrSuccess(false), 3000);
      } else {
        alert(`Error: ${data.error || 'Submission failed'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please check your connection.');
    }
  };

  // Steps data for "How It Works"
  const steps = [
    { icon: UserPlus, title: 'Create Profile', desc: 'Sign up and create your profile in minutes.', color: 'indigo' },
    { icon: Search, title: 'Find Jobs', desc: 'Browse jobs that match your skills and location.', color: 'blue' },
    { icon: Send, title: 'Apply Jobs', desc: 'Apply directly to verified employers.', color: 'emerald' },
    { icon: Award, title: 'Get Hired', desc: 'Get selected and start your new journey.', color: 'purple' }
  ];

  const whyRozgarItems = [
    { icon: Shield, title: 'Verified Employers', desc: 'All employers are verified for your safety.', color: 'green' },
    { icon: Rocket, title: 'Fast Hiring Process', desc: 'Quick applications and faster responses.', color: 'indigo' },
    { icon: DollarSign, title: 'Zero Fees for Workers', desc: '100% free for job seekers.', color: 'emerald' },
    { icon: Map, title: 'Local Job Matching', desc: 'Find jobs near your location.', color: 'blue' },
    { icon: Handshake, title: 'No Middlemen', desc: 'Connect directly with employers.', color: 'purple' },
    { icon: UserCheck, title: 'Direct Hiring', desc: 'Get hired directly by verified companies.', color: 'orange' },
    { icon: HardHat, title: 'Blue-Collar Focused', desc: 'Built exclusively for blue-collar workforce.', color: 'amber' },
    { icon: Smartphone, title: 'Simple to Use', desc: 'Easy registration and smooth experience.', color: 'teal' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      amber: 'bg-amber-100 text-amber-600',
      teal: 'bg-teal-100 text-teal-600'
    };
    return colors[color] || colors.indigo;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <main className="flex-1">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6"> */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-1 pb-6">
          {/* Back button */}
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition -mb-4 text-sm"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {/* Tab Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-slate-200/60 flex w-full max-w-md">
              <button
                onClick={() => setActiveTab('employee')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'employee' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Briefcase size={16} />
                <span>Looking for Job</span>
              </button>
              <button
                onClick={() => setActiveTab('hr')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'hr' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building2 size={16} />
                <span>I'm Hiring</span>
              </button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Info Cards */}
            <div className="space-y-5">
              {/* Bridge Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h1 className="text-xl font-bold text-slate-800">Bridge to <span className="text-indigo-600">Better Opportunities</span></h1>
                <p className="text-sm text-slate-500 mt-1">India's fastest-growing platform connecting blue-collar workers with verified employers.</p>
              </div>

              {/* Why RozgarDo? - Clean grid */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Award size={20} className="text-indigo-500" /> Why RozgarDo?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {whyRozgarItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${getColorClasses(item.color)} flex items-center justify-center`}>
                        <item.icon size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How It Works - Fixed mobile arrows */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-indigo-500" /> How It Works?
                </h2>
                {/* Desktop: horizontal with arrows */}
                <div className="hidden md:flex items-center justify-between">
                  {steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="flex-1 text-center">
                        <div className={`w-12 h-12 mx-auto rounded-full ${getColorClasses(step.color)} flex items-center justify-center mb-2`}>
                          <step.icon size={20} />
                        </div>
                        <p className="font-semibold text-slate-800 text-sm">{step.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
                      </div>
                      {idx < steps.length - 1 && (
                        <ArrowRight size={18} className="text-slate-300 flex-shrink-0 mx-2" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Mobile: vertical with downward arrows between steps */}
                <div className="md:hidden space-y-4">
                  {steps.map((step, idx) => (
                    <div key={idx}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${getColorClasses(step.color)} flex items-center justify-center flex-shrink-0`}>
                          <step.icon size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{step.title}</p>
                          <p className="text-xs text-slate-500">{step.desc}</p>
                        </div>
                      </div>
                      {idx < steps.length - 1 && (
                        <div className="flex justify-center my-2">
                          <ArrowRight size={14} className="text-slate-300 rotate-90" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Forms (unchanged functionality, cleaned styling) */}
            <div>
              {activeTab === 'employee' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-indigo-50 rounded-lg"><Sparkles size={20} className="text-indigo-500" /></div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Create your profile</h2>
                      <p className="text-sm text-slate-500">Get discovered by top employers</p>
                    </div>
                  </div>
                  <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="fullName" value={employeeForm.fullName} onChange={handleEmployeeChange} 
                            className={`w-full pl-9 pr-3 py-2 rounded-lg border ${employeeErrors.fullName ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                            placeholder="Ramesh Kumar" />
                        </div>
                        {employeeErrors.fullName && <p className="text-red-500 text-xs mt-1">{employeeErrors.fullName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="tel" name="phone" value={employeeForm.phone} onChange={handleEmployeeChange} 
                            className={`w-full pl-9 pr-3 py-2 rounded-lg border ${employeeErrors.phone ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                            placeholder="9876543210" />
                        </div>
                        {employeeErrors.phone && <p className="text-red-500 text-xs mt-1">{employeeErrors.phone}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-slate-400 text-xs">(optional)</span></label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="email" name="email" value={employeeForm.email} onChange={handleEmployeeChange} 
                          className={`w-full pl-9 pr-3 py-2 rounded-lg border ${employeeErrors.email ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                          placeholder="you@example.com" />
                      </div>
                      {employeeErrors.email && <p className="text-red-500 text-xs mt-1">{employeeErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Current Location *</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" name="currentLocation" value={employeeForm.currentLocation} onChange={handleEmployeeChange} 
                          className={`w-full pl-9 pr-3 py-2 rounded-lg border ${employeeErrors.currentLocation ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                          placeholder="Delhi, Noida" />
                      </div>
                      {employeeErrors.currentLocation && <p className="text-red-500 text-xs mt-1">{employeeErrors.currentLocation}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Highest Qualification *</label>
                      <div className="relative">
                        <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select name="highestQualification" value={employeeForm.highestQualification} onChange={handleEmployeeChange}
                          className={`w-full pl-9 pr-3 py-2 rounded-lg border ${employeeErrors.highestQualification ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none bg-white`}>
                          <option value="">Select qualification</option>
                          {qualificationOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                        </select>
                      </div>
                      {employeeErrors.highestQualification && <p className="text-red-500 text-xs mt-1">{employeeErrors.highestQualification}</p>}
                      {showCustomQualificationInput && (
                        <input type="text" value={employeeForm.customQualification} onChange={handleCustomQualificationChange}
                          placeholder="Please specify your qualification"
                          className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Job Types Looking For *</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {jobOptions.map(job => (
                          <button type="button" key={job} onClick={() => togglePredefinedJob(job)} 
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${employeeForm.selectedJobTypes.includes(job) ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {employeeForm.selectedJobTypes.includes(job) && <Check size={12} className="inline mr-1" />}{job}
                          </button>
                        ))}
                        <button type="button" onClick={handleOthersJobClick} 
                          className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
                          <Plus size={12} className="inline mr-1" />Others
                        </button>
                      </div>
                      {showCustomJobInput && (
                        <div className="flex items-center gap-2 mt-2">
                          <input type="text" value={customJobInput} onChange={(e) => setCustomJobInput(e.target.value)} onKeyDown={handleAddCustomJob} 
                            placeholder="Type job role and press Enter..." 
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" autoFocus />
                          <button type="button" onClick={cancelCustomJob} className="text-slate-500 text-sm px-2">Cancel</button>
                        </div>
                      )}
                      {employeeForm.selectedJobTypes.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-100">
                          <p className="text-xs font-medium text-slate-500 mb-1">Selected:</p>
                          <div className="flex flex-wrap gap-1">
                            {employeeForm.selectedJobTypes.map(job => (
                              <span key={job} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                                {job}
                                <button type="button" onClick={() => removeSelectedJob(job)} className="hover:bg-indigo-200 rounded-full p-0.5"><X size={10} /></button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {employeeErrors.selectedJobTypes && <p className="text-red-500 text-xs mt-1">{employeeErrors.selectedJobTypes}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Languages *</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {predefinedLanguages.map(lang => (
                          <button type="button" key={lang} onClick={() => togglePredefinedLanguage(lang)} 
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${employeeForm.preferredLanguages.includes(lang) ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {employeeForm.preferredLanguages.includes(lang) && <Check size={12} className="inline mr-1" />}{lang}
                          </button>
                        ))}
                        <button type="button" onClick={handleOthersLanguageClick} 
                          className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
                          <Plus size={12} className="inline mr-1" />Others
                        </button>
                      </div>
                      {showCustomLanguageInput && (
                        <div className="flex items-center gap-2 mt-2">
                          <input type="text" value={customLanguageInput} onChange={(e) => setCustomLanguageInput(e.target.value)} onKeyDown={handleAddCustomLanguage} 
                            placeholder="Type language and press Enter..." 
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" autoFocus />
                          <button type="button" onClick={cancelCustomLanguage} className="text-slate-500 text-sm px-2">Cancel</button>
                        </div>
                      )}
                      {employeeForm.preferredLanguages.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-100">
                          <p className="text-xs font-medium text-slate-500 mb-1">Selected:</p>
                          <div className="flex flex-wrap gap-1">
                            {employeeForm.preferredLanguages.map(lang => (
                              <span key={lang} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                                {lang}
                                <button type="button" onClick={() => removeSelectedLanguage(lang)} className="hover:bg-indigo-200 rounded-full p-0.5"><X size={10} /></button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {employeeErrors.preferredLanguages && <p className="text-red-500 text-xs mt-1">{employeeErrors.preferredLanguages}</p>}
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition shadow-sm text-sm">
                      Register as Job Seeker
                    </button>
                    {employeeSuccess && <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg"><Check size={14} /><span className="text-sm">Registration successful! We'll contact you soon.</span></div>}
                  </form>
                </div>
              )}

              {activeTab === 'hr' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-indigo-50 rounded-lg"><TrendingUp size={20} className="text-indigo-500" /></div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Company Hiring Profile</h2>
                      <p className="text-sm text-slate-500">Find skilled blue-collar talent</p>
                    </div>
                  </div>
                  <form onSubmit={handleHrSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                        <div className="relative">
                          <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="companyName" value={hrForm.companyName} onChange={handleHrChange} 
                            className={`w-full pl-9 pr-3 py-2 rounded-lg border ${hrErrors.companyName ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                            placeholder="ABC Logistics" />
                        </div>
                        {hrErrors.companyName && <p className="text-red-500 text-xs mt-1">{hrErrors.companyName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Office Location *</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="officeLocation" value={hrForm.officeLocation} onChange={handleHrChange} 
                            className={`w-full pl-9 pr-3 py-2 rounded-lg border ${hrErrors.officeLocation ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                            placeholder="Mumbai, Full address" />
                        </div>
                        {hrErrors.officeLocation && <p className="text-red-500 text-xs mt-1">{hrErrors.officeLocation}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">HR First Name *</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="hrFirstName" value={hrForm.hrFirstName} onChange={handleHrChange} 
                            className={`w-full pl-9 pr-3 py-2 rounded-lg border ${hrErrors.hrFirstName ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                            placeholder="Rahul" />
                        </div>
                        {hrErrors.hrFirstName && <p className="text-red-500 text-xs mt-1">{hrErrors.hrFirstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">HR Last Name *</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="hrLastName" value={hrForm.hrLastName} onChange={handleHrChange} 
                            className={`w-full pl-9 pr-3 py-2 rounded-lg border ${hrErrors.hrLastName ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                            placeholder="Sharma" />
                        </div>
                        {hrErrors.hrLastName && <p className="text-red-500 text-xs mt-1">{hrErrors.hrLastName}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Official Email *</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="email" name="hrEmail" value={hrForm.hrEmail} onChange={handleHrChange} 
                            className={`w-full pl-9 pr-3 py-2 rounded-lg border ${hrErrors.hrEmail ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                            placeholder="hr@company.com" />
                        </div>
                        {hrErrors.hrEmail && <p className="text-red-500 text-xs mt-1">{hrErrors.hrEmail}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number *</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="tel" name="hrPhone" value={hrForm.hrPhone} onChange={handleHrChange} 
                            className={`w-full pl-9 pr-3 py-2 rounded-lg border ${hrErrors.hrPhone ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                            placeholder="9876543210" />
                        </div>
                        {hrErrors.hrPhone && <p className="text-red-500 text-xs mt-1">{hrErrors.hrPhone}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile <span className="text-slate-400 text-xs">(optional)</span></label>
                      <div className="relative">
                        <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" name="linkedinProfile" value={hrForm.linkedinProfile} onChange={handleHrChange} 
                          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
                          placeholder="https://linkedin.com/in/yourprofile" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Candidates Required *</label>
                        <div className="relative">
                          <UsersIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="number" name="totalCandidatesRequired" value={hrForm.totalCandidatesRequired} onChange={handleHrChange} min="1" 
                            className={`w-full pl-9 pr-3 py-2 rounded-lg border ${hrErrors.totalCandidatesRequired ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                            placeholder="5" />
                        </div>
                        {hrErrors.totalCandidatesRequired && <p className="text-red-500 text-xs mt-1">{hrErrors.totalCandidatesRequired}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Job Location *</label>
                        <div className="relative">
                          <MapPinIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" name="jobLocation" value={hrForm.jobLocation} onChange={handleHrChange} 
                            className={`w-full pl-9 pr-3 py-2 rounded-lg border ${hrErrors.jobLocation ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                            placeholder="Mumbai, Delhi, Bangalore" />
                        </div>
                        {hrErrors.jobLocation && <p className="text-red-500 text-xs mt-1">{hrErrors.jobLocation}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Job Categories You Hire For *</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {predefinedCategories.map(cat => (
                          <button type="button" key={cat} onClick={() => togglePredefinedCategory(cat)} 
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${hrForm.selectedJobCategories.includes(cat) ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {hrForm.selectedJobCategories.includes(cat) && <Check size={12} className="inline mr-1" />}{cat}
                          </button>
                        ))}
                        <button type="button" onClick={handleOthersCategoryClick} 
                          className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
                          <Plus size={12} className="inline mr-1" />Others
                        </button>
                      </div>
                      {showCustomCategoryInput && (
                        <div className="flex items-center gap-2 mt-2">
                          <input type="text" value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} onKeyDown={handleAddCustomCategory} 
                            placeholder="Type category and press Enter..." 
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" autoFocus />
                          <button type="button" onClick={cancelCustomCategory} className="text-slate-500 text-sm px-2">Cancel</button>
                        </div>
                      )}
                      {hrForm.selectedJobCategories.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-100">
                          <p className="text-xs font-medium text-slate-500 mb-1">Selected:</p>
                          <div className="flex flex-wrap gap-1">
                            {hrForm.selectedJobCategories.map(cat => (
                              <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                                {cat}
                                <button type="button" onClick={() => removeSelectedCategory(cat)} className="hover:bg-indigo-200 rounded-full p-0.5"><X size={10} /></button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {hrErrors.selectedJobCategories && <p className="text-red-500 text-xs mt-1">{hrErrors.selectedJobCategories}</p>}
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition shadow-sm text-sm">
                      Register as Employer
                    </button>
                    {hrSuccess && <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg"><Check size={14} /><span className="text-sm">Company registered! Our team will verify and contact you.</span></div>}
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Registration;