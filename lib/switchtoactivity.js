var waitForActivity = require('./waitforapp').waitForActivity,
    getApp = require('./getapp').getApp;

/**
 * Switch focus to an app that is run as inline activity based on the origin.
 * @param {Apps} apps to manage state.
 * @param {String} origin of the application.
 * @param {String} [entrypoint] of the application.
 * @param {Function} callback [Error err].
 */
function switchToActivity(apps, origin, entrypoint, callback) {
  if (typeof entrypoint === 'function') {
    callback = entrypoint;
    entrypoint = null;
  }

  client = apps._client;
  callback = callback || client.defaultCallback;

  return getApp(apps, origin, entrypoint, function(err, app) {
    if (err) {
      return callback(err);
    }

    return waitForActivity(apps, app.source, function(err, iframe) {
      if (err) {
        return callback(err);
      }

      // By default, should set focus to the frame.
      return client.switchToFrame(iframe, {focus: true}, function(err) {
        return callback(err, iframe, app);
      });
    });
  });
}

module.exports.switchToActivity = switchToActivity;
