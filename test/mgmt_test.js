var App = require(__dirname + '/../lib/app'),
    Apps = require(__dirname + '/../index');


suite('mgmt', function() {
  var subject;

  var client = createClient();
  marionette.plugin('mozApps', require('../lib/apps'));

  setup(function() {
    subject = client.mozApps.mgmt;
  });

  suite('#getAll', function() {
    var context;

    test('should return an array of app objects', function(done) {
      function checkApps(apps) {
        assert.ok(apps.length > 0);
        apps.forEach(function(app) {
          assert.ok(app instanceof App, 'app instanceof App');
          assert.equal(typeof(app.installOrigin), 'string');
          assert.ok(app.installOrigin.length > 0);
          assert.equal(typeof(app.installTime), 'number');
          assert.ok(app.installTime > 0);
          assert.equal(typeof(app.manifestURL), 'string');
          assert.ok(app.manifestURL.length > 0);
          assert.equal(typeof(app.origin), 'string');
          assert.ok(app.origin.length > 0);
          assert.equal(typeof app.manifest, 'object');
        });
      }


      subject.getAll(function(err, list) {
        if (err) {
          return done(err);
        }
        checkApps(list);
        done();
      });
    });

    test('should not change client context', function(done) {
      context = client.context;
      subject.getAll(function() {
        assert.strictEqual(client.context, context);
        done();
      });
    });
  });
});
