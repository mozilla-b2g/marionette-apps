suite('launch', function() {
  // requires
  var launch = require('../lib/launch').launch;

  var client = createClient();
  marionette.plugin('mozApps', require('../lib/apps'));

  suite('launch installed app', function() {
    var domain = 'calendar.gaiamobile.org';
    var origin = 'app://' + domain;
    setup(function(done) {
      this.timeout('20s');
      launch(client.mozApps, origin, done);
    });

    // find iframe
    var iframe;
    setup(function(done) {
      client.findElement('iframe[src*="' + domain + '"]', function(err, el) {
        if (err) return done(err);
        iframe = el;
        done();
      });
    });

    test('iframe exists', function() {
      assert.ok(iframe, 'iframe exists');
    });

    test('iframe is visible', function(done) {
      this.timeout('10s');
      /**
       * Wait until iframe is visible.
       */
      function waitForVisibility(callback) {
        iframe.displayed(function(err, isDisplayed) {
          if (err) return callback(err);
          if (isDisplayed)
            return callback();

          setTimeout(waitForVisibility, 250, callback);
        });
      }

      waitForVisibility(done);
    });
  });
});
