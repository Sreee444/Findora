import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/map.css';
import L from 'leaflet';

// Fix default marker icon issue in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ onLocationSelect, position, setPosition, setSelectedAddress }) {
  // Function to get address from coordinates
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
    } catch (error) {
      console.log('Could not fetch address:', error);
    }
    return '';
  };

  useMapEvents({
    async click(e) {
      setPosition(e.latlng);
      const addressText = await getAddressFromCoords(e.latlng.lat, e.latlng.lng);
      setAddress(addressText);
      setSelectedAddress(addressText);
      onLocationSelect({ 
        lat: e.latlng.lat, 
        lng: e.latlng.lng,
        address: addressText 
      });
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ onLocationSelect, zoom = 6, center = [28.6139, 77.2090] }) {
  const [position, setPosition] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const mapRef = useRef();

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          
          // Get address for current location
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
            const data = await response.json();
            const addressText = data && data.display_name ? data.display_name : '';
            
            onLocationSelect({ 
              lat: latitude, 
              lng: longitude,
              address: addressText 
            });
            setSelectedAddress(addressText);
          } catch (error) {
            console.log('Could not fetch address:', error);
            onLocationSelect({ lat: latitude, lng: longitude });
          }
          
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
    setSelectedAddress('');
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
        <LocationMarker onLocationSelect={onLocationSelect} position={position} setPosition={setPosition} setSelectedAddress={setSelectedAddress} />
      </MapContainer>
      <div className="flex flex-col items-center mt-3">
        <div className="text-xs text-blue-800 text-center font-semibold tracking-wide mb-2">
          Click on the map to select a location.
        </div>
        {position && (
          <div className="text-center mb-2">
            <div className="text-xs text-blue-800 font-semibold">Selected Location:</div>
            <div className="text-xs text-gray-600">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</div>
            {selectedAddress && (
              <div className="text-xs text-gray-700 mt-1 px-2 py-1 bg-blue-50 rounded border max-w-full break-words">
                {selectedAddress}
              </div>
            )}
          </div>
        )}
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