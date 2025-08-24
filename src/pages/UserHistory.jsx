
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;


export default function UserHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/items/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch user history');
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const lostItems = history.filter(item => item.type === 'lost');
  const foundItems = history.filter(item => item.type === 'found');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-blue-600 dark:text-yellow-300 hover:underline focus:outline-none"
          aria-label="Go back"
        >
          <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-yellow-300 flex items-center gap-2">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
          Your History
        </h2>

        {/* Summary Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">{lostItems.length}</div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Lost Items</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-300">{foundItems.length}</div>
              <div className="text-sm text-green-800 dark:text-green-200">Found Items</div>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
                {history.filter(item => !item.approved && !item.verified).length}
              </div>
              <div className="text-sm text-yellow-800 dark:text-yellow-200">Pending</div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                {history.filter(item => item.claimed).length}
              </div>
              <div className="text-sm text-purple-800 dark:text-purple-200">Claimed</div>
            </div>
          </div>
        )}
        {loading ? (
          <div>Loading history...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : history.length === 0 ? (
          <div className="italic text-gray-500">No lost or found items posted yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                Lost Items
              </h3>
              {lostItems.length === 0 ? (
                <div className="italic text-gray-400">No lost items posted.</div>
              ) : (
                <ul className="space-y-3">
                  {lostItems.map(item => (
                    <li key={item._id} className="border rounded p-3 bg-blue-50 dark:bg-blue-900">
                      <div className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                        <span>❓</span> {item.title}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">{item.date ? new Date(item.date).toLocaleString() : 'N/A'}</div>
                      <div className="text-gray-700 dark:text-gray-200 text-sm mb-1">{item.description}</div>
                      <div className="text-xs text-gray-400 mb-1">Contact: {item.contact}</div>
                      <div className="text-xs font-semibold mb-1">
                        Status: 
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          item.approved || item.verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.approved || item.verified ? 'Approved' : 'Pending'}
                        </span>
                        {item.claimed && (
                          <span className="ml-1 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                            Claimed
                          </span>
                        )}
                      </div>
                      <Link to={`/item/${item._id}`} className="text-xs text-blue-600 underline">View Details</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-green-700 dark:text-green-300">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4l-3-3" /></svg>
                Found Items
              </h3>
              {foundItems.length === 0 ? (
                <div className="italic text-gray-400">No found items posted.</div>
              ) : (
                <ul className="space-y-3">
                  {foundItems.map(item => (
                    <li key={item._id} className="border rounded p-3 bg-green-50 dark:bg-green-900">
                      <div className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
                        <span>✔️</span> {item.title}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">{item.date ? new Date(item.date).toLocaleString() : 'N/A'}</div>
                      <div className="text-gray-700 dark:text-gray-200 text-sm mb-1">{item.description}</div>
                      <div className="text-xs text-gray-400 mb-1">Contact: {item.contact}</div>
                      <div className="text-xs font-semibold mb-1">
                        Status: 
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          item.approved || item.verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.approved || item.verified ? 'Verified' : 'Pending'}
                        </span>
                        {item.claimed && (
                          <span className="ml-1 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                            Claimed
                          </span>
                        )}
                      </div>
                      <Link to={`/item/${item._id}`} className="text-xs text-green-700 underline">View Details</Link>
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
