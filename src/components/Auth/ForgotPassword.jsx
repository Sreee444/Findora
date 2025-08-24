import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Reset failed");
      setStatus("Password reset successful! You can now log in.");
    } catch (err) {
      setStatus(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4 border border-blue-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-2 text-blue-700 dark:text-yellow-300 flex items-center justify-center gap-2">
          <span className="inline-block text-3xl">📧</span> Forgot Password
        </h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
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
        <div className="flex flex-col gap-2">
          <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-200">New Password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
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
        {status && <p className={`text-center text-sm ${status.includes("successful") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{status}</p>}
      </form>
    </div>
  );
}