var App = require(__dirname + '/app'),
    DOMRequest = require(__dirname + '/domrequest'),
    fs = require('fs');


/**
 * @constructor
 * @param {Marionette.Client} client Marionette client to use.
 */
function Mgmt(client) {
  this._client = client;
}
module.exports = Mgmt;


Mgmt.prototype = {
  /**
   * @type {Marionette.Client}
   * @private
   */
  _client: undefined,

  /**
   * Lists all installed apps in the user's repository.
   * @return {DOMRequest} Request that supports onsuccess, onerror callbacks.
   */
  getAll: function() {
    var req = new DOMRequest();

    var script = fs.readFileSync(
      __dirname + '/scripts/getallapps.js',
      'utf8'
    );

    var client = this._client.scope({
      context: 'content'
    });

    client.executeAsyncScript(script, (function(err, result) {
      if (err) {
        throw err;
      }

      result = JSON.parse(result);
      switch (result.callbackType) {
        case DOMRequest.CallbackType.ON_SUCCESS:
          var apps = result.data.map((function(data) {
            // its important that we don't pass the scoped local variable
            // client.
            var app = new App(this._client);
            for (var key in data) {
              app[key] = data[key];
            }

            return app;
          }).bind(this));

          req.onsuccess && req.onsuccess({ target: { result: apps } });
          break;
        case DOMRequest.CallbackType.ON_ERROR:
          req.onerror && req.onerror();
          break;
      }
    }).bind(this));

    return req;
  }
};
