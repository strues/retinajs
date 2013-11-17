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

    it('uses data-@2x when supplied', function(){
      path = new RetinaImagePath("/path/to/image-hash1.png", "/path/to/image@2x-hash2.png");
      path.at_2x_path.should.equal("/path/to/image@2x-hash2.png");
    });
  });

  describe('#is_external()', function() {
    it('should return true when image path references a remote domain with www', function() {
      document.domain = "www.apple.com";
      path = new RetinaImagePath("http://www.google.com/images/some_image.png");
      path.is_external().should.equal(true);
    });

    it('should return true when image path references a remote domain without www', function() {
      document.domain = "www.apple.com";
      path = new RetinaImagePath("http://google.com/images/some_image.png");
      path.is_external().should.equal(true);
    });

    it('should return true when image path references a remote domain with https', function() {
      document.domain = "www.apple.com";
      path = new RetinaImagePath("https://google.com/images/some_image.png");
      path.is_external().should.equal(true);
    });

    it('should return true when image path is a remote domain with www and domain is localhost', function() {
      document.domain = "localhost";
      path = new RetinaImagePath("http://www.google.com/images/some_image.png");
      path.is_external().should.equal(true);
    });

    it('should return true when image path is a remote domain without www and domain is localhost', function() {
      document.domain = "localhost"
      path = new RetinaImagePath("http://google.com/images/some_image.png")
      path.is_external().should.equal(true);
    });

    it('should return true when image path has www and domain does not', function() {
      document.domain = "apple.com";
      path = new RetinaImagePath("http://www.apple.com/images/some_image.png");
      path.is_external().should.equal(true);
    });

    it('should return true when image path does not have www and domain does', function() {
      document.domain = "www.apple.com";
      path = new RetinaImagePath("http://apple.com/images/some_image.png");
      path.is_external().should.equal(true);
    });

    it('should return false when image path is relative with www', function() {
      document.domain = "www.apple.com";
      path = new RetinaImagePath("/images/some_image.png");
      path.is_external().should.equal(false);
    });

    it('should return false when image path is relative without www', function() {
      document.domain = "apple.com";
      path = new RetinaImagePath("/images/some_image.png");
      path.is_external().should.equal(false);
    });

    it('should return false when image path is relative to localhost', function() {
      document.domain = "localhost";
      path = new RetinaImagePath("/images/some_image.png");
      path.is_external().should.equal(false);
    });

    it('should return false when image path has same domain as current site with www', function() {
      document.domain = "www.apple.com";
      path = new RetinaImagePath("http://www.apple.com/images/some_image.png");
      path.is_external().should.equal(false);
    });
  });

  describe('#check_2x_variant()', function() {
    it('should callback with false when #is_external() is true', function(done) {
      document.domain = "www.apple.com";
      path = new RetinaImagePath("http://google.com/images/some_image.png");
      path.check_2x_variant(function(hasVariant) {
        hasVariant.should.equal(false);
        done();
      });
    });

    it('should callback with true when at2x is supplied', function(done) {
      path = new RetinaImagePath("/images/some_image.png", "/images/some_image@100x.png");
      path.check_2x_variant(function(hasVariant) {
        hasVariant.should.equal(true);
        done();
      });
    });

    it('should callback with false when remote at2x image does not exist', function(done) {
      XMLHttpRequest.status = 404; // simulate a failing request
      XMLHttpRequest.contentType = 'image/png'; // simulate a proper content type
      path = new RetinaImagePath("/images/some_image.png");
      path.check_2x_variant(function(hasVariant) {
        hasVariant.should.equal(false);
        done();
      });
    });

    it('should callback with false when content-type is not an image type', function(done) {
      XMLHttpRequest.status = 200; // simulate a an image request that comes back OK
      XMLHttpRequest.contentType = 'text/html'; // but is actually an improperly coded 404 page
      path = new RetinaImagePath("/images/some_image.png");
      path.check_2x_variant(function(hasVariant) {
        hasVariant.should.equal(false);
        done();
      });
    });

    it('should callback with true when content-type is wrong, but check_mime_type is false', function(done) {
      XMLHttpRequest.status = 200; // simulate a proper request
      XMLHttpRequest.contentType = 'text/html'; // but with an incorrect content type

      Retina.configure({
        check_mime_type: false // but ignore it
      });

      path = new RetinaImagePath("/images/some_image.png");
      path.check_2x_variant(function(hasVariant) {
        hasVariant.should.equal(true);

        Retina.configure({
          check_mime_type: true
        });

        done();
      });
    });

    it('should callback with true when remote at2x image exists', function(done) {
      XMLHttpRequest.status = 200; // simulate a proper request
      XMLHttpRequest.contentType = 'image/png'; // simulate a proper content type
      path = new RetinaImagePath("/images/some_image.png");
      path.check_2x_variant(function(hasVariant) {
        hasVariant.should.equal(true);
        done();
      });
    });

    it('should add path to cache when at2x image exists', function(done) {
      XMLHttpRequest.status = 200; // simulate a proper request
      XMLHttpRequest.contentType = 'image/png'; // simulate a proper content type
      path = new RetinaImagePath("/images/some_image.png");
      path.check_2x_variant(function(hasVariant) {
        RetinaImagePath.confirmed_paths.should.include(path.at_2x_path);
        done();
      });
    });

    it('should return true when the at2x image path has already been checked and confirmed', function(done) {
      RetinaImagePath.confirmed_paths = ['/images/some_image@2x.png']
      path = new RetinaImagePath("/images/some_image.png")
      path.check_2x_variant(function(hasVariant) {
        hasVariant.should.equal(true);
        done();
      });
    });
  });
});
