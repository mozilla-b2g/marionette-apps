
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
  });

  teardown(function(done) {
    client.deleteSession(function() {
      b2g.kill();
      done();
    });
  });

  suite('#setup', function() {
    var apps, spy;

    setup(function(done) {
      spy = sinon.spy(client, 'setContext');
      Apps.setup(client, function(err, result) {
        if (err) {
          done(err);
        }

        apps = result;
        done();
      });
    });


    test('should setContext chrome', function() {
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, 'chrome');
    });

    test('should return an App with a _client', function() {
      assert.ok(apps instanceof Apps);
      assert.strictEqual(apps._client, client);
    });
  });
});
