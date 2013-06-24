
var BootWatcher = require(__dirname + '/../lib/bootwatcher'),
    Host = require('marionette-host-environment'),
    Marionette = require('marionette-client');


global.assert = require('assert'),
global.fs = require('fs'),
global.path = require('path'),
global.sinon = require('sinon');


/**
 * File path to B2G.
 * @const {string}
 */
global.B2G_PATH = path.resolve(__dirname, '../b2g');


global.Helper = {
  /**
   * Spawn a b2g instance and connect to its marionette server.
   * @param {Function=} context Optional calling test context.
   * @param {Function} cb Some function to call when we finish.
   */
  spawn: function(cb, context) {
    var options = {
      settings: {
        'ftu.manifestURL': null,
        'lockscreen.enabled': false
      }
    };

    Host.spawn(B2G_PATH, options, function(err, port, childProcess) {
      if (err) {
        throw err;
      }

      if (process.env.DEBUG) {
        childProcess.stdout.pipe(process.stdout);
      }

      var driver = new Marionette.Drivers.Tcp({ port: port });
      driver.connect(function() {
        client = new Marionette.Client(driver);

        BootWatcher.setup(client, function(err, bootwatcher) {
          if (err) {
            throw err;
          }

          /**
           * @param {Event} evt BootWatcher.EventType.BOOT event.
           */
          function onBoot(evt) {
            bootwatcher.removeListener(BootWatcher.EventType.BOOT, onBoot);
            cb(client, childProcess);
          }

          bootwatcher.addListener(BootWatcher.EventType.BOOT, onBoot);
          client.startSession(function() {
            bootwatcher.start();
          });
        });
      });
    });
  }
};
