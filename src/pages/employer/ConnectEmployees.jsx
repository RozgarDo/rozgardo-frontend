import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { 
  Filter, MapPin, Briefcase, GraduationCap, Award, DollarSign, 
  X, Users, Copy, Eye, Search, SlidersHorizontal, Phone, Mail, 
  User, Globe, FileText
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ConnectEmployees = ({ user }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filters, setFilters] = useState({
    experience: '',
    education: '',
    location: '',
    expectedSalaryMin: '',
    jobType: '',
  });

  // Redirect if not employer
  if (!user) return null;
  if (user.role !== 'employer') return <Navigate to="/employer-login" replace />;

  // Helper to safely parse JSON fields
  const parseIfNeeded = (value) => {
    if (!value) return value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if ((trimmed.startsWith('[') || trimmed.startsWith('{')) && 
          (trimmed.endsWith(']') || trimmed.endsWith('}'))) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
      return value;
    }
    return value;
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/employees`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid data');
      
      const parsedEmployees = data.map(emp => ({
        ...emp,
        experience: parseIfNeeded(emp.experience),
        skills: parseIfNeeded(emp.skills),
        job_types: parseIfNeeded(emp.job_types),
        preferred_languages: parseIfNeeded(emp.preferred_languages),
        highest_qualification: parseIfNeeded(emp.highest_qualification),
      }));
      
      setEmployees(parsedEmployees);
      setFilteredEmployees(parsedEmployees);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderExperience = (exp) => {
    if (!exp) return 'Not specified';
    if (typeof exp === 'string') return exp;
    if (Array.isArray(exp)) {
      if (exp.length === 0) return 'Not specified';
      return exp.map((item, idx) => {
        if (typeof item === 'object' && item !== null) {
          const parts = [item.title, item.company, item.duration].filter(Boolean);
          return parts.join(' · ');
        }
        return String(item);
      }).join(' | ');
    }
    if (typeof exp === 'object') {
      const parts = [exp.title, exp.company, exp.duration].filter(Boolean);
      return parts.join(' · ') || 'Not specified';
    }
    return String(exp);
  };

  const safeRender = (value, fallback = 'Not specified') => {
    if (value === null || value === undefined) return fallback;
    if (Array.isArray(value)) {
      if (value.length === 0) return fallback;
      return value.join(', ');
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value) || fallback;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyAllFilters = () => {
    let filtered = [...employees];
    
    if (filters.experience) {
      filtered = filtered.filter(emp => {
        const expStr = renderExperience(emp.experience).toLowerCase();
        return expStr.includes(filters.experience.toLowerCase());
      });
    }
    if (filters.education) {
      filtered = filtered.filter(emp =>
        (emp.highest_qualification || '').toString().toLowerCase().includes(filters.education.toLowerCase())
      );
    }
    if (filters.location) {
      filtered = filtered.filter(emp =>
        (emp.current_location || emp.location || '').toString().toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.expectedSalaryMin) {
      const min = parseInt(filters.expectedSalaryMin);
      if (!isNaN(min)) {
        filtered = filtered.filter(emp => emp.expected_salary && emp.expected_salary >= min);
      }
    }
    if (filters.jobType) {
      filtered = filtered.filter(emp => {
        let types = emp.job_types;
        if (typeof types === 'string') types = types.split(',');
        if (Array.isArray(types)) {
          return types.some(t => t.toLowerCase().includes(filters.jobType.toLowerCase()));
        }
        return (emp.job_types || '').toString().toLowerCase().includes(filters.jobType.toLowerCase());
      });
    }

    if (globalSearch.trim()) {
      const searchTerm = globalSearch.toLowerCase();
      filtered = filtered.filter(emp => {
        const searchableFields = [
          emp.full_name, emp.phone_number, emp.email,
          emp.current_location, emp.location, emp.skills,
          renderExperience(emp.experience), emp.highest_qualification,
          emp.job_types, emp.preferred_languages, emp.job_type
        ].map(f => (f ? f.toString().toLowerCase() : '')).join(' ');
        return searchableFields.includes(searchTerm);
      });
    }

    setFilteredEmployees(filtered);
  };

  useEffect(() => {
    applyAllFilters();
  }, [filters, globalSearch, employees]);

  const resetFilters = () => {
    setFilters({
      experience: '', education: '', location: '',
      expectedSalaryMin: '', jobType: '',
    });
    setGlobalSearch('');
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v.toString().trim() !== '').length + (globalSearch.trim() ? 1 : 0);

  const copyToClipboard = (text, fieldId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    }).catch(err => console.error('Copy failed:', err));
  };

  const openModal = (emp) => {
    setSelectedEmployee(emp);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <Card className="p-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchEmployees}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header with Global Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black mb-1">Find Candidates</h1>
          <p className="text-gray-500 flex items-center gap-1">
            <Users size={16} /> {filteredEmployees.length} skilled professionals available
          </p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, phone, email, skill, location..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <SlidersHorizontal size={18} />
            {showFilters ? 'Hide Filters' : 'Filters'}
            {activeFilterCount > 0 && !showFilters && (
              <span className="ml-1 bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Filters Panel - No Skill/Profession filter */}
      {showFilters && (
        <Card className="p-6 mb-8 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block flex items-center gap-1">
                <Award size={16} /> Experience
              </label>
              <input
                type="text"
                name="experience"
                placeholder="e.g., 2 years"
                value={filters.experience}
                onChange={handleFilterChange}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block flex items-center gap-1">
                <GraduationCap size={16} /> Education
              </label>
              <input
                type="text"
                name="education"
                placeholder="e.g., Diploma, ITI"
                value={filters.education}
                onChange={handleFilterChange}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block flex items-center gap-1">
                <MapPin size={16} /> Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="City"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block flex items-center gap-1">
                <DollarSign size={16} /> Expected Salary
              </label>
              <input
                type="number"
                name="expectedSalaryMin"
                placeholder="e.g., 20000"
                value={filters.expectedSalaryMin}
                onChange={handleFilterChange}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block flex items-center gap-1">
                <Briefcase size={16} /> Job Types
              </label>
              <input
                type="text"
                name="jobType"
                placeholder="e.g., Driver, Plumber, Full-time"
                value={filters.jobType}
                onChange={handleFilterChange}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={resetFilters} className="flex items-center gap-1">
              <X size={16} /> Clear all filters
            </Button>
          </div>
        </Card>
      )}

      {/* Employee Table (unchanged) */}
      {filteredEmployees.length === 0 ? (
        <Card className="py-16 text-center text-gray-500">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-lg font-medium">No candidates found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 cursor-pointer transition" onClick={() => openModal(emp)}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{emp.full_name || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.phone_number || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.current_location || emp.location || 'Not specified'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Array.isArray(emp.job_types) ? emp.job_types.join(', ') : (emp.job_types || 'Any')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => { e.stopPropagation(); openModal(emp); }}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium"
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal - No Account Status, no Skill/Profession filter */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Candidate Details</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Basic Info with copy buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <User size={12} /> Full Name
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-900 font-medium">{selectedEmployee.full_name || 'Unknown'}</p>
                    <button onClick={() => copyToClipboard(selectedEmployee.full_name || '', 'modal-name')} className="text-gray-400 hover:text-indigo-600">
                      <Copy size={16} />
                    </button>
                    {copiedField === 'modal-name' && <span className="text-xs text-green-600">Copied!</span>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <Phone size={12} /> Phone Number
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-900">{selectedEmployee.phone_number || 'N/A'}</p>
                    {selectedEmployee.phone_number && (
                      <button onClick={() => copyToClipboard(selectedEmployee.phone_number, 'modal-phone')} className="text-gray-400 hover:text-indigo-600">
                        <Copy size={16} />
                      </button>
                    )}
                    {copiedField === 'modal-phone' && <span className="text-xs text-green-600">Copied!</span>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <Mail size={12} /> Email
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-900">{selectedEmployee.email || 'N/A'}</p>
                    {selectedEmployee.email && (
                      <button onClick={() => copyToClipboard(selectedEmployee.email, 'modal-email')} className="text-gray-400 hover:text-indigo-600">
                        <Copy size={16} />
                      </button>
                    )}
                    {copiedField === 'modal-email' && <span className="text-xs text-green-600">Copied!</span>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <MapPin size={12} /> Current Location
                  </label>
                  <p className="text-gray-900 mt-1">{selectedEmployee.current_location || selectedEmployee.location || 'Not specified'}</p>
                </div>
              </div>

              <hr className="my-2" />

              {/* Work & Professional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <Briefcase size={14} /> Experience
                  </label>
                  <div className="text-gray-900 mt-1 text-sm">
                    {renderExperience(selectedEmployee.experience)}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <GraduationCap size={14} /> Highest Qualification
                  </label>
                  <p className="text-gray-900 mt-1">{safeRender(selectedEmployee.highest_qualification)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <Award size={14} /> Skills
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(() => {
                      let skills = selectedEmployee.skills;
                      if (!skills) return <span className="text-gray-400 text-xs">None</span>;
                      if (typeof skills === 'string') skills = skills.split(',');
                      if (!Array.isArray(skills)) skills = [];
                      return skills.map((s, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{s.trim()}</span>
                      ));
                    })()}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <DollarSign size={14} /> Expected Salary
                  </label>
                  <p className="text-gray-900 mt-1">₹{selectedEmployee.expected_salary?.toLocaleString() || 'Negotiable'}</p>
                </div>
              </div>

              <hr className="my-2" />

              {/* Additional Details - No Account Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <Briefcase size={14} /> Job Types
                  </label>
                  <p className="text-gray-900 mt-1">
                    {Array.isArray(selectedEmployee.job_types) 
                      ? selectedEmployee.job_types.join(', ') 
                      : (selectedEmployee.job_types || 'Not specified')}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <Globe size={14} /> Preferred Languages
                  </label>
                  <p className="text-gray-900 mt-1">
                    {Array.isArray(selectedEmployee.preferred_languages) 
                      ? selectedEmployee.preferred_languages.join(', ') 
                      : (selectedEmployee.preferred_languages || 'Not specified')}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <MapPin size={14} /> Preferred Location
                  </label>
                  <p className="text-gray-900 mt-1">{selectedEmployee.preferred_location || 'Not specified'}</p>
                </div>
              </div>

              {/* Bio */}
              {(selectedEmployee.bio || selectedEmployee.about) && (
                <>
                  <hr className="my-2" />
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                      <FileText size={14} /> Bio / About
                    </label>
                    <p className="text-gray-700 mt-1 text-sm whitespace-pre-wrap">
                      {selectedEmployee.bio || selectedEmployee.about}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <Button onClick={closeModal}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectEmployees;