class XMLHttpRequest
  @status = 200

  constructor: -> 
    @status = XMLHttpRequest.status

  open: -> true

  send: -> true
        
root = exports ? window
root.XMLHttpRequest = XMLHttpRequest