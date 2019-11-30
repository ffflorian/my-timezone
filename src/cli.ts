#!/usr/bin/env node

import program = require('commander');
import {MyTimezone} from './MyTimezone';

const {bin, description, version} = require('../package.json');

program
  .name(Object.keys(bin)[0])
  .version(version)
  .description(`${description}\nUse a city name or longitude value as location.`)
  .option('-o, --offline', 'Work offline (default is false)')
  .option('-s, --server', 'Specify the NTP server (default is "pool.ntp.org")')
  .arguments('<location>')
  .parse(process.argv);

if (!program.args || !program.args.length) {
  console.error('Error: No location specified.');
  program.help();
}

const location = program.args[0];

const myTimezone = new MyTimezone({
  ...(program.offline ?? undefined),
  ...(program.server ?? undefined),
});

myTimezone
  .getLocation(location)
  .then(({longitude}) => myTimezone.getTimeByLocation(longitude))
  .then(time => console.log(`Time in "${location}": ${time.toString()}`))
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });
