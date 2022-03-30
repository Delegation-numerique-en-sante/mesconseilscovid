.DEFAULT_GOAL:=help

THEMATIQUES = $(foreach file,$(subst contenus/thematiques/,,$(subst .md,.html,$(wildcard contenus/thematiques/*.md))),$(addprefix src/,$(shell echo $(file) | sed -r 's/[0-9]+-//')))

HTML = src/index.html $(THEMATIQUES)

key.pem:  ## Generate certificates to be able to run `https` on `localhost`.
	openssl req -nodes -newkey rsa:2048 -x509  -days 365 -keyout key.pem -out cert.pem -subj "/C=FR/CN=localhost"

install: install-python install-js

install-python:  ## Install Python dependencies.
	python3 -m pip install -U 'pip<22' setuptools wheel
	python3 -m pip install -r requirements.txt

install-js:  ## Install JS dependencies.
	PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install

uninstall-js:
	rm -rf ./node_modules

clean:
	rm -rf dist/ src/*.html .cache __pycache__

##
## Run JS unit tests matching a given pattern/browser engine.
##
## Examples:
##    make test-unit grep=profil
##    make test-integration browser=webkit grep=suivi
##    make test browser=webkit

test: test-unit test-integration test-tools test-feedback

ifdef grep
grepping = --grep $(grep)
else
grepping =
endif

ifdef cover
	coverage = :coverage
else
	coverage =
endif

ifdef watch
	watching = --watch
else
	watching =
endif

ifdef noopen
	open =
else
	open = --open
endif

test-unit:  ## Run JS unit tests.
	npm run-script test$(coverage) -- $(grepping) $(watching)

test-integration: dist/index.html  ## Run JS browser tests.
ifdef browser
	npx playwright install $(browser)
	BROWSER=$(browser) npm run-script test-integration -- $(grepping)
else
	npx playwright install chromium
	BROWSER=chromium npm run-script test-integration -- $(grepping)

	npx playwright install firefox
	BROWSER=firefox npm run-script test-integration -- $(grepping)

	npx playwright install webkit
	BROWSER=webkit npm run-script test-integration -- $(grepping)
endif

test-tools:
	PYTHONPATH=. pytest construction/
	PYTHONPATH=tools pytest tools/

test-feedback:
	tox -e py38 -c feedback/tox.ini

check: check-external-links check-versions check-orphelins check-diagrammes check-service-worker

check-external-links:  # Check that links to external pages are still valid.
	python3 check.py external_links --timeout 40 --delay 0.3

check-internal-links: build  # Check that links to internal pages are still valid.
	python3 check.py internal_links

check-versions:  # Check that current version matches service-worker one.
	python3 check.py versions

check-orphelins:  # Check that all markdown files are in use in template.
	python3 check.py orphelins

check-diagrammes:  # Check that all files from diagrammes/matrice exist.
	python3 check.py diagrammes

check-service-worker: src/index.html $(firstword $(THEMATIQUES))  # Check that all files in use are listed in service-worker.js.
	python3 check.py service_worker

HTML_EN = src/covid-in-france.html
HTML_FR = $(filter-out $(HTML_EN),$(HTML))

check-spelling: $(HTML) jargon.dic
	hunspell -l -H --check-apostrophe -d en_US,fr,jargon $(HTML_EN)
	hunspell -l -H --check-apostrophe -d fr,jargon $(HTML_FR)

jargon.dic: jargon.dic.txt
	cat $< | sort | uniq >$@.in
	wc -l $@.in >$@
	cat $@.in >>$@
	rm -f $@.in

lint:  ## Run ESLint + check code style.
	npm run-script lint
	./node_modules/.bin/prettier "src/**/*.{js,css}" --check

pretty:  ## Run PrettierJS.
	./node_modules/.bin/prettier "src/**/*.{js,css}" --write

optimize-images:
	find diagrammes src static -type f -iname "*.png" -print0 | xargs -I {} -0 zopflipng -y "{}" "{}"

build: dist/index.html

dist/index.html: src/index.html $(firstword $(THEMATIQUES)) static/sitemap.xml
	npm run-script build

# Construire l’index (page d’accueil + questionnaire)
src/index.html: build.py construction/*.py construction/directives/*.py \
 contenus/actualites/*.toml \
 contenus/config/*.md contenus/conseils/*.md contenus/lexique/*.md contenus/meta/*.md contenus/questions/*.md contenus/réponses/*.md contenus/statuts/*.md contenus/suivi/*.md \
 contenus/thematiques/*.md \
 templates/index.html
	python3 build.py index

# Construire les pages thématiques
$(THEMATIQUES): build.py construction/*.py construction/directives/*.py \
 contenus/lexique/*.md contenus/meta/*.md contenus/lexique/*.md contenus/thematiques/*.md \
 contenus/thematiques/formulaires/*.md templates/thematique.html
	python3 build.py thematiques

# Construire la carte du site (pour les robots)
static/sitemap.xml: build.py templates/sitemap.html contenus/thematiques/*.md
	python3 build.py sitemap

dev: dist/index.html  ## Local HTTP server with auto rebuild (with LiveReload).
	python3 serve.py --watch $(open)

dev-ssl: key.pem dist/index.html  ## Local HTTPS server with auto rebuild (without LiveReload).
	python3 serve.py --watch $(open) --ssl


pre-commit: pretty lint test-unit dist/index.html check-versions check-orphelins check-diagrammes check-service-worker  ## Interesting prior to commit/push.

release:
	echo "{\"version\": \"$$(date --iso-8601)\"}" >static/version.json
	sed -i "s/'network-or-cache-.*'/'network-or-cache-$$(date --iso-8601)'/" src/service-worker.js
	sed -i "2 a ## $$(date --iso-8601)\n\n* ...\n" CHANGELOG.md

prod: clean install lint pretty test check  ## Make sure everything is clean prior to deploy.
	# Note: `test` dependency will actually generate the `build`.

.PHONY: serve serve-ssl install install-python install-js clean test test-unit test-integration test-feedback check-external-links check-internal-links check-versions check-documentation check-service-worker check-spelling optimize-images build generate dev pre-commit release prod help

help:  ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
