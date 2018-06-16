//@ts-check

const { default: MyTimezone } = require('../');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000; // 10 seconds

describe('MyTimezone', () => {
  const tz = new MyTimezone();

  xit('returns an address from Google', async done => {
    const location = 'Berlin, Germany';

    try {
      const { formatted_address } = await tz.getLocationByName(location);

      expect(formatted_address).toEqual(location);
      done();
    } catch (error) {
      done.fail(error);
    }
  });

  it('returns the correct time for a location', async done => {
    const berlinTime = await tz.getTimeByLocation(52.51848, 13.40803);
    //console.log('Timezone at 52.51848, 13.40803:', berlinTime.toString());

    const frankfurtTime = await tz.getTimeByLocation(50.11796, 8.67931);
    //console.log('Timezone at 50.11796, 8.67931:', frankfurtTime.toString());

    try {
      expect(frankfurtTime.isBefore(berlinTime)).toBe(true);
      done();
    } catch (error) {
      done.fail(error);
    }
  });

  xit('returns the time for an address', async done => {
    try {
      const data = await tz.getTimeByAddress('Berlin, Germany');
      console.log('Timezone Berlin:', data.toString());
    } catch (error) {
      done.fail(error);
    }

    try {
      const data = await tz.getTimeByAddress('Minsk, Belarus');
      console.log('Timezone Minsk:', data.toString());
      done();
    } catch (error) {
      done.fail(error);
    }
  });

  it('calculates the distance between two locations', () => {
    const result1 = tz.calculateDistance(13.3497483, 52.5303654);
    const result2 = tz.calculateDistance(52.5303654, 13.3497483);
    expect(result1).toEqual(39.1806171);
    expect(result2).toEqual(39.1806171);
  });
});
