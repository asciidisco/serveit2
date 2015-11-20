#! /usr/bin/env node
var serveit2 = require('./index');
var options = {};

if (process.argv[2]) options.port = process.argv[2];
serveit2(options, function (port) {
  console.log('Server listening at: https://localhost:%s', port);
});