import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Filter, MapPin, Briefcase, GraduationCap, Award, DollarSign, Phone, Mail, UserCheck, X, Users } from 'lucide-react';

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

  // Redirect if not employer
  if (!user) return null; // Will be handled by parent route
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

  const handleConnect = (emp) => {
    alert(`Connect with ${emp.full_name || emp.name}\n📞 ${emp.phone_number || emp.phone}\n📧 ${emp.email || 'N/A'}`);
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

      {/* Results Grid */}
      {filteredEmployees.length === 0 ? (
        <Card className="py-16 text-center text-gray-500">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-lg font-medium">No candidates found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map(emp => (
            <Card key={emp.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">{emp.full_name || emp.name || 'Unknown'}</h3>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Available</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600"><Phone size={14} /> {emp.phone_number || emp.phone || 'N/A'}</div>
                  <div className="flex items-center gap-2 text-gray-600"><Mail size={14} /> {emp.email || 'N/A'}</div>
                  <div className="flex items-center gap-2 text-gray-600"><MapPin size={14} /> {emp.location || 'Not specified'}</div>
                  <div className="flex items-center gap-2 text-gray-600"><Award size={14} /> Exp: {safeRender(emp.experience)}</div>
                  <div className="flex items-center gap-2 text-gray-600"><GraduationCap size={14} /> Edu: {safeRender(emp.highest_qualification)}</div>
                  <div className="flex items-center gap-2 text-gray-600"><Briefcase size={14} /> Type: {Array.isArray(emp.job_types) ? emp.job_types.join(', ') : (emp.job_types || 'Any')}</div>
                  <div className="flex items-center gap-2 text-gray-600"><DollarSign size={14} /> ₹{emp.expected_salary?.toLocaleString() || 'Negotiable'}</div>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-500">Skills</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(() => {
                      let skills = emp.skills;
                      if (!skills) return <span className="text-gray-400 text-xs">None</span>;
                      if (typeof skills === 'string') skills = skills.split(',');
                      if (!Array.isArray(skills)) skills = [];
                      return skills.map((s, i) => <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{s.trim()}</span>);
                    })()}
                  </div>
                </div>
                <Button onClick={() => handleConnect(emp)} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                  <UserCheck size={16} className="inline mr-2" /> Connect
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConnectEmployees;