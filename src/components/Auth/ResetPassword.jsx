import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { verifyResetToken, resetPasswordWithToken } from "../../services/api";

export default function ResetPassword() {
  console.log("ResetPassword component loaded"); // Debug log
  const { token } = useParams();
  console.log("Token from URL:", token); // Debug log
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await verifyResetToken(token);
        setTokenValid(true);
        setUserEmail(response.email);
      } catch (error) {
        setTokenValid(false);
        setStatus(error.message);
      }
    };

    if (token) {
      checkToken();
    } else {
      setTokenValid(false);
      setStatus("Invalid reset link");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    if (password !== confirmPassword) {
      setStatus("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setStatus("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await resetPasswordWithToken(token, password);
      setStatus("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setStatus(error.message);
    }
    setLoading(false);
  };

  if (tokenValid === null) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center border border-blue-100 dark:border-gray-700">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md text-center border border-red-200 dark:border-red-800">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
            Invalid Reset Link
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link 
            to="/forgot-password"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition mr-2"
          >
            Request New Link
          </Link>
          <Link 
            to="/login"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition"
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
          <span className="inline-block text-3xl">🔑</span> Reset Password
        </h2>
        
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-4">
          Setting new password for <strong>{userEmail}</strong>
        </p>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
            minLength={6}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-60 dark:bg-blue-800 dark:hover:bg-blue-900"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        
        {status && (
          <p className={`text-center text-sm ${
            status.includes("successful") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
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
