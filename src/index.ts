import NTPClient from 'ntpclient';
import * as https from 'https';
import * as moment from 'moment';

interface GoogleMapsResult {
  error_message: string;
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    formatted_address: string;
  }>;
  status: string;
}

interface MyTimezoneConfig {
  ntpServer?: string;
  offline?: boolean;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

const defaultConfig: MyTimezoneConfig = {
  ntpServer: 'pool.ntp.org',
  offline: false
};

export class MyTimezone {
  private ntpClient: NTPClient;
  private config: MyTimezoneConfig;

  constructor(config?: MyTimezoneConfig) {
    this.config = {
      ...defaultConfig,
      ...config
    };
    this.ntpClient = new NTPClient(this.config.ntpServer);
  }

  public getLocationByName(
    address: string,
    radius = ''
  ): Promise<
    Coordinates & {
      formatted_address: string;
    }
  > {
    return new Promise((resolve, reject) => {
      const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json';

      address = encodeURIComponent(address);

      https.get(`${baseURL}?address=${address}&radius=${radius}`, response => {
        let body = '';

        response.on('data', chunk => (body += chunk));

        response.on('end', () => {
          const data: GoogleMapsResult = JSON.parse(body);
          if (data.status === 'OK') {
            const { results = [] } = data;
            if (results.length > 0) {
              const {
                geometry: { location },
                formatted_address
              } = results[0];

              resolve({
                latitude: location.lat,
                longitude: location.lng,
                formatted_address
              });
            } else {
              reject('No place found');
            }
          } else {
            reject(`Google Maps API Error: ${data.error_message}`);
          }
        });

        response.on('error', err => reject(err));
      });
    });
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

  public async getLocation(location: string): Promise<Coordinates> {
    try {
      return this.parseCoordinates(location);
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
