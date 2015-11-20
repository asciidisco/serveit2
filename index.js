var spdy = require('spdy');
var keys = require('spdy-keys');
var ecstatic = require('ecstatic');
var morgan = require('morgan');
var mime = require('mime');
var fs = require('fs');

module.exports = function (options, cb) {
  options = options || {};
  cb = typeof options === 'function' ? options : cb;

  // determine port, keys & root folder
  var port = options.port || 5000;
  var root = options.root || process.cwd() + '/';
  if (root[root.length-1] !== '/') {
    root += '/';
  }

  // add ssl keys
  // TODO: Enable users to add their own keys
  var spdyOpts = {
    key: keys.key,
    cert: keys.cert,
    ca: keys.ca,
  };

  // dummy `logger` that prevents the script from outputting anything
  var quietLogger = function (req, res, _cb) {
    _cb();
  };

  // create logger "middleware"
  var logger = options.quiet ? quietLogger : morgan('dev');

  // create static server "middleware"
  var es = ecstatic({root: root});

  // default middleware (logging + static file server)
  var middleware = function (req, res) {
    var requestedFile = req.url.replace('/', '');
    if (requestedFile === '') requestedFile = 'index.html';

    // push resources
    if (options.push && options.push[requestedFile] && options.push[requestedFile].length > 0) {
      options.push[requestedFile].forEach(function (file) {
        var stream = res.push(file, {
          request: { accept: '*/*'},
          response: {'content-type': mime.lookup(file)},
        });
        stream.on('error', console.error);
        try {
          var pushable = fs.readFileSync(root + file);
          stream.end(pushable);
          if (!options.quiet) console.log('PUSH', '/' + file, '-', pushable.length);
        } catch (e) {
          console.error('Error pushing file:', root + file, e);
        }
      });
    }


    logger(req, res, function (err) {
      if (err) console.error(err);
      es(req, res, typeof options.middleware === 'function' || function () {});
    });
  };

  var server = spdy.createServer(spdyOpts, middleware);
  server.listen(port, typeof cb === 'function' ? cb.bind(server, port) : function () {});
  return server;
};
