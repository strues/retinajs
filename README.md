# retina.js

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)


### JavaScript, Sass, Less, and Stylus helpers for rendering high-resolution image variants

`retina.js` makes it easy to serve high-resolution images to devices with displays that support them. You can prepare images for as many levels of pixel density as you want and let `retina.js` dynamically serve the right image to the user.

## How it works

There are 4 ways to use `retina.js`:

1. Automatically swapping out `src` paths on `img` tags.
2. Automatically swapping out background image URLs in inline styles.
3. Manually specifying the location of a high-res image variant (works for `src` attributes and inline styles).
4. Automatically creating media queries for CSS background images.

#### Img Tags

`retina.js` assumes you are using Apple's prescribed high-resolution modifiers (@2x, @3x, etc) to denote high-res image variants on your server. It also assumes that if you have prepared a variant for a given high-res environment, that you have also prepared variants for each environment below it. For example, if you have prepared 3x variants, `retina.js` will assume that you have also prepared 2x variants.

With this in mind, you'll specify your highest environment level with the `data-rjs` attribute and let `retina.js` take it from there.

Let's say you have an image on your page that looks like this:

```html
<img src="/images/my_image.png" data-rjs="3" />
```

In this case, we've set our resolution cap at "3", denoting that we've prepared 3x and 2x image variants. When the page loads, `retina.js` will check the actual resolution of the device environment to decide whether it should really serve up a 3x image. If the user happens to be in a 2x environment, `retina.js` will serve up the 2x image instead, assuming it will find the image at `/images/my_image@2x.png`.

If the environment does have 3x capabilities, `retina.js` will serve up the 3x image. It will expect that url to be `/images/my_image@3x.png`. If the environment has the ability to display images at higher densities than 3x, `retina.js` will serve up the image of the highest resolution that you've provided, in this case 3x.

#### Inline Styles

Previous versions of `retina.js` were unable to target background images set via inline styles. Now, if you apply a `data-rjs` attribute to any kind of element other than an `img`, the script will target inline background images instead of `src` attributes.

So if you created an element like this:

```html
<div style="background: url(/images/my_image.png)" data-rjs="3"></div>
```

`retina.js` would convert it to something like this:

```html
<div style="background: url(/images/my_image@3x.png)" data-rjs="3"></div>
```

The logic behind image swapping is exactly the same when dealing with background images as it is when dealing with `src` attributes. If the user's environment only supports 2x variants, `retina.js` will load the 2x variant instead of the 3x.

_Note that it is up to you in a case like this to correctly apply background sizing and any other necessary background-related styles to the element. retina.js will not affect these._

#### Manually Specifying a High-Res URL

In previous versions, you could tell the script where to find your high-res file by using the `data-at2x` attribute. Now, if you pass a URL to the `data-rjs` attribute, `retina.js` will use the image at the path you specify for all high-resolution environments instead of trying to dynamically serve an auto-suffixed image path based on the environment's capabilities. This will work for both `src` attributes on `img` tags and inline background images on all other tags.

For example, you might write something like this:

```html
<img
  src="/images/my_image.png"
  data-rjs="/images/2x/my-image.png" />

<!-- or -->

<div
  style="background: url(/images/my_image.png)"
  data-rjs="/images/2x/my-image.png">
</div>
```

If the user then loads the page in any kind of high-resolution environment, they'll get the following:

```html
<img
  src="/images/2x/my-image.png"
  data-rjs="/images/2x/my-image.png" />

<!-- or -->

<div
  style="background: url(/images/2x/my-image.png)"
  data-rjs="/images/2x/my-image.png">
</div>
```

#### Media Queries

`retina.js` comes with mixins for SCSS, Sass, Less, and Stylus. These mixins work similarly to the JavaScript version in that they will dynamically serve images for as many high-res environments as you've prepared image variants for. Previously, these mixins were named "at2x" but because they now serve images for multiple environments, they have been renamed "retina".

In each language, the retina mixin allows 4 parameters:

1. `path` - The path to your standard resolution image.
2. `cap` - _Optional._ The highest resolution level for which you have prepared images. Defaults to 2.
3. `size`- _Optional._ A value to be applied to the `background-size` property. Defaults to `auto auto`.
4. `extras`- _Optional._ Any other values to be added to the background property. Defaults to nothing.

Here is an example wherein we are specifying that we have prepared images for both 2x and 3x environments:

**SCSS**

```scss
#item {
  @include retina('/images/my_image.png', 3, cover, center center no-repeat);
}
```

**Sass**

```sass
#item
  +retina('/images/my_image.png', 3, cover, center center no-repeat)
```

**Less**

```less
#item {
  .retina('/images/my_image.png', 3, cover, center center no-repeat);
}
```

**Stylus**

```stylus
#item
  retina('/images/my_image.png', 3, cover, center center no-repeat)
```

Regardless of the dialect, the output is effectively the same:

```css
#item {
  background: url("/images/my_image.png") center center no-repeat;
  background-size: cover;
}

@media all and (-webkit-min-device-pixel-ratio: 1.5),
       all and (-o-min-device-pixel-ratio: 3 / 2),
       all and (min--moz-device-pixel-ratio: 1.5),
       all and (min-device-pixel-ratio: 1.5) {
  #item {
    background: url("/images/my_image@2x.png") center center no-repeat;
    background-size: cover;
  }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  #item {
    background: url("/images/my_image@2x.png") center center no-repeat;
    background-size: cover;
  }
}

@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi) {
  #item {
    background: url("/images/my_image@3x.png") center center no-repeat;
    background-size: cover;
  }
}
```

## Compatibility

`retina.js` is compatible with all modern browsers and __should__ not throw errors in old browsers all the way back through IE6.

## Installing & Launching

### JavaScript

There are 2 ways to use the JavaScript version of `retina.js`:

1. The old-school way (manually dropping the script into an html file).
2. The new-school way (importing it into a larger JavaScript build process).

#### Old-School

To use retina.js the old-school way, download **retina.min.js** and put it on your server. Then, include the script in your html file at the bottom of your template, before your closing \</body> tag.

``` html
<script type="text/javascript" src="/scripts/retina.min.js"></script>
```

Using this technique, `retina.js` will run automatically on page load. It will also create a globally available function called `retinajs`. Whenever you'd like to manually re-initialize the script, simply call `window.retinajs()`.

If you don't pass any arguments to the `retinajs` function, it will only attempt to process images that have not previously been processed by the script. Optionally, you can pass a collection of HTML elements to the script, in which case it will only attempt to process elements in that collection, specifically the ones that have not been processed before. Your collection may take the form of an Array, NodeList, or jQuery selection.

```javascript
retinajs();
// Finds all images not previously processed and processes them.

retinajs( [img, img, img] );
// Only attempts to process the images in the collection.

retinajs( $('img') );
// Same.

retinajs( document.querySelectorAll('img') );
// Same.
```

#### New-School

To use retina.js the new-school way, you'll want to `require` it (or `import` it if you're using ES6) into your Gulp/Webpack/Grunt/CommonJS/etc application. In this case, the script won't run automatically. Instead, it'll let you determine when you'd like it to run.

```JavaScript
import retina from 'retina';

window.addEventListener('load', retina);
```

Notice that the `retina` function can be called as often as you need in order to re-initialize the image swapping.

If you don't pass any arguments to the `retina` function, it will only attempt to process images that have not previously been processed by the script. Optionally, you can pass a collection of HTML elements to the script, in which case it will only attempt to process elements in that collection, specifically the ones that have not been processed before. Your collection may take the form of an Array, NodeList, or jQuery selection.

```javascript
retina();
// Finds all images not previously processed and processes them.

retina( [img, img, img] );
// Only attempts to process the images in the collection.

retina( $('img') );
// Same.

retina( document.querySelectorAll('img') );
// Same.
```

### CSS Preprocessors

The process for including the CSS mixins is relatively straightforward. Here is a breakdown for each:

#### SCSS

Add the `@mixin retina( ... )` mixin from \_retina.scss to your SCSS stylesheet (or reference it in an `@import`). In your stylesheet, call the mixin using `@include retina( ... )` anywhere instead of using `background` or `background-image`.

#### Sass

Add the `=retina( ... )` mixin from \_retina.sass to your Sass stylesheet (or reference it in an `@import`). In your stylesheet, call the mixin using `+retina( ... )` anywhere instead of using `background` or `background-image`.

#### Less

Add the `.retina( ... )` mixin from retina.less to your Less stylesheet (or reference it in an `@import`). In your stylesheet, call the mixin using `.retina( ... )` anywhere instead of using `background` or `background-image`.

#### Stylus

Add the `retina( ... )` mixin from retina.styl to your Stylus stylesheet (or reference it in an `@import`). In your stylesheet, call the mixin using `retina( ... )` anywhere instead of using `background` or `background-image`.


## Considerations for Ruby on Rails 3+

...or any framework that embeds some digest/hash to the asset URLs based on the contents, e.g. `/images/image-{hash1}.jpg`.

The problem with this is that the high-resolution version would have a different hash, and would not conform to the usual pattern, i.e. `/images/image@2x-{hash2}.jpg`. So automatic detection would fail because retina.js would check the existence of `/images/image-{hash1}@2x.jpg`.

There's no way for retina.js to know beforehand what the high-resolution image's hash would be without some sort of help from the server side. So in this case, there are a couple of options for handling it:

#### Bypass Digesting

One potential method is to bypass digesting altogether by implementing a process like [team-umlaut's asset compile rake file](https://github.com/team-umlaut/umlaut/blob/5edcc609389edf833a79caa6f3ef92982312f0c5/lib/tasks/umlaut_asset_compile.rake) which will generate non-digested asset files as necessary.

#### Use Manual Paths

Although it's not quite as fancy as dynamically serving up files based on the resolution of the user's environment, this may be a good time to pass a URL string to the `data-rjs` attribute so that you can manually tell retina.js exactly where to look for a high-resolution variant of your image.
