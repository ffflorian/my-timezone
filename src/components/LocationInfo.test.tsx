import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';
import {LocationInfo} from './LocationInfo';

describe('LocationInfo', () => {
  afterEach(cleanup);

  it('renders coordinates formatted to 4 decimal places', () => {
    render(<LocationInfo lat={52.52} lon={13.4} />);
    expect(screen.getByText('52.5200, 13.4000')).toBeInTheDocument();
  });

  it('renders solar time offset from UTC for east longitude', () => {
    // 13.4° east: 13.4 * 4 * 60 = 3216 seconds = 53m 36s
    render(<LocationInfo lat={52.52} lon={13.4} />);
    expect(screen.getByText('UTC+00:53:36')).toBeInTheDocument();
  });

  it('renders solar time offset from UTC for west longitude', () => {
    // -74° west: 74 * 4 * 60 = 17760 seconds = 4h 56m 0s
    render(<LocationInfo lat={40.71} lon={-74} />);
    expect(screen.getByText('UTC-04:56:00')).toBeInTheDocument();
  });

  it('renders UTC+00:00:00 for zero longitude', () => {
    render(<LocationInfo lat={51.48} lon={0} />);
    expect(screen.getByText('UTC+00:00:00')).toBeInTheDocument();
  });

  it('renders place name when provided', () => {
    render(<LocationInfo lat={52.52} lon={13.4} placeName="Berlin, Germany" />);
    expect(screen.getByText('Berlin, Germany')).toBeInTheDocument();
  });

  it('does not render place name element when not provided', () => {
    render(<LocationInfo lat={52.52} lon={13.4} />);
    expect(screen.queryByText(/germany/i)).not.toBeInTheDocument();
  });

  it('applies location-info class to wrapper', () => {
    const {container} = render(<LocationInfo lat={52.52} lon={13.4} />);
    expect(container.querySelector('.location-info')).toBeInTheDocument();
  });

  it('applies location-name class to place name', () => {
    render(<LocationInfo lat={52.52} lon={13.4} placeName="Berlin" />);
    expect(screen.getByText('Berlin')).toHaveClass('location-name');
  });

  it('applies location-coords class to coordinates', () => {
    render(<LocationInfo lat={52.52} lon={13.4} />);
    expect(screen.getByText('52.5200, 13.4000')).toHaveClass('location-coords');
  });

  it('applies location-offset class to offset', () => {
    render(<LocationInfo lat={52.52} lon={13.4} />);
    expect(screen.getByText('UTC+00:53:36')).toHaveClass('location-offset');
  });
});
