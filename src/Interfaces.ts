export interface GoogleMapsLocation {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_address: string;
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
