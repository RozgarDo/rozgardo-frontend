import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Filter, MapPin, Briefcase, GraduationCap, Award, DollarSign, Phone, Mail, UserCheck, X, Users, Copy } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ConnectEmployees = ({ user }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skill: '',
    experience: '',
    education: '',
    location: '',
    expectedSalaryMin: '',
    expectedSalaryMax: '',
    jobType: '',
  });
  const [copiedField, setCopiedField] = useState(null); // track which field was copied

  // Redirect if not employer
  if (!user) return null;
  if (user.role !== 'employer') return <Navigate to="/employer-login" replace />;

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
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const safeRender = (value, fallback = 'Not specified') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string') return value || fallback;
    if (Array.isArray(value)) return value.length ? value.join(', ') : fallback;
    if (typeof value === 'object') {
      if (value.title || value.company || value.duration) {
        return [value.title, value.company, value.duration].filter(Boolean).join(' · ') || fallback;
      }
      return JSON.stringify(value);
    }
    return String(value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = [...employees];
    if (filters.skill) {
      filtered = filtered.filter(emp =>
        (emp.skills || '').toString().toLowerCase().includes(filters.skill.toLowerCase())
      );
    }
    if (filters.experience) {
      filtered = filtered.filter(emp =>
        (emp.experience || '').toString().toLowerCase().includes(filters.experience.toLowerCase())
      );
    }
    if (filters.education) {
      filtered = filtered.filter(emp =>
        (emp.highest_qualification || '').toString().toLowerCase().includes(filters.education.toLowerCase())
      );
    }
    if (filters.location) {
      filtered = filtered.filter(emp =>
        (emp.location || '').toString().toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.expectedSalaryMin) {
      const min = parseInt(filters.expectedSalaryMin);
      if (!isNaN(min)) filtered = filtered.filter(emp => emp.expected_salary && emp.expected_salary >= min);
    }
    if (filters.expectedSalaryMax) {
      const max = parseInt(filters.expectedSalaryMax);
      if (!isNaN(max)) filtered = filtered.filter(emp => emp.expected_salary && emp.expected_salary <= max);
    }
    if (filters.jobType) {
      filtered = filtered.filter(emp => {
        const types = emp.job_types;
        if (Array.isArray(types)) return types.includes(filters.jobType);
        if (typeof types === 'string') return types.split(',').includes(filters.jobType);
        return false;
      });
    }
    setFilteredEmployees(filtered);
  };

  const resetFilters = () => {
    setFilters({
      skill: '', experience: '', education: '', location: '',
      expectedSalaryMin: '', expectedSalaryMax: '', jobType: '',
    });
    setFilteredEmployees(employees);
  };

  // Copy to clipboard helper
  const copyToClipboard = (text, fieldId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    }).catch(err => {
      console.error('Copy failed:', err);
    });
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black mb-1">Find Candidates</h1>
          <p className="text-gray-500 flex items-center gap-1">
            <Users size={16} /> {filteredEmployees.length} skilled professionals available
          </p>
        </div>
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter size={18} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-6 mb-8 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="Skill" name="skill" placeholder="e.g., Plumber, Driver" value={filters.skill} onChange={handleFilterChange} />
            <Input label="Experience" name="experience" placeholder="e.g., 2 years" value={filters.experience} onChange={handleFilterChange} />
            <Input label="Education" name="education" placeholder="e.g., 10th, Diploma" value={filters.education} onChange={handleFilterChange} />
            <Input label="Location" name="location" placeholder="City" value={filters.location} onChange={handleFilterChange} />
            <div>
              <label className="text-sm font-medium mb-1 block">Expected Salary (₹)</label>
              <div className="flex gap-2">
                <input type="number" name="expectedSalaryMin" placeholder="Min" className="w-full p-2 border rounded-md" value={filters.expectedSalaryMin} onChange={handleFilterChange} />
                <input type="number" name="expectedSalaryMax" placeholder="Max" className="w-full p-2 border rounded-md" value={filters.expectedSalaryMax} onChange={handleFilterChange} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Job Type</label>
              <select name="jobType" className="w-full p-2 border rounded-md" value={filters.jobType} onChange={handleFilterChange}>
                <option value="">Any</option>
                <option value="Full-time">Full‑time</option>
                <option value="Part-time">Part‑time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={resetFilters}>Reset</Button>
            <Button onClick={applyFilters}>Search</Button>
          </div>
        </Card>
      )}

      {/* Table View */}
      {filteredEmployees.length === 0 ? (
        <Card className="py-16 text-center text-gray-500">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-lg font-medium">No candidates found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  {/* Name with copy */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{emp.full_name || emp.name || 'Unknown'}</span>
                      <button
                        onClick={() => copyToClipboard(emp.full_name || emp.name || '', `name-${emp.id}`)}
                        className="text-gray-400 hover:text-indigo-600 transition"
                        title="Copy name"
                      >
                        <Copy size={14} />
                      </button>
                      {copiedField === `name-${emp.id}` && (
                        <span className="text-xs text-green-600">Copied!</span>
                      )}
                    </div>
                  </td>
                  {/* Phone with copy */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{emp.phone_number || emp.phone || 'N/A'}</span>
                      {(emp.phone_number || emp.phone) && (
                        <button
                          onClick={() => copyToClipboard(emp.phone_number || emp.phone, `phone-${emp.id}`)}
                          className="text-gray-400 hover:text-indigo-600 transition"
                          title="Copy phone number"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                      {copiedField === `phone-${emp.id}` && (
                        <span className="text-xs text-green-600">Copied!</span>
                      )}
                    </div>
                  </td>
                  {/* Email with copy */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{emp.email || 'N/A'}</span>
                      {emp.email && (
                        <button
                          onClick={() => copyToClipboard(emp.email, `email-${emp.id}`)}
                          className="text-gray-400 hover:text-indigo-600 transition"
                          title="Copy email"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                      {copiedField === `email-${emp.id}` && (
                        <span className="text-xs text-green-600">Copied!</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.location || 'Not specified'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{safeRender(emp.experience)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{safeRender(emp.highest_qualification)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Array.isArray(emp.job_types) ? emp.job_types.join(', ') : (emp.job_types || 'Any')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{emp.expected_salary?.toLocaleString() || 'Negotiable'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        let skills = emp.skills;
                        if (!skills) return <span className="text-gray-400 text-xs">None</span>;
                        if (typeof skills === 'string') skills = skills.split(',');
                        if (!Array.isArray(skills)) skills = [];
                        return skills.map((s, i) => (
                          <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{s.trim()}</span>
                        ));
                      })()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConnectEmployees;