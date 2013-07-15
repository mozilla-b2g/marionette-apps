
var App = require(__dirname + '/app'),
    DOMRequest = require(__dirname + '/domrequest'),
    fs = require('fs');


/**
 * @constructor
 * @param {Marionette.Client} client Marionette client to use.
 */
function _Mgmt(client) {
  this._client = client;
}
module.exports = _Mgmt;


_Mgmt.prototype = {
  /**
   * @type {Marionette.Client}
   * @private
   */
  _client: undefined,


  /**
   * @param {App} app Close this app.
   * @param {Function} cb Some callback to call once app is closed.
   */
  close: function(app, cb) {
    throw 'Not yet implemented';
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
  },


  /**
   * @param {App} app Wait until this app is visible.
   * @param {Function} cb Some callback to call once app is visible.
   */
  waitUntilVisible: function(app, cb) {
    throw 'Not yet implemented';
  }
};
