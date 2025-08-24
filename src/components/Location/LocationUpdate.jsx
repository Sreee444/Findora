
import React, { useEffect, useState } from "react";
import MapPicker from "./MapPicker";
const API_URL = import.meta.env.VITE_API_URL || 'https://gotcha-bn3z.onrender.com';

// This component expects an itemId prop to fetch/update location for a specific item
export default function LocationUpdate({ itemId }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchLocation() {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual endpoint if available
        const res = await fetch(`${API_URL}/api/items/${itemId}`);
        if (!res.ok) throw new Error('Failed to fetch item location');
        const data = await res.json();
  setLocation(data.location || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (itemId) fetchLocation();
  }, [itemId]);

  async function handleUpdateLocation(newLoc) {
    setUpdating(true);
    setError(null);
    try {
      // Replace with your actual endpoint if available
      const res = await fetch(`${API_URL}/api/items/${itemId}/location`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: newLoc }),
      });
      if (!res.ok) throw new Error("Failed to update location");
      setLocation(newLoc);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="location-update">
      <h2 className="text-lg font-bold mb-2">Item Location</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div>
          <div className="mb-2">
            Current Location: {location ? (
              <span className="font-semibold">{location.lat}, {location.lng}</span>
            ) : (
              <span className="italic text-gray-500">Not set</span>
            )}
          </div>
          <MapPicker
            onLocationSelect={loc => handleUpdateLocation(loc)}
            zoom={location ? 16 : 2}
            center={location ? [location.lat, location.lng] : [20, 0]}
          />
          {updating && <div className="text-blue-600 mt-2">Updating location...</div>}
        </div>
      )}
    </div>
  );
}
