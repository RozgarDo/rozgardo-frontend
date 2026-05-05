import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Shield, Award, Rocket, DollarSign, Map, 
  Users as UsersIcon2, UserCheck, HardHat, Smartphone, ArrowRight, TrendingUp,
  UserPlus, Search, Send
} from 'lucide-react';

import handshake from '../../assets/handshake.jpeg';
import workers from '../../assets/workers.png';
import employers from '../../assets/employers.png';

import flurys from '../../assets/flurys.png';
import barbeque_nation from '../../assets/barbeque_nation.png';
import six_downtown from '../../assets/6downtown.png';

const Onboarding = () => {
  const navigate = useNavigate();

  const getColorClasses = (color) => {
    const colors = {
      green: "bg-green-100 text-green-600",
      indigo: "bg-indigo-100 text-indigo-600",
      emerald: "bg-emerald-100 text-emerald-600",
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      amber: "bg-amber-100 text-amber-600",
      teal: "bg-teal-100 text-teal-600"
    };
    return colors[color] || colors.indigo;
  };

  const whyRozgarItems = [
    { icon: Shield, title: 'Verified Employers', color: 'green' },
    { icon: Rocket, title: 'Fast Hiring Process', color: 'indigo' },
    { icon: DollarSign, title: 'Zero Fees for Workers', color: 'emerald' },
    { icon: Map, title: 'Local Job Matching', color: 'blue' },
    { icon: UsersIcon2, title: 'No Middlemen', color: 'purple' },
    { icon: UserCheck, title: 'Direct Hiring', color: 'orange' },
    { icon: HardHat, title: 'Blue-Collar Focused', color: 'amber' },
    { icon: Smartphone, title: 'Simple to Use', color: 'teal' }
  ];

  const steps = [
    { icon: UserPlus, title: 'Create Profile', color: 'indigo' },
    { icon: Search, title: 'Find Jobs', color: 'blue' },
    { icon: Send, title: 'Apply Jobs', color: 'emerald' },
    { icon: Award, title: 'Get Hired', color: 'purple' }
  ];

  return (
    // <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
    <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <main className="flex-1">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-1 pb-6"> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
          {/* Two column layout with equal height */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* LEFT COLUMN – now uses flex column with expandable second card */}
            <div className="flex flex-col h-full gap-6">
              {/* Tagline Card – fixed height (does not stretch) */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex-shrink-0">
                <div className="text-left">
                  <div className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                    Better <span className="text-indigo-600">Jobs.</span>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight mt-1">
                    Better <span className="text-indigo-600">Hiring.</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-3 max-w-md">
                    India's most trusted platform connecting blue‑collar workers with verified employers.
                  </p>
                </div>
              </div>

              {/* Why RozgarDo? – expands to fill remaining space (flex-1) */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
                  <Award size={22} className="text-indigo-500" /> Why RozgarDo?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {whyRozgarItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${getColorClasses(item.color)} flex items-center justify-center`}>
                        <item.icon size={18} />
                      </div>
                      <span className="font-medium text-slate-800 text-sm">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN – expands to match left column height */}
            <div className="flex flex-col h-full gap-5">
              {/* Handshake image – takes remaining space (flex-1) to balance heights */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1 min-h-0">
                <img 
                  src={handshake} 
                  alt="RozgarDo Partnership" 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* CTA Card – fixed height, stays at bottom */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex-shrink-0">
                <div className="text-center">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <UsersIcon2 className="text-indigo-600" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-1">Ready to get started?</h2>
                  <p className="text-slate-500 text-xs mb-4">Join thousands of workers and employers already using RozgarDo.</p>
                  
                  <button
                    onClick={() => navigate('/register')}
                    className="w-max mx-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-16 rounded-xl transition-all flex items-center justify-center gap-2 text-base shadow-md active:scale-95"
                  >
                    Get Started <ArrowRight size={18} />
                  </button>
                </div>

                {/* Footer icons – larger text for worker/employer labels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 mt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 flex-shrink-0">
                      <img src={workers} alt="Worker" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">For workers:</p>
                      <p className="text-xs text-slate-500">Find verified jobs • No fees</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-left border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-3">
                    <div className="w-10 h-10 flex-shrink-0">
                      <img src={employers} alt="Employer" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">For employers:</p>
                      <p className="text-xs text-slate-500">Post jobs • Hire instantly</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

{/* Trusted by Leading Employers Section */}


<div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 relative">

  <div className="absolute -top-3 left-0 right-0 flex justify-center">
    <div className="bg-slate-50 px-6 py-1 rounded-full border border-slate-100 flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
      <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
        Trusted by Leading Employers
      </h3>
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
    </div>
  </div>


  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
    

    <div className="flex justify-center items-center h-24 bg-slate-50/40 rounded-xl border border-transparent hover:border-slate-200 transition-all group">
      <img 
        src={flurys} 
        alt="Flurys" 
        className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
      />
    </div>


    <div className="flex justify-center items-center h-24 bg-slate-50/40 rounded-xl border border-transparent hover:border-slate-200 transition-all group">
      <img 
        src={barbeque_nation} 
        alt="Barbeque Nation" 
        className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
      />
    </div>


    <div className="flex justify-center items-center h-24 bg-slate-50/40 rounded-xl border border-transparent hover:border-slate-200 transition-all group">
      <img 
        src={six_downtown} 
        alt="6 Downtown" 
        className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
      />
    </div>


    <div className="flex items-center gap-4 px-6 h-24 bg-indigo-50/40 rounded-xl border border-indigo-100/50 group cursor-default">
      <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-50">
        <UsersIcon2 size={24} className="text-indigo-600" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-slate-700 leading-tight">And many more</span>
        <span className="text-xs text-slate-500">trusted partners...</span>
      </div>
    </div>

  </div>
</div> 



        </div>
      </main>
    </div>
  );
};

export default Onboarding;