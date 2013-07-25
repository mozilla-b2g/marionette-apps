/**
 * @const {number}
 */
var SEARCH_TIMEOUT = 10000;


/**
 * @const {number}
 */
var WAIT_BETWEEN_CHECKS = 250;


/**
 * Wait until the app is visible.
 *
 * @param {Apps} apps state.
 * @param {String} origin to wait for.
 * @param {Function} callback [Err error, Marionette.Element el].
 */
function waitForApp(apps, origin, callback) {
  var client = apps._client.scope({ searchTimeout: SEARCH_TIMEOUT });
  var selector = 'iframe[src*="' + origin + '"]';

  // find iframe
  client.findElement(selector, function(err, element) {
    if (err) {
      return callback && callback(err);
    }

    function displayed(done) {
      element.displayed(done);
    }

    client.waitFor(displayed, function(err) {
      callback && callback(err, element);
    });
  });
}

module.exports.waitForApp = waitForApp;
