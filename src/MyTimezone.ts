import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {add as addDate, sub as subtractDate} from 'date-fns';
import {NTPClient} from 'ntpclient';

export interface OSMResult {
  boundingbox?: string[] | null;
  class: string;
  display_name: string;
  icon?: string | null;
  importance: number;
  lat: string;
  licence: string;
  lon: string;
  osm_id: number;
  osm_type: string;
  place_id: number;
  type: string;
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

const defaultConfig: Required<MyTimezoneConfig> = {
  ntpServer: 'pool.ntp.org',
  offline: false,
};

const nominatimAPI = 'https://nominatim.openstreetmap.org';

export class MyTimezone {
  private readonly config: Required<MyTimezoneConfig>;
  private readonly ntpClient: NTPClient;

  constructor(config?: MyTimezoneConfig) {
    this.config = {
      ...defaultConfig,
      ...config,
    };
    this.ntpClient = new NTPClient(this.config.ntpServer);
  }

  public async getLocation(location: string): Promise<Location> {
    try {
      const coordinates = this.parseCoordinates(location);
      return coordinates;
    } catch (error) {
      if ((error as Error).message.includes('No coordinates parsed')) {
        return this.getLocationByName(location);
      }
      throw error;
    }
  }

  public async getLocationByName(address: string, radius?: string): Promise<Location> {
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      params: {
        format: 'json',
        limit: 9,
        // eslint-disable-next-line id-length
        q: address,
      },
      url: `${nominatimAPI}/search`,
    };

    if (radius) {
      requestConfig.params.radius = radius;
    }

    let results: OSMResult[];

    try {
      const response = await axios.request<OSMResult[]>(requestConfig);
      results = response.data;
    } catch (error) {
      throw new Error(`Nominatim API Error: ${(error as AxiosError).message}`);
    }

    if (!results.length) {
      throw new Error('No place found.');
    }

    const {display_name, lon} = results[0];
    const parsedLongitude = parseFloat(lon);

    return {
      formattedAddress: display_name,
      longitude: parsedLongitude,
    };
  }

  public async getTimeByAddress(address: string): Promise<Date> {
    const {longitude} = await this.getLocationByName(address);
    return this.getTimeByLocation(longitude);
  }

  public async getTimeByLocation(longitude: number): Promise<Date> {
    const utcDate = await this.getUTCDate();
    const distance = this.calculateDistance(0, longitude);
    const FIFTEEN_SECONDS_IN_HOURS = 0.004167;
    const distanceSeconds = distance / FIFTEEN_SECONDS_IN_HOURS;

    const calculatedDate =
      longitude < 0 ? subtractDate(utcDate, {seconds: distanceSeconds}) : addDate(utcDate, {seconds: distanceSeconds});
    return calculatedDate;
  }

  public parseCoordinates(coordinates: string): Coordinates {
    const longitudeRegex = new RegExp('[-?\\W\\d\\.]+,(?<longitude>[-?\\W\\d\\.]+)');
    const parsedRegex = longitudeRegex.exec(coordinates);
    if (parsedRegex?.groups?.longitude) {
      try {
        const longitude = parseFloat(parsedRegex.groups.longitude);
        return {longitude};
      } catch (error) {
        throw new Error(`Invalid coordinates: "${coordinates}"`);
      }
    }
    throw new Error(`No coordinates parsed: "${coordinates}"`);
  }

  private calculateDistance(from: number, to: number): number {
    return Math.abs(from - to);
  }

  private async getUTCDate(): Promise<Date> {
    return this.config.offline ? new Date() : this.ntpClient.getNetworkTime();
  }
}
