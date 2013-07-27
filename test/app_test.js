var BootWatcher = require('../lib/bootwatcher');

suite('App', function() {
  var client, subject;

  Helper.client({
    plugins: {
      mozApps: require('../lib/apps')
    }
  });

  setup(function() {
    client = this.client;
  });

  suite('#launch', function() {
    var context;

    var CALENDAR_URL = 'app://calendar.gaiamobile.org';
    setup(function(done) {
      var onsuccess = function(evt) {
        var result = evt.target.result;
        for (var i = 0; i < result.length; i++) {
          var app = result[i];
          if (app.origin === CALENDAR_URL) {
            subject = app;
            context = client.context;
            subject.launch();
            done();
          }
        }
      };

      client.mozApps.mgmt.getAll(null, onsuccess);
    });

    test('should launch the appropriate app', function(done) {
      /**
       * @param {string} app src for app.
       */
      function checkForApp(app) {
        var selector = 'iframe[src="' + app + '"]';

        if (client.isSync) {
          client.setSearchTimeout(BootWatcher.WAIT_TIME);
          var result = client.findElement(selector);
          assert.notEqual(result.id, undefined);
          done();
        } else {
          client
              .setSearchTimeout(BootWatcher.WAIT_TIME)
              .findElement(selector, function(err, result) {
                assert.notEqual(result.id, undefined);
                done();
              });
        }
      }

      if (client.context !== 'content') {
        client.setContext('content');
      }
      checkForApp(CALENDAR_URL + '/index.html');
    });

    test('should not change client context', function() {
      assert.strictEqual(client.context, context);
    });
  });
});
