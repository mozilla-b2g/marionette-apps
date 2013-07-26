var BootWatcher = require(__dirname + '/../lib/bootwatcher'),
    Host = require('marionette-host-environment'),
    Marionette = require('marionette-client');


global.assert = require('assert');
global.fs = require('fs');
global.path = require('path');
global.sinon = require('sinon');


/**
 * File path to B2G.
 * @const {string}
 */
global.B2G_PATH = path.resolve(__dirname, '../b2g');


global.Helper = {
  /**
   * Creates the marionette client given some options.
   *
   *    suite('my test', function() {
   *      Helper.client({
   *        plugins: {
   *          'apps': require('apps')
   *        }
   *      });
   *
   *      test('apps', function() {
   *        this.client.apps = xx;
   *      });
   *    });
   */
  client: function(options) {
    var b2g;

    setup(function(done) {
      Helper.spawn(options, function(client, child) {
        b2g = child;
        this.client = client;
        done();
      }.bind(this));
    });

    teardown(function(done) {
      this.client.deleteSession(function() {
        b2g.kill();
        done();
      });
    });
  },


  /**
   * Spawn a b2g instance and connect to its marionette server.
   *
   * Options:
   *  - (Boolean) sync: when true uses sync driver.
   *
   * @param {Object} options for spawn.
   * @param {Function} cb Some function to call when we finish.
   */
  spawn: function(spawnOpts, cb) {
    if (typeof spawnOpts === 'function') {
      cb = spawnOpts;
      spawnOpts = {};
    }

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

      var driverClass = spawnOpts.sync ?
          Marionette.Drivers.TcpSync : Marionette.Drivers.Tcp;
      var driver = new driverClass({ port: port });
      driver.connect(function() {
        client = new Marionette.Client(driver);

        if (spawnOpts && spawnOpts.plugins) {
          for (var key in spawnOpts.plugins) {
            client.plugin(key, spawnOpts.plugins[key]);
          }
        }

        client.startSession(function() {
          cb(client, childProcess);
        });
      });
    });
  },


  /**
   * Sets up the plugin.
   *
   *    Helper.setup(function(client, process, apps) {
   *
   *    });
   *
   * @param {Object} options see #spawn.
   * @param {Function} callback see above.
   */
  setup: function(opts, callback) {
    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    var Apps = require('../lib/apps');
    this.spawn(opts, function(client, process) {
      client.plugin('appsCore', Apps);
      callback(client, process);
    });
  }
};
