function Image() {
  this.complete = true;
  this.attributes = {
    src: '/images/some_image.png',
    width: 500,
    height: 400
  };
}

Image.prototype.setAttribute = function(name, value) {
  this.attributes[name] = value;
};

Image.prototype.getAttribute = function(name) {
  return this.attributes[name];
};

var root = (exports || window);
root.Image = Image;
