import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    
    try {
      await forgotPassword(email);
      setEmailSent(true);
      setStatus("Reset email sent! Check your inbox and spam folder.");
    } catch (err) {
      setStatus(err.message || "Failed to send reset email");
    }
    setLoading(false);
  };

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center border border-blue-100 dark:border-gray-700">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-yellow-300">
            Check Your Email
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            We've sent a password reset link to <strong>{email}</strong>. 
            Click the link in the email to reset your password.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <p>• Check your spam folder if you don't see it</p>
            <p>• The link expires in 1 hour</p>
          </div>
          <Link 
            to="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4 border border-blue-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-700 dark:text-yellow-300 flex items-center justify-center gap-2">
          <span className="inline-block text-3xl">🔐</span> Forgot Password
        </h2>
        
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@campus.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          />
        </div>
        
        <button
          type="submit"
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-60 dark:bg-blue-800 dark:hover:bg-blue-900"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        
        {status && (
          <p className={`text-center text-sm ${
            status.includes("sent") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}>
            {status}
          </p>
        )}
        
        <div className="text-center mt-4">
          <Link 
            to="/login" 
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
