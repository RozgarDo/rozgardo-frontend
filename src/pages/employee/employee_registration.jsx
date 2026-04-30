import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Phone, Mail, MapPin, GraduationCap, 
  Briefcase, Languages, Lock, Eye, EyeOff, 
  ArrowLeft, Shield, CheckCircle 
} from 'lucide-react';

const EmployeeRegistration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const jobTypesList = [
    'Driver', 'Delivery', 'Cook', 'Cleaner', 'Helper', 
    'Electrician', 'Plumber', 'Security', 'Office Boy', '+ Others'
  ];

  const languagesList = [
    'Hindi', 'English', 'Bengali', 'Nepali', 'Kannada', '+ Others'
  ];

  const qualificationsList = [
    'Select qualification',
    'No Formal Education',
    'Below 10th',
    '10th Pass',
    '12th Pass',
    'ITI',
    'Diploma',
    'Graduate',
    'Post Graduate'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (type, value) => {
    setFormData(prev => {
      const current = [...prev[type]];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [type]: [...current, value] };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Enter valid 10-digit number';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter valid email address';
    }
    
    if (!formData.currentLocation.trim()) newErrors.currentLocation = 'Current location is required';
    if (!formData.highestQualification || formData.highestQualification === 'Select qualification') {
      newErrors.highestQualification = 'Please select qualification';
    }
    if (formData.jobTypes.length === 0) newErrors.jobTypes = 'Select at least one job type';
    if (formData.preferredLanguages.length === 0) newErrors.preferredLanguages = 'Select at least one language';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Employee Registration Data:', formData);
    setLoading(false);
    // Navigate to login or dashboard after successful registration
    navigate('/login', { state: { message: 'Registration successful! Please login.' } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Column - Infographics & Info */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-8">
                    <Shield size={28} />
                    <span className="text-xl font-bold">JobSeekerHub</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
                  <p className="text-indigo-100 mb-8 leading-relaxed">
                    Join thousands of blue-collar workers who found their dream jobs through our platform. 
                    100% free, verified employers, and jobs near you.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-300" />
                      <span>Free registration for job seekers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-300" />
                      <span>Apply to verified jobs only</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-300" />
                      <span>Get hired faster with complete profile</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-indigo-400">
                  <div className="text-sm text-indigo-200">
                    <p>Already have an account?</p>
                    <button 
                      onClick={() => navigate('/login')}
                      className="mt-2 text-white font-semibold underline hover:no-underline"
                    >
                      Login here →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <div className="p-8 overflow-y-auto max-h-[90vh]">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create your profile</h2>
                <p className="text-gray-500">Get discovered by top employers</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ramesh Kumar"
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="9876543210"
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Current Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="currentLocation"
                      value={formData.currentLocation}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${
                        errors.currentLocation ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Delhi, Noida"
                    />
                  </div>
                  {errors.currentLocation && <p className="text-red-500 text-xs mt-1">{errors.currentLocation}</p>}
                </div>

                {/* Highest Qualification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Highest Qualification <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      name="highestQualification"
                      value={formData.highestQualification}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none ${
                        errors.highestQualification ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {qualificationsList.map(qual => (
                        <option key={qual} value={qual}>{qual}</option>
                      ))}
                    </select>
                  </div>
                  {errors.highestQualification && <p className="text-red-500 text-xs mt-1">{errors.highestQualification}</p>}
                </div>

                {/* Job Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Types Looking For <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {jobTypesList.map(job => (
                      <label key={job} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.jobTypes.includes(job)}
                          onChange={() => handleCheckboxChange('jobTypes', job)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        {job}
                      </label>
                    ))}
                  </div>
                  {errors.jobTypes && <p className="text-red-500 text-xs mt-1">{errors.jobTypes}</p>}
                </div>

                {/* Preferred Languages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Languages <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {languagesList.map(lang => (
                      <label key={lang} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.preferredLanguages.includes(lang)}
                          onChange={() => handleCheckboxChange('preferredLanguages', lang)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        {lang}
                      </label>
                    ))}
                  </div>
                  {errors.preferredLanguages && <p className="text-red-500 text-xs mt-1">{errors.preferredLanguages}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-10 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-10 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Registering...
                    </>
                  ) : (
                    'Register as Job Seeker'
                  )}
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