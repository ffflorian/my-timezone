# ExactTime [![Build Status](https://travis-ci.org/ffflorian/exact-time.svg?branch=master)](http://travis-ci.org/moonpyk/node-ntp-client)

Calculate the exact time based on your location. Calculates the time difference in minutes from UTC (good explanation on [CS4FN](http://www.cs4fn.org/mobile/owntimezone.php)).

## Getting Started
Install the module with: `npm install exact-time`

```ts
import ExactTime from 'exact-time';

new ExactTime()
  .getTimeByAddress('Berlin, Germany')
  .then(data => {
    console.log('Berlin, Germany', data.toString()); // Sun Sep 03 2017 14:29:49 GMT+0200
    done();
  })
  .catch(err => done.fail(err));
```

## License
Copyright (c) 2017 Florian Keller,
licensed under the MIT license.
