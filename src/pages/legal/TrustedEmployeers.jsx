import React, { useState, useEffect } from 'react';

// Import your logos (keep your paths)
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

  const [duration, setDuration] = useState('28s');

  useEffect(() => {
    const updateDuration = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDuration('15s'); // faster on mobile
      } else {
        setDuration('28s'); // slightly faster on desktop
      }
    };

    updateDuration();
    window.addEventListener('resize', updateDuration);
    return () => window.removeEventListener('resize', updateDuration);
  }, []);

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

      {/* Responsive marquee – now faster */}
      <div className="overflow-hidden w-full">
        <div
          className="flex flex-nowrap gap-4 sm:gap-8 animate-scroll-left will-change-transform"
          style={{ animationDuration: duration }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex justify-center items-center h-24 min-w-[120px] sm:min-w-[180px] bg-slate-50/40 rounded-xl border border-transparent hover:border-slate-200 transition-all group"
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