
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
          <MapView lat={item.location.lat} lng={item.location.lng} />
          <div className="text-xs text-gray-600 mt-1">({item.location.lat}, {item.location.lng})</div>
        </div>
      ) : (
        <div className="italic text-gray-400">No location set for this item.</div>
      )}
    </div>
  );
}
