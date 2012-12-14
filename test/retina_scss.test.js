var fs = require('fs');
var sass = require('node-sass');

describe('retina.scss', function() {

  describe('.at2x()', function() {
    it('compiles correctly', function(done) {
      var expected_output = fs.readFileSync('test/fixtures/scss_expected_output.css', 'utf8');
      var input = fs.readFileSync('test/fixtures/test.scss', 'utf8');
      sass.render(input, function (e, actual_output) {
        actual_output.should.equal(expected_output);
        done();
      });
    });
  });

});

