#!/usr/bin/env node

import MyTimezone from './';
import program = require('commander');

const { description, name, version } = require('../package.json');

program
  .name(name)
  .version(version)
  .description(description)
  .option(
    '-l, --location [City name or Latitude:Longitude]',
    'Specify your location as name or in the format Latiude,Longitude'
  )
  .option('-o, --offline', 'Work offline (default is "false")')
  .option('-s, --server', 'Specify the NTP server (default is "pool.ntp.org")')
  .parse(process.argv);

const timezone = new MyTimezone({
  offline: !!program.offline,
  ntpServer: program.server
});

if (!program.location) {
  console.error('No location specified.');
  program.help();
} else {
  timezone
    .getLocation(program.location)
    .then(({ latitude, longitude }) =>
      timezone.getTimeByLocation(latitude, longitude)
    )
    .then(time => console.log('time', time));
}
