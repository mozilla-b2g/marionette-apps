
var Apps = require(__dirname + '/../index');


suite('Apps', function() {
  var b2g, client, subject;

  setup(function(done) {
    Helper.spawn(function(marionetteClient, childProcess) {
      subject = Apps;
      client = marionetteClient;
      b2g = childProcess;
      done();
    });
  }, this);

  teardown(function(done) {
    client.deleteSession(function() {
      b2g.kill();
      done();
    });
  });

  suite('#setup', function() {
    var apps, context;

    setup(function(done) {
      context = client.context;
      Apps.setup(client, function(err, result) {
        if (err) {
          done(err);
        }

        apps = result;
        done();
      });
    });

    test('should return an App with a _client', function() {
      assert.ok(apps instanceof Apps);
      assert.strictEqual(apps._client, client);
    });

    test('should not change client context', function() {
      assert.strictEqual(client.context, context);
    });
  });
});
