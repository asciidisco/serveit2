#! /usr/bin/env node
var serveit2 = require('./index');
var meow = require('meow');
var fs = require('fs');

var options = {};
var rootDir;
var config;

// check if we have a config file
try {
  config = JSON.parse(fs.readFileSync(process.cwd() + '/.serveit2'));
} catch (e) {
  if (e.toString() === 'SyntaxError: Unexpected end of input') {
    config = 'Invalid json';
  }
  if (e.code === 'ENOENT') {
    config = 'Not found';
  }
}

if (typeof config === 'object' && config.root) {
  rootDir = config.root;
  if (rootDir[0] !== '/') rootDir = process.cwd + '/' + rootDir;
}

var cli = meow(
  '     Usage\n' +
  '     -----\n' +
  '     $ serveit2 [port]\n' +
  '\n' +
  '     Options\n' +
  '     -------\n' +
  '     -g, --gzip Turn on gzipping\n' +
  '     -q, --quiet Turn off logger output\n' +
  '     -x, --no-conf Do not parse config file (ignore .serveit2 config file in the root public dir)\n' +
  '     -r, --root Server root directory (defaults to `cwd`)\n' +
  '\n' +
  '     Examples\n' +
  '     --------\n' +
  '     $ serveit2\n' +
  '     $ serveit2 7000 -g -r=/User/something/somewhere\n' +
  '\n' +
  '     Info\n' +
  '     ----\n' +
  (typeof config === 'string' ? '     Config error: ' + config + '\n' : '') +
  (typeof config === 'object' && config.root ? '     Root directory with config applied: ' + rootDir + '\n' : '') +
  '     Root directory without config applied would be: `' + process.cwd() + '/`',
  {
    alias: {
      g: 'gzip',
      q: 'quiet',
      x: 'no-conf',
      r: 'root',
    },
  }
);

if (cli.flags.x) {
  config = {};
}

options.port = cli.input[0] || config.port;
options.gzip = cli.flags.g || config.gzip || false;
options.push = config.push || {};
options.quiet = cli.flags.q || config.quiet || false;
options.root = cli.flags.r || config.root;

//console.log(cli.input[0], cli.flags);
serveit2(options, function (port) {
  console.log('Server listening at: https://localhost:%s', port);
});
