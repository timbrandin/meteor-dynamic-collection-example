Template.ifEmpty.isEmpty = function () {
  var o = this.valueOf();
  if (typeof o === 'array') {
    return o.length === 0;
  }
  if (typeof o === 'string') {
    return o.trim().length === 0;
  }
  if (typeof o === 'number') {
    return o === 0;
  }
  if (typeof o === 'object' && typeof o.count === 'function') {
    return o.count() === 0;
  }
  return false;
}
