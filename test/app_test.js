
var Apps = require(__dirname + '/../index'),
    BootWatcher = require(__dirname + '/../lib/bootwatcher');


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
    }, this);
  });

  teardown(function(done) {
    client.deleteSession(function() {
      b2g.kill();
      done();
    });
  });

  suite('#launch', function() {
    var CALENDAR_URL = 'app://calendar.gaiamobile.org';
    setup(function(done) {
      apps.mgmt.getAll().onsuccess = function(evt) {
        var result = evt.target.result;
        for (var i = 0; i < result.length; i++) {
          var app = result[i];
          if (app.origin === CALENDAR_URL) {
            subject = app;
            subject.launch();
            done();
          }
        }
      };
    });

    test('should launch the appropriate app', function(done) {
      /**
       * @param {string} app src for app.
       */
      function checkForApp(app) {
        var selector = 'iframe[src="' + app + '"]';
        client
            .setSearchTimeout(BootWatcher.WAIT_TIME)
            .findElement(selector, function(err, result) {
              assert.notEqual(result.id, undefined);
              done();
            });
      }

      if (client.context !== 'content') {
        client.setContext('content');
      }
      checkForApp(CALENDAR_URL + '/index.html');
    });
  });
});
