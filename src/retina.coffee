#= require retina_image.coffee

window.onload = ->
  new RetinaImage(image) for image in document.getElementsByTagName("img")
