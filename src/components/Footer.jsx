import React from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
        {/* Flex container - reduced gap and adjusted alignment */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
          
          {/* Brand Column - slightly tighter spacing */}
          <div className="md:flex-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt="RozgarDo" className="h-8 w-auto" />
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">RozgarDo</h2>
            </div>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed tracking-wide">
              Revolutionizing the blue-collar job market in India by connecting 
              skilled workers directly with verified employers. We provide a 
              transparent, secure platform that eliminates unfair fees and 
              empowers the nation's workforce to find reliable opportunities 
              instantly.
            </p>
          </div>

          {/* Support Column - compact layout */}
          <div className="shrink-0 min-w-[160px]">
            <h3 className="text-white font-semibold mb-3 uppercase tracking-widest text-[10px] md:text-[11px]">Support</h3>
            <ul className="space-y-2.5">
              <li>
                <a 
                  href="mailto:support@rozgardo.com" 
                  className="flex items-center gap-2 text-gray-400 hover:text-white text-xs md:text-sm transition-colors"
                >
                  <Mail size={13} />
                  <span>support@rozgardo.com</span>
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-indigo-400 text-xs md:text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - reduced top margin and tighter spacing */}
        <div className="border-t border-gray-800/50 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-[11px] md:text-xs">
            © 2026 RozgarDo Technologies. Built for India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;