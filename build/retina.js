(function() {
  var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (window.devicePixelRatio > 1) {
    window.onload = function() {
      var checked_files, confirmed_files, image, load, swap_file, _i, _len, _ref, _results;
      checked_files = [];
      confirmed_files = [];
      swap_file = function(image, width, height, path) {
        image.setAttribute('width', width);
        image.setAttribute('height', height);
        return image.setAttribute('src', path);
      };
      _ref = document.getElementsByTagName("img");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        image = _ref[_i];
        _results.push((load = function() {
          var at_2x_path, extension, height, http, path_segments, path_without_extension, width;
          if (!image.complete) {
            return setTimeout(load, 5);
          } else {
            width = image.offsetWidth;
            height = image.offsetHeight;
            path_segments = image.getAttribute("src").split('.');
            path_without_extension = path_segments.slice(0, path_segments.length - 1).join(".");
            extension = path_segments[path_segments.length - 1];
            at_2x_path = "" + path_without_extension + "@2x." + extension;
            if (__indexOf.call(checked_files, at_2x_path) < 0) {
              http = new XMLHttpRequest();
              http.open('HEAD', at_2x_path, false);
              http.send();
              if (http.status === 200) {
                swap_file(image, width, height, at_2x_path);
                confirmed_files.push(at_2x_path);
              }
              return checked_files.push(at_2x_path);
            } else if (__indexOf.call(confirmed_files, at_2x_path) >= 0) {
              return swap_file(image, width, height, at_2x_path);
            }
          }
        })());
      }
      return _results;
    };
  }

}).call(this);
