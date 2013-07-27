var Apps = require('../lib/apps');

suite('Apps', function() {
  var client, subject;

  Helper.client({
    plugins: {
      mozApps: require('../lib/apps')
    }
  });

  setup(function() {
    client = this.client;
  });

  suite('#setup', function() {
    var apps;

    test('should return an App with a _client', function() {
      assert.ok(client.mozApps instanceof Apps);
      assert.strictEqual(client.mozApps._client, client);
    });
  });
});
