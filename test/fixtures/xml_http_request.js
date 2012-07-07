function XMLHttpRequest() {
  this.status = XMLHttpRequest.status;
  this.readyState = 4;
  this.onreadystatechange = function() {}
}

XMLHttpRequest.status = 200;

XMLHttpRequest.prototype.open = function() {
  return true;
}

XMLHttpRequest.prototype.send = function() {
  this.onreadystatechange();
}
        
var root = (exports || window);
root.XMLHttpRequest = XMLHttpRequest;
