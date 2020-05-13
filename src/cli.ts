#!/usr/bin/env node

import program = require('commander');
import {format as formatDate} from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

import {MyTimezone} from './MyTimezone';

const defaultPackageJsonPath = path.join(__dirname, 'package.json');
const packageJsonPath = fs.existsSync(defaultPackageJsonPath)
  ? defaultPackageJsonPath
  : path.join(__dirname, '../package.json');

const {bin, description, version} = require(packageJsonPath);

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
  .then(time => {
    const formattedTime = formatDate(time, 'HH:mm:ss');
    console.info(`Time in "${location}": ${formattedTime}`);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });
