import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import App from './App';

vi.mock('./components/Map.tsx', () => ({
  Map: ({lat, lon}: {lat: number | null; lon: number | null}) => <div aria-label="Map" data-lat={lat} data-lon={lon} />,
}));

describe('App', () => {
  afterEach(cleanup);

  it('renders heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', {name: /my timezone/i})).toBeInTheDocument();
  });

  it('renders map', () => {
    render(<App />);
    expect(screen.getByLabelText('Map')).toBeInTheDocument();
  });

  it('renders intro text', () => {
    render(<App />);
    expect(screen.getByText(/find your true solar time/i)).toBeInTheDocument();
  });

  it('renders coordinate inputs', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('e.g. 52.52')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 13.40')).toBeInTheDocument();
  });

  it('renders detect location button', () => {
    render(<App />);
    expect(screen.getByRole('button', {name: /detect my location/i})).toBeInTheDocument();
  });

  it('renders clock after form submission with valid longitude', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText('e.g. 13.40'), '13.40');
    await user.click(screen.getByRole('button', {name: /get solar time/i}));
    expect(await screen.findByLabelText('Clock')).toBeInTheDocument();
  });

  it('does not render clock before coordinates are set', () => {
    render(<App />);
    expect(screen.queryByLabelText('Clock')).not.toBeInTheDocument();
  });

  it('displays solar time in UTC, not adjusted for local timezone', async () => {
    // Solar time for longitude 0 equals UTC. Midnight UTC must display as 00:00:00.
    const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(new Date('2024-01-01T00:00:00Z').getTime());
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText('e.g. 13.40'), '0');
    await user.click(screen.getByRole('button', {name: /get solar time/i}));
    expect(await screen.findByText('00:00:00')).toBeInTheDocument();
    dateSpy.mockRestore();
  });

  it('displays error for invalid longitude', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', {name: /get solar time/i}));
    expect(await screen.findByText('Please enter a valid longitude.')).toBeInTheDocument();
  });

  it('renders city search input', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('e.g. Berlin')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /search/i})).toBeInTheDocument();
  });

  describe('city search', () => {
    beforeEach(() => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: vi.fn().mockResolvedValue([{display_name: 'Berlin, Germany', lat: '52.5170365', lon: '13.3888599'}]),
        })
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('fills coordinates and shows Clock on city search success', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.type(screen.getByPlaceholderText('e.g. Berlin'), 'Berlin');
      await user.click(screen.getByRole('button', {name: /search/i}));
      expect(await screen.findByLabelText('Clock')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g. 52.52')).toHaveValue(52.5170365);
      expect(screen.getByPlaceholderText('e.g. 13.40')).toHaveValue(13.3888599);
    });

    it('shows error when city is not found', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          json: vi.fn().mockResolvedValue([]),
        })
      );
      const user = userEvent.setup();
      render(<App />);
      await user.type(screen.getByPlaceholderText('e.g. Berlin'), 'UnknownCity12345');
      await user.click(screen.getByRole('button', {name: /search/i}));
      expect(await screen.findByText('Location not found. Please try a different name.')).toBeInTheDocument();
    });

    it('shows error when city search fetch fails', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));
      const user = userEvent.setup();
      render(<App />);
      await user.type(screen.getByPlaceholderText('e.g. Berlin'), 'Berlin');
      await user.click(screen.getByRole('button', {name: /search/i}));
      expect(await screen.findByText('Could not search for location.')).toBeInTheDocument();
    });
  });

  describe('detect location', () => {
    let mockGetCurrentPosition: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockGetCurrentPosition = vi.fn();
      Object.defineProperty(navigator, 'geolocation', {
        configurable: true,
        value: {getCurrentPosition: mockGetCurrentPosition},
      });
    });

    it('fills coordinates and shows Clock on success', async () => {
      mockGetCurrentPosition.mockImplementation((success: PositionCallback) => {
        success({coords: {latitude: 52.52, longitude: 13.4}} as GeolocationPosition);
      });
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByRole('button', {name: /detect my location/i}));
      expect(await screen.findByLabelText('Clock')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g. 52.52')).toHaveValue(52.52);
      expect(screen.getByPlaceholderText('e.g. 13.40')).toHaveValue(13.4);
    });

    it('shows error when geolocation fails', async () => {
      mockGetCurrentPosition.mockImplementation((_success: PositionCallback, error: PositionErrorCallback) => {
        error({code: 1, message: 'denied'} as GeolocationPositionError);
      });
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByRole('button', {name: /detect my location/i}));
      expect(await screen.findByText('Could not detect your location.')).toBeInTheDocument();
    });
  });
});
