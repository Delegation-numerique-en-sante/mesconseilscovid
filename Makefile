.DEFAULT_GOAL:=help

key.pem:  ## Generate certificates to be able to run `https` on `localhost`.
	openssl req -nodes -newkey rsa:2048 -x509  -days 365 -keyout key.pem -out cert.pem -subj "/C=FR/CN=localhost"

serve: build  ## Local HTTP server with auto rebuild (with LiveReload).
	python3 serve.py --watch

serve-ssl: key.pem build  ## Local HTTPS server with auto rebuild (without LiveReload).
	python3 serve.py --watch --ssl

install:  ## Install Python and JS dependencies.
	python3 -m pip install -U pip setuptools wheel
	python3 -m pip install -r requirements.txt
	npm install

test:  ## Run JS unit tests.
	npm run-script test
	npm run-script --browser=chromium test-integration
	npm run-script --browser=firefox test-integration
	npm run-script --browser=webkit test-integration

test-unit:  ## Run JS unit tests matching a given pattern/browser engine.
	# Usage: make test-unit browser=webkit grep=proche
	npm run-script test -- --grep $(grep)
	npm run-script --browser=$(browser) test-integration -- --grep $(grep)

check-links:  # Check that links to external pages are still valid.
	python3 check.py links

lint:  ## Run ESLint.
	npm run-script lint

build:  ## Build the index from `template.html` + contenus markdown files.
	python3 build.py all
	npm run-script build

.PHONY: serve serve-ssl install test check-links build help

help:  ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
