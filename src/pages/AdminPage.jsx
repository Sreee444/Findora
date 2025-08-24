
import React, { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'https://gotcha-bn3z.onrender.com';


export default function AdminPage() {
  const { user } = useAuth();
  const adminEmails = [
    'admin@campus.edu',
    // Add more admin emails as needed
  ];
  const isAdmin = user && adminEmails.includes(user.email);

  const [lost, setLost] = useState([]);
  const [found, setFound] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    // Fetch pending items from backend
  fetch(`${API_URL}/api/items?approved=false`)
      .then(res => res.json())
      .then(data => {
        setLost(data.filter(item => item.type === 'lost'));
        setFound(data.filter(item => item.type === 'found'));
        setLoading(false);
      });
  }, [status, isAdmin]);

  const approveLost = async (id) => {
    setStatus('');
    try {
      const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/items/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve');
      setStatus('Lost item approved.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  const verifyFound = async (id) => {
    setStatus('');
    try {
      const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/items/${id}/verify`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify');
      setStatus('Found item verified.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-700 max-w-md w-full text-center">
          <span className="text-5xl mb-2">🔒</span>
          <h2 className="text-2xl font-extrabold mb-2 text-blue-800 dark:text-yellow-300">Admin Dashboard</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">You must be logged in as an admin to access this page.</p>
          <Link to="/admin/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition block mb-2 dark:bg-blue-800 dark:hover:bg-blue-900">Admin Login</Link>
        </div>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-700 max-w-md w-full text-center">
          <span className="text-5xl mb-2">⛔</span>
          <h2 className="text-2xl font-extrabold mb-2 text-blue-800 dark:text-yellow-300">Access Denied</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-200">You are not an admin. Please contact support if you believe this is a mistake.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-700 max-w-md w-full text-center mb-8">
        <span className="text-5xl mb-2">🔒</span>
        <h2 className="text-2xl font-extrabold mb-2 text-blue-800 dark:text-yellow-300">Admin Dashboard</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">Welcome, Admin! Approve or verify lost and found reports below.</p>
        {status && <div className={`mb-4 text-center text-sm ${status.includes('approved')||status.includes('verified') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{status}</div>}
      </div>
      <div className="w-full max-w-5xl px-2">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading reports...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">Pending Lost Items</h3>
              {lost.length === 0 ? <div className="text-gray-400 dark:text-gray-500">No lost items pending approval.</div> : (
                <ul className="space-y-4">
                  {lost.map(item => (
                    <li key={item.id} className="bg-white dark:bg-gray-900 rounded shadow p-4 border border-blue-100 dark:border-blue-700 flex flex-col gap-2">
                      <div className="font-semibold text-gray-900 dark:text-white">{item.title}</div>
                      <div className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</div>
                      {item.image_url && <img src={item.image_url} alt="Lost" className="max-h-32 rounded border dark:border-gray-700" />}
                      {item.location && <div className="text-xs text-gray-500 dark:text-gray-400">Location: Lat {item.location.lat?.toFixed(4)}, Lng {item.location.lng?.toFixed(4)}</div>}
                      <button onClick={() => approveLost(item.id)} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded dark:bg-blue-800 dark:hover:bg-blue-900">Approve</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-300">Pending Found Items</h3>
              {found.length === 0 ? <div className="text-gray-400 dark:text-gray-500">No found items pending verification.</div> : (
                <ul className="space-y-4">
                  {found.map(item => (
                    <li key={item.id} className="bg-white dark:bg-gray-900 rounded shadow p-4 border border-green-100 dark:border-green-700 flex flex-col gap-2">
                      <div className="font-semibold text-gray-900 dark:text-white">{item.title}</div>
                      <div className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</div>
                      {item.image_url && <img src={item.image_url} alt="Found" className="max-h-32 rounded border dark:border-gray-700" />}
                      {item.location && <div className="text-xs text-gray-500 dark:text-gray-400">Location: Lat {item.location.lat?.toFixed(4)}, Lng {item.location.lng?.toFixed(4)}</div>}
                      <button onClick={() => verifyFound(item.id)} className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded dark:bg-green-800 dark:hover:bg-green-900">Verify</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}