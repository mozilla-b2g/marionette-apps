/**
 * Find all apps.
 *
 *    apps.list(apps, function(err, list) {
 *      // list is an array of "Apps"
 *      list[0].origin; // origin of a given app
 *    });
 *
 * @param {Apps} apps state.
 * @param {Function} callback [Err err, Array<App> apps].
 */
function list(apps, callback) {
  var req = apps.mgmt.getAll();

  req.onerror = function(e) {
    callback(e.target.error);
  };

  req.onsuccess = function(e) {
    callback(null, e.target.result);
  };
}

module.exports.list = list;
