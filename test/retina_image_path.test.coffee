# Create a document object because we don't have one
# in our Node test environment
global.document = {domain: null}

{RetinaImagePath} = require '../src/retina_image_path'


describe 'RetinaImagePath', ->
  path = null 
  
  describe '#is_external()', ->
    it 'should return true when image path references a remote domain with www', ->
      document.domain = "www.apple.com"
      path = new RetinaImagePath("http://www.google.com/images/some_image.png")
      path.is_external().should.equal true


    it 'should return true when image path references a remote domain without www', ->
      document.domain = "www.apple.com"
      path = new RetinaImagePath("http://google.com/images/some_image.png")
      path.is_external().should.equal true


    it 'should return true when image path references a remote domain with https', ->
      document.domain = "www.apple.com"
      path = new RetinaImagePath("https://google.com/images/some_image.png")
      path.is_external().should.equal true

    
    it 'should return true when image path is a remote domain with www and domain is localhost', ->
      document.domain = "localhost"
      path = new RetinaImagePath("http://www.google.com/images/some_image.png")
      path.is_external().should.equal true


    it 'should return true when image path is a remote domain without www and domain is localhost', ->
      document.domain = "localhost"
      path = new RetinaImagePath("http://google.com/images/some_image.png")
      path.is_external().should.equal true
    
    it 'should return true when image path has www and domain does not', ->
      document.domain = "apple.com"
      path = new RetinaImagePath("http://www.apple.com/images/some_image.png")
      path.is_external().should.equal true


    it 'should return true when image path does not have www and domain does', ->
      document.domain = "www.apple.com"
      path = new RetinaImagePath("http://apple.com/images/some_image.png")
      path.is_external().should.equal true


    it 'should return false when image path is relative with www', ->
      document.domain = "www.apple.com"
      path = new RetinaImagePath("/images/some_image.png")
      path.is_external().should.equal false


    it 'should return false when image path is relative without www', ->
      document.domain = "apple.com"
      path = new RetinaImagePath("/images/some_image.png")
      path.is_external().should.equal false
    
    
    it 'should return false when image path is relative to localhost', ->
      document.domain = "localhost"
      path = new RetinaImagePath("/images/some_image.png")
      path.is_external().should.equal false

    
    it 'should return false when image path has same domain as current site with www', ->
      document.domain = "www.apple.com"
      path = new RetinaImagePath("http://www.apple.com/images/some_image.png")
      path.is_external().should.equal false    

        
    it 'should exit early and return false when image path is external', ->
      document.domain = "www.apple.com"
      path = new RetinaImagePath("http://google.com/images/some_image.png")
      path.has_2x_variant().should.equal false
    

  describe '#has_@2x_variant()', ->    
    it 'should return true when the at2x image path has already been checked and confirmed', ->
      RetinaImagePath.confirmed_paths = ['/images/some_image@2x.png']
      path = new RetinaImagePath("/images/some_image.png")
      path.has_2x_variant().should.equal true
    