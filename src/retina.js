(function() {
  /*
   * Determine whether or not `window` is available.
   */
  const hasWindow = typeof window !== 'undefined';

  /*
   * Get the device pixel ration per our environment.
   * Default to 1.
   */
  const environment = hasWindow ? (window.devicePixelRatio || 1) : 1;

  /*
   * Define a pattern for capturing src url suffixes.
   */
  const srcReplace = /(\.[A-z]{3,4}\/?(\?.*)?)$/;

  /*
   * Define our selector for elements to target.
   */
  const selector = 'img[data-rjs]';

  /**
   * Chooses the actual image size to fetch, (for example 2 or 3) that
   * will be used to create a suffix like "@2x" or "@3x".
   *
   * @param  {String|Number} cap The number the user provided indicating that
   *                             they have prepared images up to this size.
   *
   * @return {Number} The number we'll be using to create a suffix.
   */
  function chooseCap(cap) {
    const numericCap = parseInt(cap, 10);

    /*
     * If the environment's device pixel ratio is less than what the user
     * provided, we'll only grab images at that size.
     */
    if (environment < numericCap) {
      return environment;

    /*
     * If the device pixel ratio is greater than or equal to what the
     * user provided, we'll use what the user provided.
     */
    } else {
      return numericCap;
    }
  }

  /**
   * Makes sure that, since we are going to swap out the source of an image,
   * the image does not change size on the page.
   *
   * @param  {Element} image An image element in the DOM.
   *
   * @return {Element} The same element that was passed in.
   */
  function forceOriginalDimensions(image) {
    if (!image.getAttribute('data-no-resize')) {
      if (image.offsetWidth === 0 && image.offsetHeight === 0) {
        image.setAttribute('width', image.naturalWidth);
        image.setAttribute('height', image.naturalHeight);
      } else {
        image.setAttribute('width', image.offsetWidth);
        image.setAttribute('height', image.offsetHeight);
      }
    }
    return image;
  }

  /**
   * Determines whether the retina image actually exists on the server.
   * If so, swaps out the retina image for the standard one. If not,
   * leaves the original image alone.
   *
   * @param {Element} image  An image element in the DOM.
   * @param {String}  newSrc The url to the retina image.
   *
   * @return {undefined}
   */
  function setSourceIfAvailable(image, retinaURL) {
    /*
     * Create a new image element and give it a load listener. When the
     * load listener fires, it means the URL is correct and we will then
     * attach it to the user's image.
     */
    const testImage = document.createElement('img');
    testImage.addEventListener('load', () => {
      forceOriginalDimensions(image).setAttribute('src', retinaURL);
    });

    /*
     * Attach the retina URL to our proxy image to make sure it can load.
     */
    testImage.setAttribute('src', retinaURL);
  }

  /**
   * Attempts to do an image url swap on a given image.
   *
   * @param  {Element} image An image in the DOM.
   *
   * @return {undefined}
   */
  function swapImage(image) {
    const src = image.getAttribute('src');
    const cap = chooseCap(image.getAttribute('data-rjs') || 1);

    /*
     * Don't do anything if the user didn't provide a source or if the
     * cap is less than 2.
     */
    if (src && cap < 2) {
      const newSrc = src.replace(srcReplace, `@${cap}x$1`);
      setSourceIfAvailable(image, newSrc);
    }
  }

  /**
   * Collects all images matching our selector, and converts our
   * NodeList into an Array so that Array methods will be available to it.
   *
   * @return {Array} Contains all elements matching our selector.
   */
  function getImages() {
    return typeof document !== 'undefined' ? Array.prototype.slice.call(
      document.querySelectorAll(selector)
    ) : [];
  }

  /**
   * Gets all participating images and dynamically swaps out each one for its
   * retina equivalent taking into account the environment capabilities and
   * the densities for which the user has provided images.
   *
   * @return {undefined}
   */
  function activate() {
    getImages().forEach(img => swapImage(img));
  }

  /*
   * If this environment has `window`, activate the plugin.
   */
  if (hasWindow) {
    activate();
  }
}());
