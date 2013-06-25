#!/usr/bin/env node

/**
 * @fileoverview An example that shows how to use the MarionetteApps plugin
 *     to get a list of the installed apps and launch one.
 */

var Apps = require(__dirname + '/../index'),
    BootWatcher = require(__dirname + '/../lib/bootwatcher'),
    Host = require('marionette-host-environment'),
    Marionette = require('marionette-client'),
    path = require('path');


/**
 * Options to setup our b2g instance with.
 * @type {Object}
 */
var OPTIONS = {
  settings: {
    'ftu.manifestURL': null,
    'lockscreen.enabled': false
  }
};


/**
 * File path to B2G.
 * @const {string}
 */
var B2G_PATH = path.resolve(__dirname, '../b2g');


/**
 * Origin URL for the calendar app.
 * @const {string}
 */
var CALENDAR_URL = 'app://calendar.gaiamobile.org';


/**
 * Gets called once we have a child process booted with Firefox OS.
 * @param {Marionette.Client} client Marionette client to use.
 * @param {ChildProcess} childProcess Child process running b2g.
 */
function demo(client, childProcess) {
  // Initialize the Apps plugin!
  Apps.setup(client, function(err, apps) {
    // Ask for all of the apps.
    var req = apps.mgmt.getAll();
    req.onsuccess = function(evt) {
      // Prove that we got them by logging them!
      evt.target.result.forEach(function(app) {
        console.log(app.origin);

        // If this is the calendar app, try launching it!
        if (app.origin === CALENDAR_URL) {
          app.launch();
        }
      });

      setTimeout(childProcess.kill.bind(childProcess), 5000);
    };
  });
}


// Bring up a b2g desktop instance.
Host.spawn(B2G_PATH, OPTIONS, function(err, port, childProcess) {
  if (process.env.DEBUG) {
    childProcess.stdout.pipe(process.stdout);
  }

  // Connect to the marionette server.
  var driver = new Marionette.Drivers.Tcp({ port: port });
  driver.connect(function() {
    // Wrap the marionette connection with a client that we can pass
    // to our plugin.
    var client = new Marionette.Client(driver);

    // Make a bootwatcher to tell us when we're done booting.
    BootWatcher.setup(client, function(err, bootwatcher) {
      function onBoot(evt) {
        bootwatcher.removeListener(BootWatcher.EventType.BOOT, onBoot);
        demo(client, childProcess);
      }

      bootwatcher.addListener(BootWatcher.EventType.BOOT, onBoot);
      client.startSession(function() {
        bootwatcher.start();
      });
    });
  });
});
