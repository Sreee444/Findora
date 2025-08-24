import React, { useEffect, useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL;


export default function LostList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLostItems() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/items?type=lost`);
        if (!res.ok) throw new Error('Failed to fetch lost items');
        const data = await res.json();
  setItems(data.filter(item => item.approved));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLostItems();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-8 w-full">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4">All Lost Items</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">This page displays a list of all lost item reports. As an admin, you can review, verify, or remove lost items here.</p>
        {loading ? (
          <div className="text-blue-600 dark:text-blue-200">Loading...</div>
        ) : error ? (
          <div className="text-red-600 dark:text-red-300">{error}</div>
        ) : items.length === 0 ? (
          <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center text-blue-700 dark:text-blue-200">
            <span className="text-lg">No lost items found.</span>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map(item => (
              <li key={item._id} className="bg-blue-100 dark:bg-blue-900 dark:bg-opacity-40 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <div className="font-semibold text-blue-800 dark:text-blue-200">{item.title}</div>
                <div className="text-gray-700 dark:text-gray-300 text-sm mb-1">{item.description}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Reported by: {item.createdBy?.username || 'Unknown'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Date: {item.date ? new Date(item.date).toLocaleString() : 'N/A'}</div>
                {item.location && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    📍 Location: 
                    <button
                      onClick={() => {
                        const googleMapsUrl = `https://www.google.com/maps?q=${item.location.lat},${item.location.lng}`;
                        window.open(googleMapsUrl, '_blank');
                      }}
                      className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline cursor-pointer transition-colors"
                      title="Open in Google Maps"
                    >
                      {item.location.lat?.toFixed(4)}, {item.location.lng?.toFixed(4)}
                    </button>
                    {item.location.address && (
                      <span className="ml-1">
                        (
                        <button
                          onClick={() => {
                            const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(item.location.address)}`;
                            window.open(googleMapsUrl, '_blank');
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline cursor-pointer transition-colors"
                          title="Search address in Google Maps"
                        >
                          {item.location.address}
                        </button>
                        )
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
