import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionStatus, setActionStatus] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    setActionStatus('');
    try {
      await deleteUser(userId);
      setActionStatus('User deleted');
      fetchUsers();
    } catch (err) {
      setActionStatus('Delete failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-green-800 dark:text-yellow-300 mb-4">User Management</h2>
      <p className="mb-6 text-gray-700 dark:text-gray-200">View and manage all registered users in the system.</p>
      {error && <div className="mb-4 text-red-600 dark:text-red-400">{error}</div>}
      {actionStatus && <div className="mb-4 text-green-700 dark:text-green-300">{actionStatus}</div>}
      {loading ? (
        <div className="text-center text-green-700 dark:text-green-300">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">No users found.</div>
      ) : (
        <ul className="space-y-4">
          {users.map(user => (
            <li key={user._id} className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-semibold text-green-800 dark:text-green-200">{user.username || user.email}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{user.email}</div>
              </div>
              <button
                className="mt-2 md:mt-0 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition"
                onClick={() => handleDelete(user._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
