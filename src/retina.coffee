#= require retina_image.coffee

if window.devicePixelRatio > 1
  window.onload = ->
    new RetinaImage(image) for image in document.getElementsByTagName("img")
