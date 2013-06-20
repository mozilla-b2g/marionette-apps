#!/usr/bin/env node

/**
 * @fileoverview An example that shows how to use the MarionetteApps plugin
 *     to get a list of the installed apps and launch one.
 */

var Apps = require('../lib/apps'),
    Host = require('marionette-host-environment'),
    Marionette = require('marionette-client'),
    path = require('path');


/**
 * File path to B2G.
 * @const {string}
 */
var B2G_PATH = path.resolve(__dirname, '../b2g');


// Bring up a b2g desktop instance.
Host.spawn(B2G_PATH, function(err, port, childProcess) {
  if (err) {
    throw err;
  }

  if (process.env.DEBUG) {
    childProcess.stdout.pipe(process.stdout);
  }

  // Connect to the marionette server.
  var driver = new Marionette.Drivers.Tcp({ port: port });
  driver.connect(function() {
    // Wrap the marionette connection with a client that we can pass
    // to our plugin.
    client = new Marionette.Client(driver);
    client.startSession(function() {
      // Initialize the FoxDriver plugin!
      Apps.setup(client, function(err, apps) {
        if (err) {
          throw err;
        }

        // Ask for all of the apps. Note that this is the same interface
        // that navigator exposes in gecko!
        var req = apps.mgmt.getAll();
        req.onsuccess = function(evt) {
          var app = evt.target.result[0];
          app.launch();
          childProcess.kill();
        };
      });
    });
  });
});
