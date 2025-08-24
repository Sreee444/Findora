import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const API_URL = import.meta.env.VITE_API_URL || 'https://gotcha-bn3z.onrender.com';

// Create custom icons for lost and found items
const lostIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: 'lost-marker'
});

const foundIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: 'found-marker'
});

export default function LocationPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/items`);
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      
      // Filter items that have location data
      const itemsWithLocation = data.filter(item => 
        item.location && 
        typeof item.location.lat === 'number' && 
        typeof item.location.lng === 'number'
      );
      
      setItems(itemsWithLocation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-lg">Loading items...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-red-600">Error: {error}</div>
    </div>
  );

  // Default center (you can adjust this based on your preference)
  const defaultCenter = items.length > 0 
    ? [items[0].location.lat, items[0].location.lng]
    : [40.7128, -74.0060]; // Default to New York

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          📍 Item Locations
        </h1>
        
        {/* Filter buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Items ({items.length})
          </button>
          <button
            onClick={() => setFilterType('lost')}
            className={`px-4 py-2 rounded-lg transition ${
              filterType === 'lost'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Lost Items ({items.filter(i => i.type === 'lost').length})
          </button>
          <button
            onClick={() => setFilterType('found')}
            className={`px-4 py-2 rounded-lg transition ${
              filterType === 'found'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Found Items ({items.filter(i => i.type === 'found').length})
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No items with location data found.
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredItems.length} items with location data
            </div>
            
            {/* Map */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <MapContainer
                center={defaultCenter}
                zoom={10}
                style={{ width: '100%', height: '500px' }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                {filteredItems.map(item => (
                  <Marker
                    key={item._id}
                    position={[item.location.lat, item.location.lng]}
                    icon={item.type === 'lost' ? lostIcon : foundIcon}
                  >
                    <Popup>
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="text-xs space-y-1">
                          <div className={`inline-block px-2 py-1 rounded text-white ${
                            item.type === 'lost' ? 'bg-blue-600' : 'bg-green-600'
                          }`}>
                            {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
                          </div>
                          <div>📅 {new Date(item.date).toLocaleDateString()}</div>
                          <div>👤 {item.createdBy?.username || 'Unknown'}</div>
                          {item.location.address && (
                            <div className="text-gray-500">📍 {item.location.address}</div>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
