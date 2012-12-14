var fs = require('fs');
var less = require('less');

describe('retina.less', function() {

  describe('.at2x()', function(){
    it('compiles correctly', function(done){
      var expected_output = fs.readFileSync('test/fixtures/less_expected_output.css', 'utf8');
      var input = fs.readFileSync('test/fixtures/test.less', 'utf8');
      less.render(input, function (e, actual_output) {
        actual_output.should.equal(expected_output);
        done();
      });
    });
  });

});
