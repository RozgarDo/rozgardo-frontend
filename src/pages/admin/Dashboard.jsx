import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { 
  ShieldAlert, CheckCircle, XCircle, Users, Briefcase, 
  TrendingUp, DollarSign, Calendar, Building, Download, 
  ChevronDown, ChevronUp, MapPin, IndianRupee, Clock, 
  Award, GraduationCap, LayoutGrid, UserCheck, UserX, 
  Mail, Phone, AlertCircle, Filter, X, FileText, Search
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] =useState('jobs');
  const [usersTab, setUsersTab] = useState('employer');
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);
  const [applicantsMap, setApplicantsMap] = useState({});
  const [loadingApplicants, setLoadingApplicants] = useState({});

  // Report filters
  const [reportDateFilterType, setReportDateFilterType] = useState('all');
  const [reportCustomStartDate, setReportCustomStartDate] = useState('');
  const [reportCustomEndDate, setReportCustomEndDate] = useState('');
  const [showReportCustomDatePicker, setShowReportCustomDatePicker] = useState(false);
  const [reportType, setReportType] = useState('combined');
  const [searchEmployee, setSearchEmployee] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
    } else if (activeTab === 'users') {
      fetchAllUsers();
    } else if (activeTab === 'reports') {
      fetchAllDataForReports();
    }
  }, [activeTab]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const [empRes, employerRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/auth/employees`),
        fetch(`${API_BASE_URL}/api/auth/employers`)
      ]);
      if (empRes.ok) {
        const empData = await empRes.json();
        setEmployees(empData);
      }
      if (employerRes.ok) {
        const employerData = await employerRes.json();
        setEmployers(employerData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDataForReports = async () => {
    setLoading(true);
    try {
      const [jobsRes, empRes, appsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/jobs`),
        fetch(`${API_BASE_URL}/api/auth/employees`),
        fetch(`${API_BASE_URL}/api/applications`)
      ]);
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      }
      if (empRes.ok) {
        const empData = await empRes.json();
        setEmployees(empData);
      }
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData);
        // Also build applicantsMap for quick access
        const newApplicantsMap = {};
        appsData.forEach(app => {
          if (!newApplicantsMap[app.job_id]) {
            newApplicantsMap[app.job_id] = [];
          }
          newApplicantsMap[app.job_id].push(app);
        });
        setApplicantsMap(newApplicantsMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicantsForJob = async (jobId) => {
    if (applicantsMap[jobId]) return;
    setLoadingApplicants(prev => ({ ...prev, [jobId]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications/job/${jobId}`);
      if (res.ok) {
        const data = await res.json();
        setApplicantsMap(prev => ({ ...prev, [jobId]: data }));
      } else {
        setApplicantsMap(prev => ({ ...prev, [jobId]: [] }));
      }
    } catch (err) {
      console.error(err);
      setApplicantsMap(prev => ({ ...prev, [jobId]: [] }));
    } finally {
      setLoadingApplicants(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const handleJobAction = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setJobs(jobs.map(job => job.id === id ? { ...job, status } : job));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpandJob = (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
      fetchApplicantsForJob(jobId);
    }
  };

  const toggleExpandEmployee = (employeeId) => {
    if (expandedEmployeeId === employeeId) {
      setExpandedEmployeeId(null);
    } else {
      setExpandedEmployeeId(employeeId);
    }
  };

  // Date filtering logic for reports
  const isWithinReportDateRange = (createdAt) => {
    if (!createdAt) return false;
    const date = new Date(createdAt);
    const now = new Date();
    if (reportDateFilterType === 'all') return true;
    if (reportDateFilterType === 'last1month') {
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return date >= oneMonthAgo;
    }
    if (reportDateFilterType === 'last2months') {
      const twoMonthsAgo = new Date(now);
      twoMonthsAgo.setMonth(now.getMonth() - 2);
      return date >= twoMonthsAgo;
    }
    if (reportDateFilterType === 'last3months') {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return date >= threeMonthsAgo;
    }
    if (reportDateFilterType === 'custom' && reportCustomStartDate && reportCustomEndDate) {
      const start = new Date(reportCustomStartDate);
      const end = new Date(reportCustomEndDate);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    }
    return true;
  };

  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const decidedJobsAll = jobs.filter(j => j.status !== 'pending');

  const approvedJobs = jobs.filter(j => j.status === 'approved').length;
  const totalEmployers = employers.length;
  const totalEmployees = employees.length;

  const estimatedRevenue = {
    total: approvedJobs * 500,
    thisMonth: Math.floor(approvedJobs * 500 * 0.3),
    lastMonth: Math.floor(approvedJobs * 500 * 0.25),
  };

  const monthlyData = [
    { month: 'Apr 2026', jobs: Math.floor(Math.random() * 10) + 5, revenue: Math.floor(Math.random() * 5000) + 2000 },
    { month: 'Mar 2026', jobs: Math.floor(Math.random() * 10) + 3, revenue: Math.floor(Math.random() * 5000) + 1500 },
    { month: 'Feb 2026', jobs: Math.floor(Math.random() * 10) + 4, revenue: Math.floor(Math.random() * 5000) + 1800 },
    { month: 'Jan 2026', jobs: Math.floor(Math.random() * 10) + 2, revenue: Math.floor(Math.random() * 5000) + 1000 },
  ];

  const employersWithJobs = jobs.reduce((acc, job) => {
    const name = job.employer_name || 'Unknown';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const employerStats = Object.entries(employersWithJobs)
    .map(([name, count]) => ({ name, jobs: count, revenue: count * 500 }))
    .sort((a, b) => b.jobs - a.jobs)
    .slice(0, 5);

  const exportToCSV = (data, filename, headers) => {
    if (!data || data.length === 0) return;
    const csvRows = [headers.join(',')];
    data.forEach(row => {
      const rowData = headers.map((h, i) => {
        const val = String(row[Object.keys(row)[i]] || '');
        return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
      });
      csvRows.push(rowData.join(','));
    });
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename + '.csv');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const exportJobs = () => {
    const data = jobs.map(j => ({
      title: j.title,
      employer: j.employer_name,
      category: j.category,
      location: j.location,
      salary: j.salary,
      status: j.status,
      created: j.created_at
    }));
    exportToCSV(data, 'jobs_export', ['Title', 'Employer', 'Category', 'Location', 'Salary', 'Status', 'Created']);
  };

  const exportUsers = () => {
    let data = [];
    if (usersTab === 'employee') data = employees;
    else if (usersTab === 'employer') data = employers;
    let exportData, headers;
    if (usersTab === 'employee') {
      exportData = data.map(u => ({
        name: u.name || u.full_name || 'N/A',
        phone: u.phone || u.phone_number || u.contact_number || 'N/A',
        email: u.email || u.official_email || 'N/A',
        skills: u.skills || 'N/A',
        education: u.education || 'N/A',
        experience: u.experience || 'N/A',
        role: u.role
      }));
      headers = ['Name', 'Phone', 'Email', 'Skills', 'Education', 'Experience', 'Role'];
    } else {
      exportData = data.map(u => ({
        name: u.name || u.full_name || u.company_name || 'N/A',
        phone: u.phone || u.phone_number || u.contact_number || 'N/A',
        email: u.email || u.official_email || 'N/A',
        role: u.role
      }));
      headers = ['Name', 'Phone', 'Email', 'Role'];
    }
    exportToCSV(exportData, `${usersTab}s_export`, headers);
  };

  const exportMonthlyAnalytics = () => {
    exportToCSV(monthlyData, 'monthly_analytics', ['Month', 'Jobs', 'Revenue']);
  };

  const exportEmployerStats = () => {
    exportToCSV(employerStats, 'employer_stats', ['Employer', 'Jobs', 'Revenue']);
  };

  const exportApplicantsForJob = (jobId) => {
    const applicants = applicantsMap[jobId] || [];
    if (!applicants.length) {
      alert('No applicants for this job');
      return;
    }
    const exportData = applicants.map(app => ({
      name: app.users?.name || 'Unknown',
      phone: app.users?.phone || 'N/A',
      email: app.users?.email || 'N/A',
      skills: app.users?.skills || 'N/A',
      education: app.users?.education || 'N/A',
      experience: app.users?.experience || 'N/A',
      status: app.status || 'N/A',
      interview_date: app.interview_date ? new Date(app.interview_date).toLocaleString() : '-',
      job_title: jobs.find(j => j.id === jobId)?.title || 'N/A'
    }));
    const headers = ['Name', 'Phone', 'Email', 'Skills', 'Education', 'Experience', 'Status', 'Interview Date', 'Job Title'];
    exportToCSV(exportData, `applicants_job_${jobId}`, headers);
  };

  const getFilteredUsers = (role) => {
    if (role === 'employee') return employees;
    if (role === 'employer') return employers;
    return [];
  };

  const renderUsersTable = () => {
    const filteredUsers = getFilteredUsers(usersTab);
    if (filteredUsers.length === 0) {
      return (
        <div className="text-center py-12 text-muted">
          <p>No {usersTab}s found</p>
        </div>
      );
    }
    return (
      <table className="w-full text-left bg-white rounded-lg shadow-sm overflow-hidden text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-4 font-bold text-gray-700">Name</th>
            <th className="p-4 font-bold text-gray-700">Phone</th>
            <th className="p-4 font-bold text-gray-700">Email</th>
            <th className="p-4 font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-4 font-semibold">{u.name || u.full_name || u.company_name || 'N/A'}</td>
              <td className="p-4 text-gray-600">{u.phone || u.phone_number || u.contact_number || 'N/A'}</td>
              <td className="p-4 text-gray-600">{u.email || u.official_email || 'N/A'}</td>
              <td className="p-4">
                <button className="text-primary hover:underline font-medium text-xs mr-3">View</button>
                <button className="text-danger hover:underline font-medium text-xs">Suspend</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderApplicantDetails = (jobId) => {
    const applicants = applicantsMap[jobId] || [];
    const isLoading = loadingApplicants[jobId];
    if (isLoading) return <div className="text-center py-4">Loading applicants...</div>;
    if (applicants.length === 0) return <div className="text-center py-4 text-gray-500">No applicants yet for this position.</div>;

    const counts = {
      applied: applicants.filter(a => a.status === 'applied').length,
      shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
      interview: applicants.filter(a => a.status === 'interview').length,
      selected: applicants.filter(a => a.status === 'selected').length,
      rejected: applicants.filter(a => a.status === 'rejected').length
    };

    return (
      <div className="mt-4 space-y-4">
        <div className="flex justify-end mb-2">
          <Button onClick={() => exportApplicantsForJob(jobId)} variant="outline" className="text-xs">
            <Download size={14} className="mr-1" /> Export Applicants
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          <div className="bg-blue-50 p-2 rounded text-center"><span className="font-bold">{counts.applied}</span><p className="text-xs">Applied</p></div>
          <div className="bg-purple-50 p-2 rounded text-center"><span className="font-bold">{counts.shortlisted}</span><p className="text-xs">Shortlisted</p></div>
          <div className="bg-indigo-50 p-2 rounded text-center"><span className="font-bold">{counts.interview}</span><p className="text-xs">Interview</p></div>
          <div className="bg-green-50 p-2 rounded text-center"><span className="font-bold">{counts.selected}</span><p className="text-xs">Selected</p></div>
          <div className="bg-red-50 p-2 rounded text-center"><span className="font-bold">{counts.rejected}</span><p className="text-xs">Rejected</p></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Contact</th>
                <th className="p-2 text-left">Skills</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Interview Date</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map(app => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{app.users?.name || 'Unknown'}</td>
                  <td className="p-2">
                    <div className="flex flex-col text-xs">
                      {app.users?.phone && <span className="flex items-center gap-1"><Phone size={12}/> {app.users.phone}</span>}
                      {app.users?.email && <span className="flex items-center gap-1"><Mail size={12}/> {app.users.email}</span>}
                    </div>
                  </td>
                  <td className="p-2 text-xs max-w-[200px] truncate">{app.users?.skills || 'N/A'}</td>
                  <td className="p-2">
                    <span className={`badge badge-${app.status}`}>
                      {app.status === 'selected' ? 'HIRED' : app.status}
                    </span>
                  </td>
                  <td className="p-2 text-xs">
                    {app.interview_date ? new Date(app.interview_date).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Report rendering functions
  const getJobStatusCounts = (job) => {
    const jobApps = applications.filter(app => app.job_id === job.id);
    return {
      applied: jobApps.filter(a => a.status === 'applied').length,
      shortlisted: jobApps.filter(a => a.status === 'shortlisted').length,
      interview: jobApps.filter(a => a.status === 'interview').length,
      selected: jobApps.filter(a => a.status === 'selected').length,
      rejected: jobApps.filter(a => a.status === 'rejected').length,
      total: jobApps.length
    };
  };

  const getEmployeeApplications = (employeeId) => {
    return applications.filter(app => app.employee_id === employeeId);
  };

  const renderJobsOnlyReport = () => {
    let filteredJobs = jobs.filter(job => isWithinReportDateRange(job.created_at));
    
    // Apply status filter
    if (jobStatusFilter !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === jobStatusFilter);
    }
    
    if (filteredJobs.length === 0) {
      return <Card className="py-8 text-center text-muted">No jobs found matching the criteria.</Card>;
    }
    
    return (
      <div className="space-y-4 mt-4">
        {filteredJobs.map(job => {
          const counts = getJobStatusCounts(job);
          const isExpanded = expandedJobId === job.id;
          return (
            <div key={job.id} className="mb-4">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${isExpanded ? 'border-2 border-indigo-300' : ''}`}
                onClick={() => toggleExpandJob(job.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.employer_name}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{job.category}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{job.location}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">₹{job.salary}/month</span>
                      <span className={`text-xs px-2 py-1 rounded ${job.status === 'approved' ? 'bg-green-100 text-green-700' : job.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total Applications</p>
                      <p className="text-xl font-bold">{counts.total}</p>
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </Card>
              {isExpanded && (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    <div className="bg-blue-50 p-2 rounded text-center"><span className="font-bold">{counts.applied}</span><p className="text-xs">Applied</p></div>
                    <div className="bg-purple-50 p-2 rounded text-center"><span className="font-bold">{counts.shortlisted}</span><p className="text-xs">Shortlisted</p></div>
                    <div className="bg-indigo-50 p-2 rounded text-center"><span className="font-bold">{counts.interview}</span><p className="text-xs">Interview</p></div>
                    <div className="bg-green-50 p-2 rounded text-center"><span className="font-bold">{counts.selected}</span><p className="text-xs">Selected</p></div>
                    <div className="bg-red-50 p-2 rounded text-center"><span className="font-bold">{counts.rejected}</span><p className="text-xs">Rejected</p></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><p className="text-sm font-semibold">Description</p><p className="text-gray-700 text-sm">{job.description || 'No description'}</p></div>
                    <div><p className="text-sm font-semibold">Requirements</p><p className="text-gray-700 text-sm">Experience: {job.required_experience || 'N/A'}<br/>Education: {job.education || 'N/A'}<br/>Skills: {job.technical_skills || 'N/A'}</p></div>
                  </div>
                  <h4 className="font-bold mb-2">Applicants</h4>
                  {renderApplicantDetails(job.id)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderEmployeesOnlyReport = () => {
    let filteredEmployees = employees;
    
    if (searchEmployee) {
      filteredEmployees = employees.filter(emp => {
        const name = (emp.full_name || emp.name || '').toLowerCase();
        const phone = (emp.phone_number || emp.phone || '').toLowerCase();
        const email = (emp.email || '').toLowerCase();
        const query = searchEmployee.toLowerCase();
        return name.includes(query) || phone.includes(query) || email.includes(query);
      });
    }
    
    if (filteredEmployees.length === 0) {
      return <Card className="py-8 text-center text-muted">No employees found.</Card>;
    }
    
    return (
      <div className="space-y-4 mt-4">
        {filteredEmployees.map(emp => {
          const empApps = getEmployeeApplications(emp.id);
          const isExpanded = expandedEmployeeId === emp.id;
          const counts = {
            applied: empApps.filter(a => a.status === 'applied').length,
            shortlisted: empApps.filter(a => a.status === 'shortlisted').length,
            interview: empApps.filter(a => a.status === 'interview').length,
            selected: empApps.filter(a => a.status === 'selected').length,
            rejected: empApps.filter(a => a.status === 'rejected').length
          };
          
          return (
            <div key={emp.id} className="mb-4">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${isExpanded ? 'border-2 border-indigo-300' : ''}`}
                onClick={() => toggleExpandEmployee(emp.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{emp.full_name || emp.name || 'Unknown'}</h3>
                    <p className="text-sm text-gray-500">{emp.phone_number || emp.phone} | {emp.email || 'No email'}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Total Apps: {empApps.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Applications</p>
                      <p className="text-xl font-bold">{empApps.length}</p>
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </Card>
              {isExpanded && (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    <div className="bg-blue-50 p-2 rounded text-center"><span className="font-bold">{counts.applied}</span><p className="text-xs">Applied</p></div>
                    <div className="bg-purple-50 p-2 rounded text-center"><span className="font-bold">{counts.shortlisted}</span><p className="text-xs">Shortlisted</p></div>
                    <div className="bg-indigo-50 p-2 rounded text-center"><span className="font-bold">{counts.interview}</span><p className="text-xs">Interview</p></div>
                    <div className="bg-green-50 p-2 rounded text-center"><span className="font-bold">{counts.selected}</span><p className="text-xs">Selected</p></div>
                    <div className="bg-red-50 p-2 rounded text-center"><span className="font-bold">{counts.rejected}</span><p className="text-xs">Rejected</p></div>
                  </div>
                  {empApps.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No applications yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2 text-left">Job Title</th>
                            <th className="p-2 text-left">Employer</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Interview Date</th>
                            <th className="p-2 text-left">Applied On</th>
                          </tr>
                        </thead>
                        <tbody>
                          {empApps.map(app => {
                            const job = jobs.find(j => j.id === app.job_id);
                            return (
                              <tr key={app.id} className="border-t">
                                <td className="p-2">{job?.title || 'Unknown'}</td>
                                <td className="p-2">{job?.employer_name || 'Unknown'}</td>
                                <td className="p-2"><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                                <td className="p-2">{app.interview_date ? new Date(app.interview_date).toLocaleString() : '-'}</td>
                                <td className="p-2">{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '-'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCombinedReport = () => {
    let filteredJobs = jobs.filter(job => isWithinReportDateRange(job.created_at));
    
    if (filteredJobs.length === 0) {
      return <Card className="py-8 text-center text-muted">No jobs found in selected date range.</Card>;
    }
    
    return (
      <div className="space-y-6 mt-4">
        {filteredJobs.map(job => {
          const jobApps = applications.filter(app => app.job_id === job.id);
          const counts = {
            applied: jobApps.filter(a => a.status === 'applied').length,
            shortlisted: jobApps.filter(a => a.status === 'shortlisted').length,
            interview: jobApps.filter(a => a.status === 'interview').length,
            selected: jobApps.filter(a => a.status === 'selected').length,
            rejected: jobApps.filter(a => a.status === 'rejected').length
          };
          const isExpanded = expandedJobId === job.id;
          
          return (
            <div key={job.id} className="mb-4">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${isExpanded ? 'border-2 border-indigo-300' : ''}`}
                onClick={() => toggleExpandJob(job.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.employer_name} | {job.location} | ₹{job.salary}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{job.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${job.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{job.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Applications</p>
                      <p className="text-xl font-bold">{jobApps.length}</p>
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </Card>
              {isExpanded && (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    <div className="bg-blue-50 p-2 rounded text-center"><span className="font-bold">{counts.applied}</span><p className="text-xs">Applied</p></div>
                    <div className="bg-purple-50 p-2 rounded text-center"><span className="font-bold">{counts.shortlisted}</span><p className="text-xs">Shortlisted</p></div>
                    <div className="bg-indigo-50 p-2 rounded text-center"><span className="font-bold">{counts.interview}</span><p className="text-xs">Interview</p></div>
                    <div className="bg-green-50 p-2 rounded text-center"><span className="font-bold">{counts.selected}</span><p className="text-xs">Selected</p></div>
                    <div className="bg-red-50 p-2 rounded text-center"><span className="font-bold">{counts.rejected}</span><p className="text-xs">Rejected</p></div>
                  </div>
                  {jobApps.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No applicants yet for this position.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2 text-left">Applicant Name</th>
                            <th className="p-2 text-left">Contact</th>
                            <th className="p-2 text-left">Skills</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Interview Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobApps.map(app => (
                            <tr key={app.id} className="border-t">
                              <td className="p-2 font-medium">{app.users?.name || 'Unknown'}</td>
                              <td className="p-2 text-xs">{app.users?.phone}<br/>{app.users?.email}</td>
                              <td className="p-2 text-xs">{app.users?.skills || '-'}</td>
                              <td className="p-2"><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                              <td className="p-2 text-xs">{app.interview_date ? new Date(app.interview_date).toLocaleString() : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const exportEmployeesReport = () => {
    let filteredEmployees = employees;
    if (searchEmployee) {
      filteredEmployees = employees.filter(emp => {
        const name = (emp.full_name || emp.name || '').toLowerCase();
        const phone = (emp.phone_number || emp.phone || '').toLowerCase();
        const email = (emp.email || '').toLowerCase();
        const query = searchEmployee.toLowerCase();
        return name.includes(query) || phone.includes(query) || email.includes(query);
      });
    }
    const data = filteredEmployees.map(emp => {
      const empApps = getEmployeeApplications(emp.id);
      return {
        name: emp.full_name || emp.name || 'N/A',
        phone: emp.phone_number || emp.phone || 'N/A',
        email: emp.email || 'N/A',
        total_applications: empApps.length,
        applied: empApps.filter(a => a.status === 'applied').length,
        shortlisted: empApps.filter(a => a.status === 'shortlisted').length,
        interview: empApps.filter(a => a.status === 'interview').length,
        selected: empApps.filter(a => a.status === 'selected').length,
        rejected: empApps.filter(a => a.status === 'rejected').length
      };
    });
    exportToCSV(data, 'employees_report', ['Name', 'Phone', 'Email', 'Total Applications', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected']);
  };

  const exportJobsReport = () => {
    let filteredJobs = jobs.filter(job => isWithinReportDateRange(job.created_at));
    if (jobStatusFilter !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === jobStatusFilter);
    }
    const data = filteredJobs.map(job => {
      const counts = getJobStatusCounts(job);
      return {
        title: job.title,
        employer: job.employer_name,
        category: job.category,
        location: job.location,
        salary: job.salary,
        status: job.status,
        posted_date: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
        total_applications: counts.total,
        applied: counts.applied,
        shortlisted: counts.shortlisted,
        interview: counts.interview,
        selected: counts.selected,
        rejected: counts.rejected
      };
    });
    exportToCSV(data, `jobs_report_${reportDateFilterType}`, ['Title', 'Employer', 'Category', 'Location', 'Salary', 'Status', 'Posted Date', 'Total Applications', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected']);
  };

  const exportCombinedReport = () => {
    let filteredJobs = jobs.filter(job => isWithinReportDateRange(job.created_at));
    const allData = [];
    filteredJobs.forEach(job => {
      const jobApps = applications.filter(app => app.job_id === job.id);
      if (jobApps.length === 0) {
        allData.push({
          job_title: job.title,
          employer: job.employer_name,
          category: job.category,
          location: job.location,
          salary: job.salary,
          job_status: job.status,
          posted_date: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
          applicant_name: 'No applicants',
          applicant_phone: '',
          applicant_email: '',
          application_status: '',
          interview_date: ''
        });
      } else {
        jobApps.forEach(app => {
          allData.push({
            job_title: job.title,
            employer: job.employer_name,
            category: job.category,
            location: job.location,
            salary: job.salary,
            job_status: job.status,
            posted_date: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
            applicant_name: app.users?.name || 'Unknown',
            applicant_phone: app.users?.phone || 'N/A',
            applicant_email: app.users?.email || 'N/A',
            applicant_skills: app.users?.skills || 'N/A',
            application_status: app.status || 'N/A',
            interview_date: app.interview_date ? new Date(app.interview_date).toLocaleString() : '-'
          });
        });
      }
    });
    const headers = ['Job Title', 'Employer', 'Category', 'Location', 'Salary', 'Job Status', 'Posted Date', 'Applicant Name', 'Applicant Phone', 'Applicant Email', 'Applicant Skills', 'Application Status', 'Interview Date'];
    exportToCSV(allData, `combined_report_${reportDateFilterType}`, headers);
  };

  return (
    <div className="container py-8 page-enter">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldAlert className="text-primary" size={32} /> Admin Center
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <TrendingUp size={24} className="mx-auto text-green-600 mb-2" />
          <p className="text-2xl font-bold">₹{estimatedRevenue.total.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </Card>
        <Card className="p-4 text-center">
          <DollarSign size={24} className="mx-auto text-blue-600 mb-2" />
          <p className="text-2xl font-bold">₹{estimatedRevenue.thisMonth.toLocaleString()}</p>
          <p className="text-sm text-gray-500">This Month</p>
        </Card>
        <Card className="p-4 text-center">
          <Briefcase size={24} className="mx-auto text-purple-600 mb-2" />
          <p className="text-2xl font-bold">{approvedJobs}</p>
          <p className="text-sm text-gray-500">Jobs Approved</p>
        </Card>
        <Card className="p-4 text-center">
          <Building size={24} className="mx-auto text-indigo-600 mb-2" />
          <p className="text-2xl font-bold">{totalEmployers}</p>
          <p className="text-sm text-gray-500">Employers</p>
        </Card>
      </div>

      <div className="flex gap-4 mb-8 pb-4 border-b border-gray-200">
        <button
          className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${activeTab === 'jobs' ? 'bg-indigo-100 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={18} /> Moderate Jobs
        </button>
        <button
          className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${activeTab === 'users' ? 'bg-indigo-100 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} /> Manage Users
        </button>
        <button
          className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${activeTab === 'analytics' ? 'bg-indigo-100 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('analytics')}
        >
          <TrendingUp size={18} /> Analytics
        </button>
        <button
          className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${activeTab === 'reports' ? 'bg-indigo-100 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText size={18} /> Reports
        </button>
      </div>

      {/* Moderate Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="flex flex-col gap-4">
          {pendingJobs.length > 0 && <h2 className="text-xl font-bold mb-2">Pending Approval ({pendingJobs.length})</h2>}
          {pendingJobs.length === 0 && (
            <Card className="py-12 text-center text-muted">
              <CheckCircle size={48} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-medium">All caught up!</h3>
              <p>No pending job postings to review.</p>
            </Card>
          )}
          {pendingJobs.map(job => (
            <Card key={job.id} className="border-l-4 border-warning flex flex-col md:flex-row justify-between md:items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                <p className="text-muted font-medium mb-1">{job.employer_name}</p>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-semibold">{job.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="text-danger border-danger hover:bg-red-50" onClick={() => handleJobAction(job.id, 'rejected')}>
                  <XCircle size={18} className="mr-2" /> Reject
                </Button>
                <Button className="bg-success hover:bg-emerald-600 hover:text-white text-white border-none" onClick={() => handleJobAction(job.id, 'approved')}>
                  <CheckCircle size={18} className="mr-2" /> Approve
                </Button>
              </div>
            </Card>
          ))}

          {decidedJobsAll.length > 0 && (
            <>
              <div className="flex justify-between items-center mt-8 mb-4">
                <h2 className="text-xl font-bold">Past Decisions</h2>
              </div>
              {decidedJobsAll.map(job => (
                <div key={job.id} className="mb-4">
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      job.status === 'approved' ? 'border-l-4 border-success' : 'border-l-4 border-danger'
                    }`}
                    onClick={() => toggleExpandJob(job.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.employer_name}</p>
                        <p className="text-xs text-gray-400 mt-1">Posted: {new Date(job.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`badge badge-${job.status}`}>{job.status}</span>
                        {expandedJobId === job.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </Card>
                  {expandedJobId === job.id && (
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><p className="text-sm font-semibold flex items-center gap-1"><MapPin size={14} /> Location</p><p className="text-gray-700">{job.location || 'N/A'}</p></div>
                        <div><p className="text-sm font-semibold flex items-center gap-1"><IndianRupee size={14} /> Salary</p><p className="text-gray-700">₹{job.salary}/month</p></div>
                        <div><p className="text-sm font-semibold flex items-center gap-1"><Briefcase size={14} /> Job Type</p><p className="text-gray-700">{job.job_type || 'Full-time'}</p></div>
                        <div><p className="text-sm font-semibold flex items-center gap-1"><Clock size={14} /> Posted On</p><p className="text-gray-700">{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</p></div>
                        <div className="col-span-2"><p className="text-sm font-semibold">Description</p><p className="text-gray-700 whitespace-pre-line">{job.description || 'No description provided.'}</p></div>
                        <div><p className="text-sm font-semibold flex items-center gap-1"><Award size={14} /> Experience</p><p className="text-gray-700">{job.required_experience || 'Not specified'}</p></div>
                        <div><p className="text-sm font-semibold flex items-center gap-1"><GraduationCap size={14} /> Education</p><p className="text-gray-700">{job.education || 'Not specified'}</p></div>
                        <div className="col-span-2"><p className="text-sm font-semibold flex items-center gap-1"><LayoutGrid size={14} /> Technical Skills</p><p className="text-gray-700">{job.technical_skills || 'Not specified'}</p></div>
                      </div>
                      <hr className="my-3" />
                      <h4 className="font-bold flex items-center gap-2"><Users size={18} /> Applicants & Pipeline</h4>
                      {renderApplicantDetails(job.id)}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Manage Users Tab */}
      {activeTab === 'users' && (
        <>
          <div className="flex gap-2 mb-6">
            <button
              className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${usersTab === 'employer' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
              onClick={() => setUsersTab('employer')}
            >
              Employers ({totalEmployers})
            </button>
            <button
              className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${usersTab === 'employee' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
              onClick={() => setUsersTab('employee')}
            >
              Employees ({totalEmployees})
            </button>
            <button onClick={exportUsers} className="ml-auto px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1">
              <Download size={14} /> Export {usersTab}s
            </button>
          </div>
          <div className="overflow-x-auto">{renderUsersTable()}</div>
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><Calendar size={20} /> Monthly Overview</h3>
              <button onClick={exportMonthlyAnalytics} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1"><Download size={14} /> Export</button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Month</th><th className="text-right py-2">Jobs</th><th className="text-right py-2">Revenue</th></tr></thead>
              <tbody>{monthlyData.map((row, i) => (<tr key={i} className="border-b"><td className="py-2">{row.month}</td><td className="text-right">{row.jobs}</td><td className="text-right font-semibold">₹{row.revenue.toLocaleString()}</td></tr>))}</tbody>
            </table>
          </Card>
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><Building size={20} /> Top Employers</h3>
              <button onClick={exportEmployerStats} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1"><Download size={14} /> Export</button>
            </div>
            {employerStats.length === 0 ? <p className="text-muted">No employer data yet</p> : (
              <table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2">Employer</th><th className="text-right py-2">Jobs</th><th className="text-right py-2">Revenue</th></tr></thead>
              <tbody>{employerStats.map((emp, i) => (<tr key={i} className="border-b"><td className="py-2 truncate max-w-[150px]">{emp.name}</td><td className="text-right">{emp.jobs}</td><td className="text-right font-semibold">₹{emp.revenue.toLocaleString()}</td></tr>))}</tbody>
              </table>
            )}
          </Card>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div>
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold mb-1">Report Type</label>
                <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                  <option value="combined">Jobs + Applicants (Detailed)</option>
                  <option value="jobs">Jobs Only</option>
                  <option value="employees">Employees Only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Date Filter</label>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
                  <button onClick={() => setReportDateFilterType('all')} className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${reportDateFilterType === 'all' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'}`}>All</button>
                  <button onClick={() => setReportDateFilterType('last1month')} className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${reportDateFilterType === 'last1month' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'}`}>1 Month</button>
                  <button onClick={() => setReportDateFilterType('last2months')} className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${reportDateFilterType === 'last2months' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'}`}>2 Months</button>
                  <button onClick={() => setReportDateFilterType('last3months')} className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${reportDateFilterType === 'last3months' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'}`}>3 Months</button>
                  <button onClick={() => setShowReportCustomDatePicker(!showReportCustomDatePicker)} className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors flex items-center gap-1 ${reportDateFilterType === 'custom' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'}`}><Filter size={12} /> Custom</button>
                </div>
                {showReportCustomDatePicker && (
                  <div className="flex gap-2 mt-2 items-end">
                    <input type="date" className="border rounded px-2 py-1 text-sm" value={reportCustomStartDate} onChange={(e) => { setReportCustomStartDate(e.target.value); setReportDateFilterType('custom'); }} />
                    <input type="date" className="border rounded px-2 py-1 text-sm" value={reportCustomEndDate} onChange={(e) => { setReportCustomEndDate(e.target.value); setReportDateFilterType('custom'); }} />
                    <button onClick={() => { setShowReportCustomDatePicker(false); setReportCustomStartDate(''); setReportCustomEndDate(''); setReportDateFilterType('all'); }} className="text-gray-500 hover:text-gray-700"><X size={16} /></button>
                  </div>
                )}
              </div>
              {reportType === 'jobs' && (
                <div>
                  <label className="block text-xs font-semibold mb-1">Job Status</label>
                  <select value={jobStatusFilter} onChange={(e) => setJobStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}
              {reportType === 'employees' && (
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-semibold mb-1">Search Employee</label>
                  <div className="flex items-center border rounded-lg px-3 py-1.5 bg-white">
                    <Search size={16} className="text-gray-400 mr-2" />
                    <input type="text" placeholder="Name, phone or email..." className="flex-1 outline-none text-sm" value={searchEmployee} onChange={(e) => setSearchEmployee(e.target.value)} />
                    {searchEmployee && <X size={14} className="text-gray-400 cursor-pointer" onClick={() => setSearchEmployee('')} />}
                  </div>
                </div>
              )}
              <div className="flex gap-2 ml-auto">
                {reportType === 'jobs' && (
                  <button onClick={exportJobsReport} className="px-3 py-2 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1">
                    <Download size={14} /> Export Jobs Report
                  </button>
                )}
                {reportType === 'employees' && (
                  <button onClick={exportEmployeesReport} className="px-3 py-2 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1">
                    <Download size={14} /> Export Employees Report
                  </button>
                )}
                {reportType === 'combined' && (
                  <button onClick={exportCombinedReport} className="px-3 py-2 bg-blue-600 text-white rounded text-sm font-bold flex items-center gap-1">
                    <Download size={14} /> Export Detailed Report
                  </button>
                )}
              </div>
            </div>
          </div>
          {loading ? <div className="text-center py-12">Loading data...</div> : (
            reportType === 'jobs' ? renderJobsOnlyReport() :
            reportType === 'employees' ? renderEmployeesOnlyReport() :
            renderCombinedReport()
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;