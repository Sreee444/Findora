import React, { useEffect, useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL;


export default function FoundList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFoundItems() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/items?type=found`);
        if (!res.ok) throw new Error('Failed to fetch found items');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFoundItems();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-8 w-full">
        <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-4">All Found Items</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">This page displays a list of all found item reports. As an admin, you can review, verify, or remove found items here.</p>
        {loading ? (
          <div className="text-yellow-600 dark:text-yellow-200">Loading...</div>
        ) : error ? (
          <div className="text-red-600 dark:text-red-300">{error}</div>
        ) : items.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-center text-yellow-700 dark:text-yellow-200">
            <span className="text-lg">No found items found.</span>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map(item => (
              <li key={item._id} className="bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-40 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <div className="font-semibold text-yellow-800 dark:text-yellow-200">{item.title}</div>
                <div className="text-gray-700 dark:text-gray-300 text-sm mb-1">{item.description}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Reported by: {item.createdBy?.username || 'Unknown'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Date: {item.date ? new Date(item.date).toLocaleString() : 'N/A'}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
