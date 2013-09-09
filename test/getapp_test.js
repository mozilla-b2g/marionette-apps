suite('getapp', function() {
  var getApp = require('../lib/getapp').getApp;

  marionette.plugin('mozApps', require('../lib/apps'));
  var client = createClient();

  var calendarOrigin = 'app://calendar.gaiamobile.org';

  test('success origin', function(done) {
    getApp(client.mozApps, calendarOrigin, function(err, app) {
      assert.equal(app.origin, calendarOrigin, 'origin');
      assert.equal(app.source, calendarOrigin, 'source');
      done();
    });
  });

  test('missing origin', function(done) {
    var origin = 'xfoobarbaz';
    getApp(client.mozApps, origin, function(err) {
      assert.ok(err, 'has error');
      assert.ok(err.message.match(origin, 'has correct type of error'));
      done();
    });
  });

  suite('entrypoint apps', function() {
    var origin = 'app://communications.gaiamobile.org';
    var app;

    // get the app without the entrypoint
    setup(function(done) {
      app = getApp(client.mozApps, origin, function(err, _app) {
        app = _app;
        done(err);
      });
    });

    test('success', function(done) {
      getApp(client.mozApps, origin, 'contacts', function(err, contacts) {
        assert.deepEqual(
          contacts.entrypoint,
          {
            name: 'contacts',
            details: app.manifest.entry_points.contacts
          },
          'entrypoint'
        );

        var launchPath = contacts.entrypoint.details.launch_path;

        assert.ok(contacts.source.indexOf(origin) !== -1, 'has origin');
        assert.ok(
          contacts.source.indexOf(launchPath) !== -1,
          'has launchPath'
        );

        done();
      });
    });

    test('failure', function(done) {
      var entrypoint = 'epicfail';
      getApp(client.mozApps, origin, entrypoint, function(err) {
        assert.ok(err, 'has error');
        assert.ok(
          err.message.match(entrypoint),
          'error message contains: ' + entrypoint
        );
        done();
      });
    });
  });
});
