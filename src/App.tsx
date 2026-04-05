import {SubmitEvent, useState} from 'react';
import {Clock} from './components/Clock.tsx';
import {Map} from './components/Map.tsx';
import {useTheme} from './hooks/useTheme.ts';

function App() {
  const {theme, toggleTheme} = useTheme();
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const parsedLat = parseFloat(lat);
  const parsedLon = parseFloat(lon);
  const hasLon = !isNaN(parsedLon);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isNaN(parseFloat(lon))) {
      setError('Please enter a valid longitude.');
      return;
    }
    setError(null);
  };

  const handleCitySearch = async () => {
    if (!city.trim()) {
      return;
    }
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
      position => {
        const {latitude, longitude} = position.coords;
        setLat(String(latitude));
        setLon(String(longitude));
        setLocating(false);
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
          <div className="header-actions">
            <a
              aria-label="View on GitHub"
              className="github-link"
              href="https://github.com/ffflorian/my-timezone"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <button
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              className="theme-toggle"
              onClick={toggleTheme}
              type="button"
            >
              {theme === 'light' ? (
                <i aria-hidden="true" className="bi bi-moon-fill" />
              ) : (
                <i aria-hidden="true" className="bi bi-sun-fill" />
              )}
            </button>
          </div>
        </div>
        <p className="intro">
          Find your your <strong>true solar time</strong> &ndash; the astronomically correct local mean time at your
          exact geographic location.
          <br />
          True solar time is not political clock time (UTC offsets, DST). Every degree of longitude equals exactly 4
          minutes of offset from UTC. See{' '}
          <a
            href="https://web.archive.org/web/20250914163157/http://www.cs4fn.org/mobile/owntimezone.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            this article on CS4FN
          </a>{' '}
          for background.
        </p>
        <Map
          lat={isNaN(parsedLat) ? null : parsedLat}
          lon={isNaN(parsedLon) ? null : parsedLon}
          onLocationChange={(newLat, newLon) => {
            setLat(String(newLat));
            setLon(String(newLon));
          }}
        />
        <form onSubmit={handleSubmit}>
          <button
            className="detect-location"
            disabled={locating || geocoding}
            onClick={handleDetectLocation}
            type="button"
          >
            {locating ? (
              'Detecting\u2026'
            ) : (
              <>
                <i aria-hidden="true" className="bi bi-geo-alt-fill" /> Detect My Location
              </>
            )}
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
              disabled={geocoding || locating}
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
          <button disabled={locating || geocoding} type="submit">
            Get Solar Time
          </button>
        </form>
        {hasLon && <Clock longitude={parsedLon} />}
        {error && <p className="error">{error}</p>}
      </div>
    </main>
  );
}

export default App;
