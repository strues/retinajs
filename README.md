# retina.js [![Build Status](https://secure.travis-ci.org/imulus/retinajs.png?branch=master)](http://travis-ci.org/imulus/retinajs)

> Retina.js has been updated to version 2.0! With this update, the API has changed a bit. Make sure to go over this readme before updating.

### JavaScript, LESS and SASS helpers for rendering high-resolution image variants

retina.js makes it easy to serve high-resolution images to devices with retina displays. Prepare images for as many pixel densities as you want and let retina.js dynamically serve the right image to the user.

[![Build Status](https://secure.travis-ci.org/imulus/retinajs.png?branch=master)](http://travis-ci.org/imulus/retinajs)

## How it works

With the release of version 2.0, retina.js now requires each image to opt in rather than assuming all `img` tags are retina-ready.

When your users load a page, retina.js makes a selection of all `img` tags with a `data-rjs` attribute. For each of those images, it checks to see if there is a high-resolution version of that image on your server. If a high-resolution variant exists, the script will swap in that image in-place.

The script assumes you use Apple's prescribed high-resolution modifiers (@2x, @3x, etc) to denote high-resolution image variants on your server. It also assumes that if you have prepared a variant for @3x environments, that you have also prepared a variant for @2x environments. With that in mind, you'll specify your highest environment level with the `data-rjs` attribute and let retina.js take it from there.

For example, let's say you have an image on your page that looks like this:

```html
<img src="/images/my_image.png" data-rjs="3" />
```

retina.js will assume that the url you placed in the `src` attribute is a standard, non-retina image. Since you gave the `data-rjs` attribute a value of "3", it will also assume that a variant for @2x environments **AND** a variant for @3x environments exists on the server. If you had said "4" instead of "3", it would have assumed variants existed for @2x, @3x, and @4x – everything up through the value you specified.

In this case, we've set our resolution cap at "3". When the page loads, retina.js will check the actual resolution of the device environment to decide whether it should really serve up an @3x image. If the user If the user happens to be in an @2x environment, retina.js will not try to serve up your @3x image. It will serve up the @2x image instead. It will look for that image at `/images/my_image@2x.png`.

If the environment does have @3x capabilities, retina.js will serve up the @3x image. It will expect that url to be `/images/my_image@3x.png`. If the environment has capabilities to display images at higher densities than @3x, retina.js will serve up the image of the highest resolution that you've provided, in this case @3x.


## How to use

### JavaScript

The JavaScript helper script replaces images on your page with high-resolution variants (if they exist). There are a couple of ways to use it. If you'd like to use retina.js the old-fashioned way, download the _minified script_ and include it at the bottom of your page. This will cause retina.js to automatically kick in and replace images as soon as the page loads.

1. Place the **retina.min.js** file on your server.
2. Include the script on your page (put it at the bottom of your template, before your closing \</body> tag)

``` html
<script type="text/javascript" src="/scripts/retina.min.js"></script>
```

Note that only the minified file is designed to be directly placed into your html.

The other way to use retina.js is to `import` it as part of a larger build process. In this case, retina.js won't run automatically. Instead it'll let you determine when you'd like it to run.

```JavaScript
import retina from 'retina';

window.addEventListener('load', retina);
```


###LESS & SASS

The LESS &amp; SASS CSS mixins are helpers for applying high-resolution background images in your stylesheet. You provide it with an image path and the dimensions of the original-resolution image. The mixin creates a media query specifically for Retina displays, changes the background image for the selector elements to use the high-resolution (@2x) variant and applies a background-size of the original image in order to maintain proper dimensions. To use it, download the mixin, import or include it in your LESS or SASS stylesheet, and apply it to elements of your choice. The SASS versions require you pass the extension separately from the path.

*Syntax:*

``` less
.at2x(@path, [optional] @width: auto, [optional] @height: auto);
```

``` scss
@include at2x($path, [option] $ext: "jpg", [optional] $width: auto, [optional] $height: auto);
```

*Steps:*

1. LESS - Add the .at2x() mixin from retina.less to your LESS stylesheet (or reference it in an @import statement)
SASS - Add the @mixin at2x() from retina.scss or retina.sass to your SASS stylesheet (or reference it in an @import)
2. LESS - In your stylesheet, call the .at2x() mixin anywhere instead of using background-image
SASS - In your stylesheet, call @include at2x() anywhere instead of using background-image

This:

``` less
.logo {
  .at2x('/images/my_image.png', 200px, 100px);
}
```

``` sass
.logo {
  @include at2x('/images/my_image', png, 200px, 100px);
}
```

Will compile to:

``` css
.logo {
  background-image: url('/images/my_image.png');
}

@media all and (-webkit-min-device-pixel-ratio: 1.5) {
  .logo {
    background-image: url('/images/my_image@2x.png');
    background-size: 200px 100px;
  }
}
```

### Ruby on Rails 3.x

...or any framework that embeds some digest/hash to the asset URLs based on the contents, e.g. `/images/image-{hash1}.jpg`.

The problem with this is that the high-resolution version would have a different hash, and would not conform the usual pattern, i.e. `/images/image@2x-{hash2}.jpg`. So automatic detection would fail because retina.js would check the existence of `/images/image-{hash1}@2x.jpg`.

There's no way for retina.js to know beforehand what the high-resolution image's hash would be without some sort of help from the server side. So in this case, the suggested method is to supply the high-resolution URLs using the `data-at2x` attributes as previously described in the How It Works section.

In Rails, one way to automate this is using a helper, e.g.:

```ruby
# in app/helpers/some_helper.rb or app/helpers/application_helper.rb
def image_tag_with_at2x(name_at_1x, options={})
  name_at_2x = name_at_1x.gsub(%r{\.\w+$}, '@2x\0')
  image_tag(name_at_1x, options.merge("data-at2x" => asset_path(name_at_2x)))
end
```

And then in your views (templates), instead of using image_tag, you would use image_tag_with_at2x, e.g. for ERB:

```erb
<%= image_tag_with_at2x "logo.png" %>
```

It would generate something like:

```html
<img src="logo-{hash1}.png" data-at2x="logo@2x-{hash2}.png" />
```

## How to test

We use [mocha](http://visionmedia.github.com/mocha/) for unit testing with [should](https://github.com/visionmedia/should.js) assertions. Install mocha and should by running `npm install`.

To run the test suite:

``` bash
$ npm test
```

Use [http-server](https://github.com/nodeapps/http-server) for node.js to test it. To install, run `npm install -g http-server`.

If you've updated `retina.js` be sure to copy it from `src/retina.js` to `test/functional/public/retina.js`.

To start the server, run:

``` bash
$ cd test/functional && http-server
```

Then navigate your browser to [http://localhost:8080](http://localhost:8080)

After that, open up `test/functional/public/index.html` in your editor, and try commenting out the line that spoofs retina support, and reloading it.


# TODO

- Sass, and less mixins
- Make a decision about rails
- Unit tests
- Change readme for css, rails, and unit tests
