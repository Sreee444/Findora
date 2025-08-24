import React from "react";
import { Link } from "react-router-dom";

export default function LostFoundAccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white p-10 rounded-2xl shadow-2xl border border-blue-100 max-w-md w-full text-center">
        <div className="flex flex-col items-center mb-4">
          <span className="text-6xl mb-2">🔒</span>
          <h2 className="text-3xl font-extrabold mb-2 text-blue-800">Login or Register Required</h2>
        </div>
        <p className="mb-6 text-gray-700 text-lg font-semibold">
          You must be logged in to report lost or found items.<br />
          Please login or register to access this feature.
        </p>
        <div className="flex flex-col gap-3 mb-2">
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition text-lg">Login</Link>
          <span className="text-gray-500 text-base">or</span>
          <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition text-lg">Register as New User</Link>
        </div>
        <p className="mt-6 text-xs text-gray-400">Need help? Contact support from the homepage.</p>
      </div>
    </div>
  );
}
