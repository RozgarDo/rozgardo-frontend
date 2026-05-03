import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ChevronDown, Users } from 'lucide-react';
import laptopImg from '../assets/handshake.png';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'What is this regarding?',
    message: '',
    agreed: false
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const subjects = ["General Inquiry", "Job Support", "Employer Services", "Technical Issue"];

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Main Grid: Responsive column ordering */}
        <div className="grid grid-cols-1 lg:grid-cols-[25%_42%_33%] gap-10 items-stretch">
          
          {/* COLUMN 1: Contact Info (Order 1 on Mobile) */}
          <div className="flex flex-col justify-start space-y-10 py-2 order-1 lg:order-none">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#2d2e32] mb-4 tracking-tight text-center lg:text-left">
                Contact <span className="text-[#4f46e5]">Us</span>
              </h1>
              <p className="text-gray-500 text-[15px] leading-relaxed text-center lg:text-left">
                We're here to help! Reach out to us for any queries, support, or partnership opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
              <ContactInfoCard icon={<Mail size={20} />} title="Email Us" detail="support@rozgardo.com" />
              <ContactInfoCard icon={<Phone size={20} />} title="Call Us" detail="+91 98765 43210" sub="Mon - Sat: 9:00 AM - 6:00 PM" />
              <ContactInfoCard icon={<MapPin size={20} />} title="Our Office" detail="RozgarDo Technologies Pvt. Ltd." sub="2nd Floor, Sector 62, Noida, UP - 201309" />
              <ContactInfoCard icon={<Clock size={20} />} title="Business Hours" detail="Monday - Saturday" sub="9:00 AM - 6:00 PM IST" />
            </div>
          </div>

          {/* COLUMN 2: Message Form (Order 2 on Mobile) */}
          <div className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col h-full order-2 lg:order-none">
            <h2 className="text-2xl font-bold mb-1 text-[#111827]">Send Us a Message</h2>
            <p className="text-sm text-gray-400 mb-8 md:mb-10">Fill out the form below and we'll get back to you soon.</p>
            
            <form className="space-y-6 flex-grow flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name *</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" placeholder="Enter name" className="w-full bg-[#f9fafc] rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-indigo-200 outline-none border border-transparent focus:border-indigo-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address *</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Enter email" className="w-full bg-[#f9fafc] rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-indigo-200 outline-none border border-transparent focus:border-indigo-100" />
                </div>
              </div>

              {/* Collapsible Dropdown */}
              <div className="space-y-2 relative">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Subject *</label>
                <button 
                  type="button"
                  className="w-full bg-[#f9fafc] rounded-xl px-4 py-3.5 text-sm cursor-pointer flex justify-between items-center text-gray-500 border border-transparent hover:border-indigo-100 transition-colors" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {formData.subject}
                  <ChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl py-2 overflow-hidden">
                    {subjects.map((s) => (
                      <div 
                        key={s} 
                        className="px-5 py-3 hover:bg-indigo-50 cursor-pointer text-sm text-gray-600 transition-colors" 
                        onClick={() => { setFormData({...formData, subject: s}); setIsDropdownOpen(false); }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Message *</label>
                <textarea required name="message" value={formData.message} onChange={handleInputChange} rows="5" placeholder="Type your message here..." className="w-full bg-[#f9fafc] rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-indigo-200 outline-none resize-none border border-transparent focus:border-indigo-100"></textarea>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="privacy" name="agreed" checked={formData.agreed} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-200 cursor-pointer" />
                <label htmlFor="privacy" className="text-xs text-gray-400 cursor-pointer">
                  I agree to the <span className="text-indigo-600 font-semibold underline">Privacy Policy</span>
                </label>
              </div>

              <button className="mt-auto w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-md shadow-indigo-100">
                Send Message <Send size={16} />
              </button>
            </form>
          </div>

          {/* COLUMN 3: Help Column (Order 3 on Mobile) */}
          <div className="flex flex-col gap-8 h-full order-3 lg:order-none">
            <div className="flex-1 bg-white rounded-[2.5rem] overflow-hidden flex items-center justify-center min-h-[200px]">
              <img 
                src={laptopImg} 
                alt="Support Team" 
                className="w-full h-auto object-contain max-h-[300px] lg:max-h-full" 
              />
            </div>

            <div className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-sm">
              <h3 className="text-2xl font-bold text-[#111827] mb-3">We're Here to Help</h3>
              <p className="text-sm text-gray-400 mb-8 leading-relaxed">Our team is dedicated to providing you with the best support.</p>
              <ul className="space-y-5">
                <SupportLink text="Quick response within 24 hours" />
                <SupportLink text="Friendly & professional support" />
                <SupportLink text="Help with jobs, hiring & platform issues" />
                <SupportLink text="Partnerships & business inquiries welcome" />
              </ul>
            </div>
          </div>
        </div>

        {/* URGENT SUPPORT BANNER - Exactly as per Screenshot 2026-05-04 at 1.18.49 AM.png */}
        <div className="mt-12 md:mt-16 bg-[#f9faff] rounded-[2.5rem] p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border border-[#f0f2f9]">
          
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5 w-full">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-[#eceef6] shadow-sm flex-shrink-0">
              <div className="text-[#4f46e5]">
                <Users size={24} /> 
              </div>
            </div>
            
            <div>
              <h4 className="text-l font-bold text-[#1a1a1a] leading-tight">
                Looking for urgent support?
              </h4>
              <p className="text-[12px] text-gray-500 mt-1">
                Call us directly for immediate assistance during business hours.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Phone Button */}
            <div className="w-full sm:w-auto flex items-center justify-center gap-4 bg-white border border-[#e5e7eb] rounded-2xl px-6 py-4 shadow-sm min-w-[220px]">
              <div className="bg-[#f5f7ff] p-2 rounded-lg text-[#4f46e5]">
                <Phone size={16} fill="currentColor" />
              </div>
              <span className="text-[#4f46e5] font-bold text-base whitespace-nowrap">
                +91 98765 43210
              </span>
            </div>

            {/* Email Button */}
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-2xl px-8 py-4 transition-all shadow-lg shadow-indigo-100 group">
              <Mail size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-base whitespace-nowrap">Email Us</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const ContactInfoCard = ({ icon, title, detail, sub }) => (
  <div className="flex gap-5 group items-start">
    <div className="bg-[#f5f7ff] text-[#4f46e5] p-3.5 rounded-2xl group-hover:bg-[#4f46e5] group-hover:text-white transition-all duration-300 shadow-sm">
      {icon}
    </div>
    <div className="text-left">
      <p className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 mb-1">{title}</p>
      <p className="text-base font-bold text-[#111827]">{detail}</p>
      {sub && <p className="text-[13px] text-gray-400 mt-1 leading-tight">{sub}</p>}
    </div>
  </div>
);

const SupportLink = ({ text }) => (
  <li className="flex items-start gap-4">
    <div className="mt-1 bg-indigo-50 rounded-full p-1 flex-shrink-0">
      <CheckCircle2 className="text-[#4f46e5]" size={15} strokeWidth={3} />
    </div>
    <span className="text-[15px] font-medium text-gray-700 leading-tight">{text}</span>
  </li>
);

export default Contact;