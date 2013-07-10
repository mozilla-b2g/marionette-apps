suite('close', function() {
  // requires
  var Apps = require('../lib/apps'),
      close = require('../lib/close').close,
      launch = require('../lib/launch').launch;

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

  suite('close app', function() {
    var domain = 'calendar.gaiamobile.org';
    var origin = 'app://' + domain;
    var element;

    setup(function(done) {
      this.timeout('10s');
      launch(apps, origin, done);
    });

    setup(function(done) {
      close(apps, origin, done);
    });

    test('iframe is gone', function(done) {
      client.setSearchTimeout(100);
      client.findElement('iframe[src*="' + domain + '"]', function(err, el) {
        assert.ok(err, 'has error');
        assert.equal(err.type, 'NoSuchElement', 'element is missing');
        done();
      });
    });
  });
});


