import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black border-t border-gray-800">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-7 h-7 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">RozgarDo</h2>
            </div>
            <p className="text-slate-400 text-sm transition-colors">
              Revolutionizing the blue-collar job market in India. We instantly connect skilled workers with reliable employers, bridging the gap without unfair agent fees.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a className="text-slate-400 text-sm transition-colors">Sign In / Register</a></li>
              <li><a className="text-slate-400 text-sm transition-colors">Post a Job</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-3">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Contact Us</a></li>
              <li><a href="mailto:support@rozgardo.com" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">support@rozgardo.com</a></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">© 2026 RozgarDo Technologies. Built for India.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;