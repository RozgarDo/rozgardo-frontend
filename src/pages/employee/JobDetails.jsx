import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, IndianRupee, Briefcase, 
  CheckCircle, Clock, ShieldCheck, 
  Share2, Bookmark, Star, 
  Info, AlertCircle, LayoutGrid, Award, GraduationCap,
  Users, TrendingUp, DollarSign, Calendar, X, Copy, Mail
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const JobDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [employerInfo, setEmployerInfo] = useState(null);
  
  // Share Modal State
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data);
        fetchExtraContent(data);
      } else {
        throw new Error('Failed to fetch job');
      }
    } catch (err) {
      console.error(err);
      const mockJob = { 
        id: id, 
        title: 'Experienced Logistics Driver', 
        category: 'Driver', 
        salary: 22000, 
        location: 'Mumbai', 
        employer_name: 'Tata Logistics Corp', 
        status: 'approved',
        job_type: 'Full-time',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'We are seeking a reliable and experienced Driver...',
        required_experience: '3+ Years',
        education: '10th Pass',
        technical_skills: 'Heavy Vehicle License, GPS, Mumbai Routes',
        vacancies: 5,
        employer_id: 'sample-employer',
        apply_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        jobs_serial_number: 'RZD-26001A'
      };
      setJob(mockJob);
      fetchExtraContent(mockJob);
    } finally {
      setLoading(false);
    }
  };

  const fetchExtraContent = async (jobData) => {
    if (user?.id) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/applications/employee/${user.id}`);
        if (res.ok) {
          const apps = await res.json();
          const hasApplied = apps.some(app => app.job_id === jobData.id);
          if (hasApplied) setApplied(true);
        }
      } catch (e) { console.warn('Could not check application status', e); }
    }

    const companyName = jobData.employer_name || 'the employer';
    setEmployerInfo({
      company_name: companyName,
      about: `At ${companyName}, we believe in empowering our workforce through dignity and respect. Join our mission to provide elite services across ${jobData.location || 'your city'}.`
    });
  };

  const handleApply = async () => {
    if (applied) return;
    setApplying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: job.id, employee_id: user?.id })
      });
      if (res.ok) {
        setApplied(true);
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to apply');
      }
    } catch (err) {
      console.error('Apply Error:', err);
      alert('Error: ' + (err.message || 'Could not submit application.'));
    } finally {
      setApplying(false);
    }
  };

  const isDeadlinePassed = () => {
    if (!job?.apply_deadline) return false;
    const today = new Date().toISOString().split('T')[0];
    return job.apply_deadline < today;
  };

  const formatDeadline = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isJobExpired = isDeadlinePassed();

  // Share helpers
  const currentUrl = window.location.href;
  const shareText = `Check out this job opening for ${job?.title} at ${job?.employer_name || 'RozgarDo'}: `;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!job) return (
    <div className="container py-12 text-center max-w-lg mx-auto">
      <AlertCircle size={40} className="mx-auto text-red-500 mb-3" />
      <h2 className="text-xl font-bold">Job Not Found</h2>
      <Link to="/all-jobs" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Back</Link>
    </div>
  );

  const postedText = job.created_at ? `${Math.floor((new Date() - new Date(job.created_at)) / (1000 * 60 * 60 * 24))} days ago` : 'Recently';
  const experienceValue = job.required_experience || job.experience || 'Not specified';
  const educationValue = job.education || 'Not specified';
  const skillsValue = job.technical_skills || job.skills || 'Not specified';
  const vacanciesCount = job.vacancies || 1;
  const employerName = job.employer_name || job.company_name || 'Company';
  const employerInitial = employerName.charAt(0).toUpperCase();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <button
            onClick={() => navigate('/all-jobs')}
            className="inline-flex items-center gap-1.5 bg-none border-0 cursor-pointer text-indigo-600 font-semibold text-sm mb-4 p-0"
          >
            <ArrowLeft size={16} /> Back to All Jobs
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">{job.category}</span>
                <span className="text-[10px] font-bold text-gray-400">Posted {postedText}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">{job.title}</h1>
              <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 shadow-sm">
                    {employerInitial}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-none">{employerName}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">Employer</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100 ml-2">
                    <ShieldCheck size={12} /> Verified
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* Click handler added to open modal */}
                  <button 
                    onClick={() => setIsShareOpen(true)}
                    className="p-2.5 rounded-lg bg-gray-50 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-4">
              <SectionHeader icon={<Info size={16} />} title="Job Description" />
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</div>
              </div>
            </div>

            {/* Key Requirements */}
            <div className="space-y-4">
              <SectionHeader icon={<TrendingUp size={16} />} title="Key Requirements" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RequirementItem icon={<Award size={16} />} title="Experience" value={experienceValue} />
                <RequirementItem icon={<GraduationCap size={16} />} title="Education" value={educationValue} />
                <RequirementItem icon={<LayoutGrid size={16} />} title="Technical Skills" value={skillsValue} />
              </div>
            </div>

            {/* Company Info */}
            <div className="space-y-4">
              <SectionHeader icon={<Users size={16} />} title="About the Company" />
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-xl border-4 border-white flex-shrink-0">
                  {employerInitial}
                </div>
                <div>
                  <h3 className="font-black text-lg text-gray-900">{employerName}</h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {employerInfo?.about || `Join ${employerName} and build a career with one of the most trusted employers in your industry.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 space-y-6 sticky top-6">
              <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Monthly Salary</p>
                <div className="text-3xl font-black text-indigo-600 flex items-center justify-center">
                  <IndianRupee size={26} strokeWidth={3} /> {job.salary}
                </div>
              </div>

              {/* Vacancies */}
              <div className="text-center bg-amber-50 rounded-lg p-3 border border-amber-100">
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Open Positions</p>
                <p className="text-xl font-black text-amber-800">{vacanciesCount}</p>
              </div>

              {/* Job Serial Number (Job ID) */}
              {job.jobs_serial_number && (
                <div className="text-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Job ID</p>
                  <p className="text-sm font-mono font-bold text-gray-800 mt-1">{job.jobs_serial_number}</p>
                </div>
              )}

              {/* Deadline */}
              {job.apply_deadline && (
                <div className={`text-center rounded-lg p-3 border ${isJobExpired ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1">
                    <Calendar size={12} /> 
                    <span className={isJobExpired ? 'text-red-700' : 'text-blue-700'}>
                      {isJobExpired ? 'Application Closed' : 'Last Date to Apply'}
                    </span>
                  </p>
                  <p className={`text-sm font-black mt-1 ${isJobExpired ? 'text-red-800' : 'text-blue-800'}`}>
                    {formatDeadline(job.apply_deadline)}
                  </p>
                </div>
              )}

              {/* Apply Button */}
              {applied ? (
                <div className="w-full py-4 bg-green-50 text-green-700 font-bold rounded-xl flex items-center justify-center gap-2 border border-green-100">
                  <CheckCircle size={20} /> Application Sent
                </div>
              ) : isJobExpired ? (
                <div className="w-full py-4 bg-gray-100 text-gray-500 font-bold rounded-xl flex items-center justify-center gap-2 border border-gray-200 cursor-not-allowed">
                  <AlertCircle size={20} /> Applications Closed
                </div>
              ) : (
                <button 
                  onClick={handleApply}
                  disabled={applying}
                  className={`w-full py-4 px-6 rounded-xl font-black text-lg shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    applying ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {applying ? 'Applying...' : 'APPLY TO JOB'}
                </button>
              )}

              <div className="space-y-4 pt-4 border-t border-gray-50">
                <SidebarBullet icon={<MapPin size={18} />} boldLabel={job.location} subLabel="Job Location" />
                <SidebarBullet icon={<Briefcase size={18} />} boldLabel={job.job_type} subLabel="Work Style" />
                <SidebarBullet icon={<ShieldCheck size={18} />} boldLabel="Verified Employer" subLabel="Trusted Hire" />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Platform Assurance</h4>
                <p className="text-[10px] text-gray-500 leading-normal">
                  RozgarDo guarantees your profile only goes to verified managers. No processing fees ever!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SHARE MODAL POPUP */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsShareOpen(false)}
          ></div>
          
          {/* Content Box */}
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900">Share Job Opening</h3>
              <button 
                onClick={() => setIsShareOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Horizontal Grid of Share Actions */}
            <div className="grid grid-cols-4 gap-4 py-6 text-center">
              {/* WhatsApp */}
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shadow-xs border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.948 0c3.179.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.907-11.893 11.907-2.01-.001-3.986-.51-5.742-1.477L0 24zm6.59-4.846c1.63.967 3.225 1.478 4.783 1.479 5.349 0 9.701-4.34 9.704-9.677a9.534 9.534 0 0 0-2.83-6.844A9.557 9.557 0 0 0 11.947 1.3c-5.356 0-9.716 4.34-9.719 9.678a9.604 9.604 0 0 0 1.432 4.974l-.993 3.623 3.71-.973zm13.067-5.863c-.325-.163-1.926-.949-2.223-1.058-.297-.109-.514-.162-.73.163-.217.324-.838 1.056-1.026 1.274-.188.217-.377.243-.702.08-1.748-.874-2.883-1.442-4.034-2.42-.3-.254-.04-.239.26-.54.237-.238.324-.405.486-.73.162-.324.081-.609-.04-.852-.122-.244-1.026-2.473-1.406-3.385-.369-.888-.744-.768-1.026-.782-.265-.014-.569-.016-.873-.016a1.677 1.677 0 0 0-1.218.541c-.417.417-1.596 1.558-1.596 3.8a4.674 4.674 0 0 0 .974 2.533c.108.143 1.812 2.766 4.39 3.879 2.148.924 2.586.741 3.046.699.46-.042 1.926-.788 2.197-1.514.27-.726.27-1.35.19-1.473-.08-.122-.297-.184-.622-.347z"/></svg>
                </div>
                <span className="text-[11px] font-bold text-gray-600">WhatsApp</span>
              </a>

              {/* LinkedIn */}
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shadow-xs border border-blue-100 group-hover:bg-blue-700 group-hover:text-white transition-all">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
                <span className="text-[11px] font-bold text-gray-600">LinkedIn</span>
              </a>

              {/* Facebook */}
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center shadow-xs border border-indigo-100 group-hover:bg-indigo-700 group-hover:text-white transition-all">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z"/></svg>
                </div>
                <span className="text-[11px] font-bold text-gray-600">Facebook</span>
              </a>

              {/* Email */}
              <a 
                href={`mailto:?subject=${encodeURIComponent('Job Opening Opportunity')}&body=${encodeURIComponent(shareText + currentUrl)}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shadow-xs border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <Mail size={20} />
                </div>
                <span className="text-[11px] font-bold text-gray-600">Email</span>
              </a>
            </div>

            {/* Link Copier Bar */}
            <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl">
              <input 
                type="text" 
                readOnly 
                value={currentUrl} 
                className="bg-transparent text-xs text-gray-500 font-mono flex-1 pl-2 outline-hidden select-all truncate"
              />
              <button 
                onClick={copyToClipboard}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const SectionHeader = ({ icon, title }) => (
  <h2 className="text-base font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">{icon}</div>
    {title}
  </h2>
);

const BenefitItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
    <div className="text-green-500 flex-shrink-0">{icon}</div>
    <span className="text-xs font-bold text-gray-700">{text}</span>
  </div>
);

const RequirementItem = ({ icon, title, value }) => (
  <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col gap-2 group hover:bg-indigo-50/50 hover:border-indigo-200 hover:shadow-md transition-all">
    <div className="text-indigo-600 group-hover:text-indigo-700">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{title}</p>
      <p className="text-sm font-black text-gray-900 leading-tight">{value || 'N/A'}</p>
    </div>
  </div>
);

const SidebarBullet = ({ icon, boldLabel, subLabel }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg border border-gray-100">{icon}</div>
    <div>
      <p className="text-xs font-black text-gray-900 leading-none">{boldLabel}</p>
      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">{subLabel}</p>
    </div>
  </div>
);

export default JobDetails;