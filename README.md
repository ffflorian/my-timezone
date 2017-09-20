# MyTimezone [![Build Status](https://travis-ci.org/ffflorian/my-timezone.svg?branch=master)](https://travis-ci.org/ffflorian/my-timezone) [![Greenkeeper badge](https://badges.greenkeeper.io/ffflorian/my-timezone.svg)](https://greenkeeper.io/) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Get the exact time based on your location by calculating the time difference in minutes from UTC (good explanation on [CS4FN](http://www.cs4fn.org/mobile/owntimezone.php)).

## Getting Started
Add the module to your project with `yarn add my-timezone`.

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
