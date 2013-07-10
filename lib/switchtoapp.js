var waitForApp = require('./waitforapp').waitForApp;

/**
 * Switches focus to a given app based on the origin.
 *
 *
 * @param {Apps} apps to manage state.
 * @param {String} origin of the application.
 * @param {Function} callback [Error err].
 */
function switchToApp(apps, origin, callback) {
  var client = apps._client;
  waitForApp(apps, origin, function(err, iframe) {
    if (err) return callback(err);
    client.switchToFrame(iframe, callback);
  });
}

module.exports.switchToApp = switchToApp;
