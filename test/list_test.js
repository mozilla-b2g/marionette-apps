suite('list', function() {
  var list = require('../lib/list').list;

  var response,
      appsMock = {};
  setup(function() {
    response = {};
    appsMock.mgmt = {};
    appsMock.mgmt.getAll = function() {
      return response;
    };
  });

  test('success', function(done) {
    var result = [];

    list(appsMock, function(err, list) {
      assert.ok(!err, 'error');
      assert.equal(list, result, 'apps');
      done();
    });

    response.onsuccess({
      target: {
        result: result
      }
    });
  });

  test('error', function(done) {
    var error = new Error();
    list(appsMock, function(givenErr) {
      assert.equal(givenErr, error, 'error');
      done();
    });
    response.onerror({
      target: {
        error: error
      }
    });
  });
});
