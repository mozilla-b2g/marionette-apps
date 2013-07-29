var App = require(__dirname + '/app'),
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
   * List all installed apps in the user's repository.
   * @param {Function} onerror some function to call if err.
   * @param {Function} onsuccess some function to call if success.
   */
  getAll: function(onerror, onsuccess) {
    /**
     * Gets called when we get a result from the getallapps script.
     * @param {Error} err some error.
     * @param {string} result json representation for api result.
     * @return {Object} event object.
     */
    var onScriptFinished = (function(err, result) {
      if (err) {
        throw err;
      }

      result = JSON.parse(result);
      switch (result.callbackType) {
        case 'onsuccess':
          var apps = result.data.map((function(data) {
            var app = new App(this._client);
            for (var key in data) {
              app[key] = data[key];
            }

            return app;
          }).bind(this));

          var result = { target: { result: apps }};
          return this._client.isSync ?
              result : onsuccess && onsuccess(result);
        case 'onerror':
          if (this._client.isSync) {
            throw 'Error running getAll in gecko';
          } else {
            return onerror && onerror();
          }
      }
    }).bind(this);

    var script = fs.readFileSync(
      __dirname + '/scripts/getallapps.js',
      'utf8'
    );

    var client = this._client.scope({ context: 'content' });
    if (client.isSync) {
      var result = this._client.executeAsyncScript(script);
      return onScriptFinished(null, result);
    } else {
      this._client.executeAsyncScript(script, onScriptFinished);
    }
  },


  /**
   * Inject utility functions into gecko through the marionette client.
   * @param {Function} cb Optional callback function.
   */
  prepareClient: function(cb) {
    var script = fs.readFileSync(
      __dirname + '/scripts/objectcache.js',
      'utf8'
    );

    this._client.importScript(script, cb);
  }
};
