
import React, { useEffect, useState } from "react";
import MapView from "../Location/MapView";
const API_URL = import.meta.env.VITE_API_URL;

// Expects an itemId prop
export default function ItemDetails({ itemId }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/items/${itemId}`);
        if (!res.ok) throw new Error("Failed to fetch item");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (itemId) fetchItem();
  }, [itemId]);

  if (loading) return <div>Loading item details...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!item) return <div>Item not found.</div>;

  return (
    <div className="item-details p-4 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{item.title}</h2>
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
            <span className="font-medium text-gray-600 dark:text-gray-300">👤 Reported by:</span>
            <div className="text-gray-800 dark:text-white">{item.createdBy?.username || "Unknown"}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
            <span className="font-medium text-gray-600 dark:text-gray-300">📅 Date:</span>
            <div className="text-gray-800 dark:text-white">{item.date ? new Date(item.date).toLocaleString() : "N/A"}</div>
          </div>
        </div>
      {item.location ? (
        <div className="my-4">
          <div className="font-semibold mb-2 text-gray-800 dark:text-gray-200">📍 Location:</div>
          <div 
            className="cursor-pointer relative group mb-3"
            onClick={() => {
              const googleMapsUrl = `https://www.google.com/maps?q=${item.location.lat},${item.location.lng}`;
              window.open(googleMapsUrl, '_blank');
            }}
            title="Click to open in Google Maps"
          >
            <MapView lat={item.location.lat} lng={item.location.lng} />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-2xl flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-lg">
                <span className="text-sm font-medium">🗺️ Open in Google Maps</span>
              </div>
            </div>
          </div>
          
          {/* Mobile-friendly location info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Coordinates:</span>
              <button
                onClick={() => {
                  const googleMapsUrl = `https://www.google.com/maps?q=${item.location.lat},${item.location.lng}`;
                  window.open(googleMapsUrl, '_blank');
                }}
                className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                title="Open coordinates in Google Maps"
              >
                🗺️ View on Map
              </button>
            </div>
            
            {item.location.address && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Address:</span>
                <button
                  onClick={() => {
                    const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(item.location.address)}`;
                    window.open(googleMapsUrl, '_blank');
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-left"
                  title="Search address in Google Maps"
                >
                  {item.location.address}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="italic text-gray-400">No location set for this item.</div>
      )}
      </div>
    </div>
  );
}
