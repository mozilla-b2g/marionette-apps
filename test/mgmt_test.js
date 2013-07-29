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
      function checkApps(apps) {
        assert.ok(apps.length > 0);
        apps.forEach(function(app) {
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
      }

      function onsuccess(evt) {
        checkApps(evt.target.result);
        done();
      };

      if (client.isSync) {
        var evt = subject.getAll();
        checkApps(evt.target.result);
        done();
      } else {
        subject.getAll(null, onsuccess);
      }
    });

    test('should not change client context', function() {
      context = client.context;
      var onsuccess = function(evt) {
        assert.strictEqual(client.context, context);
      };

      subject.getAll(null, onsuccess);
    });
  });
});
