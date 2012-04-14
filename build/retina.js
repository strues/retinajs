(function() {

  if (window.devicePixelRatio > 1) {
    window.onload = function() {
      var image, is_external, load, _i, _len, _ref, _results;
      is_external = function(href) {
        return !!(href.match(/^https?\:/i) && !href.match(document.domain));
      };
      _ref = document.getElementsByTagName("img");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        image = _ref[_i];
        _results.push((load = function() {
          var at_2x_path, extension, height, http, path, path_segments, path_without_extension, width;
          if (!image.complete) {
            return setTimeout(load, 5);
          } else {
            path = image.getAttribute("src");
            if (is_external(path)) return;
            width = image.offsetWidth;
            height = image.offsetHeight;
            path_segments = path.split('.');
            path_without_extension = path_segments.slice(0, path_segments.length - 1).join(".");
            extension = path_segments[path_segments.length - 1];
            at_2x_path = "" + path_without_extension + "@2x." + extension;
            http = new XMLHttpRequest();
            http.open('HEAD', at_2x_path, false);
            http.send();
            if (http.status === 200) {
              image.setAttribute('width', width);
              image.setAttribute('height', height);
              return image.setAttribute("src", at_2x_path);
            }
          }
        })());
      }
      return _results;
    };
  }

}).call(this);
