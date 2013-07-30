.PHONY: default
default: lint test

.PHONY: lint
lint:
	gjslint  --recurse . \
		--disable "220,225" \
		--exclude_directories "b2g,examples,node_modules"

.PHONY: test-sync
test-sync:
	SYNC=true ./node_modules/.bin/mocha

.PHONY: test-async
test-async:
	./node_modules/.bin/mocha

.PHONY: test
test: test-sync test-async
