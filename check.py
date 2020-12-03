#!/usr/bin/env python3
import json
import time
from html.parser import HTMLParser
from http import HTTPStatus
from pathlib import Path

import httpx
from minicli import cli, run

from build import each_folder_from, each_file_from

HERE = Path(__file__).parent
SRC_DIR = HERE / "src"
CONTENUS_DIR = HERE / "contenus"


class LinkExtractor(HTMLParser):
    def reset(self):
        HTMLParser.reset(self)
        self.links = set()

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            attrs = dict(attrs)
            url = attrs["href"]
            if url.startswith("http"):
                if url.startswith(
                    (
                        "https://www.facebook.com/",
                        "https://twitter.com/",
                        "https://github.com/",
                    )
                ):
                    return
                self.links.add(url)


@cli
def links(timeout: int = 10, delay: float = 0.1):
    parser = LinkExtractor()
    content = (SRC_DIR / "index.html").read_text()
    parser.feed(content)
    for link in sorted(parser.links):
        print(link)
        with httpx.stream(
            "GET",
            link,
            timeout=timeout,
            verify=False,  # ignore SSL certificate validation errors
        ) as response:
            if response.status_code == HTTPStatus.TOO_MANY_REQUESTS:
                print("Warning: we’re being throttled, skipping link (429)")
                continue
            if response.status_code != HTTPStatus.OK:
                raise Exception(f"{link} is broken! ({response.status_code})")
        time.sleep(delay)  # avoid being throttled


@cli
def versions():
    content = open(HERE / "static" / "version.json").read()
    data = json.loads(content)
    version = data["version"]
    line_prefix = "const CACHE_NAME = "
    for line in open(SRC_DIR / "service-worker.js"):
        if line.startswith(line_prefix):
            break
    if version not in line:
        raise Exception(
            f"Version mismatch between version.json ({version}) and service-worker.js"
        )


@cli
def service_worker():
    KNOWN_EXCLUDED_FILES = {
        "browserconfig.xml",
        "illustrations/mesconseilscovid.png",
        "illustrations/isolement-avec-symptomes.png",
        "illustrations/isolement-sans-symptomes.png",
        "illustrations/isolement-foyer-malade.png",
        "index.html",
        "logo.png",
        "logo-favicon.png",
        "service-worker.js",
        "template.html",
        "version.json",
    }
    REQUIRED_FILES = {"/", "style.css", "scripts/main.js", "favicon.ico"}

    # Retrieving the list from CACHE_FILES.
    sw_filenames = set()
    start = False
    for line in open(SRC_DIR / "service-worker.js"):
        # Parsing a JS file in Python, what could potentially go wrong?
        if line.startswith("const CACHE_FILES = ["):
            start = True
            continue

        if start:
            sw_filenames.add(line.strip()[1:-2])

        if line.startswith("]"):
            break
    sw_filenames |= KNOWN_EXCLUDED_FILES

    # Make sure the required files are present.
    if not REQUIRED_FILES.issubset(sw_filenames):
        raise Exception(
            f"File(s) missing in service-worker.js: {REQUIRED_FILES - sw_filenames}"
        )

    # Compare the list to static files.
    static_file_names = {
        filename
        for file_path, filename in each_file_from(
            HERE / "static", exclude=[".DS_Store"]
        )
    }
    if not static_file_names.issubset(sw_filenames):
        raise Exception(
            f"File(s) missing in service-worker.js: {static_file_names - sw_filenames}"
        )

    # Compare the list to font files.
    fonts_file_names = {
        f"fonts/{filename}"
        for file_path, filename in each_file_from(
            SRC_DIR / "fonts", file_name="*.woff2", exclude=[".DS_Store"]
        )
    }
    if not fonts_file_names.issubset(sw_filenames):
        raise Exception(
            f"File(s) missing in service-worker.js: {fonts_file_names - sw_filenames}"
        )

    # Compare the list to illustration files.
    illustrations_file_names = {
        f"illustrations/{filename}"
        for file_path, filename in each_file_from(
            SRC_DIR / "illustrations",
            exclude=[".DS_Store"],
        )
    }
    if not illustrations_file_names.issubset(sw_filenames):
        raise Exception(
            f"File(s) missing in service-worker.js: {illustrations_file_names - sw_filenames}"
        )

    # Compare the list to src files.
    src_file_names = {
        filename
        for file_path, filename in each_file_from(
            SRC_DIR,
            file_name="*.*",
            exclude=[".DS_Store"],
        )
    }
    if not src_file_names.issubset(sw_filenames):
        raise Exception(
            f"File(s) missing in service-worker.js: {src_file_names - sw_filenames}"
        )


@cli
def orphelins():
    template = (SRC_DIR / "template.html").read_text()
    for folder in each_folder_from(CONTENUS_DIR, exclude=["nouveaux_contenus"]):
        for file_path, filename in each_file_from(
            folder, file_name="*.md", exclude=["README.md"]
        ):
            if filename.startswith("meta_") or filename.startswith("config_"):
                continue
            if filename[: -len(".md")] not in template:
                raise Exception(f"Reference missing for {filename}")


if __name__ == "__main__":
    run()
