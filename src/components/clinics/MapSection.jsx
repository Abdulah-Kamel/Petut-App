import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [48, 48],
});

const MapSection = ({ userLocation }) => {
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [30.0444, 31.2357];
  return (
    <div
      className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-gray-200"
      style={{ height: 350, minHeight: 320 }}
    >
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <Marker position={center} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="absolute left-6 bottom-6 flex gap-4 z-[1000]">
        <button
          className="w-14 h-14 bg-orange-400 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-500 transition text-3xl relative group"
          title="After hours care"
        >
          <span className="material-icons">nightlight_round</span>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition">
            After hours care
          </span>
        </button>
        <button
          className="w-14 h-14 border-2 border-orange-400 text-orange-500 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-50 transition text-3xl relative group"
          title="Emergency Services"
        >
          <span className="material-icons">medical_services</span>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition">
            Emergency Services
          </span>
        </button>
      </div>
    </div>
  );
};

export default MapSection;
