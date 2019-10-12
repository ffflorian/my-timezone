#!/usr/bin/env node

import program = require('commander');
import {MyTimezone} from './';

const {bin, description, version} = require('../package.json');

program
  .name(Object.keys(bin)[0])
  .version(version)
  .description(`${description}\n  Use a city name or longitude value as location.`)
  .option('-o, --offline', 'Work offline (default is false)')
  .option('-s, --server', 'Specify the NTP server (default is "pool.ntp.org")')
  .arguments('<location>')
  .parse(process.argv);

if (!program.args || !program.args.length) {
  console.error('Error: No location specified.');
  program.help();
} else {
  const timezone = new MyTimezone({
    ...(program.offline && {offline: program.offline}),
    ...(program.server && {ntpServer: program.server}),
  });

  const location = program.args[0];

  timezone
    .getLocation(location)
    .then(({longitude}) => timezone.getTimeByLocation(longitude))
    .then(time => console.log(time.toString()))
    .catch(error => {
      console.error(error.message);
      process.exit(1);
    });
}
