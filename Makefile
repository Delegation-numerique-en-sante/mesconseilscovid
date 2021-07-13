.DEFAULT_GOAL:=help

key.pem:  ## Generate certificates to be able to run `https` on `localhost`.
	openssl req -nodes -newkey rsa:2048 -x509  -days 365 -keyout key.pem -out cert.pem -subj "/C=FR/CN=localhost"

install: install-python install-js

install-python:  ## Install Python dependencies.
	python3 -m pip install -U pip setuptools wheel
	python3 -m pip install -r requirements.txt

install-js:  ## Install JS dependencies.
	npm install

clean:  ## Clean up JS related stuff.
	rm -rf ./node_modules
	rm -rf ./.cache

##
## Run JS unit tests matching a given pattern/browser engine.
##
## Examples:
##    make test-unit grep=profil
##    make test-integration browser=webkit grep=suivi
##    make test browser=webkit


check: check-links check-versions check-orphelins check-diagrammes check-service-worker

check-links:  # Check that links to external pages are still valid.
	python3 check.py links --timeout 40 --delay 0.3

check-versions:  # Check that current version matches service-worker one.
	python3 check.py versions

check-orphelins:  # Check that all markdown files are in use in template.
	python3 check.py orphelins

check-diagrammes:  # Check that all files from diagrammes/matrice exist.
	python3 check.py diagrammes

check-service-worker:  # Check that all files in use are listed in service-worker.js.
	python3 build.py thematiques
	python3 check.py service_worker

lint:  ## Run ESLint + check code style.
	npm run-script lint
	./node_modules/.bin/prettier src/*.js src/**/*.js src/**/**/*.js src/**/**/**/*.js src/style.css --check

pretty:  ## Run PrettierJS.
	./node_modules/.bin/prettier src/*.js src/**/*.js src/**/**/*.js src/**/**/**/*.js src/style.css --write

optimize-images:
	find diagrammes src static -type f -iname "*.png" -print0 | xargs -I {} -0 zopflipng -y "{}" "{}"

build:  ## Build all files (markdown + statics).
	python3 build.py all
	npm run-script build

prefectures:  ## Generate data related to prefectures.
	python prefectures.py generate
	make pretty

dev: build  ## Local HTTP server with auto rebuild (with LiveReload).
	python3 serve.py --watch --open

dev-ssl: key.pem build  ## Local HTTPS server with auto rebuild (without LiveReload).
	python3 serve.py --watch --open --ssl


pre-commit: pretty lint test-unit build check-versions check-orphelins check-diagrammes check-service-worker  ## Interesting prior to commit/push.

release:
	echo "{\"version\": \"$$(date --iso-8601)\"}" >static/version.json
	sed -i "s/'network-or-cache-.*'/'network-or-cache-$$(date --iso-8601)'/" src/service-worker.js
	sed -i "2 a ## $$(date --iso-8601)\n\n* ...\n" CHANGELOG.md

prod: clean install lint pretty test check  ## Make sure everything is clean prior to deploy.
	# Note: `test` dependency will actually generate the `build`.

.PHONY: serve serve-ssl install install-python install-js clean test test-unit test-integration test-feedback check-links check-versions check-documentation check-service-worker optimize-images build generate dev pre-commit release prod help

help:  ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
