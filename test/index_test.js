suite('public interface', function() {
  // requires
  var marionetteApps = require('../index');
  var App = require('../lib/app');

  var apps, client, b2g;
  setup(function(done) {
    Helper.spawn(function(_client, _child) {
      client = _client;
      b2g = _child;
      apps = marionetteApps.setup(client, {}, done);
    });
  });

  teardown(function(done) {
    client.deleteSession(function() {
      b2g.kill();
      done();
    });
  });

  suite('after launching app', function() {
    var appOrigin = 'app://calendar.gaiamobile.org',
        selector = 'iframe[src*="calendar"]';

    setup(function(done) {
      apps.launch(appOrigin, done);
    });

    test('it has element', function(done) {
      client.scope({ searchTimeout: 1000 }).
             findElement(selector, done);
    });

    suite('#switchToApp', function() {
      setup(function(done) {
        apps.switchToApp(appOrigin, done);
      });

      test('it should be inside app', function(done) {
        function loc() { return window.location.href };
        client.executeScript(loc, function(err, href) {
          assert.ok(href.indexOf(appOrigin) !== -1);
          done();
        });
      });
    });

    suite('#close', function() {
      setup(function(done) {
        apps.close(appOrigin, done);
      });

      test('app iframe should be missing', function(done) {
        client.setSearchTimeout(10);
        client.findElement(selector, function(err) {
          assert.equal(err.type, 'NoSuchElement');
          done();
        });
      });
    });
  });

  suite('#all', function() {
    var allApps;

    setup(function(done) {
      apps.list(function(err, _allApps) {
        allApps = _allApps;
        done();
      });
    });

    test('has many apps', function() {
      assert.ok(allApps.length > 0);
    });

    test('each app is an instanceof App', function() {
      allApps.forEach(function(app) {
        assert.ok(
          app instanceof App,
          app.origin
        );
      });
    });
  });

});
