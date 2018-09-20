import {MyTimezone} from '../src';
import * as nock from 'nock';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000; // 10 seconds

describe('MyTimezone', () => {
  let tz: MyTimezone;

  beforeEach(() => {
    tz = new MyTimezone({
      offline: true
    });

    let formatted_address: string;
    nock('https://maps.googleapis.com')
      .get('/maps/api/geocode/json')
      .query((obj: {address: string}) => {
        formatted_address = obj.address;
        return true;
      })
      .reply(() => [
        200,
        {
          results: [
            {
              geometry: {
                location: {
                  lat: 1.2345,
                  lng: 2.3456
                }
              },
              formatted_address
            }
          ],
          status: 'OK'
        }
      ]);
  });

  it('returns an address from Google', async () => {
    const location = 'Berlin, Germany';

    const { formattedAddress } = await tz.getLocationByName(location);

    expect(formattedAddress).toBe(location);
  });

  it('returns the correct time for a location', async () => {
    const berlinTime = await tz.getTimeByLocation(13.40803);
    //console.log('Timezone at 52.51848, 13.40803:', berlinTime.toString());

    const frankfurtTime = await tz.getTimeByLocation(8.67931);
    //console.log('Timezone at 50.11796, 8.67931:', frankfurtTime.toString());

    expect(frankfurtTime.isBefore(berlinTime)).toBe(true);
  });

  it('returns the time for an address', async () => {
    const dataBerlin = await tz.getTimeByAddress('Berlin, Germany');
    expect(dataBerlin).toBeDefined();
    //console.log('Timezone Berlin:', dataBerlin.toString());

    const dataMinsk = await tz.getTimeByAddress('Minsk, Belarus');
    expect(dataMinsk).toBeDefined();
    //console.log('Timezone Minsk:', dataMinsk.toString());
  });

  it('calculates the distance between two locations', () => {
    const result1 = tz['calculateDistance'](13.3497483, 52.5303654);
    const result2 = tz['calculateDistance'](52.5303654, 13.3497483);
    expect(result1).toEqual(39.1806171);
    expect(result2).toEqual(39.1806171);
  });
});
