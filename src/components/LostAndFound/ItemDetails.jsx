
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
    <div className="item-details p-4">
      <h2 className="text-xl font-bold mb-2">{item.title}</h2>
      <div className="mb-2 text-gray-700">{item.description}</div>
      <div className="mb-2 text-sm text-gray-500">Reported by: {item.createdBy?.username || "Unknown"}</div>
      <div className="mb-2 text-sm text-gray-500">Date: {item.date ? new Date(item.date).toLocaleString() : "N/A"}</div>
      {item.location ? (
        <div className="my-4">
          <div className="font-semibold mb-1">Location:</div>
          <div 
            className="cursor-pointer relative group"
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
          <div className="text-xs text-gray-600 mt-1">
            <button
              onClick={() => {
                const googleMapsUrl = `https://www.google.com/maps?q=${item.location.lat},${item.location.lng}`;
                window.open(googleMapsUrl, '_blank');
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline cursor-pointer transition-colors"
              title="Open coordinates in Google Maps"
            >
              ({item.location.lat}, {item.location.lng})
            </button>
            {item.location.address && (
              <span className="ml-2">
                - 
                <button
                  onClick={() => {
                    const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(item.location.address)}`;
                    window.open(googleMapsUrl, '_blank');
                  }}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline cursor-pointer transition-colors"
                  title="Search address in Google Maps"
                >
                  {item.location.address}
                </button>
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="italic text-gray-400">No location set for this item.</div>
      )}
    </div>
  );
}
