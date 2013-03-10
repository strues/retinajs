// Create a document object because we don't have one
// in our Node test environment
delete global.document;
global.document         = {};
global.Image            = require('./fixtures/image').Image;
global.XMLHttpRequest   = require('./fixtures/xml_http_request').XMLHttpRequest;

global.exports = {
  devicePixelRatio : 0.9,
  matchMedia : function() {
    return {
      matches : false
    }
  }
}

var Retina           = require('../').Retina;
var RetinaImage      = require('../').RetinaImage;
var RetinaImagePath  = require('../').RetinaImagePath;


describe('RetinaImagePath', function() {
  var path = null;

  before(function(){
    global.document = {domain: null};
  });

  describe('@at_2x_path', function(){
    it('adds "@2x" before the extension', function(){
      path = new RetinaImagePath("/path/to/image.png");
      path.at_2x_path.should.equal("/path/to/image@2x.png");
    });
  });

  describe('#check_2x_variant()', function() {
    it('should callback with false when remote at2x image cannot be loaded', function(done) {
      path = new RetinaImagePath("/images/some_image.png");

      // Simulate error when loading 2x image
      path.at_2x_path_loads = function(callback) { callback(false); }

      path.check_2x_variant(function(hasVariant) {
        hasVariant.should.equal(false);
        done();
      });
    });

    it('should callback with true when remote at2x image exists', function(done) {
      path = new RetinaImagePath("/images/some_image.png");

      // Simulate successful loading of 2x image
      path.at_2x_path_loads = function(callback) { callback(true); }

      path.check_2x_variant(function(hasVariant) {
        hasVariant.should.equal(true);
        done();
      });
    });

    it('should add path to cache when at2x image exists', function(done) {
      path = new RetinaImagePath("/images/some_image.png");

      // Simulate successful loading of 2x image
      path.at_2x_path_loads = function(callback) { callback(true); }

      path.check_2x_variant(function(hasVariant) {
        RetinaImagePath.confirmed_paths.should.include(path.at_2x_path);
        done();
      });
    });

    it('should return true when the at2x image path has already been checked and confirmed', function(done) {
      RetinaImagePath.confirmed_paths = ['/images/some_image@2x.png']
      path = new RetinaImagePath("/images/some_image.png")

      // Simulate error when loading 2x image
      path.at_2x_path_loads = function(callback) { callback(false); }

      path.check_2x_variant(function(hasVariant) {
        hasVariant.should.equal(true);
        done();
      });
    });
  });
});
