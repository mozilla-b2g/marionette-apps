
var App = require(__dirname + '/../lib/app'),
    Apps = require(__dirname + '/../index');


suite('mgmt', function() {
  var apps, b2g, client, subject;

  Helper.client({
    plugins: {
      mozApps: require('../lib/apps')
    }
  });

  setup(function() {
    client = this.client;
    subject = client.mozApps.mgmt;
  });

  suite('#getAll', function() {
    var context;

    test('should return an array of app objects', function(done) {
      subject.getAll().onsuccess = function(evt) {
        // TODO(gareth): Check that the app is launched and that we've
        // switched context appropriately.
        assert.ok(evt.target.result.length > 0);
        evt.target.result.forEach(function(app) {
          assert.ok(app instanceof App);
          assert.equal(typeof(app.installOrigin), 'string');
          assert.ok(app.installOrigin.length > 0);
          assert.equal(typeof(app.installTime), 'number');
          assert.ok(app.installTime > 0);
          assert.equal(typeof(app.manifestURL), 'string');
          assert.ok(app.manifestURL.length > 0);
          assert.equal(typeof(app.origin), 'string');
          assert.ok(app.origin.length > 0);
        });

        done();
      };
    });

    test('should not change client context', function() {
      context = client.context;
      subject.getAll().onsuccess = function(evt) {
        assert.strictEqual(client.context, context);
      };
    });
  });
});
