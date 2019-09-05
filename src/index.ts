import axios, {AxiosRequestConfig} from 'axios';
import * as moment from 'moment';
import {NTPClient} from 'ntpclient';
import {Coordinates, GoogleMapsResult, Location, MyTimezoneConfig} from './Interfaces';

const defaultConfig: Required<MyTimezoneConfig> = {
  ntpServer: 'pool.ntp.org',
  offline: false,
};

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
      const coordinates = await this.parseCoordinates(location);
      return coordinates;
    } catch (error) {
      return this.getLocationByName(location);
    }
  }

  public async getLocationByName(address: string, radius?: string): Promise<Location> {
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      params: {
        address,
      },
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
    };

    if (radius) {
      requestConfig.params.radius = radius;
    }

    let data: GoogleMapsResult;

    try {
      const response = await axios.request<GoogleMapsResult>(requestConfig);
      data = response.data;
    } catch (error) {
      throw new Error(`Google Maps API Error: ${error.message}`);
    }

    if (data.status !== 'OK') {
      if (data.error_message) {
        throw new Error(`Google Maps API Error: ${data.error_message}`);
      }
      throw new Error('Unknown Google Maps API Error.');
    }

    const {results = []} = data;

    if (!results.length) {
      throw new Error('No place found.');
    }

    const {
      geometry: {location},
      formatted_address,
    } = results[0];

    return {
      formattedAddress: formatted_address,
      longitude: location.lng,
    };
  }

  public async getTimeByAddress(address: string): Promise<moment.Moment> {
    const {longitude} = await this.getLocationByName(address);
    return this.getTimeByLocation(longitude);
  }

  public async getTimeByLocation(longitude: number): Promise<moment.Moment> {
    const date = await this.getUTCDate();
    const momentDate = moment(date);
    const distance = this.calculateDistance(0, longitude);
    const distanceSeconds = distance / 0.004167;

    return longitude < 0 ? momentDate.subtract(distanceSeconds, 'seconds') : momentDate.add(distanceSeconds, 'seconds');
  }

  public parseCoordinates(coordinates: string): Coordinates {
    const re = new RegExp(`(-?[0-9]{1,2}(?:.|,)[0-9]{1,})`);
    const data = re.exec(coordinates);
    if (data && data.length > 0) {
      try {
        const longitude = parseFloat(data[1]);
        return {longitude};
      } catch (error) {
        throw new Error(`Invalid coordinates: "${coordinates}"`);
      }
    }
    throw new Error(`Invalid coordinates: "${coordinates}"`);
  }

  private calculateDistance(from: number, to: number): number {
    return Math.abs(from - to);
  }

  private async getUTCDate(): Promise<Date> {
    return this.config.offline ? new Date() : this.ntpClient.getNetworkTime();
  }
}
