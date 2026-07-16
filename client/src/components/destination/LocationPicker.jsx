import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MapPin, Loader } from "lucide-react";
import "leaflet/dist/leaflet.css";

const markerIconDefault = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER = [20, 0];

function RecenterOnChange({ position }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (position) map.setView(position, 11);
  }, [position, map]);
  return null;
}

function DraggableMarker({ position, onChange }) {
  const markerRef = useRef(null);

  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  if (!position) return null;

  return (
    <Marker
      draggable
      icon={markerIconDefault}
      position={position}
      eventHandlers={{
        dragend: () => {
          const marker = markerRef.current;
          if (marker) {
            const { lat, lng } = marker.getLatLng();
            onChange({ lat, lng });
          }
        },
      }}
      ref={markerRef}
    />
  );
}

// Geocodes name/city/state/country into map coordinates (OpenStreetMap Nominatim, no API key needed)
export default function LocationPicker({ name, city, state, country, coordinates, onChange }) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);
  const lastQueryRef = useRef(null);

  const position = coordinates?.lat != null && coordinates?.lng != null
    ? [coordinates.lat, coordinates.lng]
    : null;

  const geocode = async (query) => {
    setLocating(true);
    setError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      );
      const results = await res.json();
      if (!results.length) {
        setError("Couldn't find that place. Try adjusting name/city/country or drop a pin manually.");
        return;
      }
      onChange({ lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) });
    } catch {
      setError("Location lookup failed. Try again or drop a pin manually.");
    } finally {
      setLocating(false);
    }
  };

  const handleLocate = () => {
    const query = [name, city, state, country].filter(Boolean).join(", ");
    if (!query) {
      setError("Enter a name, city or country first.");
      return;
    }
    lastQueryRef.current = query;
    geocode(query);
  };

  // Auto-fetch once name, city and country are all filled in
  useEffect(() => {
    const query = [name, city, state, country].filter(Boolean).join(", ");
    if (!name || !city || !country || query === lastQueryRef.current) return;

    const timeout = setTimeout(() => {
      lastQueryRef.current = query;
      geocode(query);
    }, 700);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, city, state, country]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Location
        </label>
        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-600 disabled:opacity-60 transition-colors"
        >
          {locating ? (
            <Loader className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <MapPin className="w-3.5 h-3.5" />
          )}
          Locate on map
        </button>
      </div>

      <div className="relative isolate z-0 rounded-xl overflow-hidden border border-gray-200 h-56">
        <MapContainer
          center={position ?? DEFAULT_CENTER}
          zoom={position ? 11 : 2}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterOnChange position={position} />
          <DraggableMarker position={position} onChange={onChange} />
        </MapContainer>
      </div>

      <p className="mt-1.5 text-[11px] text-gray-400">
        The map locates automatically once name, city and country are filled in — click/drag on the map to fine-tune it.
      </p>

      {position && (
        <p className="mt-1 text-[11px] text-gray-500">
          {position[0].toFixed(5)}, {position[1].toFixed(5)}
        </p>
      )}

      {error && <p className="mt-1.5 text-red-500 text-xs">{error}</p>}
    </div>
  );
}
