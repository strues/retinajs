delete global.document;
global.document = {};

var Retina = require('../').Retina;

describe('Retina', function() {
  before(function() {
    // stub out the getElementsByTagName method
    global.document = {
      getElementsByTagName: function() {
        return [];
      }
    }
  });
});
