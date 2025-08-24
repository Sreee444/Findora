import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDashboardMsg, setShowDashboardMsg] = useState(false);
  const [open, setOpen] = useState(false);
  const [adminMenu, setAdminMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const adminMenuRef = useRef(null);

  useEffect(() => {
    if (!userMenu) return;
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenu]);

  useEffect(() => {
    if (!adminMenu) return;
    function handleClickOutside(event) {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setAdminMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [adminMenu]);

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow relative z-20">
      <div className="flex items-center font-bold text-xl">
        <Link to="/" className="flex items-center gap-2">
          <span className="sr-only">Gotcha</span>
          <img 
            src="/gotcha-logo-new.png" 
            alt="Gotcha Lost & Found Logo" 
            className="h-12 w-auto object-contain transition-transform duration-200 hover:scale-105" 
            style={{maxWidth:'200px', minWidth:'120px'}}
            onError={(e) => {
              // Fallback to text if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span 
            className="text-2xl font-bold text-transparent bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text hidden"
            style={{display: 'none'}}
          >
            Gotcha
          </span>
        </Link>
      </div>
      <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)}>
        <span className="sr-only">Open menu</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <div className={`flex-col md:flex-row md:flex space-y-2 md:space-y-0 md:space-x-4 absolute md:static top-full left-0 w-full md:w-auto bg-gray-900 md:bg-transparent px-6 md:px-0 py-2 md:py-0 ${open ? 'flex' : 'hidden md:flex'}`}>
        <Link to="/lost" className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 transition text-white shadow-sm" onClick={() => setOpen(false)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
          Report Lost
        </Link>
        <Link to="/found" className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 transition text-white shadow-sm" onClick={() => setOpen(false)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4l-3-3" /></svg>
          Report Found
        </Link>
        <Link to="/profile" className="ml-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full font-semibold transition" onClick={() => setOpen(false)}>
          Profile
        </Link>
        {/* User Options Dropdown */}
        <div className="relative group" ref={userMenuRef}>
          <button onClick={() => setUserMenu((v) => !v)} className="flex items-center gap-1 px-3 py-2 rounded-lg font-semibold bg-gray-800 hover:bg-gray-700 transition">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            User <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {userMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-gray-900 rounded-lg shadow-lg z-30 border border-gray-200">
              {!user ? (
                <>
                  <Link to="/login" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-t-lg" onClick={() => { setUserMenu(false); setOpen(false); }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                    Login
                  </Link>
                  <Link to="/register" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100" onClick={() => { setUserMenu(false); setOpen(false); }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <button
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-t-lg w-full text-left"
                    onClick={() => {
                      setUserMenu(false); setOpen(false);
                      navigate('/user/dashboard');
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10-5h3a1 1 0 011 1v4m-1 4v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m16-4V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4" /></svg>
                    My Dashboard
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-b-lg w-full text-left"
                    onClick={() => {
                      setUserMenu(false); setOpen(false);
                      logout();
                      navigate('/login');
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        {/* Admin Options Dropdown */}
  <div className="relative group" ref={adminMenuRef}>
          <button onClick={() => setAdminMenu((v) => !v)} className="flex items-center gap-1 px-3 py-2 rounded-lg font-semibold bg-gray-800 hover:bg-gray-700 transition">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm0 0V7m0 4v4m0 0a4 4 0 100-8 4 4 0 000 8z" /></svg>
            Admin <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {adminMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-gray-900 rounded-lg shadow-lg z-30 border border-gray-200">
              {!user ? (
                <>
                  <Link to="/admin/login" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-t-lg" onClick={() => { setAdminMenu(false); setOpen(false); }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                    Admin Login
                  </Link>
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-b-lg" onClick={() => { setAdminMenu(false); setOpen(false); }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10-5h3a1 1 0 011 1v4m-1 4v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m16-4V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4" /></svg>
                    Admin Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <button
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-t-lg w-full text-left"
                    onClick={() => {
                      setAdminMenu(false); setOpen(false);
                      navigate('/admin');
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10-5h3a1 1 0 011 1v4m-1 4v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m16-4V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4" /></svg>
                    Admin Dashboard
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-b-lg w-full text-left"
                    onClick={() => {
                      setAdminMenu(false); setOpen(false);
                      logout();
                      navigate('/admin/login');
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}