// Create a document object because we don't have one
// in our Node test environment
delete global.document;
global.document = {};

var Retina = require('../').Retina;

describe('Retina', function() {

  before(function(){
    // stub out the getElementsByTagName method
    global.document = {
      getElementsByTagName : function(){
        return [];
      }
    }
  });

  describe('init', function(){
    it('stashes the existing onload and executes it later', function(){
      var existingOnloadExecutions = 0;
      var window = {
        matchMedia : function() {
          return { matches: false }
        },
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
