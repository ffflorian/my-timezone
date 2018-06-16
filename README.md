# MyTimezone [![Dependabot badge](https://img.shields.io/badge/Dependabot-active-brightgreen.svg)](https://dependabot.com/)

Get the exact time based on your location by calculating the time difference in seconds from UTC (good explanation on [CS4FN](http://www.cs4fn.org/mobile/owntimezone.php)).

## Getting Started
Add the module to your project with `yarn add my-timezone` or install it globally with `yarn add -g my-timezone`.

## Usage

### TypeScript

```ts
import MyTimezone from 'my-timezone';

new MyTimezone()
  .getTimeByAddress('Berlin, Germany')
  .then(data => {
    console.log('Berlin, Germany', data.toString()); // Sun Sep 03 2017 14:29:49 GMT+0200
    done();
  })
  .catch(error => console.error(error));
```

### CLI

```
my-timezone -l "Berlin, Germany"
```

## License
Copyright (c) 2018 Florian Keller,
licensed under the MIT license.
