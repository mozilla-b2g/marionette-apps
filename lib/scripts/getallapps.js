
(function() {
  /**
   * Take an app from a DOMRequest and serialize it to send back
   * to the client.
   * @return {Object} App representation.
   */
  function serialize(app) {
    return {
      installOrigin: app.installOrigin,
      installTime: app.installTime,
      // TODO(gareth): This breaks things, probably too much data...
      // manifest: app.manifest,
      manifestURL: app.manifestURL,
      origin: app.origin,
      receipts: app.receipts
    };
  }


  var ObjectCache = window.wrappedJSObject.ObjectCache;

  var req = navigator.mozApps.mgmt.getAll();
  req.onsuccess = function(evt) {
    var result = evt.target.result;
    var apps = evt.target.result.map(function(app) {
      var id = ObjectCache._inst.set(app);
      var obj = serialize(app);
      obj._id = id;
      return obj;
    });

    marionetteScriptFinished(JSON.stringify({
      callbackType: 'onsuccess',
      data: apps
    }));
  };
  req.onerror = function(evt) {
    marionetteScriptFinished(JSON.stringify({
      callbackType: 'onerror',
      error: req.error
    }));
  };
})();
