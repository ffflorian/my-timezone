# MyTimezone [![Build Status](https://travis-ci.org/ffflorian/my-timezone.svg?branch=master)](https://travis-ci.org/ffflorian/my-timezone)

[![Greenkeeper badge](https://badges.greenkeeper.io/ffflorian/my-timezone.svg)](https://greenkeeper.io/)

Calculate the exact time based on your location. Calculates the time difference in minutes from UTC (good explanation on [CS4FN](http://www.cs4fn.org/mobile/owntimezone.php)).

## Getting Started
Install the module with: `npm install my-timezone`

```ts
import MyTimezone from 'my-timezone';

new MyTimezone()
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
