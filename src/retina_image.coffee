#= require retina_image_path.coffee

class RetinaImage

  constructor: (@el) ->
    @path = new RetinaImagePath(@el.getAttribute('src'))
    @swap() if @path.has_2x_variant()



  # Method for swapping in a new image path
  # Applies the dimensions of the existing image
  # to the image with the new image path
  swap: (path = @path.at_2x_path) ->

    # We wrap this in a named self-executer so we can reference 
    # it in a setTimeout if the image has not loaded yet.
    do load = =>

      # Check that the image has loaded.
      # We need to wait for the image to load to grab proper dimensions.
      unless @el.complete  

        # If it has not, try again in a few milliseconds.
        # We've found 5ms to be the fastest we can crank this up
        # and still have the script detect image loads reliably and efficiently.
        setTimeout load, 5

      # Once the the image has loaded we know we 
      # can grab the proper dimensions of the original image
      # and go ahead and swap in the new image path and apply the dimensions
      else
        swap = true;

        # If offsetWidth is 0, the image is probably hidden
        if @el.offsetWidth != 0
          width = @el.offsetWidth
        else
          # try to get width from the image attribute
          if @el.getAttribute('width')
            width = @el.getAttribute('width')
          else
            # we have no knowledge about the width, abort because it
            # would brake the image size
            swap = false;

        # Same also for the height
        if @el.offsetHeight != 0
          height = @el.offsetHeight
        else
          if @el.getAttribute('height')
            height = @el.getAttribute('height')
          else
            swap = false;


        if (swap)
          @el.setAttribute('width', width)
          @el.setAttribute('height', height)
          @el.setAttribute('src', path)


root = exports ? window
root.RetinaImage = RetinaImage