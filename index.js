var spdy = require('spdy');
var keys = require('spdy-keys');
var ecstatic = require('ecstatic');
var fs = require('fs');
var port = process.argv[2] || 5000;
 
var options = {
  key: keys.key,
  cert: keys.cert,
  ca: keys.ca
};
 
var server = spdy.createServer(options, ecstatic({root: process.cwd() + '/'}));
server.listen(port, function () {
  console.log('Server listening at: https://localhost:%s', port);
});