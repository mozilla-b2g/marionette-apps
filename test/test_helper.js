
var Host = require('marionette-host-environment'),
    Marionette = require('marionette-client');


global.assert = require('assert');
global.path = require('path');
global.sinon = require('sinon');


/**
 * File path to B2G.
 * @const {string}
 */
global.B2G_PATH = path.resolve(__dirname, '../b2g');


global.Helper = {
  /**
   * Spawn a b2g instance and connect to its marionette server.
   * @param {Function} cb Some function to call when we finish.
   */
  spawn: function(cb, done) {
    Host.spawn(B2G_PATH, function(err, port, childProcess) {
      if (err) {
        throw err;
      }

      if (process.env.DEBUG) {
        childProcess.stdout.pipe(process.stdout);
      }

      var driver = new Marionette.Drivers.Tcp({ port: port });
      driver.connect(function() {
        client = new Marionette.Client(driver);
        client.startSession(cb.bind(null, client, childProcess));
      });
    });
  }
};
