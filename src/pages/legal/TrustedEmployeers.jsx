import React from 'react';

// Direct imports from your assets folder
import flurysImg from '../../assets/flurys.png';
import barbequeNationImg from '../../assets/barbeque_nation.png';
import sixDowntownImg from '../../assets/6downtown.png';

const TrustedEmployers = () => {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 relative">
      {/* Badge Header */}
      <div className="absolute -top-3 left-0 right-0 flex justify-center">
        <div className="bg-slate-50 px-6 py-1 rounded-full border border-slate-100 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Trusted by Leading Employers
          </h3>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
        </div>
      </div>

      {/* Logos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        
        {/* Flurys */}
        <div className="flex justify-center items-center h-24 bg-slate-50/40 rounded-xl border border-transparent hover:border-slate-200 transition-all group">
          <img 
            src={flurysImg} 
            alt="Flurys" 
            className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </div>

        {/* Barbeque Nation */}
        <div className="flex justify-center items-center h-24 bg-slate-50/40 rounded-xl border border-transparent hover:border-slate-200 transition-all group">
          <img 
            src={barbequeNationImg} 
            alt="Barbeque Nation" 
            className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </div>

        {/* 6 Downtown */}
        <div className="flex justify-center items-center h-24 bg-slate-50/40 rounded-xl border border-transparent hover:border-slate-200 transition-all group">
          <img 
            src={sixDowntownImg} 
            alt="6 Downtown" 
            className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </div>

        {/* Placeholder / Many More */}
        <div className="flex items-center gap-4 px-6 h-24 bg-indigo-50/40 rounded-xl border border-indigo-100/50 group cursor-default">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-50">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-indigo-600"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700 leading-tight">And many more</span>
            <span className="text-xs text-slate-500">trusted partners...</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrustedEmployers;