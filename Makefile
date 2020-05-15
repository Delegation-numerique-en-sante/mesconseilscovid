.DEFAULT_GOAL:=help

key.pem:  ## Generate certificates to be able to run `https` on `localhost`.
	openssl req -nodes -newkey rsa:2048 -x509  -days 365 -keyout key.pem -out cert.pem -subj "/C=FR/CN=localhost"

serve: key.pem  ## Serve the `src/index.html` file with `https` on `localhost`.
	python3 serve.py

install:  ## Install Python dependencies contained in `requirements.txt`.
	python3 -m pip install -r requirements.txt

build:  ## Build the index from `template.html` + contenus markdown files.
	python3 build.py all

autobuild:  ## Serve the `src` folder _without_ `https` but with build on file change.
	python3 autobuild.py

.PHONY: serve install build autobuild

help:  ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
