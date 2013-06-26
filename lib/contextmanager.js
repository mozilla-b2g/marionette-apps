
/**
 * @fileoverview Manages saving and restoring chrome/content context
 *     for a marionette client.
 */


/**
 * @constructor
 * @param {Marionette.Client} client for which we'll manage context.
 */
function ContextManager(client) {
  this.client = client;
  this.savedContext = client.context;
}
module.exports = ContextManager;


ContextManager.prototype = {
  /**
   * @type {Marionette.Client}
   */
  client: undefined,


  /**
   * @type {string}
   */
  savedContext: undefined,


  /**
   * Restore the most recently saved context if different from the client's.
   */
  restoreContext: function() {
    this.setContext(this.savedContext);
  },


  /**
   * Cache the client's context.
   */
  saveContext: function() {
    this.savedContext = this.client.context;
  },


  /**
   * @param {string} context gecko context either chrome or content.
   */
  setContext: function(context) {
    if (this.client.context !== context) {
      this.client.context = context;
    }
  }
};
