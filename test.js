var test = require('tape');
var serveit2 = require('./index');
var fs = require('fs');
var spdy = require('spdy');
var http = require('https');

// check if the server surfs correct status codes
test('statusCode test', function (t) {
  t.plan(1);

  var agent = spdy.createAgent({
    host: 'localhost',
    port: 7000,
    agent: false,
    rejectUnauthorized: false,
  });

  var server = serveit2({port: 7000, quiet: true}, function () {
    http.get({
      host: 'localhost',
      path: '/README.md',
      agent: agent,
    }, function(res) {
      t.equal(res.statusCode, 200);
      agent.close();
      server.close();
    }).end();
  });


});

// check if the server delivers correct contents
test('contents test', function (t) {
  t.plan(1);

  var agent = spdy.createAgent({
    host: 'localhost',
    port: 7000,
    agent: false,
    rejectUnauthorized: false,
  });

  var server = serveit2({port: 7000, quiet: true}, function () {
    var contentsFromFile = fs.readFileSync(__dirname + '/README.md', 'utf8');
    http.get({
      host: 'localhost',
      agent: agent,
      path: '/README.md',
    }, function(res) {
      var contentsFromServer = '';
      res.on('data', function (data) {
        contentsFromServer += data.toString();
      });

      res.on('end', function () {
        t.equal(contentsFromServer, contentsFromFile);
        agent.close();
        server.close();
      });
    }).end();
  });
});
