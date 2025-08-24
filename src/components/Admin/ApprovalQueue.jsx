import React, { useEffect, useState } from 'react';
import { getPendingItems, approveLostItem, verifyFoundItem } from '../../services/api';

export default function ApprovalQueue() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionStatus, setActionStatus] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPendingItems();
      setItems(data);
    } catch (err) {
      setError('Failed to fetch items');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleApprove = async (item) => {
    setActionStatus('');
    try {
      if (item.type === 'lost') {
        await approveLostItem(item._id);
        setActionStatus('Item approved!');
      } else if (item.type === 'found') {
        await verifyFoundItem(item._id);
        setActionStatus('Item verified!');
      }
      fetchItems();
    } catch (err) {
      setActionStatus('Action failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-blue-800 dark:text-yellow-300 mb-4">Approval Queue</h2>
      <p className="mb-6 text-gray-700 dark:text-gray-200">Review and approve or verify new lost and found item submissions.</p>
      {error && <div className="mb-4 text-red-600 dark:text-red-400">{error}</div>}
      {actionStatus && <div className="mb-4 text-green-700 dark:text-green-300">{actionStatus}</div>}
      {loading ? (
        <div className="text-center text-blue-600 dark:text-blue-300">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">No pending items for approval.</div>
      ) : (
        <ul className="space-y-4">
          {items.map(item => (
            <li key={item._id} className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-semibold text-blue-800 dark:text-blue-200">{item.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{item.type === 'lost' ? 'Lost' : 'Found'} | {new Date(item.date).toLocaleDateString()}</div>
                <div className="text-sm text-gray-700 dark:text-gray-200 mt-1">{item.description}</div>
              </div>
              <button
                className="mt-2 md:mt-0 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition"
                onClick={() => handleApprove(item)}
              >
                {item.type === 'lost' ? 'Approve' : 'Verify'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
