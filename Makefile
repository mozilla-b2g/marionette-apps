TESTS?=$(shell find test -name *_test.js)
REPORTER?=spec
MOCHA_OPTS=--reporter $(REPORTER) \
					 --profile-base $(PWD)/profile.js \
					 $(TESTS)

.PHONY: default
default: lint test

.PHONY: lint
lint:
	gjslint  --recurse . \
		--disable "220,225" \
		--exclude_directories "b2g,examples,node_modules"

.PHONY: test-sync
test-sync:
	SYNC=true ./node_modules/.bin/marionette-mocha $(MOCHA_OPTS)

.PHONY: test-async
test-async:
	./node_modules/.bin/marionette-mocha $(MOCHA_OPTS)

.PHONY: test
test: test-sync test-async
