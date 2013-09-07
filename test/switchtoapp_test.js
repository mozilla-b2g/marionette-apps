suite('launch', function() {
  var launch = require('../lib/launch').launch;
  var switchToApp = require('../lib/switchtoapp').switchToApp;

  var client = createClient();
  marionette.plugin('mozApps', require('../lib/apps'));

  suite('switch to running app', function() {
    var domain = 'homescreen.gaiamobile.org';
    var origin = 'app://' + domain;
    setup(function(done) {
      switchToApp(client.mozApps, origin, done);
    });

    test('should be visible', function(done) {
      // switch to root (system app)
      client.switchToFrame();
      client.findElement('iframe[src*="' + domain + '"]', function(err, el) {
        if (err) return done(err);
        el.displayed(function(err, isDisplayed) {
          assert.ok(isDisplayed);
          done();
        });
      });
    });

    test('app should be the target of scripts', function(done) {
      function remote() {
        return window.wrappedJSObject.location.href;
      }

      client.executeScript(remote, function(err, result) {
        assert.ok(result);
        done();
      });
    });
  });

  suite('entrypoint', function() {
    var origin = 'app://communications.gaiamobile.org';
    var entrypoint = 'contacts';
    var app;

    setup(function(done) {
      launch(client.mozApps, origin, entrypoint, function(err, _app) {
        app = _app;
        done(err);
      });
    });

    setup(function(done) {
      switchToApp(client.mozApps, origin, entrypoint, done);
    });

    test('context of marionette after switch', function(done) {
      client.getUrl(function(err, url) {
        assert.ok(
          url.indexOf(app.source) !== -1,
          'url contains: ' + app.source
        );
        done(err);
      });
    });

  });
});

