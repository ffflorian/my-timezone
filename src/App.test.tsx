import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import App from './App';

vi.mock('my-timezone', () => ({
  MyTimezone: function () {
    return {
      getDateByLongitude: vi.fn().mockResolvedValue(new Date('2024-01-01T12:34:56Z')),
    };
  },
}));

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

  it('displays solar time after form submission', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText('e.g. 13.40'), '13.40');
    await user.click(screen.getByRole('button', {name: /get solar time/i}));
    expect(await screen.findByText('12:34:56')).toBeInTheDocument();
  });

  it('displays error for invalid longitude', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', {name: /get solar time/i}));
    expect(await screen.findByText('Please enter a valid longitude.')).toBeInTheDocument();
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

    it('fills coordinates and shows solar time on success', async () => {
      mockGetCurrentPosition.mockImplementation((success: PositionCallback) => {
        success({coords: {latitude: 52.52, longitude: 13.4}} as GeolocationPosition);
      });
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByRole('button', {name: /detect my location/i}));
      expect(await screen.findByText('12:34:56')).toBeInTheDocument();
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
