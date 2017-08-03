const ExactTime = require('../dist/commonjs');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('ExactTime', () => {
  const et = new ExactTime();

  xit('returns an address from Google', done => {
    et.getLocationByName('Berlin, Germany')
      .then(data => done())
      .catch(err => done.fail(err));
  });

  xit('returns the time for a location', done => {
    et.getTimeByLocation(52.5303654, 13.3497483)
      .then(data => {console.log(data); done()})
      .catch(err => done.fail(err));
  });

  it('calculates the distance between two locations', () => {
    const result = et.calculateDistance(13.3497483, 52.5303654);
    const result2 = et.calculateDistance(52.5303654, 13.3497483);
    expect(result).toEqual(39.1806171);
    expect(result2).toEqual(39.1806171);
  });
});
