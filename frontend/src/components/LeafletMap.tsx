import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// 2. Fix broken default marker icons in React build environments
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useMyStore } from "../store/useMyStore";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function LeafletMap() {
  // Center coordinates [Latitude, Longitude]
  const position = [23, 65.5];
  const data = useMyStore((s) => s.data);
  const current = useMyStore((s) => s.current);
  const dropoff = useMyStore((s) => s.dropoff);
  const pickup = useMyStore((s) => s.pickup);

  if (!data || !current || !pickup || !dropoff) {
    return null
  }

  const a = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
  return (
    <div className="rounded-xl overflow-hidden w-full">
      <MapContainer
        className="w-full h-[400px]"
        center={a[0]}
        zoom={9}
        maxZoom={18}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom={18}
          maxZoom={18}
        />

        <Polyline positions={a} />

        <Marker position={current}>
          <Popup>Current</Popup>
        </Marker>

        <Marker position={pickup}>
          <Popup>Pickup</Popup>
        </Marker>

        <Marker position={dropoff}>
          <Popup>Dropoff</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
