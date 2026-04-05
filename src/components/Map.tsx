import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {useEffect} from 'react';
import {MapContainer, Marker, TileLayer, useMap, useMapEvents} from 'react-leaflet';

// Fix Leaflet default icon path issue with Vite/bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapUpdaterProps {
  lat: number;
  lon: number;
}

function MapUpdater({lat, lon}: MapUpdaterProps) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], LOCATION_ZOOM);
  }, [lat, lon, map]);
  return null;
}

interface MapClickHandlerProps {
  onLocationChange: (lat: number, lon: number) => void;
}

function MapClickHandler({onLocationChange}: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const EUROPE_CENTER: [number, number] = [54.526, 15.255];
const EUROPE_ZOOM = 4;
const LOCATION_ZOOM = 13;

export interface MapProps {
  lat: number | null;
  lon: number | null;
  onLocationChange?: (lat: number, lon: number) => void;
}

export function Map({lat, lon, onLocationChange}: MapProps) {
  const hasCoords = lat !== null && lon !== null;
  const center: [number, number] = hasCoords ? [lat, lon] : EUROPE_CENTER;
  const zoom = hasCoords ? LOCATION_ZOOM : EUROPE_ZOOM;

  return (
    <MapContainer center={center} className="map-container" zoom={zoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {onLocationChange && <MapClickHandler onLocationChange={onLocationChange} />}
      {hasCoords && (
        <>
          <Marker position={[lat, lon]} />
          <MapUpdater lat={lat} lon={lon} />
        </>
      )}
    </MapContainer>
  );
}
