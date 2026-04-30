import React from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black border-t border-gray-800">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-14">
        {/* Flex container with reduced gap to bring sections closer */}
        <div className="flex flex-col md:flex-row justify-start items-start gap-12 lg:gap-24">
          
          {/* Brand Column - Occupies enough space to prevent a large mid-gap */}
          <div className="md:flex-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-5">
              <img src={logo} alt="RozgarDo" className="h-9 w-auto" />
              <h2 className="text-xl font-bold text-white tracking-tight">RozgarDo</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed tracking-wide">
              Revolutionizing the blue-collar job market in India by connecting 
              skilled workers directly with verified employers. We provide a 
              transparent, secure platform that eliminates unfair fees and 
              empowers the nation's workforce to find reliable opportunities 
              instantly.
            </p>
          </div>

          {/* Quick Links Column - Positioned closer to the brand */}
          <div className="shrink-0">
            <h3 className="text-white font-semibold mb-5 uppercase tracking-widest text-[11px]">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/auth" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                  Sign In / Register
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                  Post a Job
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="shrink-0 lg:min-w-[180px]">
            <h3 className="text-white font-semibold mb-5 uppercase tracking-widest text-[11px]">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@rozgardo.com" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors duration-200">
                  <Mail size={14} />
                  <span>support@rozgardo.com</span>
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>

              <li><Link to="/privacy" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © 2026 RozgarDo Technologies. Built for India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;