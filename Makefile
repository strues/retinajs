package:
	npm test
	mkdir -p build
	cp README.md build/README.md
	cp src/retina.less build/retina.less
	cp src/retina.js build/retina.js
	uglifyjs build/retina.js > build/retina.min.js
