# MyTimezone [![Build Status](https://api.travis-ci.org/ffflorian/my-timezone.svg?branch=master)](https://travis-ci.org/ffflorian/my-timezone/)  [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=ffflorian/my-timezone)](https://dependabot.com)

Get the exact time based on your location by calculating the time difference in seconds from UTC (good explanation on [CS4FN](http://www.cs4fn.org/mobile/owntimezone.php)).

## Getting Started
Add the module to your project with `yarn add my-timezone` or install it globally with `yarn global add my-timezone`.

## Usage

### TypeScript

```ts
import {MyTimezone} from 'my-timezone';

new MyTimezone()
  .getTimeByAddress('Berlin, Germany')
  .then(date => {
    console.log(date.toString()); // Sun Sep 03 2017 14:29:49 GMT+0200
    done();
  })
  .catch(error => console.error(error));
```

### CLI

```
Usage: my-timezone [options] <location>

Get the exact time based on your location.

Options:

  -V, --version  output the version number
  -o, --offline  Work offline (default is false)
  -s, --server   Specify the NTP server (default is "pool.ntp.org")
  -h, --help     output usage information
```
