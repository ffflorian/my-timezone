import {FormEvent, useState} from 'react';
import {MyTimezone} from 'my-timezone';
import {Map} from './components/Map.tsx';
import {useTheme} from './hooks/useTheme.ts';

const timezone = new MyTimezone({offline: true});

function App() {
  const {theme, toggleTheme} = useTheme();
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [city, setCity] = useState('');
  const [solarTime, setSolarTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const calculateSolarTime = async (longitude: number) => {
    setError(null);
    setLoading(true);
    try {
      const date = await timezone.getDateByLongitude(longitude);
      setSolarTime(date.toISOString().slice(11, 19));
    } catch {
      setError('Could not calculate solar time.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const longitude = parseFloat(lon);
    if (isNaN(longitude)) {
      setError('Please enter a valid longitude.');
      return;
    }
    await calculateSolarTime(longitude);
  };

  const handleCitySearch = async () => {
    if (!city.trim()) return;
    setGeocoding(true);
    setError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
        {headers: {'User-Agent': 'my-timezone (https://github.com/ffflorian/my-timezone)'}}
      );
      const data = (await response.json()) as Array<{lat: string; lon: string}>;
      if (data.length === 0) {
        setError('Location not found. Please try a different name.');
        return;
      }
      const {lat: newLat, lon: newLon} = data[0];
      setLat(newLat);
      setLon(newLon);
      await calculateSolarTime(parseFloat(newLon));
    } catch {
      setError('Could not search for location.');
    } finally {
      setGeocoding(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        setLat(String(latitude));
        setLon(String(longitude));
        setLocating(false);
        await calculateSolarTime(longitude);
      },
      () => {
        setError('Could not detect your location.');
        setLocating(false);
      }
    );
  };

  return (
    <main>
      <div className="card">
        <div className="card-header">
          <h1>My Timezone</h1>
          <button
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <p className="intro">
          Find your true solar time. Enter your coordinates, and we will calculate the local mean time at your exact
          longitude - the time the sun actually says it is where you are.
        </p>
        <Map
          lat={isNaN(parseFloat(lat)) ? null : parseFloat(lat)}
          lon={isNaN(parseFloat(lon)) ? null : parseFloat(lon)}
          onLocationChange={async (newLat, newLon) => {
            setLat(String(newLat));
            setLon(String(newLon));
            await calculateSolarTime(newLon);
          }}
        />
        <form onSubmit={handleSubmit}>
          <button
            className="detect-location"
            disabled={locating || loading || geocoding}
            onClick={handleDetectLocation}
            type="button"
          >
            {locating ? 'Detecting\u2026' : '\uD83D\uDCCD Detect My Location'}
          </button>
          <div className="city-search">
            <label>
              <span>City</span>
              <input
                onChange={e => setCity(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void handleCitySearch();
                  }
                }}
                placeholder="e.g. Berlin"
                type="text"
                value={city}
              />
            </label>
            <button
              className="city-search-btn"
              disabled={geocoding || loading || locating}
              onClick={() => void handleCitySearch()}
              type="button"
            >
              {geocoding ? 'Searching\u2026' : 'Search'}
            </button>
          </div>
          <div className="inputs">
            <label>
              <span>Latitude</span>
              <input
                onChange={e => setLat(e.target.value)}
                placeholder="e.g. 52.52"
                step="any"
                type="number"
                value={lat}
              />
            </label>
            <label>
              <span>Longitude</span>
              <input
                onChange={e => setLon(e.target.value)}
                placeholder="e.g. 13.40"
                step="any"
                type="number"
                value={lon}
              />
            </label>
          </div>
          <button disabled={loading || locating || geocoding} type="submit">
            {loading ? 'Calculating\u2026' : 'Get Solar Time'}
          </button>
        </form>
        {solarTime && <p className="solar-time">{solarTime}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </main>
  );
}

export default App;
