
# Marionette Apps

A node library that manages Firefox OS applications through Marionette.

[![Build
Status](https://travis-ci.org/mozilla-b2g/marionette-apps.png?branch=master)](https://travis-ci.org/mozilla-b2g/marionette-apps)

## Prerequisites

+ gjslint
+ node 0.8

## Getting Started

    npm install
    examples/launch.js

## Usage

```js
// create the plugin. Must come _before_ startSession
client.plugin('apps', require('marionette-apps'));

client.startSession(function() {
  // launch the app
  client.apps.launch('app://myorigin.com', function(err) {
  });

  // close a running application
  client.apps.close('app://myorigin.com', function(err) {
  });

  // switch to the iframe of a given app origin  should run after launch
  client.apps.switchToApp('app://myorigin.com', function() {
  });


  // find all apps
  client.apps.list(function(err, apps) {
   // an array of apps see lib/app.js
  });
});


```

## License

Copyright (c) 2013 Mozilla Foundation

Contributors: Gareth Aye <gaye@mozilla.com>, James Lal <jlal@mozilla.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
