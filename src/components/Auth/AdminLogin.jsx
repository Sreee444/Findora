import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    // Only allow admin login for specific email(s)
    const adminEmails = [
      'admin@campus.edu',
      'gotchaofficial101@gmail.com'
      // Add more admin emails as needed
    ];
    if (!adminEmails.includes(form.email)) {
      setStatus('Access denied: Not an admin email.');
      setLoading(false);
      return;
    }
    try {
      await login(form.email, form.password);
      setStatus('Admin login successful!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 700);
      if (onLogin) onLogin({ email: form.email });
    } catch (err) {
      setStatus(err.message);
    }
    setLoading(false);
  };

  return (
  <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
  <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4 border border-gray-200 dark:border-gray-700">
  <h2 className="text-2xl font-bold text-center mb-2 text-gray-700 dark:text-yellow-300 flex items-center justify-center gap-2">
          <span className="inline-block text-3xl">🛡️</span> Admin Login
        </h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="admin@campus.edu"
            value={form.email}
            onChange={handleChange}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400 pr-10 w-full dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="mt-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded transition disabled:opacity-60 dark:bg-gray-900 dark:hover:bg-gray-950"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {status && (
          <div
            className={`mx-auto mt-2 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow transition-all duration-300
              ${status.includes('successful')
                ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
                : 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700'}
            `}
            style={{ maxWidth: 350 }}
            role="alert"
          >
            {status.includes('successful') ? (
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" /></svg>
            )}
            <span>{status}</span>
          </div>
        )}
      </form>
    </div>
  );
}
