class Image

  constructor: -> 
    @complete = true
    @attributes = 
      src          : "/images/some_image.png"
      offsetWidth  : 500
      offsetHeight : 400    

  setAttribute: (name, value) ->
    @attributes[name] = value

  getAttribute: (name) ->
    return @attributes[name]

    
      
root = exports ? window
root.Image = Image