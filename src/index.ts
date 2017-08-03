import * as NTP from 'ntp.js';
import * as https from 'https';
import DmsCoordinates from "dms-conversion";

const defaultConfig = {
  ntpServer: 'pool.ntp.org'
};

export = class ExactTime {
  private config = defaultConfig;
  private time: any;

  constructor(config?) {
    if (config) {
      Object.assign(this.config, config);
    }
    this.time = new NTP(this.config.ntpServer);
  }

  public getLocationByName(
    address: string,
    radius: string = ''
  ): Promise<{
    latitude: string;
    longitude: string;
    formatted_address: string;
  }> {
    return new Promise((resolve, reject) => {
      const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json';
      let latitude = '';
      let longitude = '';
      let formatted_address = '';

      address = encodeURIComponent(address);

      https.get(`${baseURL}?address=${address}&radius=${radius}`, response => {
        let body = '';

        response.on('data', chunk => (body += chunk));

        response.on('end', () => {
          const data = JSON.parse(body);
          const { results = [] } = data;
          if (results.length > 0) {
            const location = results[0].geometry.location;
            const formatted_address = results[0].formatted_address;

            resolve({
              latitude: location.lat,
              longitude: location.lng,
              formatted_address
            });
          } else {
            reject('No place found');
          }
        });

        response.on('error', err => reject(err));
      });
    });
  }

  private calculateDistance(fromLatitude: number, toLatitude: number): number {
    return Math.abs(fromLatitude - toLatitude);
  }

  public getTimeByLocation(latitude: number, longitude: number): Promise<Date> {
    return this.time.getNetworkTime();
  }
};
