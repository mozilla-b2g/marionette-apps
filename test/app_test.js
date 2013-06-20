
var Apps = require(__dirname + '/../index');


suite('App', function() {
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
        done();
      });
    });
  });

  teardown(function(done) {
    client.deleteSession(function() {
      b2g.kill();
      done();
    });
  });

  suite('#launch', function() {
    setup(function(done) {
      apps.mgmt.getAll().onsuccess = function(evt) {
        subject = evt.target.result[0];
        subject.launch();
        done();
      };
    });

    test('should launch the appropriate app', function(done) {
      // TODO(gareth): Check that the app is launched and that we've
      // switched context appropriately.
      done();
    });
  });
});
