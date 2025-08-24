
import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../styles/map.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapView({ lat, lng }) {
  if (typeof lat !== "number" || typeof lng !== "number") {
    return <div className="italic text-gray-400">Invalid location</div>;
  }
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={16}
      style={{ width: "100%", height: 240, borderRadius: "1rem", boxShadow: "0 6px 24px #0002" }}
      className="overflow-hidden"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );
}
