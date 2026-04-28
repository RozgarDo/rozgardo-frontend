import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Briefcase, Users, Zap, IndianRupee, ArrowRight, Star } from 'lucide-react';
import handshakeImg from '../assets/handshake.png';

const Landing = ({ user }) => {
  const navigate = useNavigate();

  const handleFindJobs = () => {
    if (user) {
      navigate(user.role === 'employee' ? '/all-jobs' : '/jobs');
    } else {
      navigate('/login');
    }
  };

  const handlePostJob = () => {
    if (user) {
      navigate(user.role === 'employer' ? '/post-job' : '/become-employer');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-[#F8FAFF] min-h-0 font-sans overflow-x-hidden">
      
      {/* Hero Section - Reduced pt-2 for a tight top margin */}
      <div className="max-w-7xl mx-auto px-6 pt-2 pb-8 lg:pt-6">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          
          {/* Left Content Column */}
          <div className="flex-1 lg:max-w-[550px] text-center lg:text-left pt-4 lg:pt-8 flex flex-col items-center lg:items-start">
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-extrabold text-[#1E293B] leading-[1.1] tracking-tight">
              Better <span className="text-[#4F46E5]">Jobs.</span><br />
              Better <span className="text-[#4F46E5]">Hiring.</span>
            </h1>
            <p className="mt-4 text-slate-500 text-base md:text-[17px] leading-relaxed max-w-sm mx-auto lg:mx-0">
              India's most trusted platform connecting blue-collar workers with verified employers.
            </p>

            {/* FIXED MOBILE IMAGE CONTAINER: Re-integrated your CSS, but fixed the overlap */}
            {/* Removed negative margin (-mt-4) and fixed scale (removed scale-110) for normal spacing */}
            <div className="lg:hidden flex-1 flex justify-center relative w-full pt-6 mb-4">
              {/* Background blur effect, centered */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
              
              {/* Image, centered and respect flow */}
              <img
                src={handshakeImg}
                alt="Illustration"
                className="relative w-full max-w-[380px] sm:max-w-[450px] h-auto object-contain origin-center"
              /> 
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
              <button
                onClick={handleFindJobs}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#4F46E5] text-white px-7 py-3 rounded-xl font-semibold text-base hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
              >
                Find Jobs <ArrowRight size={18} strokeWidth={2.5} />
              </button>
              
              <button
                onClick={handlePostJob}
                className="w-full sm:w-auto flex items-center justify-center gap-3 border border-[#4F46E5]/40 bg-white text-[#4F46E5] px-7 py-3 rounded-xl font-semibold text-base hover:bg-indigo-50 transition-all"
              >
                <Briefcase size={18} strokeWidth={2.5} />
                Post a Job
              </button>
            </div>

            {/* Trust Badges - Forced Single Line on Desktop, Stack on Mobile */}
            <div className="mt-12 flex flex-col md:flex-row md:flex-nowrap items-center justify-center lg:justify-start gap-y-4 md:gap-x-6 whitespace-nowrap overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 shrink-0">
                <Shield size={16} className="text-slate-400 stroke-[2]" />
                <span className="text-slate-500 font-semibold text-[13px]">Verified Employers</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Users size={16} className="text-slate-400 stroke-[2]" />
                <span className="text-slate-500 font-semibold text-[13px]">Thousands of Jobs</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Star size={16} className="text-slate-400 stroke-[2]" />
                <span className="text-slate-500 font-semibold text-[13px]">Trusted by Millions</span>
              </div>
            </div>
          </div>

          {/* DESKTOP IMAGE: Hidden on mobile, shows on right on Desktop */}
          {/* Kept your exact classes for the desktop position */}
          <div className="hidden lg:flex flex-1 justify-center lg:justify-end relative w-full lg:-mt-16">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
            <img
              src={handshakeImg}
              alt="Illustration"
              className="relative w-full max-w-[640px] h-auto object-contain transform scale-110 lg:scale-125 origin-top"
            /> 
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white rounded-[2rem] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100 p-8 md:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-[#F5F7FF] flex items-center justify-center mb-4">
                <Shield className="text-[#4F46E5] stroke-[2]" size={22} />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Verified Employers</h3>
              <p className="text-slate-400 text-xs md:text-[13px] leading-relaxed max-w-[180px]">
                All employers are verified for a safe experience.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-[#F5F7FF] flex items-center justify-center mb-4">
                <Zap className="text-[#4F46E5] stroke-[2]" size={22} />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Fast Hiring Process</h3>
              <p className="text-slate-400 text-xs md:text-[13px] leading-relaxed max-w-[180px]">
                Quick matching and faster hiring for every need.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-[#F5F7FF] flex items-center justify-center mb-4">
                <IndianRupee className="text-[#4F46E5] stroke-[2]" size={22} />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Zero Fees for Workers</h3>
              <p className="text-slate-400 text-xs md:text-[13px] leading-relaxed max-w-[180px]">
                100% free for job seekers. No hidden charges.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-[#F5F7FF] flex items-center justify-center mb-4">
                <Users className="text-[#4F46E5] stroke-[2]" size={22} />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Local Job Matching</h3>
              <p className="text-slate-400 text-xs md:text-[13px] leading-relaxed max-w-[180px]">
                Find jobs near you. Work close to home.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;