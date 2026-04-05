import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {Map} from './Map';

let capturedClickHandler: ((e: {latlng: {lat: number; lng: number}}) => void) | undefined;

vi.mock('react-leaflet', () => ({
  MapContainer: ({children, center, zoom}: {children: React.ReactNode; center: [number, number]; zoom: number}) => (
    <div aria-label="map-container" data-center={center.join(',')} data-zoom={zoom}>
      {children}
    </div>
  ),
  Marker: ({position}: {position: [number, number]}) => <div aria-label="marker" data-position={position.join(',')} />,
  TileLayer: () => <div aria-label="tile-layer" />,
  useMap: () => ({setView: vi.fn()}),
  useMapEvents: (handlers: {click?: (e: {latlng: {lat: number; lng: number}}) => void}) => {
    capturedClickHandler = handlers.click;
    return null;
  },
}));

vi.mock('leaflet', () => ({
  default: {
    Icon: {
      Default: {
        mergeOptions: vi.fn(),
        prototype: {},
      },
    },
  },
}));

describe('Map', () => {
  afterEach(() => {
    cleanup();
    capturedClickHandler = undefined;
  });

  it('renders without coordinates', () => {
    render(<Map lat={null} lon={null} />);
    expect(screen.getByLabelText('map-container')).toBeInTheDocument();
  });

  it('renders with default center when no coordinates', () => {
    render(<Map lat={null} lon={null} />);
    const container = screen.getByLabelText('map-container');
    expect(container).toHaveAttribute('data-center', '54.526,15.255');
    expect(container).toHaveAttribute('data-zoom', '4');
  });

  it('renders with coordinates centered on location', () => {
    render(<Map lat={52.52} lon={13.4} />);
    const container = screen.getByLabelText('map-container');
    expect(container).toHaveAttribute('data-center', '52.52,13.4');
    expect(container).toHaveAttribute('data-zoom', '13');
  });

  it('renders a marker when coordinates are provided', () => {
    render(<Map lat={52.52} lon={13.4} />);
    expect(screen.getByLabelText('marker')).toBeInTheDocument();
    expect(screen.getByLabelText('marker')).toHaveAttribute('data-position', '52.52,13.4');
  });

  it('does not render a marker when no coordinates', () => {
    render(<Map lat={null} lon={null} />);
    expect(screen.queryByLabelText('marker')).not.toBeInTheDocument();
  });

  it('calls onLocationChange with lat/lon when map is clicked', () => {
    const onLocationChange = vi.fn();
    render(<Map lat={null} lon={null} onLocationChange={onLocationChange} />);
    capturedClickHandler?.({latlng: {lat: 48.85, lng: 2.35}});
    expect(onLocationChange).toHaveBeenCalledWith(48.85, 2.35);
  });

  it('does not register click handler when onLocationChange is not provided', () => {
    render(<Map lat={null} lon={null} />);
    expect(capturedClickHandler).toBeUndefined();
  });
});
