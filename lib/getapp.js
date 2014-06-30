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
  var launchPath = app.entrypoint.details.launch_path;

  var urlParts = url.parse(origin);

  // Handle hashes in the launchPath
  if (launchPath.indexOf('#') !== -1) {
    var hashParts = launchPath.split('#');
    launchPath = hashParts[0];
    urlParts.hash = hashParts[1];
  }

  urlParts.pathname = fsPath.join(urlParts.pathname || '/', launchPath);
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

  return list(state, function(err, apps) {
    if (err) {
      return callback && callback(err);
    }

    var originApps = apps.filter(function(app) {
      return app.origin === origin;
    });

    if (!originApps.length) {
      return callback(
        new Error('could not find an app with the origin: "' + origin + '"')
      );
    }

    originApps.forEach(function(app) {
      app.source = origin;
    });

    if (!entrypoint) {
      return callback(null, originApps[0]);
    }

    var originApp = originApps.find(function(app) {
      var details = app.manifest.entry_points[entrypoint];
      return !!details;
    });

    if (!originApp) {
      return callback(new Error('invalid entrypoint "' + entrypoint + '"'));
    }

    originApp.entrypoint = {
      name: entrypoint,
      details: originApp.manifest.entry_points[entrypoint]
    };
    originApp.source = sourceForEntrypoint(originApp);
    return callback(null, originApp);
  });
}

module.exports.getApp = getApp;
module.exports.sourceForEntrypoint = sourceForEntrypoint;
