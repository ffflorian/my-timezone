import { NTPClient } from 'ntpclient';
import * as moment from 'moment';
import axios from 'axios';
import {
  Coordinates,
  GoogleMapsResult,
  Location,
  MyTimezoneConfig
} from './Interfaces';

const defaultConfig: Required<MyTimezoneConfig> = {
  ntpServer: 'pool.ntp.org',
  offline: false
};

export class MyTimezone {
  private ntpClient: NTPClient;
  private config: Required<MyTimezoneConfig>;

  constructor(config?: MyTimezoneConfig) {
    this.config = {
      ...defaultConfig,
      ...config
    };
    this.ntpClient = new NTPClient(this.config.ntpServer);
  }

  public async getLocationByName(
    address: string,
    radius = ''
  ): Promise<Location> {
    const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json';
    address = encodeURIComponent(address);
    const completeURL = `${baseURL}?address=${address}${radius &&
      `&radius=${radius}`}`;

    let data: GoogleMapsResult | undefined;

    try {
      const response = await axios.get<GoogleMapsResult>(completeURL);
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

    const { results = [] } = data;

    if (!results.length) {
      throw new Error('No place found.');
    }

    const {
      geometry: { location },
      formatted_address
    } = results[0];

    return {
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress: formatted_address
    };
  }

  public parseCoordinates(coordinates: string): Coordinates {
    const re = new RegExp(
      `(-?[0-9]{1,2}(?:.|,)[0-9]{1,})(.)(-?[0-9]{1,2}(?:.|,)[0-9]{1,})`
    );
    const data = re.exec(coordinates);
    if (data && data.length > 0) {
      try {
        const latitude = parseFloat(data[1]);
        const longitude = parseFloat(data[3]);
        return { latitude, longitude };
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

  public getLocation(location: string): Promise<Location> {
    try {
      return Promise.resolve(this.parseCoordinates(location));
    } catch (error) {
      return this.getLocationByName(location);
    }
  }

  public async getTimeByLocation(
    latitude: number,
    longitude: number
  ): Promise<moment.Moment> {
    const date = await this.getUTCDate();
    const momentDate = moment(date);
    const distance = this.calculateDistance(0, longitude);
    const distanceSeconds = distance / 0.004167;

    return longitude < 0
      ? momentDate.subtract(distanceSeconds, 's')
      : momentDate.add(distanceSeconds, 's');
  }

  public async getTimeByAddress(address: string): Promise<moment.Moment> {
    const { latitude, longitude } = await this.getLocationByName(address);
    return this.getTimeByLocation(latitude, longitude);
  }
}
