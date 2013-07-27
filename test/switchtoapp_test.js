suite('launch', function() {
  // requires
  var Apps = require('../lib/apps'),
      switchToApp = require('../lib/switchtoapp').switchToApp;

  var apps, client;
  Helper.client({
    plugins: {
      mozApps: require('../lib/apps')
    }
  });

  setup(function() {
    client = this.client;
  });

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
});

