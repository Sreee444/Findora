import React from "react";
import { Link } from "react-router-dom";

export default function DashboardAccessPage() {
  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
  <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-700 max-w-md w-full text-center">
        <div className="flex flex-col items-center mb-4">
          <span className="text-5xl mb-2">🔒</span>
          <h2 className="text-3xl font-extrabold mb-2 text-blue-800 dark:text-yellow-300">Dashboard Access</h2>
        </div>
  <p className="mb-4 text-gray-700 dark:text-gray-200 text-lg">
          You must be logged in to view your dashboard and manage your lost & found reports.
        </p>
        <div className="flex flex-col gap-3 mb-2">
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition dark:bg-blue-800 dark:hover:bg-blue-900">Login</Link>
          <span className="text-gray-500 dark:text-gray-400 text-sm">or</span>
          <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition dark:bg-green-800 dark:hover:bg-green-900">Register as New User</Link>
        </div>
  <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">Need help? Contact support from the homepage.</p>
      </div>
    </div>
  );
}
