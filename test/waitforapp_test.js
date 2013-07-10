suite('waitforapp', function() {
  // requires
  var Apps = require('../lib/apps'),
      waitForApp = require('../lib/waitforapp').waitForApp;

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

  suite('waiting for running app', function() {
    var domain = 'homescreen.gaiamobile.org';
    var origin = 'app://' + domain;
    var element;

    setup(function(done) {
      this.timeout('10s');
      waitForApp(apps, domain, function(err, el) {
        if (err) return done(err);
        element = el;
        done();
      });
    });

    test('it should return element', function(done) {
      assert.ok(element);
      element.getAttribute('src', function(err, src) {
        if (err) return callback(err);
        assert.ok(src.indexOf(domain) !== -1, domain);
        done();
      });
    });

    test('iframe is visible', function(done) {
      var iframe;
      client.findElement('iframe[src*="' + domain + '"]', function(err, el) {
        el.displayed(function(err, displayed) {
          assert.ok(displayed);
          done();
        });
      });
    });
  });
});

