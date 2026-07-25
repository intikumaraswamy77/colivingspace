import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically fit bounds when properties change or search center changes
const MapBounds = ({ properties, centerLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (centerLocation) {
      map.flyTo(centerLocation, 12, { duration: 1.5 });
    } else if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.lat || 17.4486, p.lng || 78.3908]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [properties, centerLocation, map]);

  return null;
};

const MapComponent = ({ properties, centerLocation }) => {
  const navigate = useNavigate();

  // If no properties and no search center, default to Hyderabad coordinates
  const center = centerLocation || (properties.length > 0 
    ? [properties[0].lat || 17.4486, properties[0].lng || 78.3908]
    : [17.4486, 78.3908]);

  return (
    <div className="h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-0 relative">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapBounds properties={properties} centerLocation={centerLocation} />
        
        {properties.map(property => {
          // Fallback to random nearby coords if no real lat/lng in DB yet
          // In a real app, these would come from geocoding the address
          const idSum = property._id ? property._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
          const latOffset = (idSum % 100) / 10000;
          const lngOffset = ((idSum * 2) % 100) / 10000;
          
          const lat = property.lat || (17.4486 + latOffset);
          const lng = property.lng || (78.3908 + lngOffset);

          return (
            <Marker key={property._id} position={[lat, lng]}>
              <Popup className="dark-popup">
                <div className="w-48 bg-slate-900 rounded-xl overflow-hidden text-white">
                  <img 
                    src={property.images?.[0] || 'https://via.placeholder.com/150'} 
                    alt={property.title} 
                    className="w-full h-24 object-cover mb-2 rounded-lg"
                  />
                  <h3 className="font-bold text-white leading-tight mb-1">{property.title}</h3>
                  <p className="font-extrabold text-indigo-400 mb-2">₹{property.rent}/mo</p>
                  <button 
                    onClick={() => navigate(`/property/${property._id}`)}
                    className="w-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
