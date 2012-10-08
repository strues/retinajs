function XMLHttpRequest() {
  this.status = XMLHttpRequest.status;
  this.contentType = XMLHttpRequest.contentType;
  this.readyState = 4;
  this.onreadystatechange = function() {}
}

XMLHttpRequest.status = 200;
XMLHttpRequest.contentType = 'image/png';

XMLHttpRequest.prototype.open = function() {
  return true;
}

XMLHttpRequest.prototype.send = function() {
  this.onreadystatechange();
}

XMLHttpRequest.prototype.getResponseHeader = function(contentType) {
  return this.contentType;
}

var root = (exports || window);
root.XMLHttpRequest = XMLHttpRequest;
