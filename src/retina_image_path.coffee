class RetinaImagePath
  
  # Class variable [Array] 
  # cache of files we've checked on the server
  @confirmed_paths = []
  

  constructor: (@path) ->
    # Split the file extension off the image path,
    # and put it back together with @2x before the extension.
    # "/path/to/image.png" => "/path/to/image@2x.png"
    path_segments           = @path.split('.')
    path_without_extension  = path_segments.slice(0, (path_segments.length - 1)).join(".")
    extension               = path_segments[path_segments.length - 1]
    @at_2x_path             = "#{path_without_extension}@2x.#{extension}"


  # Function to test if image is external
  is_external: ->
    !!( @path.match(/^https?\:/i) and !@path.match('//' + document.domain) )

  has_2x_variant: ->
    # If the image path is on an external server,
    # exit early to avoid cross-domain ajax errors
    if @is_external()
      return false

    # If we have already checked and confirmed that
    # the @2x variant exists, then just return true
    else if @at_2x_path in RetinaImagePath.confirmed_paths
      return true

    # Otherwise, prepare an AJAX request for the HEAD only.
    # We don't need a full request because we're only
    # checking to see if the @2x version exists on the server
    else
      http = new XMLHttpRequest
      http.open('HEAD', @at_2x_path, false)
      http.send()
      
      # If we get an A-OK from the server,
      # push file path onto array of confirmed files
      if http.status in [200..399]
        RetinaImagePath.confirmed_paths.push @at_2x_path
        return true
      else
        return false
    

root = exports ? window
root.RetinaImagePath = RetinaImagePath