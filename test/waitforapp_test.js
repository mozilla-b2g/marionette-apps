suite('waitforapp', function() {
  // requires
  var waitForApp = require('../lib/waitforapp').waitForApp;

  var client = createClient();
  marionette.plugin('mozApps', require('../lib/apps'));

  suite('waiting for running app', function() {
    var domain = 'homescreen.gaiamobile.org';
    var source = 'app://' + domain;
    var element;

    setup(function(done) {
      this.timeout('20s');
      waitForApp(client.mozApps, domain, function(err, el) {
        if (err) return done(err);
        element = el;
        done();
      });
    });

    test('it should return element', function(done) {
      assert.ok(element);
      element.getAttribute('src', function(err, src) {
        if (err) return callback(err);
        assert.ok(src.indexOf(domain) !== -1, domain);
        done();
      });
    });

    test('iframe is visible', function(done) {
      var iframe;
      client.findElement('iframe[src*="' + domain + '"]', function(err, el) {
        el.displayed(function(err, displayed) {
          assert.ok(displayed);
          done();
        });
      });
    });
  });
});

