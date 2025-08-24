import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ onLocationSelect, position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ onLocationSelect, zoom = 2, center = [20, 0] }) {
  const [position, setPosition] = useState(null);
  const mapRef = useRef();

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          onLocationSelect({ lat: latitude, lng: longitude });
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 16);
          }
        },
        (err) => {
          alert('Unable to get current location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleDeleteLocation = () => {
    setPosition(null);
    onLocationSelect(null);
  };

  React.useEffect(() => {
    // If parent provides center/zoom (e.g. when location is selected), update map view
    if (mapRef.current && center && zoom) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div className="rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-100 to-white p-5 shadow-xl">
      <button
        type="button"
        onClick={handleCurrentLocation}
        className="mb-3 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full hover:from-blue-700 hover:to-cyan-600 text-sm font-bold shadow-lg transition-all duration-200 border-2 border-blue-400 hover:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        📍 Use My Current Location
      </button>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: 320, borderRadius: '1rem', boxShadow: '0 6px 24px #0002' }}
        whenCreated={mapInstance => { mapRef.current = mapInstance; }}
        className="overflow-hidden"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <LocationMarker onLocationSelect={onLocationSelect} position={position} setPosition={setPosition} />
      </MapContainer>
      <div className="flex flex-col items-center mt-3">
        <div className="text-xs text-blue-800 text-center font-semibold tracking-wide mb-2">
          Click on the map to select a location.
        </div>
        {position && (
          <button
            type="button"
            onClick={handleDeleteLocation}
            className="px-4 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs font-semibold shadow border-2 border-red-300 hover:border-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Delete Location
          </button>
        )}
      </div>
    </div>
  );
}