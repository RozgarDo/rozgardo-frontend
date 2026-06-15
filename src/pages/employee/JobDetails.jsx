import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, IndianRupee, Briefcase, 
  CheckCircle, Clock, ShieldCheck, 
  Share2, Bookmark, Star, 
  Info, AlertCircle, LayoutGrid, Award, GraduationCap,
  Users, TrendingUp, DollarSign, Calendar
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
      // Fallback mock data (optional)
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
        jobs_serial_number: 'RZD-26001A'   // mock serial
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
                  <button className="p-2.5 rounded-lg bg-gray-50 text-gray-400 hover:text-indigo-600"><Bookmark size={18} /></button>
                  <button className="p-2.5 rounded-lg bg-gray-50 text-gray-400 hover:text-indigo-600"><Share2 size={18} /></button>
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

            {/* Benefits */}
            <div className="space-y-4">
              <SectionHeader icon={<Star size={16} />} title="Company Benefits" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <BenefitItem icon={<Clock size={16}/>} text="Flexible working hours & night shift options" />
                <BenefitItem icon={<DollarSign size={16}/>} text="Weekly payouts with performance bonuses" />
                <BenefitItem icon={<TrendingUp size={16}/>} text="High potential for role growth & promotions" />
                <BenefitItem icon={<ShieldCheck size={16}/>} text="Safe working environment & medical coverage" />
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

              {/* NEW: Job Serial Number (Job ID) */}
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
    </div>
  );
};

// Helper Components (same as before)
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