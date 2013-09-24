VERSION=$(shell grep 'version' package.json | cut -d '"' -f 4)
YEAR=$(shell date "+%Y")
BANNER= "/*!\n \
 * Retina.js v$(VERSION)\n \
 *\n \
 * Copyright $(YEAR) Imulus, LLC\n \
 * Released under the MIT license\n \
 *\n \
 * Retina.js is an open source script that makes it easy to serve\n \
 * high-resolution images to devices with retina displays.\n \
 */"

all: clean test build package

clean:
	rm -rf build

test:
	npm test

build:
	mkdir -p build/js build/less
	cp README.md build/README.md
	cp src/retina.less build/less/retina-$(VERSION).less
	echo $(BANNER) > build/js/retina-$(VERSION).js
	cat src/retina.js >> build/js/retina-$(VERSION).js
	echo $(BANNER) > build/js/retina-$(VERSION).min.js
	uglifyjs src/retina.js >> build/js/retina-$(VERSION).min.js

package:
	mkdir -p pkg
	cd build && zip -r ../pkg/retina-$(VERSION).zip .
