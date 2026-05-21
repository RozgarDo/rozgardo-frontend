// src/pages/admin/components/Reports.jsx
import React, { useState } from 'react';
import Card from '../../../components/Card';
import { Download, Filter, X, Search } from 'lucide-react';

const Reports = ({
  jobs,
  employees,
  applications,
  applicantsMap,
  loading,
  reportType,
  setReportType,
  reportDateFilterType,
  setReportDateFilterType,
  reportCustomStartDate,
  setReportCustomStartDate,
  reportCustomEndDate,
  setReportCustomEndDate,
  showReportCustomDatePicker,
  setShowReportCustomDatePicker,
  jobStatusFilter,
  setJobStatusFilter,
  searchEmployee,
  setSearchEmployee,
  isWithinReportDateRange,
}) => {
  const [jobTypeFilter, setJobTypeFilter] = useState('all');

  const getJobCounts = (jobId) => {
    const apps = applicantsMap[jobId] || [];
    return {
      total: apps.length,
      applied: apps.filter((a) => a.status === 'applied').length,
      shortlisted: apps.filter((a) => a.status === 'shortlisted').length,
      interview: apps.filter((a) => a.status === 'interview').length,
      selected: apps.filter((a) => a.status === 'selected').length,
      rejected: apps.filter((a) => a.status === 'rejected').length,
    };
  };

  // ---------- CSV EXPORT (fixed) ----------
  const exportToCSV = (data, filename, headers) => {
    if (!data || !data.length) {
      alert('No data to export');
      return;
    }
    try {
      const csvRows = [];
      csvRows.push(headers.join(','));
      for (const row of data) {
        const values = headers.map(header => {
          let value = row[header];
          if (value === undefined || value === null) value = '';
          if (typeof value === 'string') {
            value = value.replace(/"/g, '""');
            if (value.includes(',') || value.includes('\n') || value.includes('"')) {
              value = `"${value}"`;
            }
          }
          return value;
        });
        csvRows.push(values.join(','));
      }
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export: ' + err.message);
    }
  };

  const handleExportJobs = () => {
    let filteredJobs = jobs.filter((job) => isWithinReportDateRange(job.created_at));
    if (jobStatusFilter !== 'all') filteredJobs = filteredJobs.filter((job) => job.status === jobStatusFilter);
    if (jobTypeFilter !== 'all') filteredJobs = filteredJobs.filter((job) => (job.job_type || 'Full-time') === jobTypeFilter);

    const data = filteredJobs.map((job) => {
      const counts = getJobCounts(job.id);
      return {
        'Title': job.title || '',
        'Employer': job.employer_name || '',
        'Category': job.category || '',
        'Location': job.location || '',
        'Salary': job.salary ? `₹${job.salary}` : '',
        'Job Type': job.job_type || 'Full-time',
        'Status': job.status || '',
        'Posted Date': job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
        'Vacancies': job.vacancies || 1,
        'Description': job.description || '',
        'Experience Req.': job.required_experience || 'N/A',
        'Education Req.': job.education || 'N/A',
        'Technical Skills': job.technical_skills || 'N/A',
        'Total Apps': counts.total,
        'Applied': counts.applied,
        'Shortlisted': counts.shortlisted,
        'Interview': counts.interview,
        'Selected': counts.selected,
        'Rejected': counts.rejected,
      };
    });
    const headers = [
      'Title', 'Employer', 'Category', 'Location', 'Salary', 'Job Type', 'Status',
      'Posted Date', 'Vacancies', 'Description', 'Experience Req.', 'Education Req.',
      'Technical Skills', 'Total Apps', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'
    ];
    exportToCSV(data, `jobs_export_${reportDateFilterType}`, headers);
  };

  const handleExportEmployees = () => {
    let filteredEmployees = employees;
    if (searchEmployee) {
      filteredEmployees = employees.filter((emp) => {
        const name = (emp.full_name || emp.name || '').toLowerCase();
        const phone = (emp.phone_number || emp.phone || '').toLowerCase();
        const email = (emp.email || '').toLowerCase();
        const query = searchEmployee.toLowerCase();
        return name.includes(query) || phone.includes(query) || email.includes(query);
      });
    }
    const data = filteredEmployees.map((emp) => {
      const empApps = applications.filter((app) => app.employee_id === emp.id);
      return {
        'Name': emp.full_name || emp.name || 'Unknown',
        'Phone': emp.phone_number || emp.phone || 'N/A',
        'Email': emp.email || 'N/A',
        'Total Apps': empApps.length,
        'Applied': empApps.filter((a) => a.status === 'applied').length,
        'Shortlisted': empApps.filter((a) => a.status === 'shortlisted').length,
        'Interview': empApps.filter((a) => a.status === 'interview').length,
        'Selected': empApps.filter((a) => a.status === 'selected').length,
        'Rejected': empApps.filter((a) => a.status === 'rejected').length,
      };
    });
    const headers = ['Name', 'Phone', 'Email', 'Total Apps', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    exportToCSV(data, 'employees_export', headers);
  };

  const handleExportCombined = () => {
    let filteredJobs = jobs.filter((job) => isWithinReportDateRange(job.created_at));
    if (jobStatusFilter !== 'all') filteredJobs = filteredJobs.filter((job) => job.status === jobStatusFilter);
    if (jobTypeFilter !== 'all') filteredJobs = filteredJobs.filter((job) => (job.job_type || 'Full-time') === jobTypeFilter);

    const rows = [];
    for (const job of filteredJobs) {
      const applicants = applicantsMap[job.id] || [];
      if (applicants.length === 0) {
        rows.push({
          'Job Title': job.title || '',
          'Employer': job.employer_name || '',
          'Category': job.category || '',
          'Location': job.location || '',
          'Salary': job.salary ? `₹${job.salary}` : '',
          'Job Type': job.job_type || 'Full-time',
          'Status': job.status || '',
          'Posted Date': job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
          'Vacancies': job.vacancies || 1,
          'Description': job.description || '',
          'Experience Req.': job.required_experience || 'N/A',
          'Education Req.': job.education || 'N/A',
          'Technical Skills': job.technical_skills || 'N/A',
          'Applicant Name': 'No applicants',
          'Applicant Phone': '',
          'Applicant Email': '',
          'Applicant Skills': '',
          'Application Status': '',
          'Interview Date': '',
        });
      } else {
        for (const app of applicants) {
          rows.push({
            'Job Title': job.title || '',
            'Employer': job.employer_name || '',
            'Category': job.category || '',
            'Location': job.location || '',
            'Salary': job.salary ? `₹${job.salary}` : '',
            'Job Type': job.job_type || 'Full-time',
            'Status': job.status || '',
            'Posted Date': job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A',
            'Vacancies': job.vacancies || 1,
            'Description': job.description || '',
            'Experience Req.': job.required_experience || 'N/A',
            'Education Req.': job.education || 'N/A',
            'Technical Skills': job.technical_skills || 'N/A',
            'Applicant Name': app.users?.name || 'Unknown',
            'Applicant Phone': app.users?.phone || 'N/A',
            'Applicant Email': app.users?.email || 'N/A',
            'Applicant Skills': app.users?.skills || '-',
            'Application Status': app.status || 'N/A',
            'Interview Date': app.interview_date ? new Date(app.interview_date).toLocaleString() : '-',
          });
        }
      }
    }
    const headers = [
      'Job Title', 'Employer', 'Category', 'Location', 'Salary', 'Job Type', 'Status',
      'Posted Date', 'Vacancies', 'Description', 'Experience Req.', 'Education Req.',
      'Technical Skills', 'Applicant Name', 'Applicant Phone', 'Applicant Email',
      'Applicant Skills', 'Application Status', 'Interview Date'
    ];
    exportToCSV(rows, `combined_export_${reportDateFilterType}`, headers);
  };

  // ---------- TABLE RENDERERS (unchanged, but included for completeness) ----------
  const renderJobsOnly = () => {
    let filteredJobs = jobs.filter((job) => isWithinReportDateRange(job.created_at));
    if (jobStatusFilter !== 'all') filteredJobs = filteredJobs.filter((job) => job.status === jobStatusFilter);
    if (jobTypeFilter !== 'all') filteredJobs = filteredJobs.filter((job) => (job.job_type || 'Full-time') === jobTypeFilter);
    if (!filteredJobs.length) return <Card className="py-8 text-center text-muted">No jobs found.</Card>;

    return (
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm border-collapse bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-100"><tr className="border-b">
            <th className="p-2 text-left">Title</th><th className="p-2 text-left">Employer</th><th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Location</th><th className="p-2 text-left">Salary</th><th className="p-2 text-left">Job Type</th>
            <th className="p-2 text-left">Status</th><th className="p-2 text-left">Posted Date</th><th className="p-2 text-center">Vacancies</th>
            <th className="p-2 text-left">Description</th><th className="p-2 text-left">Experience Req.</th><th className="p-2 text-left">Education Req.</th>
            <th className="p-2 text-left">Technical Skills</th><th className="p-2 text-center">Total Apps</th><th className="p-2 text-center">Applied</th>
            <th className="p-2 text-center">Shortlisted</th><th className="p-2 text-center">Interview</th><th className="p-2 text-center">Selected</th>
            <th className="p-2 text-center">Rejected</th>
          </tr></thead>
          <tbody>
            {filteredJobs.map((job) => {
              const counts = getJobCounts(job.id);
              return (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{job.title}</td><td>{job.employer_name}</td><td>{job.category}</td>
                  <td>{job.location}</td><td>₹{job.salary}</td><td>{job.job_type || 'Full-time'}</td>
                  <td><span className={`badge badge-${job.status}`}>{job.status}</span></td>
                  <td>{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="text-center">{job.vacancies || 1}</td>
                  <td className="max-w-[250px] truncate" title={job.description || ''}>{job.description || 'No description'}</td>
                  <td>{job.required_experience || 'N/A'}</td><td>{job.education || 'N/A'}</td><td>{job.technical_skills || 'N/A'}</td>
                  <td className="text-center font-semibold">{counts.total}</td><td className="text-center">{counts.applied}</td>
                  <td className="text-center">{counts.shortlisted}</td><td className="text-center">{counts.interview}</td>
                  <td className="text-center">{counts.selected}</td><td className="text-center">{counts.rejected}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderEmployeesOnly = () => {
    let filteredEmployees = employees;
    if (searchEmployee) {
      filteredEmployees = employees.filter((emp) => {
        const name = (emp.full_name || emp.name || '').toLowerCase();
        const phone = (emp.phone_number || emp.phone || '').toLowerCase();
        const email = (emp.email || '').toLowerCase();
        const query = searchEmployee.toLowerCase();
        return name.includes(query) || phone.includes(query) || email.includes(query);
      });
    }
    if (!filteredEmployees.length) return <Card className="py-8 text-center text-muted">No employees found.</Card>;

    return (
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm border-collapse bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-100"><tr className="border-b">
            <th className="p-2 text-left">Name</th><th className="p-2 text-left">Phone</th><th className="p-2 text-left">Email</th>
            <th className="p-2 text-center">Total Apps</th><th className="p-2 text-center">Applied</th><th className="p-2 text-center">Shortlisted</th>
            <th className="p-2 text-center">Interview</th><th className="p-2 text-center">Selected</th><th className="p-2 text-center">Rejected</th>
           </tr></thead>
          <tbody>
            {filteredEmployees.map((emp) => {
              const empApps = applications.filter((app) => app.employee_id === emp.id);
              const counts = {
                total: empApps.length,
                applied: empApps.filter((a) => a.status === 'applied').length,
                shortlisted: empApps.filter((a) => a.status === 'shortlisted').length,
                interview: empApps.filter((a) => a.status === 'interview').length,
                selected: empApps.filter((a) => a.status === 'selected').length,
                rejected: empApps.filter((a) => a.status === 'rejected').length,
              };
              return (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{emp.full_name || emp.name || 'Unknown'}</td>
                  <td>{emp.phone_number || emp.phone || 'N/A'}</td><td>{emp.email || 'N/A'}</td>
                  <td className="text-center font-semibold">{counts.total}</td><td className="text-center">{counts.applied}</td>
                  <td className="text-center">{counts.shortlisted}</td><td className="text-center">{counts.interview}</td>
                  <td className="text-center">{counts.selected}</td><td className="text-center">{counts.rejected}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCombined = () => {
    let filteredJobs = jobs.filter((job) => isWithinReportDateRange(job.created_at));
    if (jobStatusFilter !== 'all') filteredJobs = filteredJobs.filter((job) => job.status === jobStatusFilter);
    if (jobTypeFilter !== 'all') filteredJobs = filteredJobs.filter((job) => (job.job_type || 'Full-time') === jobTypeFilter);
    if (!filteredJobs.length) return <Card className="py-8 text-center text-muted">No jobs found.</Card>;

    const tableRows = [];
    filteredJobs.forEach((job) => {
      const applicants = applicantsMap[job.id] || [];
      if (applicants.length === 0) tableRows.push({ job, applicant: null });
      else applicants.forEach((applicant) => tableRows.push({ job, applicant }));
    });

    return (
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm border-collapse bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-100"><tr className="border-b">
            <th className="p-2 text-left">Job Title</th><th className="p-2 text-left">Employer</th><th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Location</th><th className="p-2 text-left">Salary</th><th className="p-2 text-left">Job Type</th>
            <th className="p-2 text-left">Status</th><th className="p-2 text-left">Posted Date</th><th className="p-2 text-center">Vacancies</th>
            <th className="p-2 text-left">Description</th><th className="p-2 text-left">Experience Req.</th><th className="p-2 text-left">Education Req.</th>
            <th className="p-2 text-left">Technical Skills</th>
            <th className="p-2 text-left">Applicant Name</th><th className="p-2 text-left">Applicant Phone</th><th className="p-2 text-left">Applicant Email</th>
            <th className="p-2 text-left">Applicant Skills</th><th className="p-2 text-left">Application Status</th><th className="p-2 text-left">Interview Date</th>
           </tr></thead>
          <tbody>
            {tableRows.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{row.job.title}</td><td>{row.job.employer_name}</td><td>{row.job.category}</td>
                <td>{row.job.location}</td><td>₹{row.job.salary}</td><td>{row.job.job_type || 'Full-time'}</td>
                <td><span className={`badge badge-${row.job.status}`}>{row.job.status}</span></td>
                <td>{row.job.created_at ? new Date(row.job.created_at).toLocaleDateString() : 'N/A'}</td>
                <td className="text-center">{row.job.vacancies || 1}</td>
                <td className="max-w-[250px] truncate" title={row.job.description || ''}>{row.job.description || 'No description'}</td>
                <td>{row.job.required_experience || 'N/A'}</td><td>{row.job.education || 'N/A'}</td><td>{row.job.technical_skills || 'N/A'}</td>
                {row.applicant ? (
                  <>
                    <td>{row.applicant.users?.name || 'Unknown'}</td>
                    <td>{row.applicant.users?.phone || 'N/A'}</td>
                    <td>{row.applicant.users?.email || 'N/A'}</td>
                    <td>{row.applicant.users?.skills || '-'}</td>
                    <td><span className={`badge badge-${row.applicant.status}`}>{row.applicant.status === 'selected' ? 'HIRED' : row.applicant.status}</span></td>
                    <td>{row.applicant.interview_date ? new Date(row.applicant.interview_date).toLocaleString() : '-'}</td>
                  </>
                ) : (
                  <td colSpan="6" className="text-center text-gray-400">No applicants yet</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ---------- MAIN RENDER ----------
  return (
    <div>
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1">Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              <option value="combined">Jobs + Applicants (Detailed)</option>
              <option value="jobs">Jobs Only</option>
              <option value="employees">Employees Only</option>
            </select>
          </div>

          {reportType !== 'employees' && (
            <div>
              <label className="block text-xs font-semibold mb-1">Date Filter</label>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
                <button onClick={() => setReportDateFilterType('all')} className={`px-3 py-1 text-xs rounded-full font-semibold ${reportDateFilterType === 'all' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'}`}>All</button>
                <button onClick={() => setReportDateFilterType('last1month')} className={`px-3 py-1 text-xs rounded-full font-semibold ${reportDateFilterType === 'last1month' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'}`}>1 Month</button>
                <button onClick={() => setReportDateFilterType('last2months')} className={`px-3 py-1 text-xs rounded-full font-semibold ${reportDateFilterType === 'last2months' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'}`}>2 Months</button>
                <button onClick={() => setReportDateFilterType('last3months')} className={`px-3 py-1 text-xs rounded-full font-semibold ${reportDateFilterType === 'last3months' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'}`}>3 Months</button>
                <button onClick={() => setShowReportCustomDatePicker(!showReportCustomDatePicker)} className={`px-3 py-1 text-xs rounded-full font-semibold flex items-center gap-1 ${reportDateFilterType === 'custom' ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-gray-200'}`}><Filter size={12} /> Custom</button>
              </div>
              {showReportCustomDatePicker && (
                <div className="flex gap-2 mt-2 items-end">
                  <input type="date" className="border rounded px-2 py-1 text-sm" value={reportCustomStartDate} onChange={(e) => { setReportCustomStartDate(e.target.value); setReportDateFilterType('custom'); }} />
                  <input type="date" className="border rounded px-2 py-1 text-sm" value={reportCustomEndDate} onChange={(e) => { setReportCustomEndDate(e.target.value); setReportDateFilterType('custom'); }} />
                  <button onClick={() => { setShowReportCustomDatePicker(false); setReportCustomStartDate(''); setReportCustomEndDate(''); setReportDateFilterType('all'); }} className="text-gray-500 hover:text-gray-700"><X size={16} /></button>
                </div>
              )}
            </div>
          )}

          {(reportType === 'jobs' || reportType === 'combined') && (
            <>
              <div>
                <label className="block text-xs font-semibold mb-1">Job Status</label>
                <select value={jobStatusFilter} onChange={(e) => setJobStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Job Type</label>
                <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                  <option value="all">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </>
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
            {reportType === 'jobs' && <button onClick={handleExportJobs} className="px-3 py-2 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1"><Download size={14} /> Export Jobs</button>}
            {reportType === 'employees' && <button onClick={handleExportEmployees} className="px-3 py-2 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1"><Download size={14} /> Export Employees</button>}
            {reportType === 'combined' && <button onClick={handleExportCombined} className="px-3 py-2 bg-blue-600 text-white rounded text-sm font-bold flex items-center gap-1"><Download size={14} /> Export Detailed</button>}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading data...</div>
      ) : reportType === 'jobs' ? (
        renderJobsOnly()
      ) : reportType === 'employees' ? (
        renderEmployeesOnly()
      ) : (
        renderCombined()
      )}
    </div>
  );
};

export default Reports;