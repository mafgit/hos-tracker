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
import { FaBackward, FaTruck } from "react-icons/fa6";
import { swap } from "../utils/swap";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function LeafletMap() {
  const current = useMyStore((s) => s.current);
  const dropoff = useMyStore((s) => s.dropoff);
  const pickup = useMyStore((s) => s.pickup);
  const setFormStep = useMyStore((s) => s.setFormStep);
  const setSimulationData = useMyStore((s) => s.setSimulationData);
  const simulationData = useMyStore((s) => s.simulationData);

  if (!simulationData || !current || !pickup || !dropoff) {
    return null;
  }

  const polygonRoute = simulationData.routes[0].geometry.coordinates.map(swap);

  if (!polygonRoute.length) return null;

  function goBack() {
    setFormStep(0);
    setSimulationData(null);
  }

  return (
    <div className="overflow-hidden w-full absolute top-0 left-0 h-full">
      <button
        className="px-2 py-1 cursor-pointer z-50 absolute left-[20px] top-[10px] flex gap-2 items-center justify-center text-xl "
        onClick={goBack}
      >
        <FaBackward style={{ fontSize: 22 }} className="text-bg" />
      </button>

      <header className="bg-primary flex gap-2 items-center justify-center text-lg text-white px-4 py-1 z-50 absolute right-[20px] top-[10px] flex gap-2 items-center justify-center text-md rounded-md">
        <FaTruck />
        <h1 className="font-semibold">HOS Tracker</h1>
      </header>

      <MapContainer
        className="w-full h-full relative z-20"
        center={polygonRoute[0]}
        zoom={9}
        maxZoom={18}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom={18}
          maxZoom={18}
        />

        <Polyline positions={polygonRoute} />

        <Marker position={swap(simulationData.waypoints[0].location)}>
          <Popup>Current</Popup>
        </Marker>

        <Marker position={swap(simulationData.waypoints[1].location)}>
          <Popup>Pickup</Popup>
        </Marker>

        <Marker position={swap(simulationData.waypoints[2].location)}>
          <Popup>Dropoff</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
