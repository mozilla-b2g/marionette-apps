var waitForApp = require('./waitforapp').waitForApp;
var getApp = require('./getapp').getApp;

var url = require('url');
var fsPath = require('path');


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
 * @param {String} [entrypoint] for the app.
 * @param {Function} callback [Error err, App app].
 */
function launch(apps, origin, entrypoint, callback) {
  if (typeof entrypoint === 'function') {
    callback = entrypoint;
    entrypoint = null;
  }

  callback = callback || apps._client.defaultCallback;

  // wait for homescreen before launching
  apps._client.plugin('SettingsAPI', require('marionette-settings-api'));
  var homescreenUrl = url.parse(
    apps._client.SettingsAPI.get('homescreen.manifestURL'));
  var homescreenOrigin = homescreenUrl.hostname +
    (homescreenUrl.port ? ':' + homescreenUrl.port : '');

  waitForApp(apps, homescreenOrigin);

  // launch the given app
  return getApp(apps, origin, entrypoint, function(err, app) {
    if (err) {
      return callback(err);
    }

    // if a null entrypoint is given it is safely ignored.
    app.launch(entrypoint);

    // wait for this app to be visible
    return waitForApp(apps, app.source, function(err, element) {
      return callback(err, app, element);
    });
  });
}

module.exports.launch = launch;
