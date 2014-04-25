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
 * @param {Apps} apps state.
 * @param {String} source to wait for.
 * @param {Function} callback [Err error, Marionette.Element el].
 */
function waitForApp(apps, source, callback) {
  var client = apps._client.scope({ searchTimeout: SEARCH_TIMEOUT });
  callback = callback || client.defaultCallback;
  if (client.isSync) {
    waitForAppSync(client, source, callback);
  } else {
    waitForAppAsync(client, source, callback);
  }
}


/**
 * Wait until the app is visible using a sync driver.
 * @param {Marionette.Client} client with sync driver.
 * @param {String} source to wait for.
 * @param {Function} callback [Err error, Marionette.Element el].
 */
function waitForAppSync(client, source, callback) {
  var selector = 'iframe[src*="' + source + '"]';

  // find iframe
  var el = client.findElement(selector);
  client.waitFor(function() {
    console.log('displayed is a function.');
    return el.displayed();
  });

  //console.log('wait for 2s.');
  //wait(client, 2000);
  callback && callback(null, el);
}

/**
 * Wait for some amount of time by blocking via a marionette call.
 * Only ever use this for debugging!
 * @param {number} millis number of seconds to sleep.
 */
function wait(client, millis) {
  // Add a small value to the scriptTimeout used for this
  // `executeAsyncScript` invocation in order to account for the lack of
  // millisecond precision in `setTimeout`.
  var schedulerTolerance = 1000;
  // Ensure that the asynchronous script will not raise a timeout error, even
  // when the requested duration exceeds the client's current `scriptTimeout`
  // value.
  var scope = client.scope({
    scriptTimeout: millis + schedulerTolerance
  });

  scope.executeAsyncScript(function(millis) {
    setTimeout(marionetteScriptFinished, millis);
  }, [millis]);
}

/**
 * Wait until the app is visible using an async driver.
 * @param {Marionette.Client} client with async driver.
 * @param {String} source to wait for.
 * @param {Function} callback [Err error, Marionette.Element el].
 */
function waitForAppAsync(client, source, callback) {
  var selector = 'iframe[src*="' + source + '"]';

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
