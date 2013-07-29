var waitForApp = require('./waitforapp').waitForApp;


/**
 * Origin for the homescreen app.
 * TODO: pull this from settings rather than hardcode.
 * @const {string}
 */
var HOMESCREEN_ORIGIN = 'homescreen.gaiamobile.org';


/**
 * Launch an application based on its origin and optionally entrypoint.
 * Will wait until app's iframe is visible before firing callback.
 *
 *    launch(apps, 'app://calendar.gaiamobile.org', function(err, app) {
 *      // yey
 *    });
 *
 * @param {Apps} apps instance.
 * @param {String} origin of the app.
 * @param {Function} callback [Error err, App app].
 */
function launch(apps, origin, callback) {
  // wait for homescreen before launching
  waitForApp(apps, HOMESCREEN_ORIGIN);

  /**
   * Handles the actual launching of the app if found.
   * @param {App} app to launch.
   */
  function launchAppObject(app) {
    app.launch();
    // wait for this app to be visible
    waitForApp(apps, origin, function(err, element) {
      callback && callback(null, app, element);
    });
  }

  // attempt to find origin with getAll
  var onerror = function(evt) {
    callback(new Error('unknown error while acquiring list of apps'));
  };
  var onsuccess = function(evt) {
    var apps = evt.target.result;
    var app;

    // if the origin is found launch the app
    for (var i = 0, len = apps.length; i < len; i++) {
      app = apps[i];
      if (app.origin === origin) {
        return launchAppObject(app);
      }
    }

    // otherwise fail
    callback(new Error('no app found with origin: "' + origin + '"'));
  };

  callback = callback || apps._client.defaultCallback;
  if (apps._client.isSync) {
    var evt = apps.mgmt.getAll();
    onsuccess(evt);
  } else {
    apps.mgmt.getAll(onerror, onsuccess);
  }
}

module.exports.launch = launch;
