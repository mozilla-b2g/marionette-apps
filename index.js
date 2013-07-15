// private api and interface
var Apps = require('./lib/apps');

/*
 * map of public modules to expose to the main interface.
 * key is module, value is function on the module
 */
var PUBLIC = {
  close: 'close',
  launch: 'launch',
  list: 'list',
  switchtoapp: 'switchToApp'
};

function MarionetteApps(apps) {
  for (var key in PUBLIC) {
    var methodName = PUBLIC[key];
    var module = require('./lib/' + key);
    // bind the public interface to the object
    this[methodName] = module[methodName].bind(null, apps);
  }
}

function setup(client, options) {
  var apps = Apps.setup(client, options);

  // return public interface
  return new MarionetteApps(apps);
}

module.exports.setup = setup;
