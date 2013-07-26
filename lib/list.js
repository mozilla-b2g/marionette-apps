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
  var onerror = function(e) {
    callback(e.target.error);
  };
  var onsuccess = function(e) {
    callback(null, e.target.result);
  };

  apps.mgmt.getAll(onerror, onsuccess);
}

module.exports.list = list;
