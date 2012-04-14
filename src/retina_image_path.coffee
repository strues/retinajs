class RetinaImagePath
  
  @confirmed_paths = []
  
  constructor: (@path) ->
    path_segments           = @path.split('.')
    path_without_extension  = path_segments.slice(0, (path_segments.length - 1)).join(".")
    extension               = path_segments[path_segments.length - 1]
    @at_2x_path             = "#{path_without_extension}@2x.#{extension}"

  is_external: ->
    !!( @path.match(/^https?\:/i) and !@path.match(document.domain) )    

  has_2x_variant: ->
    if @is_external()
      return false
    
    else if @at_2x_path in RetinaImagePath.confirmed_paths
      return true

    else
      http = new XMLHttpRequest
      http.open('HEAD', @at_2x_path, false)
      http.send()
      if http.status is 200
        RetinaImagePath.confirmed_paths.push @at_2x_path
        return true
    

root = exports ? window
root.RetinaImagePath = RetinaImagePath