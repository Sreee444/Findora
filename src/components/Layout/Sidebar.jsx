import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/user/dashboard', label: 'Dashboard', icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10-5h3a1 1 0 011 1v4m-1 4v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m16-4V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4" /></svg>
  ) },
  { to: '/lost-list', label: 'Lost Items', icon: (
    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
  ) },
  { to: '/found-list', label: 'Found Items', icon: (
    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4l-3-3" /></svg>
  ) },
  { to: '/notifications', label: 'Notifications', icon: (
    <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
  ) },
  { to: '/location-update', label: 'Location', icon: (
    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ) },
  { to: '/history', label: 'History', icon: (
    <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
  ) },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  if (!user) return null;
  return (
    <aside className="bg-gray-100 dark:bg-gray-900 w-56 min-h-full p-6 border-r hidden md:flex md:flex-col shadow-sm justify-between">
      <nav className="flex flex-col space-y-3">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center rounded-lg px-4 py-2 font-medium transition-all duration-150 text-base shadow-sm
              ${location.pathname === link.to
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'hover:bg-blue-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 hover:scale-105'}`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}