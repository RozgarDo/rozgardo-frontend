import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Phone, Lock, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const EmployeeLogin = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!phone.trim()) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }
    if (!password) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/employee-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Call parent onLogin callback (if provided)
      if (onLogin) onLogin(data.user);
      
      // Redirect based on role (employee)
      navigate('/employee-dashboard'); // or wherever you want
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="w-full max-w-[400px] bg-white rounded-2xl py-6 px-8 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] border border-white/50 flex flex-col gap-5 animate-[fadeIn_0.4s_ease-out]">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(79,70,229,0.1)]">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">Employee Login</h1>
          <p className="text-sm font-medium text-slate-500">Sign in to your RozgarDo account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3 text-slate-400 pointer-events-none w-[18px] h-[18px]" />
              <input
                type="tel"
                className="w-full py-3 pl-10 pr-4 border rounded-lg text-sm text-slate-900 bg-white transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 placeholder:text-slate-300"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-slate-400 pointer-events-none w-[18px] h-[18px]" />
              <input
                type="password"
                className="w-full py-3 pl-10 pr-4 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 placeholder:text-slate-300"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="py-2 px-3 rounded-lg text-sm font-medium text-center bg-red-50 text-red-600 border border-red-100 animate-[fadeIn_0.3s_ease-out]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 mt-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-slate-500 mt-1">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-indigo-600 font-bold hover:underline bg-none border-none cursor-pointer"
              onClick={() => navigate('/employee-registration')}
            >
              Register Now
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;