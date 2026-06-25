import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { 
  Plus, Users, MapPin, Briefcase, 
  ChevronDown, Check, Clock, UserCheck, 
  XCircle, AlertCircle, Loader2, Calendar,
  Power, Edit2
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState(null);
  const [toast, setToast] = useState(null);
  const [updatingJobId, setUpdatingJobId] = useState(null);
  const [editingDeadlineFor, setEditingDeadlineFor] = useState(null);
  const [tempDeadline, setTempDeadline] = useState('');
  const [pendingInterview, setPendingInterview] = useState(null);

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchEmployerJobs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs?employer_id=${user.id}&include_expired=true`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplicants = async (job) => {
    if (selectedJob === job.id) {
      setSelectedJob(null);
      setSelectedJobTitle('');
      setApplicants([]);
      return;
    }
    setSelectedJob(job.id);
    setSelectedJobTitle(job.title);
    setApplicantsLoading(true);
    setApplicants([]);
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications/job/${job.id}`);
      if (res.ok) {
        const data = await res.json();
        setApplicants(data);
      } else { throw new Error('Failed to fetch applicants'); }
    } catch (err) {
      console.error(err);
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const toggleJobActive = async (jobId, currentActive) => {
    setUpdatingJobId(jobId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/manage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          is_active: !currentActive,
          employer_id: user.id   // fallback for auth
        })
      });
      if (res.ok) {
        await fetchEmployerJobs();
        setToast({ message: `Job ${!currentActive ? 'activated' : 'deactivated'}`, type: 'success' });
      } else {
        const error = await res.json();
        throw new Error(error.error);
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to update job status', type: 'error' });
    } finally {
      setUpdatingJobId(null);
    }
  };

  const updateJobDeadline = async (jobId, newDeadline) => {
    setUpdatingJobId(jobId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/manage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          apply_deadline: newDeadline || null,
          employer_id: user.id
        })
      });
      if (res.ok) {
        await fetchEmployerJobs();
        setToast({ message: 'Deadline updated', type: 'success' });
        setEditingDeadlineFor(null);
        setTempDeadline('');
      } else {
        const error = await res.json();
        throw new Error(error.error);
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to update deadline', type: 'error' });
    } finally {
      setUpdatingJobId(null);
    }
  };

  // Applicant status handling (unchanged)
  const handleStatusChange = (appId, newStatus) => {
    if (newStatus === 'shortlisted') performStatusUpdate(appId, 'shortlisted', null);
    else if (newStatus === 'interview') setPendingInterview({ appId, dateTime: '' });
    else performStatusUpdate(appId, newStatus, null);
  };

  const handlePickerChange = (dateTime) => {
    if (pendingInterview) setPendingInterview({ ...pendingInterview, dateTime });
  };

  const handlePickerConfirm = async () => {
    if (!pendingInterview) return;
    const { appId, dateTime } = pendingInterview;
    if (!dateTime) {
      setToast({ message: 'Please select a date and time for the interview', type: 'error' });
      return;
    }
    await performStatusUpdate(appId, 'interview', dateTime);
    setPendingInterview(null);
  };

  const handlePickerCancel = () => setPendingInterview(null);

  const performStatusUpdate = async (appId, newStatus, interviewDate) => {
    const originalApp = applicants.find(a => a.id === appId);
    const originalStatus = originalApp?.status;
    setApplicants(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus, interview_date: interviewDate } : app));
    setUpdatingAppId(appId);
    try {
      const payload = { status: newStatus };
      if (interviewDate) payload.interview_date = interviewDate;
      const res = await fetch(`${API_BASE_URL}/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setToast({ message: `Status updated to ${newStatus}`, type: 'success' });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (err) {
      setApplicants(prev => prev.map(app => app.id === appId ? { ...app, status: originalStatus, interview_date: originalApp?.interview_date || null } : app));
      setToast({ message: `Error: ${err.message}`, type: 'error' });
    } finally {
      setUpdatingAppId(null);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const isExpired = (deadline) => {
    if (!deadline) return false;
    const today = new Date().toISOString().split('T')[0];
    return deadline < today;
  };

  return (
    <div className="container py-8 page-enter relative">
      {toast && (
        <div className={`fixed top-20 right-8 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300 ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
         <div>
            <h1 className="text-3xl font-black mb-1">Employer Dashboard</h1>
            <p className="text-muted">Manage your job postings and applicants.</p>
         </div>
         <Link to="/employer/post-job">
           <Button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-100">
              <Plus size={18} /> Post New Job
           </Button>
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left column: Jobs list */}
         <div className="lg:col-span-1">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2"><Briefcase size={20} /> My Jobs ({jobs.length})</h2>
            {loading ? <p>Loading...</p> : jobs.length === 0 ? <p className="text-muted">No jobs posted yet.</p> : (
              <div className="space-y-5">
                {jobs.map(job => {
                  const expired = isExpired(job.apply_deadline);
                  return (
                    <div key={job.id} className={`rounded-2xl border-2 overflow-hidden transition-all ${selectedJob === job.id ? 'border-indigo-600 shadow-xl scale-[1.02]' : 'border-gray-100 hover:border-indigo-200 bg-white shadow-sm'}`}>
                      <div className={`p-5 ${selectedJob === job.id ? 'bg-indigo-50/50' : 'bg-white'}`} onClick={() => handleViewApplicants(job)} style={{ cursor: 'pointer' }}>
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <h3 className="font-black text-sm leading-tight text-gray-900">{job.title}</h3>
                          <span className={`badge badge-${job.status} flex-shrink-0`}>{job.status}</span>
                        </div>
                        <p className="text-xs text-gray-500 font-bold flex items-center gap-1"><MapPin size={11}/>{job.location}</p>
                        <div className="mt-3 flex flex-wrap gap-2 items-center text-xs">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${job.is_active ? (expired ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700') : 'bg-red-100 text-red-700'}`}>
                            <Power size={12} /> {job.is_active ? (expired ? 'Expired' : 'Active') : 'Inactive'}
                          </span>
                          {job.apply_deadline && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                              <Calendar size={12} /> Deadline: {new Date(job.apply_deadline).toLocaleDateString()}
                            </span>
                          )}
                          {/* NEW: Job Serial Number */}
                          {job.jobs_serial_number && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[10px]">
                              ID: {job.jobs_serial_number}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Management buttons */}
                      <div className="border-t border-gray-100 bg-gray-50 p-3 flex justify-between gap-2">
                        <button
                          onClick={() => toggleJobActive(job.id, job.is_active)}
                          disabled={updatingJobId === job.id}
                          className={`flex-1 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${job.is_active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        >
                          {updatingJobId === job.id ? <Loader2 size={14} className="animate-spin" /> : <><Power size={14} /> {job.is_active ? 'Disable' : 'Activate'}</>}
                        </button>
                        {editingDeadlineFor === job.id ? (
                          <div className="flex-1 flex gap-1">
                            <input
                              type="date"
                              className="flex-1 text-xs p-1 border rounded"
                              value={tempDeadline}
                              onChange={(e) => setTempDeadline(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                            />
                            <button onClick={() => updateJobDeadline(job.id, tempDeadline)} className="bg-indigo-600 text-white px-2 rounded text-xs">Save</button>
                            <button onClick={() => { setEditingDeadlineFor(null); setTempDeadline(''); }} className="bg-gray-300 px-2 rounded text-xs">Cancel</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingDeadlineFor(job.id); setTempDeadline(job.apply_deadline || ''); }}
                            className="flex-1 text-xs font-bold py-2 rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center justify-center gap-1"
                          >
                            <Edit2 size={14} /> {job.apply_deadline ? 'Extend Deadline' : 'Add Deadline'}
                          </button>
                        )}
                      </div>
                      <div className={`text-center py-2.5 text-[10px] uppercase tracking-widest font-black border-t transition-colors ${selectedJob === job.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-indigo-600 border-gray-100 hover:bg-indigo-50'}`} onClick={() => handleViewApplicants(job)} style={{ cursor: 'pointer' }}>
                        {selectedJob === job.id ? 'Viewing Applicants' : 'View Applicants'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
         </div>

         {/* Right column: Applicants (unchanged) */}
         <div className="lg:col-span-2 min-h-[500px]">
           {!selectedJob ? (
             <Card className="h-full flex flex-col items-center justify-center text-muted bg-white border-dashed border-2 border-gray-200">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6"><Users size={40} className="text-gray-300" /></div>
               <h3 className="text-xl font-black text-gray-800">Select a job to view applicants</h3>
               <p className="text-sm mt-2 text-gray-400">Manage your pipeline and hire the best talent</p>
             </Card>
           ) : (
             <div className="page-enter">
               <header className="mb-8">
                 <h2 className="text-2xl font-black text-gray-900">Applicants for <span className="text-indigo-600">{selectedJobTitle}</span></h2>
                 <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">{applicants.length} candidates in pipeline</p>
               </header>
               {applicantsLoading ? (
                 <div className="flex flex-col items-center justify-center py-20"><Loader2 size={40} className="animate-spin text-indigo-600 mb-4" /><p className="font-black text-sm tracking-widest uppercase">Fetching candidates...</p></div>
               ) : applicants.length === 0 ? (
                 <Card className="py-20 text-center bg-gray-50 border-gray-100 rounded-3xl">
                   <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-6"><Users size={30} className="text-gray-200" /></div>
                   <p className="font-black text-gray-800">No applicants yet for this position.</p>
                   <p className="text-xs text-gray-400 mt-1">Check back later or promote your job posting.</p>
                 </Card>
               ) : (
                 <div className="flex flex-col gap-6">
                   {applicants.map(app => {
                     const showInterviewPicker = pendingInterview && pendingInterview.appId === app.id;
                     return (
                       <Card key={app.id} className="p-6 border-gray-100 hover:border-indigo-100 transition-all hover:shadow-lg rounded-3xl group">
                         <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                               <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{app.users?.name || 'Applicant'}</h3>
                               <span className={`badge badge-${app.status} px-3 py-1 text-[10px]`}>{app.status === 'selected' ? 'HIRED' : app.status}</span>
                             </div>
                             <div className="flex flex-wrap gap-4 mb-4">
                               <ContactItem icon="📞" text={app.users?.phone} />
                               {app.users?.email && <ContactItem icon="✉️" text={app.users?.email} />}
                               {app.users?.languages && <ContactItem icon="🌐" text={app.users?.languages} />}
                             </div>
                             {app.interview_date && (
                               <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 p-2 rounded-xl w-fit">
                                 <Calendar size={14} /> 
                                 {app.status === 'interview' ? 'Interview: ' : 'Shortlist Review: '}
                                 {formatDateTime(app.interview_date)}
                               </div>
                             )}
                             <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100 w-fit mt-2">
                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Skills:</span> 
                               <span className="text-xs font-black text-gray-800">{app.users?.skills || 'Not specified'}</span>
                             </div>
                           </div>
                           <div className="lg:text-right">
                             {!showInterviewPicker ? (
                               <>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Update Application Status</p>
                                 <StatusDropdown 
                                   currentStatus={app.status === 'selected' ? 'selected' : app.status} 
                                   isLoading={updatingAppId === app.id}
                                   onChange={(s) => handleStatusChange(app.id, s)} 
                                 />
                               </>
                             ) : (
                               <div className="bg-white p-5 rounded-xl border-2 border-indigo-200 shadow-lg w-full min-w-[260px]">
                                 <div className="flex items-center gap-2 mb-3">
                                   <Calendar size={20} className="text-indigo-600" />
                                   <p className="text-sm font-black text-gray-800">Schedule Interview</p>
                                 </div>
                                 <input
                                   type="datetime-local"
                                   className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all mb-4"
                                   value={pendingInterview.dateTime}
                                   onChange={(e) => handlePickerChange(e.target.value)}
                                 />
                                 <div className="flex gap-3">
                                   <button onClick={handlePickerConfirm} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2.5 rounded-xl">Confirm</button>
                                   <button onClick={handlePickerCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold py-2.5 rounded-xl">Cancel</button>
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                       </Card>
                     );
                   })}
                 </div>
               )}
             </div>
           )}
         </div>
      </div>
    </div>
  );
};

const ContactItem = ({ icon, text }) => (
  <p className="text-sm font-bold text-gray-500 flex items-center gap-1.5"><span>{icon}</span> {text}</p>
);

const StatusDropdown = ({ currentStatus, onChange, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statusOptions = [
    { label: "Applied", value: "applied" },
    { label: "Shortlist", value: "shortlisted" },
    { label: "Interview", value: "interview" },
    { label: "Select & Hire", value: "selected" },
    { label: "Reject", value: "rejected" },
  ];

  return (
    <div className="relative inline-block text-left w-full sm:w-[200px]">
      <button onClick={() => setIsOpen(!isOpen)} disabled={isLoading} className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest ${isOpen ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'}`}>
        <span className="flex items-center gap-2">{isLoading ? <Loader2 size={14} className="animate-spin text-indigo-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}{currentStatus}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-full origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="py-1">
              {statusOptions.map((option) => (
                <button key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }} className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors hover:bg-gray-50 ${currentStatus === option.value ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600'}`}>
                  <span className="text-current">
                    {option.value === 'shortlisted' && <Check size={14} />}
                    {option.value === 'interview' && <Users size={14} />}
                    {option.value === 'selected' && <UserCheck size={14} />}
                    {option.value === 'rejected' && <XCircle size={14} />}
                    {option.value === 'applied' && <Clock size={14} />}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;