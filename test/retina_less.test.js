var fs = require('fs');
var less = require('less');

describe('retina.less', function() {

  describe('.at2x()', function(){
    it('compiles correctly', function(done){
      var desired_output = fs.readFileSync('test/fixtures/desired_output.css', 'utf8');
      var input = fs.readFileSync('test/fixtures/test.less', 'utf8');
      less.render(input, function (e, actual_output) {
        actual_output.should.equal(desired_output);
        done();
      });
    });
  });

});
