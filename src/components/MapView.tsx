import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapViewProps {
  latitude?: number;
  longitude?: number;
  height?: string;
  label?: string;
  pins?: number;
  onPin?: (index: number) => void;
}

export function MapView({
  latitude = 6.5244,
  longitude = 3.3792,
  height = "h-72",
  label,
  pins = 1,
  onPin,
}: MapViewProps) {
  const center: [number, number] = [latitude, longitude];
  const markers: [number, number][] = Array.from({ length: pins }, (_, i) => [
    latitude + (i % 3) * 0.004,
    longitude + Math.floor(i / 3) * 0.004,
  ]);

  return (
    <div
      className={`overflow-hidden w-full rounded-2xl border border-border ${height}`}
    >
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((position, index) => (
          <Marker
            key={`${position[0]}-${position[1]}`}
            position={position}
            icon={markerIcon}
            eventHandlers={{ click: () => onPin?.(index) }}
          >
            <Popup>{label ?? "Tailor Location"}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
