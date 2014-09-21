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

});
