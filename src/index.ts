import NTPClient from 'ntpclient';
import * as https from 'https';
import DmsCoordinates from 'dms-conversion';
import * as moment from 'moment';

const defaultConfig = {
  ntpServer: 'pool.ntp.org',
  offline: false
};

export default class MyTimezone {
  private config = defaultConfig;
  private time: NTPClient;

  constructor(config?) {
    if (config) {
      Object.assign(this.config, config);
    }
    this.time = new NTPClient(this.config.ntpServer);
  }

  public getLocationByName(
    address: string,
    radius: string = ''
  ): Promise<{
    latitude: number;
    longitude: number;
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

  private calculateDistance(from: number, to: number): number {
    return Math.abs(from - to);
  }

  private getNetworkTime(): Promise<Date> {
    if (this.config.offline) {
      return Promise.resolve(new Date());
    } else {
      return this.time.getNetworkTime();
    }
  }

  public getTimeByLocation(
    latitude: number,
    longitude: number
  ): Promise<moment.MomentInput> {
    return this.getNetworkTime().then(date => {
      //console.log(`date for ${latitude}, ${longitude}:`, date);
      let momentDate = moment(date);
      let distance = this.calculateDistance(0, longitude);
      //console.log('distance in degrees', distance);
      let distanceMinutes = distance * 4;
      //console.log('distance in minutes', distanceMinutes);
      return longitude < 0
        ? momentDate.subtract(distance, 'm')
        : momentDate.add(distance, 'm');
    });
  }

  public getTimeByAddress(address: string): Promise<moment.MomentInput> {
    return this.getLocationByName(address).then(({ latitude, longitude }) =>
      this.getTimeByLocation(latitude, longitude)
    );
  }
}
