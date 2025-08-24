import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from '../../services/api';
import { useAuth, parseJwt } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const token = await login(form.email, form.password);
      // Set user context immediately
      const decoded = parseJwt(token);
      setUser(decoded ? { ...decoded, token } : { token });
      setStatus('Login successful!');
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 700);
    } catch (err) {
      setStatus(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4 border border-blue-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-700 dark:text-yellow-300 flex items-center justify-center gap-2">
          <span className="inline-block text-3xl">🔐</span> Login
        </h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Email or Username</label>
          <input
            id="email"
            name="email"
            type="text"
            required
            placeholder="Enter your email or username"
            value={form.email}
            onChange={handleChange}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
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
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10 w-full dark:bg-gray-900 dark:text-white dark:border-gray-700"
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
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="30" viewBox="0 0 26 30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 15C2 15 6.5 6 13 6C19.5 6 24 15 24 15C24 15 19.5 24 13 24C6.5 24 2 15 2 15Z"/><path d="M5 27L21 3"/></svg>
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-60 dark:bg-blue-800 dark:hover:bg-blue-900"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline text-sm text-center mt-1 dark:text-blue-300"
          >
            Forgot Password?
          </Link>
        </div>
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