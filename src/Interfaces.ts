export interface GoogleMapsLocation {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface GoogleMapsResult {
  error_message: string;
  results: GoogleMapsLocation[];
  status: string;
}

export interface MyTimezoneConfig {
  ntpServer?: string;
  offline?: boolean;
}

export interface Coordinates {
  longitude: number;
}

export interface Location extends Coordinates {
  formattedAddress?: string;
}
