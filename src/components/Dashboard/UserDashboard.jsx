

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;


export default function UserDashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-2xl">
  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-yellow-300">Welcome, {user ? (user.username || user.email) : 'Guest'}!</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">This is your dashboard. Here you can manage your lost and found reports, update your profile, and more.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/lost-list" className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 p-6 rounded-lg shadow text-center transition font-semibold text-blue-700 dark:text-blue-300">View Lost Items</Link>
          <Link to="/found-list" className="bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 p-6 rounded-lg shadow text-center transition font-semibold text-green-700 dark:text-green-300">View Found Items</Link>
          <Link to="/profile" className="bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 p-6 rounded-lg shadow text-center transition font-semibold text-yellow-700 dark:text-yellow-300">Edit Profile</Link>
          <Link to="/lost" className="bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 p-6 rounded-lg shadow text-center transition font-semibold text-indigo-700 dark:text-indigo-300">Report Lost Item</Link>
          <Link to="/found" className="bg-pink-100 hover:bg-pink-200 dark:bg-pink-900 dark:hover:bg-pink-800 p-6 rounded-lg shadow text-center transition font-semibold text-pink-700 dark:text-pink-300">Report Found Item</Link>
        </div>
      </div>
    </div>
  );
}
