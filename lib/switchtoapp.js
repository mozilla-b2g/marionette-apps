var waitForApp = require('./waitforapp').waitForApp;

/**
 * Switch focus to a given app based on the origin.
 * @param {Apps} apps to manage state.
 * @param {String} origin of the application.
 * @param {Function} callback [Error err].
 */
function switchToApp(apps, origin, callback) {
  var client = apps._client;
  callback = callback || client.defaultCallback;
  waitForApp(apps, origin, function(err, iframe) {
    if (err) {
      return callback(err);
    }

    client.switchToFrame(iframe, callback);
  });
}

module.exports.switchToApp = switchToApp;
