var BootWatcher = require(__dirname + '/../lib/bootwatcher'),
    Host = require('marionette-host-environment'),
    Marionette = require('marionette-client');


global.assert = require('assert');
global.fs = require('fs');
global.path = require('path');
global.sinon = require('sinon');

/**
 * wrapper for marionette.client but with async/sync switching.
 * @param {Object} [profile] A custom profile for creating the client.
 * @return {Marionette.Client} client instance.
 */
global.createClient = function(profile) {
  // profile
  var defaultProfile = {
      settings: {
        'ftu.manifestURL': null,
        'lockscreen.enabled': false
      }
  };

  profile = profile || defaultProfile;

  var Driver = (process.env.SYNC) ?
                 Marionette.Drivers.TcpSync :
                 Marionette.Drivers.Tcp;

  return marionette.client(profile, Driver);
};
