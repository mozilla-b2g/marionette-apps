
function DOMRequest() {
}
module.exports = DOMRequest;


DOMRequest.prototype = {
  /**
   * @type {Function}
   */
  onsuccess: undefined,


  /**
   * @type {Function}
   */
  onerror: undefined
};


/**
 * @enum {string}
 */
DOMRequest.CallbackType = {
  ON_ERROR: 'onerror',
  ON_SUCCESS: 'onsuccess'
};
