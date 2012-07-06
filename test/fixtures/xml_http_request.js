function XMLHttpRequest() {
  this.status = XMLHttpRequest.status;
}

XMLHttpRequest.status = 200;

XMLHttpRequest.prototype.open = function() {
  return true;
}

XMLHttpRequest.prototype.send = function() {
  return true;
}
        
var root = (exports || window);
root.XMLHttpRequest = XMLHttpRequest;
