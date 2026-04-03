import {format} from 'date-fns';
import {FormEvent, useState} from 'react';
import {MyTimezone} from 'my-timezone';

const timezone = new MyTimezone({offline: true});

function App() {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [solarTime, setSolarTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const longitude = parseFloat(lon);
    if (isNaN(longitude)) {
      setError('Please enter a valid longitude.');
      return;
    }
    setLoading(true);
    try {
      const date = await timezone.getDateByLongitude(longitude);
      setSolarTime(format(date, 'HH:mm:ss'));
    } catch {
      setError('Could not calculate solar time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="card">
        <h1>my-timezone</h1>
        <p className="intro">
          Find your true solar time. Enter your coordinates, and we will calculate the local mean time at your exact
          longitude - the time the sun actually says it is where you are.
        </p>
        <div aria-label="Map placeholder" className="map-placeholder" />
        <form onSubmit={handleSubmit}>
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
          <button disabled={loading} type="submit">
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
