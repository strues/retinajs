// Create a document object because we don't have one
// in our Node test environment
delete global.document;

global.document = {
  // stub out the getElementsByTagName method
  getElementsByTagName : function(){
    return [];
  }
}


var Retina = require('../').Retina;

describe('Retina', function() {

  describe('init', function(){
    it('stashes the existing onload and executes it later', function(){
      var existingOnloadExecutions = 0;
      var window = {
        onload : function() {
          existingOnloadExecutions++;
        }
      };
      Retina.init(window);
      window.onload();
      existingOnloadExecutions.should.equal(1);
    });
  });

});
