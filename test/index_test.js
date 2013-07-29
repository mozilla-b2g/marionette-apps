var App = require('../lib/app');

suite('public interface', function() {
  // requires
  var apps, client, b2g;
  Helper.client({
    plugins: {
      apps: require('../index')
    }
  });

  setup(function() {
    client = this.client;
  });

  suite('#launch', function() {
    var appOrigin = 'app://calendar.gaiamobile.org';
    var selector = 'iframe[src*="calendar"]';

    setup(function(done) {
      client.apps.launch(appOrigin, done);
    });

    test('should create the appropriate app iframe', function(done) {
      client.scope({ searchTimeout: 1000 });
      if (client.isSync) {
        var el = client.findElement(selector);
        assert.ok(!!el);
        done();
      } else {
        client.findElement(selector, function(err, el) {
          assert.ok(!!el);
          done();
        });
      }
    });

    suite('#switchToApp', function() {
      setup(function(done) {
        client.apps.switchToApp(appOrigin, done);
      });

      test('should put us in the app', function(done) {
        function loc() {
          return window.location.href;
        }

        if (client.isSync) {
          var href = client.executeScript(loc);
          assert.ok(href.indexOf(appOrigin) !== -1);
          done();
        } else {
          client.executeScript(loc, function(err, href) {
            assert.ok(href.indexOf(appOrigin) !== -1);
            done();
          });
        }
      });
    });

    suite('#close', function() {
      setup(function(done) {
        client.apps.close(appOrigin, done);
      });

      test('should get rid of app iframe', function(done) {
        client.setSearchTimeout(10);
        if (client.isSync) {
          try {
            client.findElement(selector);
          } catch (err) {
            assert.strictEqual(err.type, 'NoSuchElement');
            done();
          }
        } else {
          client.findElement(selector, function(err) {
            assert.strictEqual(err.type, 'NoSuchElement');
            done();
          });
        }
      });
    });
  });

  suite('#list', function() {
    var apps;

    setup(function(done) {
      client.apps.list(function(err, _apps) {
        apps = _apps;
        done();
      });
    });

    test('should return many things', function() {
      assert.ok(apps.length > 0);
    });

    test('should return things and only things that are apps', function() {
      apps.forEach(function(app) {
        assert.ok(app instanceof App, app.origin);
      });
    });
  });
});
