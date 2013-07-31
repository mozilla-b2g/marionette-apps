suite('close', function() {
  // requires
  var Apps = require('../lib/apps'),
      close = require('../lib/close').close,
      launch = require('../lib/launch').launch,
      client = createClient();

  marionette.plugin('mozApps', Apps);

  suite('close app', function() {
    var domain = 'calendar.gaiamobile.org';
    var origin = 'app://' + domain;
    var element;

    setup(function(done) {
      this.timeout('10s');
      launch(client.mozApps, origin, done);
    });

    setup(function(done) {
      close(client.mozApps, origin, done);
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


