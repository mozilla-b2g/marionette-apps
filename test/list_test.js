var list = require('../lib/list').list;


suite('list', function() {
  var mockApps, simulateError;
  var expected = ['Not', 'an', 'ambi', 'turner'];
  var expectedError = {
    msg: 'trollololololol'
  };

  setup(function() {
    mockApps = {};
    mockApps._client = {};
    mockApps._client.isSync = true;
    mockApps.mgmt = {};
    mockApps.mgmt.getAll = function(onerror, onsuccess) {
      var result = { target: { result: expected } };

      if (mockApps._client.isSync) {
        if (simulateError) {
          throw expectedError;
        } else {
          return result;
        }
      }

      if (simulateError) {
        onerror && onerror({
          target: {
            error: expectedError
          }
        });
      } else {
        onsuccess && onsuccess(result);
      }
    };
  });

  test('onsuccess sync', function() {
    simulateError = false;
    mockApps._client.isSync = true;
    var result = list(mockApps);
    assert.deepEqual(result, expected);
  });

  test('onerror sync', function(done) {
    simulateError = true;
    mockApps._client.isSync = true;
    try {
      list(mockApps);
    } catch (e) {
      assert.strictEqual(e.msg, expectedError.msg);
      done();
    }
  });

  test('onsuccess async', function(done) {
    simulateError = false;
    mockApps._client.isSync = false;
    list(mockApps, function(err, result) {
      assert.ok(!err);
      assert.deepEqual(result, expected);
      done();
    });
  });

  test('onerror async', function(done) {
    simulateError = true;
    mockApps._client.isSync = false;
    list(mockApps, function(err, result) {
      assert.ok(err);
      assert.deepEqual(err, expectedError);
      done();
    });
  });
});
