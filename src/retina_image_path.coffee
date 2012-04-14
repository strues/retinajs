class RetinaImagePath
  
  @domain = if document?.domain? then document.domain
  
  constructor: (@path) ->
    path_segments           = @path.split('.')
    path_without_extension  = path_segments.slice(0, (path_segments.length - 1)).join(".")
    extension               = path_segments[path_segments.length - 1]
    @at_2x_path             = "#{path_without_extension}@2x.#{extension}"

  is_external: ->
    !!( @path.match(/^https?\:/i) and !@path.match(RetinaImagePath.domain) )    

  has_2x_variant: ->
    return false if @is_external()
    http = new XMLHttpRequest
    http.open('HEAD', @at_2x_path, false)
    http.send()
    http.status is 200

root = exports ? window
root.RetinaImagePath = RetinaImagePath