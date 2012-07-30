VERSION=`grep 'version' package.json | cut -d '"' -f 4`

package:
	npm test
	mkdir -p build
	cp README.md build/README.md
	cp src/retina.less build/retina.less
	echo "// retina.js, a high-resolution image swapper (http://retinajs.com), v$(VERSION)\n" > build/retina.js
	uglifyjs src/retina.js >> build/retina.js
	cat build/retina.js

