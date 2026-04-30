import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Simple icon components using emoji/unicode to avoid dependencies
const Icon = ({ children, className }) => (
  <span className={className}>{children}</span>
);

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
    linkedinProfile: '',
    candidatesRequired: '',
    jobLocation: '',
    jobCategories: [],
    password: '',
    confirmPassword: ''
  });

  const jobCategoriesList = [
    'Driver', 'Delivery', 'Cook', 'Cleaner', 'Helper',
    'Electrician', 'Plumber', 'Security', 'Office Staff',
    'Warehouse', '+ Others'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => {
      const current = [...prev.jobCategories];
      if (current.includes(value)) {
        return { ...prev, jobCategories: current.filter(item => item !== value) };
      } else {
        return { ...prev, jobCategories: [...current, value] };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.officeLocation.trim()) newErrors.officeLocation = 'Office location is required';
    if (!formData.hrFirstName.trim()) newErrors.hrFirstName = 'First name is required';
    if (!formData.hrLastName.trim()) newErrors.hrLastName = 'Last name is required';
    
    if (!formData.officialEmail.trim()) newErrors.officialEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
      newErrors.officialEmail = 'Enter valid email address';
    }
    
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    else if (!/^\d{10}$/.test(formData.contactNumber)) newErrors.contactNumber = 'Enter valid 10-digit number';
    
    if (!formData.candidatesRequired) newErrors.candidatesRequired = 'Number of candidates required';
    else if (parseInt(formData.candidatesRequired) < 1) newErrors.candidatesRequired = 'Must be at least 1';
    
    if (!formData.jobLocation.trim()) newErrors.jobLocation = 'Job location is required';
    if (formData.jobCategories.length === 0) newErrors.jobCategories = 'Select at least one job category';
    
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Employer Registration Data:', formData);
    setLoading(false);
    navigate('/login', { state: { message: 'Registration successful! Please login.' } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          ← Back to Home
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* LEFT COLUMN - INFOGRAPHICS */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-8">
                    <span className="text-2xl">📈</span>
                    <span className="text-xl font-bold">EmployerHub</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-4">Hire Better Talent</h2>
                  <p className="text-indigo-100 mb-8 leading-relaxed">
                    Connect with skilled blue-collar workers across India. Post jobs, 
                    manage applications, and find the right candidates faster.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-green-300">✓</span>
                      <span>Access to verified job seekers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-300">✓</span>
                      <span>Post unlimited jobs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-300">✓</span>
                      <span>Smart candidate matching</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-300">✓</span>
                      <span>Analytics & insights</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-indigo-400">
                  <div className="text-sm text-indigo-200">
                    <p>Already registered?</p>
                    <button 
                      onClick={() => navigate('/login')}
                      className="mt-2 text-white font-semibold underline hover:no-underline"
                    >
                      Login to your account →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - FORM */}
            <div className="p-8 overflow-y-auto max-h-[90vh]">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Company Hiring Profile</h2>
                <p className="text-gray-500">Find skilled blue-collar talent</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🏢</span>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${
                        errors.companyName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="ABC Logistics"
                    />
                  </div>
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                </div>

                {/* Office Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
                    <input
                      type="text"
                      name="officeLocation"
                      value={formData.officeLocation}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${
                        errors.officeLocation ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Mumbai, Full address"
                    />
                  </div>
                  {errors.officeLocation && <p className="text-red-500 text-xs mt-1">{errors.officeLocation}</p>}
                </div>

                {/* HR First & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      HR First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                      <input
                        type="text"
                        name="hrFirstName"
                        value={formData.hrFirstName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${
                          errors.hrFirstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Rahul"
                      />
                    </div>
                    {errors.hrFirstName && <p className="text-red-500 text-xs mt-1">{errors.hrFirstName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      HR Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                      <input
                        type="text"
                        name="hrLastName"
                        value={formData.hrLastName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${
                          errors.hrLastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Sharma"
                      />
                    </div>
                    {errors.hrLastName && <p className="text-red-500 text-xs mt-1">{errors.hrLastName}</p>}
                  </div>
                </div>

                {/* Official Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Official Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                    <input
                      type="email"
                      name="officialEmail"
                      value={formData.officialEmail}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${
                        errors.officialEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="hr@company.com"
                    />
                  </div>
                  {errors.officialEmail && <p className="text-red-500 text-xs mt-1">{errors.officialEmail}</p>}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📞</span>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${
                        errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="9876543210"
                    />
                  </div>
                  {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                </div>

                {/* LinkedIn Profile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔗</span>
                    <input
                      type="url"
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                {/* Candidates Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Candidates Required <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👥</span>
                    <input
                      type="number"
                      name="candidatesRequired"
                      value={formData.candidatesRequired}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${
                        errors.candidatesRequired ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="5"
                      min="1"
                    />
                  </div>
                  {errors.candidatesRequired && <p className="text-red-500 text-xs mt-1">{errors.candidatesRequired}</p>}
                </div>

                {/* Job Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
                    <input
                      type="text"
                      name="jobLocation"
                      value={formData.jobLocation}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${
                        errors.jobLocation ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Mumbai, Delhi, Bangalore"
                    />
                  </div>
                  {errors.jobLocation && <p className="text-red-500 text-xs mt-1">{errors.jobLocation}</p>}
                </div>

                {/* Job Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Categories You Hire For <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {jobCategoriesList.map(category => (
                      <label key={category} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.jobCategories.includes(category)}
                          onChange={() => handleCheckboxChange(category)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                  {errors.jobCategories && <p className="text-red-500 text-xs mt-1">{errors.jobCategories}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
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
                      {showPassword ? '🙈' : '👁️'}
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
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
                      {showConfirmPassword ? '🙈' : '👁️'}
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
                  {loading ? 'Registering...' : 'Register as Employer'}
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