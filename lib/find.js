Object.defineProperty(Array.prototype, 'find', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: find
});

function find(predicate, thisArg) {
  if (typeof this !== 'object') {
    throw new Error('Array.prototype.find called on non-object?');
  }

  if (typeof predicate !== 'function') {
    throw new Error('predicate must be a function');
  }

  for (var i = 0; i < this.length; i++) {
    var value = this[i];
    if (predicate.call(thisArg, value, i, this)) {
      return value;
    }
  }

  return undefined;
}
