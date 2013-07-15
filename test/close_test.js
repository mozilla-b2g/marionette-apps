suite('close', function() {
  // requires
  var Apps = require('../lib/apps'),
      close = require('../lib/close').close,
      launch = require('../lib/launch').launch;

  var apps, client, b2g;
  Helper.client({
    plugins: {
      mozApps: require('../lib/apps')
    }
  });

  setup(function() {
    client = this.client;
  });

  suite('close app', function() {
    var domain = 'calendar.gaiamobile.org';
    var origin = 'app://' + domain;
    var element;

    setup(function(done) {
      this.timeout('10s');
      launch(this.client.mozApps, origin, done);
    });

    setup(function(done) {
      close(this.client.mozApps, origin, done);
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


