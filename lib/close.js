/**
 * Small search timeout for faster polling.
 * @const {number}
 */
var SEARCH_TIMEOUT = 100;


/**
 * Close a currently running application.
 * @param {Apps} apps state.
 * @param {String} origin of the application.
 * @param {Function} callback [Error err].
 */
function close(apps, origin, callback) {
  var client = apps._client.scope({
    searchTimeout: SEARCH_TIMEOUT
  });

  /**
   * Wait until the iframe with the origin is no longer in the dom tree.
   */
  function waitUntilClosed() {
    var query = 'iframe[src*="' + origin + '"]';
    // wait until the element has been removed.
    client.waitFor(function(done) {
      // poll until it's gone
      client.findElement(query, function(err) {
        // no element is found is the success condition.
        if (err && err.type === 'NoSuchElement')
          return done(null, true);

        // error or element still exists...
        done(err, false);
      });
    }, callback);
  }

  /**
   * Run a script in gecko to tell the app to close with a mozChromeEvent.
   * @param {App} app the app to close.
   */
  function dispatchWebappsClose(app) {
    var url = app.manifestURL;
    client.executeScript(function(url, origin) {
      var win = window.wrappedJSObject;
      var event = new CustomEvent('mozChromeEvent', {
        detail: {
          manifestURL: url,
          type: 'webapps-close'
        }
      });
      win.dispatchEvent(event);
    }, [url, origin], waitUntilClosed);
  }

  // switch to root context
  client.switchToFrame();

  // find the manifestURL
  var req = apps.mgmt.getAll();
  req.onerror = callback;
  req.onsuccess = function(e) {
    e.target.result.forEach(function(app) {
      if (app.origin === origin) {
        return dispatchWebappsClose(app);
      }
    });
  };
}

module.exports.close = close;
