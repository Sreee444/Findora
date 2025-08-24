
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://gotcha-bn3z.onrender.com';

export default function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [pwStatus, setPwStatus] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch profile and items
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_URL}/api/items/my`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ]).then(([user, items]) => {
      setProfile(user);
      setEditUsername(user.username);
      setItems(items);
      setLoading(false);
    });
  }, []);

  // Edit profile handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setEditStatus("");
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username: editUsername })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setProfile(data);
      setEditStatus("Profile updated successfully.");
    } catch (err) {
      setEditStatus(err.message);
    }
  };

  // Change password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwStatus("");
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(passwords)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password change failed");
      setPwStatus("Password changed successfully.");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setPwStatus(err.message);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading profile...</div>;
  if (!profile) return <div className="text-center py-10 text-red-500">User not found or not logged in.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-blue-600 dark:text-yellow-300 hover:underline focus:outline-none"
        aria-label="Go back"
      >
        <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>
      <h2 className="text-2xl font-bold text-blue-800 dark:text-yellow-300 mb-4">My Profile</h2>
      <div className="mb-6 text-gray-700 dark:text-gray-300">View and edit your profile information, change your password, and see your reported items here.</div>

      {/* Profile info and edit form */}
      <form onSubmit={handleProfileUpdate} className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200 flex flex-col gap-2">
        <label className="font-semibold">Username (email):</label>
        <input
          type="email"
          value={editUsername}
          onChange={e => setEditUsername(e.target.value)}
          className="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          required
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 mt-2 self-start dark:bg-blue-800 dark:hover:bg-blue-900">Save</button>
        {editStatus && <div className={`text-sm mt-1 ${editStatus.includes("success") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{editStatus}</div>}
      </form>

      {/* Change password form */}
      <form onSubmit={handleChangePassword} className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 dark:bg-green-900 dark:border-green-700 dark:text-green-200 flex flex-col gap-2">
        <label className="font-semibold">Change Password:</label>
        <input
          type="password"
          placeholder="Old password"
          value={passwords.oldPassword}
          onChange={e => setPasswords(p => ({ ...p, oldPassword: e.target.value }))}
          className="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          required
        />
        <input
          type="password"
          placeholder="New password"
          value={passwords.newPassword}
          onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
          className="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          required
        />
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 mt-2 self-start dark:bg-green-800 dark:hover:bg-green-900">Change Password</button>
        {pwStatus && <div className={`text-sm mt-1 ${pwStatus.includes("success") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{pwStatus}</div>}
      </form>

      {/* List of reported items */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200">
        <div className="font-semibold mb-2">My Reported Lost/Found Items:</div>
        {items.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-300">No items reported yet.</div>
        ) : (
          <ul className="space-y-2">
            {items.map(item => (
              <li key={item._id} className="bg-white dark:bg-gray-900 rounded shadow p-3 border border-blue-100 dark:border-blue-700 flex flex-col gap-1">
                <div className="font-semibold text-gray-900 dark:text-white">{item.title}</div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Type: {item.type} | Date: {new Date(item.date).toLocaleDateString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Contact: {item.contact}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
