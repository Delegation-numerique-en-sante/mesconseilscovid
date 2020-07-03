#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from time import perf_counter
from http import HTTPStatus

import httpx
from minicli import cli, run, wrap

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
    for link in parser.links:
        response = httpx.get(link, timeout=timeout)
        if response.status_code != HTTPStatus.OK:
            raise Exception(f"{link} is broken! ({response.status_code})")


@wrap
def perf_wrapper():
    start = perf_counter()
    yield
    elapsed = perf_counter() - start
    print(f"Done in {elapsed:.5f} seconds.")


if __name__ == "__main__":
    run()
