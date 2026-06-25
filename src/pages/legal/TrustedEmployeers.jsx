import React from 'react';

// Import your logos (keeping your paths untouched)
import flurysImg from '../../assets/flurys.png';
import barbequeNationImg from '../../assets/barbeque_nation.png';
import sixDowntownImg from '../../assets/6downtown.png';
import chaiBreakImg from '../../assets/chai_break.jpeg';
import absoluteBarbequeImg from '../../assets/absolute_barbeque.jpeg';
import theBeerCafeImg from '../../assets/the_beer_cafe.jpeg';

const TrustedEmployers = () => {
  const logos = [
    { src: flurysImg, alt: 'Flurys', height: 'h-14 md:h-16' },
    { src: barbequeNationImg, alt: 'Barbeque Nation', height: 'h-16 md:h-20' },
    { src: sixDowntownImg, alt: '6 Downtown', height: 'h-14 md:h-16' },
    { src: chaiBreakImg, alt: 'Chai Break', height: 'h-14 md:h-16' },
    { src: absoluteBarbequeImg, alt: 'Absolute Barbeque', height: 'h-14 md:h-16' },
    { src: theBeerCafeImg, alt: 'The Beer Cafe', height: 'h-14 md:h-16' },
  ];

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 relative">
      {/* Badge – untouched */}
      <div className="absolute -top-3 left-0 right-0 flex justify-center">
        <div className="bg-slate-50 px-6 py-1 rounded-full border border-slate-100 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Trusted by Leading Employers
          </h3>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
        </div>
      </div>

      {/* Jitter-Free Custom CSS Keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .animate-marquee-track {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: space-around;
          min-width: 100%;
          animation: marquee 25s linear infinite;
        }
        @media (max-width: 640px) {
          .animate-marquee-track {
            animation: marquee 14s linear infinite;
          }
        }
        .marquee-container:hover .animate-marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      {/* Marquee Wrapper (Faded edges mask removed) */}
      <div className="overflow-hidden w-full flex marquee-container">
        
        {/* TRACK 1 */}
        <div className="animate-marquee-track gap-4 sm:gap-8 pr-4 sm:pr-8">
          {logos.map((logo, index) => (
            <div
              key={`track1-${index}`}
              className="flex-shrink-0 flex justify-center items-center h-24 min-w-[140px] sm:min-w-[180px] bg-slate-50/40 rounded-xl border border-transparent hover:border-slate-200 transition-all group"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className={`${logo.height} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
              />
            </div>
          ))}
        </div>

        {/* TRACK 2 (Exact Duplicate) */}
        <div className="animate-marquee-track gap-4 sm:gap-8 pr-4 sm:pr-8" aria-hidden="true">
          {logos.map((logo, index) => (
            <div
              key={`track2-${index}`}
              className="flex-shrink-0 flex justify-center items-center h-24 min-w-[140px] sm:min-w-[180px] bg-slate-50/40 rounded-xl border border-transparent hover:border-slate-200 transition-all group"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className={`${logo.height} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TrustedEmployers;