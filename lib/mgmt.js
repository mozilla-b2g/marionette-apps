
var App = require(__dirname + '/app'),
    ContextManager = require(__dirname + '/contextmanager');
    DOMRequest = require(__dirname + '/domrequest'),
    fs = require('fs');


/**
 * @constructor
 * @param {Apps} apps A reference to the Apps api.
 * @param {Marionette.Client} client Marionette client to use.
 */
function Mgmt(apps, client) {
  this._apps = apps;
  this._client = client;
  this._contextManager = new ContextManager(client);
}
module.exports = Mgmt;


Mgmt.prototype = {
  /**
   * @type {Apps}
   * @private
   */
  _apps: undefined,


  /**
   * @type {Marionette.Client}
   * @private
   */
  _client: undefined,


  /**
   * @type {ContextManager}
   * @private
   */
  _contextManager: undefined,


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

    this._contextManager.saveContext();
    this._contextManager.setContext('content');
    this._client.executeAsyncScript(script, (function(err, result) {
      if (err) {
        throw err;
      }

      this._contextManager.restoreContext();

      result = JSON.parse(result);
      switch (result.callbackType) {
        case DOMRequest.CallbackType.ON_SUCCESS:
          var apps = result.data.map((function(data) {
            var app = new App(this._apps, this._client);
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
