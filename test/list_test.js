var list = require('../lib/list').list;


suite('list', function() {
  var mockApps, simulateError;
  var expected = ['Not', 'an', 'ambi', 'turner'];
  var expectedError = {
    msg: 'trollololololol'
  };

  setup(function() {
    mockApps = {};
    mockApps.mgmt = {};
    mockApps.mgmt.getAll = function(onerror, onsuccess) {
      if (simulateError) {
        onerror && onerror({
          target: {
            error: expectedError
          }
        });
      } else {
        onsuccess && onsuccess({
          target: {
            result: expected
          }
        });
      }
    };
  });

  test('onsuccess', function(done) {
    simulateError = false;
    list(mockApps, function(err, result) {
      assert.ok(!err);
      assert.deepEqual(result, expected);
      done();
    });
  });

  test('onerror', function(done) {
    simulateError = true;
    list(mockApps, function(err, result) {
      assert.ok(err);
      assert.deepEqual(err, expectedError);
      done();
    });
  });
});
