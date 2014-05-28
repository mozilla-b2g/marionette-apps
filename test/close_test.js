suite('close', function() {
  // requires
  var Apps = require('../lib/apps'),
      close = require('../lib/close').close,
      launch = require('../lib/launch').launch,
      client = createClient();

  marionette.plugin('mozApps', Apps);

  suite('close app', function() {
    var origin = 'app://calendar.gaiamobile.org';
    var element;

    setup(function() {
      client.setSearchTimeout(100);
      launch(client.mozApps, origin);
    });

    test('when it is on foreground', function() {
      close(client.mozApps, origin);

      client.findElement('iframe[src*="' + origin + '"]', function(err, el) {
        assert.ok(err, 'has error');
        assert.equal(err.type, 'NoSuchElement', 'element is missing');
      });
    });

    test('when it is on background', function() {
      // Go to homescreen, and calendar app will be on background.
      client.executeScript(function() {
        window.wrappedJSObject.dispatchEvent(new CustomEvent('home'));
      });
      close(client.mozApps, origin);

      client.findElement('iframe[src*="' + origin + '"]', function(err, el) {
        assert.ok(err, 'has error');
        assert.equal(err.type, 'NoSuchElement', 'element is missing');
      });
    });
  });

  suite('close entrypoint app', function() {
    var origin = 'app://communications.gaiamobile.org';

    // launch some other entrypoint
    setup(function(done) {
      launch(client.mozApps, origin, 'ftu', done);
    });

    // launch contacts (which we will close later)
    var contacts;
    setup(function(done) {
      launch(client.mozApps, origin, 'contacts', function(err, app) {
        contacts = app;
        done(err);
      });
    });

    setup(function(done) {
      close(client.mozApps, origin, 'contacts', done);
    });

    test('closes right app', function(done) {
      var source = origin + '/' + contacts.entrypoint.details.launch_path;

      client.setSearchTimeout(100);
      client.findElement('iframe[src*="' + source + '"]', function(err, el) {
        assert.ok(err, 'has error');
        assert.equal(err.type, 'NoSuchElement', 'element is missing');
        done();
      });
    });
  });
});


