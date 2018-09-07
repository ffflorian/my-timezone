#!/usr/bin/env node

import { MyTimezone } from './';
import program = require('commander');

const { description, name, version } = require('../package.json');

program
  .name(name)
  .version(version)
  .description(description)
  .option('-o, --offline', 'Work offline (default is false)')
  .option('-s, --server', 'Specify the NTP server (default is "pool.ntp.org")')
  .arguments('<location>')
  .parse(process.argv);

if (!program.args || !program.args.length) {
  console.error('Error: No location specified.');
  program.help();
} else {
  const timezone = new MyTimezone({
    ...(program.offline && { offline: program.offline }),
    ...(program.server && { ntpServer: program.server })
  });

  const location = program.args[0];

  timezone
    .getLocation(location)
    .then(({ latitude, longitude }) =>
      timezone.getTimeByLocation(latitude, longitude)
    )
    .then(time => console.log(time.toString()))
    .catch(error => {
      console.error(error.message);
      process.exit(1);
    });
}
