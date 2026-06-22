// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Briefcase, Users, FileText } from 'lucide-react';
import KPICards from './components/KPICards';
import ModerateJobs from './components/ModerateJobs';
import ManageUsers from './components/ManageUsers';
import Reports from './components/Reports';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [usersTab, setUsersTab] = useState('employer');
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicantsMap, setApplicantsMap] = useState({});
  const [loadingApplicants, setLoadingApplicants] = useState({});

  // Report filters
  const [reportDateFilterType, setReportDateFilterType] = useState('all');
  const [reportCustomStartDate, setReportCustomStartDate] = useState('');
  const [reportCustomEndDate, setReportCustomEndDate] = useState('');
  const [showReportCustomDatePicker, setShowReportCustomDatePicker] = useState(false);
  const [reportType, setReportType] = useState('combined');
  const [searchEmployee, setSearchEmployee] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('all');

  const tabRefs = useRef({});

  // ✅ Helper to get auth headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  useEffect(() => {
    fetchAllInitialData();
  }, []);

  useEffect(() => {
    const tabElement = tabRefs.current[activeTab];
    if (tabElement) {
      tabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  // ✅ FETCH ALL DATA: jobs, employees, employers, AND applications
  const fetchAllInitialData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [jobsRes, empRes, employerRes, appsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/jobs`, { headers }),
        fetch(`${API_BASE_URL}/api/auth/admin/all-employees`, { headers }),
        fetch(`${API_BASE_URL}/api/auth/admin/all-employers`, { headers }),
        fetch(`${API_BASE_URL}/api/auth/admin/applications`, { headers }) // NEW ROUTE
      ]);

      let jobsData = [];
      let employeesData = [];
      let employersData = [];
      let applicationsData = [];

      if (jobsRes.ok) jobsData = await jobsRes.json();
      if (empRes.ok) employeesData = await empRes.json();
      if (employerRes.ok) employersData = await employerRes.json();
      if (appsRes.ok) applicationsData = await appsRes.json();

      setJobs(jobsData);
      setEmployees(employeesData);
      setEmployers(employersData);
      setApplications(applicationsData);

      // Build applicantsMap: group applications by job_id
      const map = {};
      applicationsData.forEach(app => {
        const jobId = app.job_id;
        if (!map[jobId]) map[jobId] = [];
        map[jobId].push(app);
      });
      setApplicantsMap(map);

    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    try {
      const headers = getAuthHeaders();
      const [empRes, employerRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/auth/admin/all-employees`, { headers }),
        fetch(`${API_BASE_URL}/api/auth/admin/all-employers`, { headers })
      ]);
      if (empRes.ok) setEmployees(await empRes.json());
      if (employerRes.ok) setEmployers(await employerRes.json());
    } catch (err) {
      console.error('Error refreshing users:', err);
    }
  };

  // ✅ Lazy load applicants for a job (if not already loaded)
  const fetchApplicantsForJob = async (jobId) => {
    if (applicantsMap[jobId]) return; // already loaded
    setLoadingApplicants(prev => ({ ...prev, [jobId]: true }));
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/applications/job/${jobId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        // Update the map and applications array
        setApplicantsMap(prev => ({ ...prev, [jobId]: data }));
        setApplications(prev => [...prev, ...data]);
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
      const headers = getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/jobs/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setJobs(jobs.map(job => job.id === id ? updated.job : job));
        alert(`✅ Job ${status} successfully!`);
      } else {
        const error = await res.json();
        alert(`❌ Error: ${error.error || 'Failed to update job status'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while updating job status');
    }
  };

  // ---------- Report helper functions (unchanged) ----------
  const isWithinReportDateRange = (createdAt) => {
    if (!createdAt) return false;
    const date = new Date(createdAt);
    const now = new Date();
    if (reportDateFilterType === 'all') return true;
    if (reportDateFilterType === 'last1month') {
      const oneMonthAgo = new Date(now); oneMonthAgo.setMonth(now.getMonth() - 1);
      return date >= oneMonthAgo;
    }
    if (reportDateFilterType === 'last2months') {
      const twoMonthsAgo = new Date(now); twoMonthsAgo.setMonth(now.getMonth() - 2);
      return date >= twoMonthsAgo;
    }
    if (reportDateFilterType === 'last3months') {
      const threeMonthsAgo = new Date(now); threeMonthsAgo.setMonth(now.getMonth() - 3);
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

  const approvedJobsCount = jobs.filter(j => j.status === 'approved').length;
  const totalEmployers = employers.length;
  const totalEmployees = employees.length;
  const estimatedRevenue = {
    total: approvedJobsCount * 0,
    thisMonth: Math.floor(approvedJobsCount * 0 * 0.3),
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
    if (!data || !data.length) return;
    const rows = [headers.join(',')];
    data.forEach(row => {
      const values = headers.map(h => {
        const val = String(row[h] || '');
        return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
      });
      rows.push(values.join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportJobsReport = () => {
    let filteredJobs = jobs.filter(j => isWithinReportDateRange(j.created_at));
    if (jobStatusFilter !== 'all') filteredJobs = filteredJobs.filter(j => j.status === jobStatusFilter);
    const data = filteredJobs.map(job => ({
      title: job.title,
      employer: job.employer_name,
      category: job.category,
      location: job.location,
      salary: job.salary,
      status: job.status,
      posted_date: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
      total_applications: (applicantsMap[job.id] || []).length
    }));
    exportToCSV(data, `jobs_report_${reportDateFilterType}`, ['title', 'employer', 'category', 'location', 'salary', 'status', 'posted_date', 'total_applications']);
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
      const empApps = applications.filter(app => app.employee_id === emp.id);
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
    exportToCSV(data, 'employees_report', ['name', 'phone', 'email', 'total_applications', 'applied', 'shortlisted', 'interview', 'selected', 'rejected']);
  };

  const exportCombinedReport = () => {
    let filteredJobs = jobs.filter(j => isWithinReportDateRange(j.created_at));
    if (jobStatusFilter !== 'all') filteredJobs = filteredJobs.filter(j => j.status === jobStatusFilter);
    const allData = [];
    filteredJobs.forEach(job => {
      const apps = applicantsMap[job.id] || [];
      if (!apps.length) {
        allData.push({
          job_title: job.title,
          employer: job.employer_name,
          location: job.location,
          salary: job.salary,
          job_status: job.status,
          posted_date: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
          applicant_name: 'No applicants'
        });
      } else {
        apps.forEach(app => {
          allData.push({
            job_title: job.title,
            employer: job.employer_name,
            location: job.location,
            salary: job.salary,
            job_status: job.status,
            posted_date: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
            applicant_name: app.users?.name || 'Unknown',
            applicant_phone: app.users?.phone || 'N/A',
            applicant_email: app.users?.email || 'N/A',
            application_status: app.status || 'N/A',
            interview_date: app.interview_date ? new Date(app.interview_date).toLocaleString() : '-'
          });
        });
      }
    });
    exportToCSV(allData, `combined_report_${reportDateFilterType}`, ['job_title', 'employer', 'location', 'salary', 'job_status', 'posted_date', 'applicant_name', 'applicant_phone', 'applicant_email', 'application_status', 'interview_date']);
  };

  const exportMonthlyAnalytics = () => exportToCSV(monthlyData, 'monthly_analytics', ['month', 'jobs', 'revenue']);
  const exportEmployerStats = () => exportToCSV(employerStats, 'employer_stats', ['name', 'jobs', 'revenue']);

  const exportUsers = () => {
    const data = usersTab === 'employee' ? employees : employers;
    const exportData = data.map(u => ({
      name: u.full_name || u.name || u.company_name || 'N/A',
      phone: u.phone_number || u.phone || u.contact_number || 'N/A',
      email: u.email || u.official_email || 'N/A'
    }));
    exportToCSV(exportData, `${usersTab}s_export`, ['name', 'phone', 'email']);
  };

  const renderApplicantDetails = (jobId) => {
    const applicants = applicantsMap[jobId] || [];
    if (loadingApplicants[jobId]) {
      return <p className="text-center py-4 text-gray-500">Loading applicants...</p>;
    }
    if (!applicants.length) return <p className="text-center py-4 text-gray-500">No applicants yet.</p>;
    const counts = {
      applied: applicants.filter(a => a.status === 'applied').length,
      shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
      interview: applicants.filter(a => a.status === 'interview').length,
      selected: applicants.filter(a => a.status === 'selected').length,
      rejected: applicants.filter(a => a.status === 'rejected').length
    };
    return (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-5 gap-2 mb-4">
          <div className="bg-blue-50 p-2 rounded text-center"><span className="font-bold">{counts.applied}</span><p className="text-xs">Applied</p></div>
          <div className="bg-purple-50 p-2 rounded text-center"><span className="font-bold">{counts.shortlisted}</span><p className="text-xs">Shortlisted</p></div>
          <div className="bg-indigo-50 p-2 rounded text-center"><span className="font-bold">{counts.interview}</span><p className="text-xs">Interview</p></div>
          <div className="bg-green-50 p-2 rounded text-center"><span className="font-bold">{counts.selected}</span><p className="text-xs">Selected</p></div>
          <div className="bg-red-50 p-2 rounded text-center"><span className="font-bold">{counts.rejected}</span><p className="text-xs">Rejected</p></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
                <tr key={app.id} className="border-t">
                  <td className="p-2">{app.users?.name || 'Unknown'}</td>
                  <td className="p-2 text-xs">{app.users?.phone}<br/>{app.users?.email}</td>
                  <td className="p-2 text-xs">{app.users?.skills || '-'}</td>
                  <td className="p-2"><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                  <td className="p-2 text-xs">{app.interview_date ? new Date(app.interview_date).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 py-3 sm:py-8 page-enter overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 gap-2 sm:gap-3">
        <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
          <ShieldAlert className="text-primary" size={24} />
          <span>Admin Center</span>
        </h1>
      </div>

      <div className="w-full">
        <KPICards stats={{ 
          totalRevenue: estimatedRevenue.total, 
          thisMonthRevenue: estimatedRevenue.thisMonth, 
          approvedJobs: approvedJobsCount, 
          totalEmployers 
        }} />
      </div>

      {/* Responsive tab bar with scroll-into-view on selection */}
      <div className="flex overflow-x-auto sm:overflow-visible gap-2 mb-4 sm:mb-8 pb-2 sm:pb-4 border-b border-gray-200 hide-scrollbar">
        {['jobs', 'users', 'reports'].map(tab => (
          <button
            key={tab}
            ref={(el) => (tabRefs.current[tab] = el)}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors ${
              activeTab === tab ? 'bg-indigo-100 text-primary' : 'text-gray-500 hover:bg-gray-100'
            }`}
            style={{ minWidth: 90 }}
          >
            {tab === 'jobs' && <Briefcase size={16} />}
            {tab === 'users' && <Users size={16} />}
            {tab === 'reports' && <FileText size={16} />}
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      <div className="w-full">
        {activeTab === 'jobs' && (
          <div className="w-full">
            <ModerateJobs
              jobs={jobs}
              onJobAction={handleJobAction}
              applicantsMap={applicantsMap}
              fetchApplicantsForJob={fetchApplicantsForJob}
              renderApplicantDetails={renderApplicantDetails}
            />
          </div>
        )}
        {activeTab === 'users' && (
          <div className="w-full">
            <ManageUsers
              usersTab={usersTab}
              setUsersTab={setUsersTab}
              totalEmployers={totalEmployers}
              totalEmployees={totalEmployees}
              usersData={{ employees, employers }}
              exportUsers={exportUsers}
              refreshUsers={refreshUsers}
            />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="w-full">
            <Reports
              jobs={jobs}
              employees={employees}
              applications={applications}
              applicantsMap={applicantsMap}
              loading={false}
              reportType={reportType}
              setReportType={setReportType}
              reportDateFilterType={reportDateFilterType}
              setReportDateFilterType={setReportDateFilterType}
              reportCustomStartDate={reportCustomStartDate}
              setReportCustomStartDate={setReportCustomStartDate}
              reportCustomEndDate={reportCustomEndDate}
              setReportCustomEndDate={setReportCustomEndDate}
              showReportCustomDatePicker={showReportCustomDatePicker}
              setShowReportCustomDatePicker={setShowReportCustomDatePicker}
              jobStatusFilter={jobStatusFilter}
              setJobStatusFilter={setJobStatusFilter}
              searchEmployee={searchEmployee}
              setSearchEmployee={setSearchEmployee}
              isWithinReportDateRange={isWithinReportDateRange}
            />
          </div>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;