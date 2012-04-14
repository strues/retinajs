#= require retina_image_path.coffee

class RetinaImage
  constructor: (@el) ->
    @path = new RetinaImagePath(@el.getAttribute('src'))
    @swap() if @path.has_2x_variant()
  
  swap: (path = @path.at_2x_path)->
    do load = =>
      unless @el.complete  
        setTimeout load, 5
      else
        @el.setAttribute('width', @el.offsetWidth)
        @el.setAttribute('height', @el.offsetHeight)
        @el.setAttribute('src', path)

root = exports ? window
root.RetinaImage = RetinaImage