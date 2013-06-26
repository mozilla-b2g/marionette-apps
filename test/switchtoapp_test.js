suite('launch', function() {
  // requires
  var Apps = require('../lib/apps'),
      switchToApp = require('../lib/switchtoapp').switchToApp;

  var apps, client, b2g;
  setup(function(done) {
    Helper.setup(function(_client, _child, _apps) {
      client = _client;
      b2g = _child;
      apps = _apps;
      done();
    });
  }, this);

  teardown(function(done) {
    client.deleteSession(function() {
      b2g.kill();
      done();
    });
  });

  suite('switch to running app', function() {
    var domain = 'homescreen.gaiamobile.org';
    var origin = 'app://' + domain;
    setup(function(done) {
      switchToApp(apps, origin, done);
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
});

