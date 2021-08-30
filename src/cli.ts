#!/usr/bin/env node

import {program as commander} from 'commander';
import {format as formatDate} from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';

import {MyTimezone} from './MyTimezone';

const defaultPackageJsonPath = path.join(__dirname, 'package.json');
const packageJsonPath = fs.existsSync(defaultPackageJsonPath)
  ? defaultPackageJsonPath
  : path.join(__dirname, '../package.json');

const {bin, description, version} = require(packageJsonPath);

commander
  .name(Object.keys(bin)[0])
  .version(version)
  .description(`${description}\nUse a city name or longitude value as location.`)
  .option('-o, --offline', 'Work offline (default is false)')
  .option('-s, --server <server>', 'Specify the NTP server (default is "pool.ntp.org")')
  .argument('<location>')
  .parse(process.argv);

if (!commander.args || !commander.args.length) {
  console.error('Error: No location specified.');
  commander.help();
}

const location = commander.args[0];

const myTimezone = new MyTimezone({
  ntpServer: commander.opts().server,
  offline: !!commander.opts().offline,
});

void (async () => {
  try {
    const {longitude} = await myTimezone.getLocation(location);
    const time = await myTimezone.getTimeByLocation(longitude);
    const formattedTime = formatDate(time, 'HH:mm:ss');

    console.info(`Time in "${location}": ${formattedTime}`);
    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
