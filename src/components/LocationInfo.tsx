const SECONDS_PER_DEGREE = 4 * 60; // 4 minutes per degree of longitude

function formatOffset(longitude: number): string {
  const totalSeconds = Math.round(longitude * SECONDS_PER_DEGREE);
  const sign = totalSeconds >= 0 ? '+' : '-';
  const abs = Math.abs(totalSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return `UTC${sign}${hh}:${mm}:${ss}`;
}

export interface LocationInfoProps {
  lat: number;
  lon: number;
  placeName?: null | string;
}

export function LocationInfo({lat, lon, placeName}: LocationInfoProps) {
  return (
    <div className="location-info">
      {placeName && <p className="location-name">{placeName}</p>}
      <p className="location-coords">
        {lat.toFixed(4)}, {lon.toFixed(4)}
      </p>
      <p className="location-offset">{formatOffset(lon)}</p>
    </div>
  );
}
