var spdy = require('spdy');
var keys = require('spdy-keys');
var ecstatic = require('ecstatic');
var morgan = require('morgan');

module.exports = function (options, cb) {
  options = options || {};

  // determine port & keys
  var port = options.port || 5000;
  var spdyOpts = options.spdy || {
    key: keys.key,
    cert: keys.cert,
    ca: keys.ca
  };

  // create logger "middleware"
  var logger = morgan('combined');

  // create static server "middleware"
  var es = ecstatic({root: process.cwd() + '/'});

  // 
  var middleware = function (req, res) {
    logger(req, res, function (err) {
      if (err) console.error(err);
      es(req, res);
    });
  };

  var server = spdy.createServer(spdyOpts, middleware);
  server.listen(port, cb.bind(server, port) || function () {});
  return server;
};