import React from 'react';

export default function AdminDashboard() {
  return (
  <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-8">
  <h1 className="text-3xl font-bold text-blue-800 dark:text-yellow-300 mb-4">Admin Dashboard</h1>
  <p className="mb-6 text-gray-700 dark:text-gray-200">Welcome, Admin! Here you can manage lost and found items, approve new submissions, and manage users.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <a href="/admin/approval-queue" className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 p-6 rounded-lg shadow text-center transition">
          <div className="text-4xl mb-2">📝</div>
          <div className="font-semibold text-blue-700 dark:text-blue-300">Approval Queue</div>
          <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">Review and approve lost/found item requests</div>
        </a>
        <a href="/admin/user-management" className="bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 p-6 rounded-lg shadow text-center transition">
          <div className="text-4xl mb-2">👥</div>
          <div className="font-semibold text-green-700 dark:text-green-300">User Management</div>
          <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">View and manage registered users</div>
        </a>
        <a href="/found-list" className="bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 p-6 rounded-lg shadow text-center transition">
          <div className="text-4xl mb-2">📦</div>
          <div className="font-semibold text-yellow-700 dark:text-yellow-300">Found Items</div>
          <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">See all found item reports</div>
        </a>
      </div>
  {/* Removed ideas section as requested */}
    </div>
  );
}