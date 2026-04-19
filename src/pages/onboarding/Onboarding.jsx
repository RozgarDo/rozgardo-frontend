import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Briefcase, Building2, Shield, Award, Rocket, DollarSign, Map, 
  Users as UsersIcon2, UserCheck, HardHat, Smartphone, ArrowRight
} from 'lucide-react';
import Footer from '../../components/Footer';

const Onboarding = () => {
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);

  // Particles background
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${15 + Math.random() * 20}s`,
    size: `${2 + Math.random() * 5}px`,
    opacity: 0.08 + Math.random() * 0.15
  }));

  // Landing Page Content
  const LandingContent = () => (
    <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Hero & Features */}
        <div className="space-y-8">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/50 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Bridge to <span className="text-indigo-600">Better Opportunities</span>
            </h1>
            <p className="text-slate-600 text-lg">
              India's fastest-growing platform connecting blue-collar workers with verified employers.
            </p>
          </div>

          {/* Why RozgarDo Feature Grid */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Why RozgarDo?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 transition"><Shield className="w-5 h-5 text-green-600" /><span className="text-slate-700 text-sm font-medium">Verified Employers</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 transition"><Rocket className="w-5 h-5 text-indigo-500" /><span className="text-slate-700 text-sm font-medium">Fast Hiring Process</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 transition"><DollarSign className="w-5 h-5 text-emerald-600" /><span className="text-slate-700 text-sm font-medium">Zero Fees for Workers</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 transition"><Map className="w-5 h-5 text-blue-500" /><span className="text-slate-700 text-sm font-medium">Local Job Matching</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 transition"><UsersIcon2 className="w-5 h-5 text-purple-500" /><span className="text-slate-700 text-sm font-medium">No Middlemen</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 transition"><UserCheck className="w-5 h-5 text-orange-500" /><span className="text-slate-700 text-sm font-medium">Direct Hiring</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 transition"><HardHat className="w-5 h-5 text-amber-600" /><span className="text-slate-700 text-sm font-medium">Blue-Collar Focused</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 transition"><Smartphone className="w-5 h-5 text-teal-500" /><span className="text-slate-700 text-sm font-medium">Simple to Use</span></div>
            </div>
          </div>
        </div>

        {/* Right side - Call to Action */}
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/50 text-center max-w-md">
            <Zap className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to get started?</h2>
            <p className="text-slate-600 mb-6">Join thousands of workers and employers already using RozgarDo.</p>
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={18} />
            </button>
          </div>
          <div className="text-center text-slate-500 text-sm">
            <p>For workers: Find verified jobs • No fees</p>
            <p>For employers: Post jobs • Hire instantly</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Registration Forms (simplified – just a placeholder that navigates to /register)
  // In this version, we removed the inline forms and use the separate page.
  // So we don't need showRegistration state anymore. But to keep your original structure,
  // we can just redirect. However, you originally wanted a separate page.
  // I'll simplify: LandingContent only, no toggle.
  // If you still want a toggle inside this file, let me know, but the requirement was a separate page.

  // For clarity: This component now only renders the landing page.
  // The registration page is at /register using the separate Registration component.

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Background elements */}
      <div className="fixed inset-0 bg-gradient-to-r from-indigo-100/20 via-purple-100/20 to-blue-100/20 animate-gradient-xy"></div>
      <div className="fixed inset-0 pointer-events-none">
        {particles.map(p => (
          <div key={p.id} className="absolute rounded-full bg-indigo-400/30 blur-sm animate-float"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration, opacity: p.opacity }} />
        ))}
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Main content - flex-1 pushes footer down */}
      <main className="relative z-10 flex-1">
        <LandingContent />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Onboarding;