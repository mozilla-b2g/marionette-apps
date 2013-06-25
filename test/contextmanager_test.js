
var ContextManager = require(__dirname + '/../lib/contextmanager');


suite('ContextManager', function() {
  var client, subject;

  setup(function() {
    client = {
      context: 'content',
      setContext: function() {}
    };

    subject = new ContextManager(client);
  });

  test('#restoreContext', function() {
    subject.saveContext();
    subject.setContext('chrome');
    subject.restoreContext();
    assert.strictEqual(client.context, 'content');
  });

  test('#saveContext', function() {
    subject.saveContext();
    assert.strictEqual(subject.savedContext, 'content');
  });

  test('#setContext', function() {
    subject.setContext('chrome');
    assert.equal(client.context, 'chrome');
  });
});
