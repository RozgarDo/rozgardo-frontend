import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Building2, Check, Sparkles, TrendingUp, Clock, MapPin, Phone, Mail, 
  User, Shield, Award, Plus, X, Link2, GraduationCap, Users as UsersIcon, 
  MapPin as MapPinIcon, Rocket, DollarSign, Map, UserCheck, 
  HardHat, Smartphone, ArrowLeft, Handshake, Search, Send, UserPlus, ArrowRight
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Custom hook for responsive breakpoint
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (event) => setMatches(event.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// --- Separate form components to prevent remounting on state changes ---
const EmployeeForm = ({ form, errors, success, submitError, onChange, onToggleJob, onRemoveJob, onToggleLanguage, onRemoveLanguage, onSubmit, onCustomJobAdd, onCustomLanguageAdd, customJobInput, setCustomJobInput, showCustomJobInput, setShowCustomJobInput, customLanguageInput, setCustomLanguageInput, showCustomLanguageInput, setShowCustomLanguageInput, showCustomQualificationInput, customQualification, onCustomQualificationChange, onOthersJobClick, onOthersLanguageClick, cancelCustomJob, cancelCustomLanguage, jobOptions, predefinedLanguages, qualificationOptions }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-indigo-50 rounded-lg"><Sparkles size={20} className="text-indigo-500" /></div>
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Create your profile</h2>
        <p className="text-sm text-slate-500">Get discovered by top employers</p>
      </div>
    </div>
    <form onSubmit={onSubmit} className="space-y-5 flex-grow flex flex-col justify-between">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" name="fullName" value={form.fullName} onChange={onChange} 
                className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.fullName ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                placeholder="Ramesh Kumar" />
            </div>
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="tel" name="phone" value={form.phone} onChange={onChange} 
                className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.phone ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                placeholder="9876543210" />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-slate-400 text-xs">(optional)</span></label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" name="email" value={form.email} onChange={onChange} 
              className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.email ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
              placeholder="you@example.com" />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Current Location *</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" name="currentLocation" value={form.currentLocation} onChange={onChange} 
              className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.currentLocation ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
              placeholder="Delhi, Noida" />
          </div>
          {errors.currentLocation && <p className="text-red-500 text-xs mt-1">{errors.currentLocation}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Highest Qualification *</label>
          <div className="relative">
            <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select name="highestQualification" value={form.highestQualification} onChange={onChange}
              className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.highestQualification ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none bg-white`}>
              <option value="">Select qualification</option>
              {qualificationOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
          </div>
          {errors.highestQualification && <p className="text-red-500 text-xs mt-1">{errors.highestQualification}</p>}
          {showCustomQualificationInput && (
            <input type="text" value={customQualification} onChange={onCustomQualificationChange}
              placeholder="Please specify your qualification"
              className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Job Types Looking For *</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {jobOptions.map(job => (
              <button type="button" key={job} onClick={() => onToggleJob(job)} 
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${form.selectedJobTypes.includes(job) ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                {form.selectedJobTypes.includes(job) && <Check size={12} className="inline mr-1" />}{job}
              </button>
            ))}
            <button type="button" onClick={onOthersJobClick} 
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Plus size={12} className="inline mr-1" />Others
            </button>
          </div>
          {showCustomJobInput && (
            <div className="flex items-center gap-2 mt-2">
              <input type="text" value={customJobInput} onChange={(e) => setCustomJobInput(e.target.value)} onKeyDown={onCustomJobAdd} 
                placeholder="Type job role and press Enter..." 
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" autoFocus />
              <button type="button" onClick={cancelCustomJob} className="text-slate-500 text-sm px-2">Cancel</button>
            </div>
          )}
          {form.selectedJobTypes.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-1">Selected:</p>
              <div className="flex flex-wrap gap-1">
                {form.selectedJobTypes.map(job => (
                  <span key={job} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                    {job}
                    <button type="button" onClick={() => onRemoveJob(job)} className="hover:bg-indigo-200 rounded-full p-0.5"><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
          )}
          {errors.selectedJobTypes && <p className="text-red-500 text-xs mt-1">{errors.selectedJobTypes}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Languages *</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {predefinedLanguages.map(lang => (
              <button type="button" key={lang} onClick={() => onToggleLanguage(lang)} 
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${form.preferredLanguages.includes(lang) ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                {form.preferredLanguages.includes(lang) && <Check size={12} className="inline mr-1" />}{lang}
              </button>
            ))}
            <button type="button" onClick={onOthersLanguageClick} 
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Plus size={12} className="inline mr-1" />Others
            </button>
          </div>
          {showCustomLanguageInput && (
            <div className="flex items-center gap-2 mt-2">
              <input type="text" value={customLanguageInput} onChange={(e) => setCustomLanguageInput(e.target.value)} onKeyDown={onCustomLanguageAdd} 
                placeholder="Type language and press Enter..." 
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" autoFocus />
              <button type="button" onClick={cancelCustomLanguage} className="text-slate-500 text-sm px-2">Cancel</button>
            </div>
          )}
          {form.preferredLanguages.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-1">Selected:</p>
              <div className="flex flex-wrap gap-1">
                {form.preferredLanguages.map(lang => (
                  <span key={lang} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                    {lang}
                    <button type="button" onClick={() => onRemoveLanguage(lang)} className="hover:bg-indigo-200 rounded-full p-0.5"><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
          )}
          {errors.preferredLanguages && <p className="text-red-500 text-xs mt-1">{errors.preferredLanguages}</p>}
        </div>
      </div>
      <div>
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition shadow-sm text-sm">
          Register as Job Seeker
        </button>
        {success && (
          <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg mt-3">
            <Check size={14} /><span className="text-sm">Registration successful! We'll contact you soon.</span>
          </div>
        )}
        {submitError && (
          <div className="flex items-center justify-center gap-2 text-red-700 bg-red-50 p-2 rounded-lg mt-3">
            <span className="text-sm">{submitError}</span>
          </div>
        )}
      </div>
    </form>
  </div>
);

const HrForm = ({ form, errors, success, submitError, onChange, onToggleCategory, onRemoveCategory, onSubmit, onCustomCategoryAdd, customCategoryInput, setCustomCategoryInput, showCustomCategoryInput, setShowCustomCategoryInput, onOthersCategoryClick, cancelCustomCategory, predefinedCategories }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-indigo-50 rounded-lg"><TrendingUp size={20} className="text-indigo-500" /></div>
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Company Hiring Profile</h2>
        <p className="text-sm text-slate-500">Find skilled blue-collar talent</p>
      </div>
    </div>
    <form onSubmit={onSubmit} className="space-y-5 flex-grow flex flex-col justify-between">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" name="companyName" value={form.companyName} onChange={onChange} 
                className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.companyName ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                placeholder="ABC Logistics" />
            </div>
            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Office Location *</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" name="officeLocation" value={form.officeLocation} onChange={onChange} 
                className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.officeLocation ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                placeholder="Mumbai, Full address" />
            </div>
            {errors.officeLocation && <p className="text-red-500 text-xs mt-1">{errors.officeLocation}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">HR First Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" name="hrFirstName" value={form.hrFirstName} onChange={onChange} 
                className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.hrFirstName ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                placeholder="Rahul" />
            </div>
            {errors.hrFirstName && <p className="text-red-500 text-xs mt-1">{errors.hrFirstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">HR Last Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" name="hrLastName" value={form.hrLastName} onChange={onChange} 
                className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.hrLastName ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                placeholder="Sharma" />
            </div>
            {errors.hrLastName && <p className="text-red-500 text-xs mt-1">{errors.hrLastName}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Official Email *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" name="hrEmail" value={form.hrEmail} onChange={onChange} 
                className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.hrEmail ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                placeholder="hr@company.com" />
            </div>
            {errors.hrEmail && <p className="text-red-500 text-xs mt-1">{errors.hrEmail}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number *</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="tel" name="hrPhone" value={form.hrPhone} onChange={onChange} 
                className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.hrPhone ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                placeholder="9876543210" />
            </div>
            {errors.hrPhone && <p className="text-red-500 text-xs mt-1">{errors.hrPhone}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile <span className="text-slate-400 text-xs">(optional)</span></label>
          <div className="relative">
            <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" name="linkedinProfile" value={form.linkedinProfile} onChange={onChange} 
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" 
              placeholder="https://linkedin.com/in/yourprofile" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Candidates Required *</label>
            <div className="relative">
              <UsersIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="number" name="totalCandidatesRequired" value={form.totalCandidatesRequired} onChange={onChange} min="1" 
                className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.totalCandidatesRequired ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                placeholder="5" />
            </div>
            {errors.totalCandidatesRequired && <p className="text-red-500 text-xs mt-1">{errors.totalCandidatesRequired}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Location *</label>
            <div className="relative">
              <MapPinIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" name="jobLocation" value={form.jobLocation} onChange={onChange} 
                className={`w-full pl-9 pr-3 py-2 rounded-lg border ${errors.jobLocation ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`} 
                placeholder="Mumbai, Delhi, Bangalore" />
            </div>
            {errors.jobLocation && <p className="text-red-500 text-xs mt-1">{errors.jobLocation}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Job Categories You Hire For *</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {predefinedCategories.map(cat => (
              <button type="button" key={cat} onClick={() => onToggleCategory(cat)} 
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${form.selectedJobCategories.includes(cat) ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                {form.selectedJobCategories.includes(cat) && <Check size={12} className="inline mr-1" />}{cat}
              </button>
            ))}
            <button type="button" onClick={onOthersCategoryClick} 
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200">
              <Plus size={12} className="inline mr-1" />Others
            </button>
          </div>
          {showCustomCategoryInput && (
            <div className="flex items-center gap-2 mt-2">
              <input type="text" value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} onKeyDown={onCustomCategoryAdd} 
                placeholder="Type category and press Enter..." 
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" autoFocus />
              <button type="button" onClick={cancelCustomCategory} className="text-slate-500 text-sm px-2">Cancel</button>
            </div>
          )}
          {form.selectedJobCategories.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-1">Selected:</p>
              <div className="flex flex-wrap gap-1">
                {form.selectedJobCategories.map(cat => (
                  <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                    {cat}
                    <button type="button" onClick={() => onRemoveCategory(cat)} className="hover:bg-indigo-200 rounded-full p-0.5"><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>
          )}
          {errors.selectedJobCategories && <p className="text-red-500 text-xs mt-1">{errors.selectedJobCategories}</p>}
        </div>
      </div>
      <div>
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition shadow-sm text-sm">
          Register as Employer
        </button>
        {success && (
          <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg mt-3">
            <Check size={14} /><span className="text-sm">Company registered! Our team will verify and contact you.</span>
          </div>
        )}
        {submitError && (
          <div className="flex items-center justify-center gap-2 text-red-700 bg-red-50 p-2 rounded-lg mt-3">
            <span className="text-sm">{submitError}</span>
          </div>
        )}
      </div>
    </form>
  </div>
);

// --- Main Registration Component ---
const Registration = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 1023px)');
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
  const [employeeSubmitError, setEmployeeSubmitError] = useState('');
  const [hrSubmitError, setHrSubmitError] = useState('');

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
    if (employeeSubmitError) setEmployeeSubmitError('');
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
    if (employeeSubmitError) setEmployeeSubmitError('');
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
      if (employeeSubmitError) setEmployeeSubmitError('');
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
    if (employeeSubmitError) setEmployeeSubmitError('');
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
      if (employeeSubmitError) setEmployeeSubmitError('');
    }
  };
  const cancelCustomLanguage = () => { setCustomLanguageInput(''); setShowCustomLanguageInput(false); };

  // HR handlers
  const handleHrChange = (e) => {
    const { name, value } = e.target;
    setHrForm(prev => ({ ...prev, [name]: value }));
    if (hrErrors[name]) setHrErrors(prev => ({ ...prev, [name]: '' }));
    if (hrSubmitError) setHrSubmitError('');
  };
  const togglePredefinedCategory = (cat) => {
    setHrForm(prev => ({
      ...prev,
      selectedJobCategories: prev.selectedJobCategories.includes(cat)
        ? prev.selectedJobCategories.filter(c => c !== cat)
        : [...prev.selectedJobCategories, cat]
    }));
    if (hrErrors.selectedJobCategories) setHrErrors(prev => ({ ...prev, selectedJobCategories: '' }));
    if (hrSubmitError) setHrSubmitError('');
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
      if (hrSubmitError) setHrSubmitError('');
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

  // Submit handlers (identical to your original)
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
        setEmployeeSubmitError('');
        setEmployeeForm({
          fullName: '', phone: '', email: '', currentLocation: '',
          highestQualification: '', customQualification: '',
          selectedJobTypes: [], preferredLanguages: []
        });
        setShowCustomQualificationInput(false);
        setEmployeeErrors({});
        setTimeout(() => setEmployeeSuccess(false), 3000);
      } else {
        if (data.error && (data.error.includes('duplicate key') || data.error.includes('phone') || data.error.includes('already registered'))) {
          setEmployeeSubmitError('This phone number is already registered. Please use a different number or contact support.');
        } else {
          setEmployeeSubmitError(data.error || 'Submission failed. Please try again.');
        }
        setTimeout(() => setEmployeeSubmitError(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setEmployeeSubmitError('Network error. Please check your connection.');
      setTimeout(() => setEmployeeSubmitError(''), 3000);
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
        setHrSubmitError('');
        setHrForm({
          companyName: '', officeLocation: '', hrFirstName: '', hrLastName: '',
          hrEmail: '', hrPhone: '', linkedinProfile: '', totalCandidatesRequired: '',
          jobLocation: '', selectedJobCategories: []
        });
        setShowCustomCategoryInput(false);
        setHrErrors({});
        setTimeout(() => setHrSuccess(false), 3000);
      } else {
        if (data.error && (data.error.includes('duplicate key') || data.error.includes('already registered'))) {
          setHrSubmitError('This email or phone number is already registered. Please use different credentials.');
        } else {
          setHrSubmitError(data.error || 'Submission failed. Please try again.');
        }
        setTimeout(() => setHrSubmitError(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setHrSubmitError('Network error. Please check your connection.');
      setTimeout(() => setHrSubmitError(''), 3000);
    }
  };

  const steps = [
    { icon: UserPlus, title: 'Create Profile', color: 'indigo' },
    { icon: Search, title: 'Find Jobs', color: 'blue' },
    { icon: Send, title: 'Apply Jobs', color: 'emerald' },
    { icon: Award, title: 'Get Hired', color: 'purple' }
  ];

  const whyRozgarItems = [
    { icon: Shield, title: 'Verified Employers', color: 'green' },
    { icon: Rocket, title: 'Fast Hiring Process', color: 'indigo' },
    { icon: DollarSign, title: 'Zero Fees for Workers', color: 'emerald' },
    { icon: Map, title: 'Local Job Matching', color: 'blue' },
    { icon: Handshake, title: 'No Middlemen', color: 'purple' },
    { icon: UserCheck, title: 'Direct Hiring', color: 'orange' },
    { icon: HardHat, title: 'Blue-Collar Focused', color: 'amber' },
    { icon: Smartphone, title: 'Simple to Use', color: 'teal' }
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

  // Reusable card components
  const TaglineCard = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
      <div className="text-center lg:text-left">
        <div className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
          Better <span className="text-indigo-600">Jobs.</span>
        </div>
        <div className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight mt-1">
          Better <span className="text-indigo-600">Hiring.</span>
        </div>
        <p className="text-sm text-slate-500 mt-3 max-w-md mx-auto lg:mx-0">
          India's most trusted platform connecting blue‑collar workers with verified employers.
        </p>
      </div>
    </div>
  );

  const WhyRozgarCard = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
        <Award size={22} className="text-indigo-500" /> Why RozgarDo?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {whyRozgarItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${getColorClasses(item.color)} flex items-center justify-center`}>
              <item.icon size={18} />
            </div>
            <span className="font-medium text-slate-800 text-sm">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const HowItWorksCard = () => (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
        <TrendingUp size={22} className="text-indigo-500" /> How It Works?
      </h2>
      <div className="hidden md:flex items-center justify-between w-full px-2">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-14 h-14 rounded-full ${getColorClasses(step.color)} flex items-center justify-center mb-3 shadow-sm`}>
                <step.icon size={24} />
              </div>
              <p className="font-bold text-slate-800 text-sm text-center">{step.title}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 flex justify-center pb-8">
                <ArrowRight size={20} className="text-slate-300" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="md:hidden flex flex-col items-start">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${getColorClasses(step.color)} flex items-center justify-center shadow-sm flex-shrink-0`}>
                <step.icon size={20} />
              </div>
              <p className="font-bold text-slate-800 text-base">{step.title}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-12 flex justify-center py-2">
                <ArrowRight size={18} className="text-slate-300 rotate-90" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-1 pb-6">
          {/* Back button */}
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {/* Tab Toggle */}
          <div className="flex justify-center mb-10">
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

          {/* Responsive Layout */}
          {isMobile ? (
            // Mobile: Tagline → Form → Why → How
            <div className="flex flex-col gap-8">
              <TaglineCard />
              {activeTab === 'employee' ? (
                <EmployeeForm
                  form={employeeForm}
                  errors={employeeErrors}
                  success={employeeSuccess}
                  submitError={employeeSubmitError}
                  onChange={handleEmployeeChange}
                  onToggleJob={togglePredefinedJob}
                  onRemoveJob={removeSelectedJob}
                  onToggleLanguage={togglePredefinedLanguage}
                  onRemoveLanguage={removeSelectedLanguage}
                  onSubmit={handleEmployeeSubmit}
                  onCustomJobAdd={handleAddCustomJob}
                  onCustomLanguageAdd={handleAddCustomLanguage}
                  customJobInput={customJobInput}
                  setCustomJobInput={setCustomJobInput}
                  showCustomJobInput={showCustomJobInput}
                  setShowCustomJobInput={setShowCustomJobInput}
                  customLanguageInput={customLanguageInput}
                  setCustomLanguageInput={setCustomLanguageInput}
                  showCustomLanguageInput={showCustomLanguageInput}
                  setShowCustomLanguageInput={setShowCustomLanguageInput}
                  showCustomQualificationInput={showCustomQualificationInput}
                  customQualification={employeeForm.customQualification}
                  onCustomQualificationChange={handleCustomQualificationChange}
                  onOthersJobClick={handleOthersJobClick}
                  onOthersLanguageClick={handleOthersLanguageClick}
                  cancelCustomJob={cancelCustomJob}
                  cancelCustomLanguage={cancelCustomLanguage}
                  jobOptions={jobOptions}
                  predefinedLanguages={predefinedLanguages}
                  qualificationOptions={qualificationOptions}
                />
              ) : (
                <HrForm
                  form={hrForm}
                  errors={hrErrors}
                  success={hrSuccess}
                  submitError={hrSubmitError}
                  onChange={handleHrChange}
                  onToggleCategory={togglePredefinedCategory}
                  onRemoveCategory={removeSelectedCategory}
                  onSubmit={handleHrSubmit}
                  onCustomCategoryAdd={handleAddCustomCategory}
                  customCategoryInput={customCategoryInput}
                  setCustomCategoryInput={setCustomCategoryInput}
                  showCustomCategoryInput={showCustomCategoryInput}
                  setShowCustomCategoryInput={setShowCustomCategoryInput}
                  onOthersCategoryClick={handleOthersCategoryClick}
                  cancelCustomCategory={cancelCustomCategory}
                  predefinedCategories={predefinedCategories}
                />
              )}
              <WhyRozgarCard />
              <HowItWorksCard />
            </div>
          ) : (
            // Desktop: two-column layout
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="space-y-6 h-full">
                <TaglineCard />
                <WhyRozgarCard />
                <HowItWorksCard />
              </div>
              <div className="flex flex-col h-full">
                {activeTab === 'employee' ? (
                  <EmployeeForm
                    form={employeeForm}
                    errors={employeeErrors}
                    success={employeeSuccess}
                    submitError={employeeSubmitError}
                    onChange={handleEmployeeChange}
                    onToggleJob={togglePredefinedJob}
                    onRemoveJob={removeSelectedJob}
                    onToggleLanguage={togglePredefinedLanguage}
                    onRemoveLanguage={removeSelectedLanguage}
                    onSubmit={handleEmployeeSubmit}
                    onCustomJobAdd={handleAddCustomJob}
                    onCustomLanguageAdd={handleAddCustomLanguage}
                    customJobInput={customJobInput}
                    setCustomJobInput={setCustomJobInput}
                    showCustomJobInput={showCustomJobInput}
                    setShowCustomJobInput={setShowCustomJobInput}
                    customLanguageInput={customLanguageInput}
                    setCustomLanguageInput={setCustomLanguageInput}
                    showCustomLanguageInput={showCustomLanguageInput}
                    setShowCustomLanguageInput={setShowCustomLanguageInput}
                    showCustomQualificationInput={showCustomQualificationInput}
                    customQualification={employeeForm.customQualification}
                    onCustomQualificationChange={handleCustomQualificationChange}
                    onOthersJobClick={handleOthersJobClick}
                    onOthersLanguageClick={handleOthersLanguageClick}
                    cancelCustomJob={cancelCustomJob}
                    cancelCustomLanguage={cancelCustomLanguage}
                    jobOptions={jobOptions}
                    predefinedLanguages={predefinedLanguages}
                    qualificationOptions={qualificationOptions}
                  />
                ) : (
                  <HrForm
                    form={hrForm}
                    errors={hrErrors}
                    success={hrSuccess}
                    submitError={hrSubmitError}
                    onChange={handleHrChange}
                    onToggleCategory={togglePredefinedCategory}
                    onRemoveCategory={removeSelectedCategory}
                    onSubmit={handleHrSubmit}
                    onCustomCategoryAdd={handleAddCustomCategory}
                    customCategoryInput={customCategoryInput}
                    setCustomCategoryInput={setCustomCategoryInput}
                    showCustomCategoryInput={showCustomCategoryInput}
                    setShowCustomCategoryInput={setShowCustomCategoryInput}
                    onOthersCategoryClick={handleOthersCategoryClick}
                    cancelCustomCategory={cancelCustomCategory}
                    predefinedCategories={predefinedCategories}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Registration;