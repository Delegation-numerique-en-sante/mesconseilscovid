#!/usr/bin/env python3
import json
from html.parser import HTMLParser
from pathlib import Path
from time import perf_counter
from http import HTTPStatus

import httpx
from minicli import cli, run, wrap

from build import each_folder_from, each_markdown_from

HERE = Path(__file__).parent


class LinkExtractor(HTMLParser):
    def reset(self):
        HTMLParser.reset(self)
        self.links = set()

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            attrs = dict(attrs)
            if attrs["href"].startswith("http"):
                self.links.update([attrs["href"]])


@cli
def links(timeout: int = 10):
    parser = LinkExtractor()
    content = open(HERE / "src" / "index.html").read()
    parser.feed(content)
    for link in sorted(parser.links):
        print(link)
        response = httpx.get(link, timeout=timeout)
        if response.status_code != HTTPStatus.OK:
            raise Exception(f"{link} is broken! ({response.status_code})")


@cli
def versions():
    content = open(HERE / "static" / "version.json").read()
    data = json.loads(content)
    version = data["version"]
    line_prefix = "const CACHE_NAME = "
    for line in open(HERE / "src" / "service-worker.js"):
        if line.startswith(line_prefix):
            break
    if version not in line:
        raise Exception(
            f"Version mismatch between version.json ({version}) and service-worker.js"
        )


@cli
def documentation():
    readme = open(HERE / "contenus" / "README.md").read()
    for folder in each_folder_from(HERE / "contenus"):
        for file_path, filename in each_markdown_from(folder):
            if filename == "README.md" or filename.startswith("meta_"):
                continue
            if filename not in readme:
                raise Exception(f"Documentation missing for {filename}")


@wrap
def perf_wrapper():
    start = perf_counter()
    yield
    elapsed = perf_counter() - start
    print(f"Done in {elapsed:.5f} seconds.")


if __name__ == "__main__":
    run()
