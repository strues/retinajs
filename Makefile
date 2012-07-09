VERSION=`grep 'version' package.json | cut -d '"' -f 4`

package:
	npm test
	mkdir -p build
	cp README.md build/README.md
	cp src/retina.less build/retina.less
	cp src/retina.js build/retina.js
	uglifyjs build/retina.js > build/retina.min.js
	mv build/retina.js build/retina.$(VERSION).js
	mv build/retina.min.js build/retina.$(VERSION).min.js	