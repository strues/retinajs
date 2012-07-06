class XMLHttpRequest
  @status = 200
  @onreadystatechange

  constructor: ->
    @status = XMLHttpRequest.status
    @readyState = 4

  open: -> true

  send: =>
    @onreadystatechange()


root = exports ? window
root.XMLHttpRequest = XMLHttpRequest