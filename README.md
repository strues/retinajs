# retina.js [![Build Status](https://secure.travis-ci.org/imulus/retinajs.png?branch=master)](http://travis-ci.org/imulus/retinajs)

> Retina.js has been updated to version 2.0! With this update, the API has changed a bit. Make sure to go over this readme before updating.

### JavaScript, LESS and SASS helpers for rendering high-resolution image variants

retina.js makes it easy to serve high-resolution images to devices with retina displays. Prepare images for as many pixel densities as you want and let retina.js dynamically serve the right image to the user.

[![Build Status](https://secure.travis-ci.org/imulus/retinajs.png?branch=master)](http://travis-ci.org/imulus/retinajs)

## How it works

With the release of version 2.0, retina.js now requires each image to opt in rather than assuming all `img` tags are retina-ready.

When your users load a page, retina.js makes a selection of all `img` tags with a `data-rjs` attribute. For each of those images, it checks to see if there is a high-resolution version of that image on your server. If a high-resolution variant exists, the script will swap in that image in-place.

The script assumes you use Apple's prescribed high-resolution modifiers (@2x, @3x, etc) to denote high-resolution image variants on your server. It also assumes that if you have prepared a variant for 3x environments, that you have also prepared a variant for 2x environments. With that in mind, you'll specify your highest environment level with the `data-rjs` attribute and let retina.js take it from there.

For example, let's say you have an image on your page that looks like this:

```html
<img src="/images/my_image.png" data-rjs="3" />
```

retina.js will assume that the url you placed in the `src` attribute is a standard, non-retina image. Since you gave the `data-rjs` attribute a value of "3", it will also assume that a variant for 3x environments **AND** a variant for 2x environments exists on the server. If you had said "4" instead of "3", it would have assumed variants existed for 2x, 3x, and 4x – everything up through the value you specified.

In this case, we've set our resolution cap at "3". When the page loads, retina.js will check the actual resolution of the device environment to decide whether it should really serve up a 3x image. If the user happens to be in a 2x environment, retina.js will not try to serve up your 3x image. It will serve up the 2x image instead, and it will look for that image at `/images/my_image@2x.png`.

If the environment does have 3x capabilities, retina.js will serve up the 3x image. It will expect that url to be `/images/my_image@3x.png`. If the environment has capabilities to display images at higher densities than 3x, retina.js will serve up the image of the highest resolution that you've provided, in this case 3x.


## How to use

### JavaScript

The JavaScript helper script replaces images on your page with high-resolution variants if they exist. There are a couple of ways to use it. If you'd like to use retina.js the old-fashioned way, download the _minified script_ and include it at the bottom of your page. This will cause retina.js to automatically kick in and replace images as soon as the page loads.

1. Place the **retina.min.js** file on your server.
2. Include the script on your page (put it at the bottom of your template, before your closing \</body> tag)

``` html
<script type="text/javascript" src="/scripts/retina.min.js"></script>
```

**Note that only the minified file is designed to be directly placed into your html.**

You can also re-initialize retina.js manually whenever you need to simply by calling `window.retinajs()`.

The other way to use retina.js is to `import` it as part of a larger build process. In this case, retina.js won't run automatically. Instead, it'll let you determine when you'd like it to run.

```JavaScript
import retina from 'retina';

window.addEventListener('load', retina);
```

In this case, the `retina` function can be called as often as you need in order to re-initialize the image swapping.


###LESS & SASS

The LESS &amp; SASS CSS mixins are helpers for applying high-resolution background images in your stylesheets. You provide an image path, a pixel density cap, and a few other attributes, and the mixin creates media queries for all device pixel ratios up through your specified cap. To use it, download the mixin, import or include it in your LESS or SASS stylesheets, and apply it to elements of your choice.

*Syntax:*

```less
.retina('./my-image.png', 3, 100px, 100px, center center no-repeat);
```

```scss
@include retina('./my-image.png', 3, 100px, 100px, center center no-repeat);
```

```sass
+retina('./my-image.png', 3, 100px, 100px, center center no-repeat)
```

*Arguments:*

1. The path to your 1x image.
2. _Optional_. The highest level resolution that you have created images for. Passing in a 3 will create media queries that utilize 2x images **and** 3x images. Defaults to 2.
3. _Optional_. The width applied to the `background-size` property when high resolution images are applied. Defaults to `auto`.
4. _Optional_. The height applied to the `background-size` property when high resolution images are applied. Defaults to `auto`.
5. _Optional_. Any extra values to be appended to the `background` property in all cases.

*Steps:*

1. Importing
  - LESS - Add the `.retina()` mixin from retina.less to your LESS stylesheet (or reference it in an `@import` statement).
  - SASS - Add the `@mixin retina()` from retina.scss or retina.sass to your SASS stylesheet (or reference it in an `@import`).
2. Using
  - LESS - In your stylesheet, call the `.retina()` mixin anywhere instead of using background-image.
  - SASS - In your stylesheet, call `@include retina()` anywhere instead of using background-image.

To give you an example of the output, this...

```less
.logo {
  .retina('./my-image.png', 3, 100px, 100px, center center no-repeat);
}
```

```scss
.logo {
  @include retina('./my-image.png', 3, 100px, 100px, center center no-repeat);
}
```

Will compile to:

``` css
.logo {
  background-image: url('/images/my_image.png') center center no-repeat;
}

@media all and (-webkit-min-device-pixel-ratio: 1.5) {
  .logo {
    background: url('/images/my_image@2x.png') center center no-repeat;
    background-size: 200px 100px;
  }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .logo {
    background: url('/images/my_image@2x.png') center center no-repeat;
    background-size: 200px 100px;
  }
}

@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi) {
  .logo {
    background: url('/images/my_image@3x.png') center center no-repeat;
    background-size: 200px 100px;
  }
}

```

### Considerations for Ruby on Rails 3+

...or any framework that embeds some digest/hash to the asset URLs based on the contents, e.g. `/images/image-{hash1}.jpg`.

The problem with this is that the high-resolution version would have a different hash, and would not conform to the usual pattern, i.e. `/images/image@2x-{hash2}.jpg`. So automatic detection would fail because retina.js would check the existence of `/images/image-{hash1}@2x.jpg`.

There's no way for retina.js to know beforehand what the high-resolution image's hash would be without some sort of help from the server side. So in this case, the suggested method is to implement a process like [team-umlaut's asset compile rake file](https://github.com/team-umlaut/umlaut/blob/5edcc609389edf833a79caa6f3ef92982312f0c5/lib/tasks/umlaut_asset_compile.rake) which will generate non-digested asset files as necessary.

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

- Unit tests
- Change readme for unit tests
- Mark the release as version 2.0
