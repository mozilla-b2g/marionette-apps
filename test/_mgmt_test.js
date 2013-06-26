
var App = require(__dirname + '/../lib/app'),
    Apps = require(__dirname + '/../index');


suite('_mgmt', function() {
  var apps, b2g, client, subject;

  setup(function(done) {
    Helper.spawn(function(marionetteClient, childProcess) {
      client = marionetteClient;
      b2g = childProcess;

      Apps.setup(client, function(err, result) {
        if (err) {
          throw err;
        }

        apps = result;
        subject = apps.mgmt;
        done();
      });
    }, this);
  });

  teardown(function(done) {
    client.deleteSession(function() {
      b2g.kill();
      done();
    });
  });

  suite('#close', function() {
    test.skip('should remove the app iframe', function() {
    });

    test.skip('should make the homescreen visible', function() {
    });

    test.skip('should not change client context', function() {
    });
  });

  suite('#waitUntilVisible', function() {
    test.skip('should wait until the app is visible to finish', function() {
    });

    test.skip('should not change the client context', function() {
    });
  });
});
