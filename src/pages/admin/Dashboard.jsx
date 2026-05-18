import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { 
  ShieldAlert, CheckCircle, XCircle, Users, Briefcase, 
  TrendingUp, DollarSign, Calendar, Building, Download, 
  ChevronDown, ChevronUp, MapPin, IndianRupee, Clock, 
  Award, GraduationCap, LayoutGrid, UserCheck, UserX, 
  Mail, Phone, AlertCircle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [usersTab, setUsersTab] = useState('employer');
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [applicantsMap, setApplicantsMap] = useState({}); // jobId -> applicants array
  const [loadingApplicants, setLoadingApplicants] = useState({});

  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
    } else {
      fetchAllUsers();
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
      if (empRes.ok) setEmployees(await empRes.json());
      if (employerRes.ok) setEmployers(await employerRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicantsForJob = async (jobId) => {
    if (applicantsMap[jobId]) return; // already fetched
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

  const getFilteredUsers = (role) => {
    if (role === 'employee') return employees;
    if (role === 'employer') return employers;
    return [];
  };

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
    const exportData = data.map(u => ({
      name: u.name || u.full_name || u.company_name || 'N/A',
      phone: u.phone || u.phone_number || u.contact_number || 'N/A',
      email: u.email || u.official_email || 'N/A',
      role: u.role
    }));
    exportToCSV(exportData, `${usersTab}s_export`, ['Name', 'Phone', 'Email', 'Role']);
  };

  const exportMonthlyAnalytics = () => {
    exportToCSV(monthlyData, 'monthly_analytics', ['Month', 'Jobs', 'Revenue']);
  };

  const exportEmployerStats = () => {
    exportToCSV(employerStats, 'employer_stats', ['Employer', 'Jobs', 'Revenue']);
  };

  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const decidedJobs = jobs.filter(j => j.status !== 'pending');

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

  return (
    <div className="container py-8 page-enter">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldAlert className="text-primary" size={32} /> Admin Center
        </h1>
      </div>

      {/* Stats Overview */}
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
      </div>

      {activeTab === 'jobs' && (
        <button onClick={exportJobs} className="mb-4 px-4 py-2 bg-green-600 text-white rounded font-bold flex items-center gap-1" style={{ width: '130px', height: '38px', justifyContent: 'center', whiteSpace: 'nowrap' }}>
          <Download size={16} /> Export Jobs
        </button>
      )}

      {activeTab === 'users' && (
        <button onClick={exportUsers} className="mb-4 px-4 py-2 bg-green-600 text-white rounded font-bold flex items-center gap-1" style={{ width: '130px', height: '38px', justifyContent: 'center', whiteSpace: 'nowrap' }}>
          <Download size={16} /> Export Users
        </button>
      )}

      {activeTab === 'users' && (
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
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Calendar size={20} /> Monthly Overview
              </h3>
              <button onClick={exportMonthlyAnalytics} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1">
                <Download size={14} /> Export
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Month</th>
                  <th className="text-right py-2">Jobs</th>
                  <th className="text-right py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{row.month}</td>
                    <td className="text-right">{row.jobs}</td>
                    <td className="text-right font-semibold">₹{row.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Building size={20} /> Top Employers
              </h3>
              <button onClick={exportEmployerStats} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1">
                <Download size={14} /> Export
              </button>
            </div>
            {employerStats.length === 0 ? (
              <p className="text-muted">No employer data yet</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Employer</th>
                    <th className="text-right py-2">Jobs</th>
                    <th className="text-right py-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {employerStats.map((emp, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2 truncate max-w-[150px]">{emp.name}</td>
                      <td className="text-right">{emp.jobs}</td>
                      <td className="text-right font-semibold">₹{emp.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      )}

      <div>
        {loading ? <p className="text-center py-12 text-muted text-lg">Loading data...</p> : (
          activeTab === 'jobs' ? (
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

              {decidedJobs.length > 0 && <h2 className="text-xl font-bold mt-8 mb-4">Past Decisions</h2>}
              {decidedJobs.map(job => (
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
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-1"><MapPin size={14} /> Location</p>
                          <p className="text-gray-700">{job.location || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-1"><IndianRupee size={14} /> Salary</p>
                          <p className="text-gray-700">₹{job.salary}/month</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-1"><Briefcase size={14} /> Job Type</p>
                          <p className="text-gray-700">{job.job_type || 'Full-time'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-1"><Clock size={14} /> Posted On</p>
                          <p className="text-gray-700">{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm font-semibold">Description</p>
                          <p className="text-gray-700 whitespace-pre-line">{job.description || 'No description provided.'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-1"><Award size={14} /> Experience</p>
                          <p className="text-gray-700">{job.required_experience || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-1"><GraduationCap size={14} /> Education</p>
                          <p className="text-gray-700">{job.education || 'Not specified'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm font-semibold flex items-center gap-1"><LayoutGrid size={14} /> Technical Skills</p>
                          <p className="text-gray-700">{job.technical_skills || 'Not specified'}</p>
                        </div>
                      </div>
                      <hr className="my-3" />
                      <h4 className="font-bold flex items-center gap-2"><Users size={18} /> Applicants & Pipeline</h4>
                      {renderApplicantDetails(job.id)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : activeTab === 'users' ? (
            <div className="overflow-x-auto">
              {renderUsersTable()}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;