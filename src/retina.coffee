# retina.coffee
# Source for retina.js, a high-resolution image swapper (http://www.retinajs.com)


# We don't wrap this up into any kind of namespace 
# because we want it to be self-executing on page load
# The CoffeeScript compiler automatically wraps it in
# closure for safety, passing the window object.

# To keep things minimal, we intentionally don't get fancy here 
# by using classes or functions. The Closure Compiler optimizes
# everything quite a bit, but the trick here is keeping everything fast.


# First check that we're on a retina device.
# We don't even want this guy executing if we're not.
# Bind everything to the window object's onload.
# This helps wait for the images to get loaded into the DOM.
if window.devicePixelRatio > 1 
  window.onload = ->

    # Function to test if image is external
    is_external = (href) ->
      !!( href.match(/^https?\:/i) and !href.match(document.domain) )

    # Grab all of the <img> elements on the page and loop over them
    for image in document.getElementsByTagName("img")

      # We wrap this in a named self-executer so we can reference 
      # it in a setTimeout if the image has not loaded yet.
      do load = ->
        
        # Check that the image has loaded.
        # We need to wait for the image to load to grab proper dimensions.
        unless image.complete  

          # If it has not, try again in a few milliseconds.
          # We've found 5ms to be the fastest we can crank this up
          # and still have the script detect image loads reliably and efficiently.
          setTimeout load, 5
          
        else

          # Get image src
          path = image.getAttribute("src")

          # Return early if image has external path
          if is_external(path)
            return
          
          # Grab the image's in-place dimensions.
          width  = image.offsetWidth
          height = image.offsetHeight
          
          # Split the file extension off the image path,
          # and put it back together with @2x before the extension.
          # "/path/to/image.png" => "/path/to/image@2x.png"
          path_segments           = path.split('.')
          path_without_extension  = path_segments.slice(0, (path_segments.length - 1)).join(".")
          extension               = path_segments[path_segments.length - 1]
          at_2x_path              = "#{path_without_extension}@2x.#{extension}"

          # Prepare an AJAX request for the HEAD only.
          # We don't need a full request because we're only
          # checking to see if the @2x version exists on the server
          http = new XMLHttpRequest()
          http.open('HEAD', at_2x_path, false)
          http.send()

          # If we get an A-OK from the server, 
          # apply the in-place dimensions and swap the source to the high-res variant
          if http.status is 200
            image.setAttribute('width', width)
            image.setAttribute('height', height)
            image.setAttribute("src", at_2x_path)

