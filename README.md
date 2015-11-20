# serveit2
Quick &amp; dirty static HTTP2 server

## Installation

```
npm i serveit2 -g
```

## CLI

```
  Usage
  -----
  $ serveit2 [port]

  Options
  -------
  -g, --gzip Turn on gzipping
  -q, --quiet Turn off logger output
  -x, --no-conf Do not parse config file (ignore .serveit2 config file in the root public dir)
  -r, --root Server root directory (defaults to `cwd`)

  Examples
  --------
  $ serveit2
  $ serveit2 7000 -g -r=/User/something/somewhere
```

> Default port is: 5000

## Programmatic

```
var serveit2 = require('serveit2');
var options = {
  port: 7000, // Default 5000
  root: '/User/something/whatever', // Default .
  push: {'index.html': ['js/app.js', 'css/styles.css']}, // Default {}
  quiet: true, // Default false
  gzip: true, // Default false
}

var server = serveit2(options, function (port) {
  console.log('Server runs on port', port);
});

// close the server after 60 seconds
setTimeout(function () {
  server.kill();
}, 60 * 1000);

```

## Server push

SPDY & HTTP2 support a mechanism to push assets to the client, before the client requested them.
You can find out more about server push [here](http://blog.xebia.com/2015/08/23/http2-server-push/)

To enable server push you can add a config file named `.serveit2` to the directory, your invoking your server from (eg. the current working directory).

A basic config for server push could look like this:

```
{
  "push": {
    "index.html": ["js/app.js", "css/style.css"]
  }
}
```

Given that config file, the files `js/app.js` & `css/style.css` would be delivered to the client
immediatly when the `index.html` is requested. Depending on their size, they could even finish downloading faster then the actual reuqested file.

Compare the logger output with push used:

```
PUSH /js/app.js - 20
PUSH /css/screen.css - 25
GET /index.html 200 12.335 ms - 678
GET /css/screen.css 304 1.960 ms - -
GET /js/app.js 304 1.466 ms - -
```

and without push being used:

```
GET /index.html 200 12.335 ms - 678
GET /css/screen.css 200 1.960 ms - 25
GET /js/app.js 200 1.466 ms - 20
```

## Config file

The config file is not only a source where you can configure your push requests,
everything than can be set programmatically or via the cmd can also be set via the config file

```
{
  "port": 7000,
  "root": "/User/something/whatever",
  "push": {"index.html": ["js/app.js", "css/styles.css"]},
  "quiet": true,
  "gzip": true
}
```

## License

MIT
