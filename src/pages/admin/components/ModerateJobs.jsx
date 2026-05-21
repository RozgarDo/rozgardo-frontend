import React, { useState } from 'react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { CheckCircle, XCircle, Users, MapPin, IndianRupee, Briefcase, Clock, Award, GraduationCap, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';

const ModerateJobs = ({ jobs, onJobAction, applicantsMap, fetchApplicantsForJob, renderApplicantDetails }) => {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const decidedJobs = jobs.filter(j => j.status !== 'pending');

  const toggleExpand = (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
      if (!applicantsMap[jobId]) fetchApplicantsForJob(jobId);
    }
  };

  return (
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
          <div><h3 className="text-xl font-bold mb-1">{job.title}</h3><p className="text-muted font-medium mb-1">{job.employer_name}</p><span className="text-xs bg-gray-100 px-2 py-1 rounded">{job.category}</span></div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-danger border-danger hover:bg-red-50" onClick={() => onJobAction(job.id, 'rejected')}><XCircle size={18} className="mr-2" /> Reject</Button>
            <Button className="bg-success hover:bg-emerald-600 text-white border-none" onClick={() => onJobAction(job.id, 'approved')}><CheckCircle size={18} className="mr-2" /> Approve</Button>
          </div>
        </Card>
      ))}
      {decidedJobs.length > 0 && <h2 className="text-xl font-bold mt-8 mb-4">Past Decisions</h2>}
      {decidedJobs.map(job => (
        <div key={job.id} className="mb-4">
          <Card className={`cursor-pointer transition-all hover:shadow-md ${job.status === 'approved' ? 'border-l-4 border-success' : 'border-l-4 border-danger'}`} onClick={() => toggleExpand(job.id)}>
            <div className="flex justify-between items-center">
              <div><h3 className="font-bold text-lg">{job.title}</h3><p className="text-sm text-gray-500">{job.employer_name}</p><p className="text-xs text-gray-400 mt-1">Posted: {new Date(job.created_at).toLocaleDateString()}</p></div>
              <div className="flex items-center gap-3"><span className={`badge badge-${job.status}`}>{job.status}</span>{expandedJobId === job.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
            </div>
          </Card>
          {expandedJobId === job.id && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><p className="text-sm font-semibold"><MapPin size={14} className="inline mr-1" /> Location</p><p>{job.location || 'N/A'}</p></div>
                <div><p className="text-sm font-semibold"><IndianRupee size={14} className="inline mr-1" /> Salary</p><p>₹{job.salary}/month</p></div>
                <div><p className="text-sm font-semibold"><Briefcase size={14} className="inline mr-1" /> Job Type</p><p>{job.job_type || 'Full-time'}</p></div>
                <div><p className="text-sm font-semibold"><Clock size={14} className="inline mr-1" /> Posted On</p><p>{new Date(job.created_at).toLocaleDateString()}</p></div>
                <div className="col-span-2"><p className="text-sm font-semibold">Description</p><p className="whitespace-pre-line">{job.description || 'No description'}</p></div>
                <div><p className="text-sm font-semibold"><Award size={14} className="inline mr-1" /> Experience</p><p>{job.required_experience || 'Not specified'}</p></div>
                <div><p className="text-sm font-semibold"><GraduationCap size={14} className="inline mr-1" /> Education</p><p>{job.education || 'Not specified'}</p></div>
                <div className="col-span-2"><p className="text-sm font-semibold"><LayoutGrid size={14} className="inline mr-1" /> Technical Skills</p><p>{job.technical_skills || 'Not specified'}</p></div>
              </div>
              <hr /><h4 className="font-bold mt-2"><Users size={18} className="inline mr-1" /> Applicants & Pipeline</h4>
              {renderApplicantDetails(job.id)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModerateJobs;