
.PHONY: build
build: lint
	Xvfb :99 &
	DISPLAY=:99 make test


.PHONY: lint
lint:
	gjslint  --recurse . \
		--disable "220,225" \
		--exclude_directories "b2g,examples,node_modules"


.PHONY: test
test:
	./node_modules/mocha/bin/mocha --colors --recursive \
		--require test/test_helper.js \
		--reporter spec \
		--timeout 100s \
		--ui tdd
