var fs = require('fs');
var stylus = require('stylus');

describe('retina.styl', function() {

  describe('at2x()', function(){
    it('compiles correctly', function(done){
      var expected_output = fs.readFileSync('test/fixtures/styl_expected_output.css', 'utf8');
      var input = fs.readFileSync('test/fixtures/test.styl', 'utf8');
      stylus.render(input, function (e, actual_output) {
        actual_output.should.equal(expected_output);
        done();
      });
    });
  });

});
