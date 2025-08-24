
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/api';


export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', password: '', confirm: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    if (form.password !== form.confirm) {
      setStatus('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await signup(form.email, form.password, form.username);
      setStatus('Registration successful! 🎉 Welcome email sent. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus(err.message);
    }
    setLoading(false);
  };

  return (
  <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
  <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4 border border-blue-100 dark:border-gray-700">
  <h2 className="text-2xl font-bold text-center mb-2 text-blue-700 dark:text-yellow-300 flex items-center justify-center gap-2">
          <span className="inline-block text-3xl">📝</span> Register
        </h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@campus.edu"
            value={form.email}
            onChange={handleChange}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            minLength={3}
            placeholder="Choose a username"
            value={form.username}
            onChange={handleChange}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="confirm" className="text-sm font-medium text-gray-700 dark:text-gray-200">Re-enter Password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            placeholder="Re-enter Password"
            value={form.confirm}
            onChange={handleChange}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>
        <button
          type="submit"
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-60 dark:bg-blue-800 dark:hover:bg-blue-900"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
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