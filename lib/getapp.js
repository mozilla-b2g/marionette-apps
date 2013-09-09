var fsPath = require('path'),
    list = require('./list').list,
    url = require('url');

/**
 * Creates the expected source of a app iframe.
 *
 * @param {App} app object to get source from.
 * @private
 */
function sourceForEntrypoint(app) {
  var origin = app.origin;
  var entrypointPath = app.entrypoint.details.launch_path;

  var urlParts = url.parse(origin);
  urlParts.pathname = fsPath.join(urlParts.pathname || '/', entrypointPath);

  return url.format(urlParts);
}

/**
 * Find a given app by its origin and optionally an entrypoint.
 *
 * @param {Object} state current app state.
 * @param {String} origin of the app.
 * @param {String} [entrypoint] of the app.
 * @param {Function} callback [Error, App].
 */
function getApp(state, origin, entrypoint, callback) {
  if (typeof entrypoint === 'function') {
    callback = entrypoint;
    entrypoint = null;
  }

  callback = callback || state._client.defaultCallback;

  var originApp;
  return list(state, function(err, apps) {
    for (var i = 0, len = apps.length; i < len; i++) {
      if (apps[i].origin === origin) {
        originApp = apps[i];
        break;
      }
    }

    if (!originApp) {
      return callback(
        new Error('could not find an app with the origin: "' + origin + '"')
      );
    }

    originApp.source = origin;

    if (entrypoint) {
      // verify this is a valid entrypoint
      var details = originApp.manifest.entry_points[entrypoint];
      if (!details) {
        return callback(new Error('invalid entrypoint "' + entrypoint + '"'));
      }

      // add sugar for the apps entrypoint instance.
      originApp = Object.create(originApp);
      originApp.entrypoint = {
        name: entrypoint,
        details: details
      };

      // must come after the entrypoint assignment
      originApp.source = sourceForEntrypoint(originApp);
    }

    return callback(null, originApp);
  });
}

module.exports.getApp = getApp;
