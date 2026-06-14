import React, { useState } from 'react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { CheckCircle, XCircle, Users, MapPin, IndianRupee, Briefcase, Clock, Award, GraduationCap, LayoutGrid, ChevronDown, ChevronUp, Hash } from 'lucide-react';

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
    <div className="space-y-4">
      {pendingJobs.length > 0 && <h2 className="text-xl font-bold">Pending Approval ({pendingJobs.length})</h2>}
      {pendingJobs.length === 0 && (
        <Card className="py-12 text-center">
          <CheckCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No pending jobs</p>
        </Card>
      )}
      {pendingJobs.map(job => (
        <Card key={job.id} className="border-l-4 border-yellow-500 flex flex-col md:flex-row justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              {job.jobs_serial_number && <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded"><Hash size={10} className="inline" /> {job.jobs_serial_number}</span>}
              <h3 className="text-xl font-bold">{job.title}</h3>
            </div>
            <p className="text-gray-500">{job.employer_name}</p>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{job.category}</span>
          </div>
          <div className="flex gap-3 mt-3 md:mt-0">
            <Button variant="outline" className="border-red-600 text-red-600" onClick={() => onJobAction(job.id, 'rejected')}>
              <XCircle size={18} className="mr-2" /> Reject
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onJobAction(job.id, 'approved')}>
              <CheckCircle size={18} className="mr-2" /> Approve
            </Button>
          </div>
        </Card>
      ))}
      {decidedJobs.length > 0 && <h2 className="text-xl font-bold mt-8">Past Decisions</h2>}
      {decidedJobs.map(job => (
        <div key={job.id} className="mb-4">
          <Card className={`cursor-pointer ${job.status === 'approved' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`} onClick={() => toggleExpand(job.id)}>
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {job.jobs_serial_number && <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded"><Hash size={10} className="inline" /> {job.jobs_serial_number}</span>}
                  <h3 className="font-bold">{job.title}</h3>
                </div>
                <p className="text-sm text-gray-500">{job.employer_name}</p>
                <p className="text-xs text-gray-400">Posted: {new Date(job.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge badge-${job.status}`}>{job.status}</span>
                {expandedJobId === job.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
          </Card>
          {expandedJobId === job.id && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><p className="font-semibold">Location</p><p>{job.location}</p></div>
                <div><p className="font-semibold">Salary</p><p>₹{job.salary}/month</p></div>
                <div><p className="font-semibold">Job Type</p><p>{job.job_type}</p></div>
                <div><p className="font-semibold">Experience</p><p>{job.required_experience || '-'}</p></div>
                <div><p className="font-semibold">Education</p><p>{job.education || '-'}</p></div>
                <div><p className="font-semibold">Skills</p><p>{job.technical_skills || '-'}</p></div>
                <div className="col-span-2"><p className="font-semibold">Description</p><p>{job.description}</p></div>
                {job.apply_deadline && <div><p className="font-semibold">Deadline</p><p>{new Date(job.apply_deadline).toLocaleDateString()}</p></div>}
              </div>
              <hr className="my-4" />
              <h4 className="font-bold">Applicants</h4>
              {renderApplicantDetails(job.id)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModerateJobs;