var Apps = require('../lib/apps');

suite('Apps', function() {
  var client = createClient();
  var subject;

  marionette.plugin('mozApps', require('../lib/apps'));

  suite('#setup', function() {
    var apps;

    test('should return an App with a _client', function() {
      assert.ok(client.mozApps instanceof Apps);
      assert.strictEqual(client.mozApps._client, client);
    });
  });
});
