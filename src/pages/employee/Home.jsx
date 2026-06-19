import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { Zap, CheckCircle2, ShieldCheck, MapPin, IndianRupee, ChevronRight, UserPlus, FileText, CheckCircle, Calendar, Hash } from 'lucide-react';
import TrustedEmployers from '../legal/TrustedEmployeers';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Home = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [applyingMap, setApplyingMap] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchApplications();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs?status=approved`);
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

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications/employee/${user.id}`);
      if (res.ok) {
        const apps = await res.json();
        const appliedIds = new Set(apps.map(app => app.job_id));
        setAppliedJobIds(appliedIds);
      }
    } catch (err) {
      console.warn('Could not fetch applications', err);
    }
  };

  const handleApply = async (jobId, e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please login to apply for jobs.');
      return;
    }
    if (appliedJobIds.has(jobId)) return;

    setApplyingMap(prev => ({ ...prev, [jobId]: true }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, employee_id: user.id }),
      });

      if (res.ok) {
        setAppliedJobIds(prev => new Set(prev).add(jobId));
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to apply');
      }
    } catch (err) {
      console.error('Apply Error:', err);
      alert('Error: ' + (err.message || 'Could not submit application.'));
    } finally {
      setApplyingMap(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    const today = new Date().toISOString().split('T')[0];
    return deadline < today;
  };

  const displayedJobs = jobs.slice(0, 6);

  return (
    <div className="w-full flex flex-col overflow-x-hidden min-h-screen">
      {/* HERO SECTION */}
      <section className="relative text-center py-32 px-6 flex flex-col items-center gap-6 bg-gradient-to-br from-slate-50 via-white to-purple-50/50 border-b border-slate-200/80">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-12 right-[-200px] w-[800px] h-[500px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-slate-200/80 px-5 py-2 rounded-full text-sm font-bold text-indigo-600 shadow-sm mb-2">
          Welcome back, {user?.name || user?.phone || 'Applicant'}
        </div>

        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight max-w-4xl">
          Let’s find your next job today.
        </h1>
        <p className="relative z-10 text-lg md:text-xl text-slate-600 font-medium max-w-2xl leading-relaxed">
          The unified platform for <strong className="text-slate-800">Drivers | Helpers | Delivery | Cooks | Cleaners</strong>. Start earning instantly.
        </p>

        <div className="relative z-10 flex gap-4 flex-wrap justify-center mt-2">
          <button
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold text-base shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
            onClick={() => document.getElementById('latest-jobs').scrollIntoView({ behavior: 'smooth' })}
          >
            Find Jobs <ChevronRight size={18} />
          </button>
          <button
            className="bg-white text-slate-700 px-8 py-3 rounded-full font-bold text-base border border-slate-200 hover:bg-slate-50 transition-all"
            onClick={() => navigate('/applications')}
          >
            My Applications
          </button>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-slate-600 font-semibold mt-4">
          <ShieldCheck size={18} className="text-indigo-600" /> No agents. Verified jobs only.
        </div>
      </section>

      {/* VALUE SECTION */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center flex flex-col items-center gap-3">
              <div className="w-18 h-18 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center transition-transform hover:-translate-y-1">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Find work faster</h3>
              <p className="text-slate-600 leading-relaxed max-w-xs">Get verified jobs near you instantly and start earning without delays or endless interviews.</p>
            </div>
            <div className="text-center flex flex-col items-center gap-3">
              <div className="w-18 h-18 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center transition-transform hover:-translate-y-1">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Hire instantly</h3>
              <p className="text-slate-600 leading-relaxed max-w-xs">Connect with reliable, background-checked workers perfectly suited for your immediate business needs.</p>
            </div>
            <div className="text-center flex flex-col items-center gap-3">
              <div className="w-18 h-18 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center transition-transform hover:-translate-y-1">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">100% Verified jobs</h3>
              <p className="text-slate-600 leading-relaxed max-w-xs">Every employer and job listing goes through rigorous safety checks before reaching your screen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* JOBS SECTION */}
      <section className="bg-gradient-to-b from-indigo-50/50 to-white border-t border-slate-200/80" id="latest-jobs">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Latest Jobs Near You</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Discover fresh opportunities posted by trusted companies matching your profile.</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-lg">Loading active jobs...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedJobs.length > 0 ? (
                displayedJobs.map((job) => {
                  const companyInitial = job.employer_name ? job.employer_name.charAt(0).toUpperCase() : 'C';
                  const expired = isDeadlinePassed(job.apply_deadline);
                  const isApplied = appliedJobIds.has(job.id);
                  const isApplying = applyingMap[job.id] || false;

                  const deadline = job.apply_deadline ? new Date(job.apply_deadline).toLocaleDateString() : null;
                  const isDeadlineSoon = deadline && new Date(job.apply_deadline) < new Date(Date.now() + 7 * 86400000);

                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-indigo-500 transition-all duration-200 flex flex-col justify-between h-full"
                    >
                      {/* Header: logo + title + employer */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-lg border border-indigo-100/50 flex-shrink-0">
                          {companyInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2 min-h-[2.8rem]">
                              {job.title}
                            </h3>
                            {job.jobs_serial_number && (
                              <span className="bg-slate-100 text-slate-600 text-[0.6rem] font-bold px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap font-mono tracking-wide flex items-center gap-1">
                                <Hash size={10} /> {job.jobs_serial_number}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-sm font-medium truncate">{job.employer_name}</p>
                        </div>
                      </div>

                      {/* Badges: category + deadline */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-slate-50 text-slate-600 text-[0.7rem] font-bold px-2.5 py-1 rounded border border-slate-200 uppercase">
                          {job.category}
                        </span>
                        {deadline && (
                          <span className={`text-[0.7rem] font-semibold px-2.5 py-1 rounded flex items-center gap-1 ${
                            expired ? 'bg-red-50 text-red-600' :
                            isDeadlineSoon ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Calendar size={12} /> {expired ? 'Closed' : `Apply by ${deadline}`}
                          </span>
                        )}
                      </div>

                      {/* Bottom: location, salary, buttons */}
                      <div className="mt-auto">
                        {/* Location & Salary */}
                        <div className="flex justify-between items-center py-3 border-t border-slate-100">
                          <span className="flex items-center gap-1.5 text-slate-600 font-semibold text-sm">
                            <MapPin size={15} className="text-slate-400" /> {job.location}
                          </span>
                          <span className="flex items-center gap-0.5 font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                            <IndianRupee size={15} /> {job.salary}
                          </span>
                        </div>

                        {/* Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                          <Link to={`/jobs/${job.id}`} className="w-full">
                            <button className="w-full py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                              View Details
                            </button>
                          </Link>
                          {expired ? (
                            <button className="w-full py-2 bg-slate-200 text-slate-400 rounded-lg text-sm font-bold cursor-not-allowed" disabled>
                              Closed
                            </button>
                          ) : isApplied ? (
                            <button className="w-full py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold flex items-center justify-center gap-1 cursor-default" disabled>
                              <CheckCircle size={16} /> Applied
                            </button>
                          ) : (
                            <button
                              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70"
                              onClick={(e) => handleApply(job.id, e)}
                              disabled={isApplying}
                            >
                              {isApplying ? 'Applying...' : 'Apply Now'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <h3 className="text-xl font-medium">No verified jobs at the moment</h3>
                  <p>Check back soon to be the first to apply!</p>
                </div>
              )}
            </div>
          )}

          {displayedJobs.length >= 4 && (
            <div className="mt-12 text-center">
              <Button
                variant="secondary"
                size="lg"
                className="px-8 shadow-sm"
                onClick={() => navigate('/all-jobs')}
              >
                View All Active Jobs
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">How It Works</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Get started in minutes and find your next opportunity effortlessly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="relative flex flex-col items-center text-center p-10 bg-slate-50 rounded-2xl border border-slate-100 hover:-translate-y-1 hover:shadow-md transition-transform">
              <div className="absolute -top-6 w-12 h-12 bg-indigo-600 text-white font-extrabold rounded-full flex items-center justify-center text-xl border-4 border-white shadow-md">
                1
              </div>
              <UserPlus size={40} className="text-indigo-600 opacity-80 mb-2" />
              <h3 className="text-xl font-extrabold text-slate-900 mt-3 mb-1">Create Profile</h3>
              <p className="text-slate-600 leading-relaxed">Register securely using your mobile number and set up a verified profile detailing your skills.</p>
            </div>
            <div className="relative flex flex-col items-center text-center p-10 bg-slate-50 rounded-2xl border border-slate-100 hover:-translate-y-1 hover:shadow-md transition-transform">
              <div className="absolute -top-6 w-12 h-12 bg-indigo-600 text-white font-extrabold rounded-full flex items-center justify-center text-xl border-4 border-white shadow-md">
                2
              </div>
              <FileText size={40} className="text-indigo-600 opacity-80 mb-2" />
              <h3 className="text-xl font-extrabold text-slate-900 mt-3 mb-1">Find Jobs</h3>
              <p className="text-slate-600 leading-relaxed">Browse jobs precisely matched to your location and categories and apply with a single tap.</p>
            </div>
            <div className="relative flex flex-col items-center text-center p-10 bg-slate-50 rounded-2xl border border-slate-100 hover:-translate-y-1 hover:shadow-md transition-transform">
              <div className="absolute -top-6 w-12 h-12 bg-indigo-600 text-white font-extrabold rounded-full flex items-center justify-center text-xl border-4 border-white shadow-md">
                3
              </div>
              <CheckCircle size={40} className="text-indigo-600 opacity-80 mb-2" />
              <h3 className="text-xl font-extrabold text-slate-900 mt-3 mb-1">Get Hired</h3>
              <p className="text-slate-600 leading-relaxed">Receive direct calls from checked employers instantly and start your new job effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      <TrustedEmployers />
    </div>
  );
};

export default Home;