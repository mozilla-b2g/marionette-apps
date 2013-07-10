var SEARCH_TIMEOUT = 100;

/**
 * Close a currently running application.
 *
 *
 * @param {Apps} apps state.
 * @param {String} origin of the application.
 * @param {Function} callback [Error err].
 */
function close(apps, origin, callback) {
  var client = apps._client.scope({
    // for relatively fast polling
    searchTimeout: SEARCH_TIMEOUT
  });

  function waitUntilClosed() {
    var query = 'iframe[src*="' + origin + '"]';
    // wait until the element has been removed.
    client.waitFor(function(done) {
      // poll until its gone
      client.findElement(query, function(err) {
        // no element is found is the success condition.
        if (err && err.type === 'NoSuchElement')
          return done(null, true);

        // error or element still exists...
        done(err, false);
      });
    }, callback);
  }

  function issueWebappsClose(app) {
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
      if (app.origin === origin)
        return issueWebappsClose(app);
    });
  };
}

module.exports.close = close;
