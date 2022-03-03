#!/usr/bin/env python3
import json
import time
from html.parser import HTMLParser
from http import HTTPStatus
from pathlib import Path

import httpx
from minicli import cli, run

from construction.utils import each_folder_from, each_file_from

HERE = Path(__file__).parent
SRC_DIR = HERE / "src"
DIAGRAMMES_DIR = HERE / "diagrammes"
CONTENUS_DIR = HERE / "contenus"
TEMPLATES_DIR = HERE / "templates"


class LinkExtractor(HTMLParser):
    def reset(self):
        HTMLParser.reset(self)
        self.external_links = set()
        self.internal_links = set()

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            attrs = dict(attrs)
            url = attrs["href"]
            if url.startswith("http"):
                if url.startswith(
                    (
                        "https://www.facebook.com/",
                        "https://www.youtube.com/",
                        "https://twitter.com/",
                        "https://github.com/",
                        "https://wa.me/",
                    )
                ):
                    return
                self.external_links.add(url)
            elif url.startswith(("/", "#")):
                if url in ("/", "#") or url.startswith(("/#", "/illustrations/")):
                    return
                self.internal_links.add(url)


@cli
def external_links(timeout: int = 10, delay: float = 0.1):
    external_links = set()
    for path in each_file_from(SRC_DIR, pattern="*.html"):
        parser = LinkExtractor()
        content = path.read_text()
        parser.feed(content)
        external_links |= parser.external_links

    for external_link in sorted(external_links):
        print(external_link)
        with httpx.stream(
            "GET",
            external_link,
            follow_redirects=True,
            timeout=timeout,
            verify=False,  # ignore SSL certificate validation errors
        ) as response:
            if response.status_code == HTTPStatus.TOO_MANY_REQUESTS:
                print("Warning: we’re being throttled, skipping link (429)")
                continue
            if response.status_code != HTTPStatus.OK:
                raise Exception(f"{external_link} is broken! ({response.status_code})")
        time.sleep(delay)  # avoid being throttled


@cli
def internal_links():
    internal_contents = {}
    internal_links = {}
    internal_pages = []
    for path in each_file_from(SRC_DIR, pattern="*.html"):
        parser = LinkExtractor()
        content = path.read_text()
        internal_contents[path.name] = content
        parser.feed(content)
        internal_links[path.name] = parser.internal_links
        internal_pages.append(path.name)

    for path, path_internal_links in internal_links.items():
        for internal_link in path_internal_links:
            # Check cross pages references.
            if internal_link.startswith("/"):
                if "#" in internal_link:
                    path_name, anchor = internal_link.split("#", 1)
                else:
                    path_name = internal_link
                    anchor = None
                # Check missing pages.
                if path_name[1:] not in internal_pages:
                    raise Exception(
                        (
                            f"{path_name} referenced in {path} but "
                            f"does not exist in {internal_pages}."
                        )
                    )
                # Check missing anchors.
                if anchor is not None:
                    if f'id="{anchor}"' not in internal_contents[path_name[1:]]:
                        raise Exception(
                            (
                                f"{internal_link} referenced in {path} but "
                                f"does not exist in content."
                            )
                        )
            # Check anchors on the same page.
            elif internal_link.startswith("#"):
                if f'id="{internal_link[1:]}"' not in internal_contents[path]:
                    raise Exception(
                        (
                            f"{internal_link} referenced in {path} but "
                            f"does not exist on that page."
                        )
                    )
            else:
                raise Exception(f"What is that link?! {internal_link}")


@cli
def orphelins():
    template = (TEMPLATES_DIR / "index.html").read_text()
    for folder in each_folder_from(CONTENUS_DIR, exclude=["thematiques"]):
        for path in each_file_from(folder, pattern="*.md"):
            if path.name.startswith("meta_") or path.name.startswith("config_"):
                continue
            if path.name[: -len(".md")] not in template:
                raise Exception(f"Reference missing for {path.name}")


@cli
def diagrammes():
    matrice_content = (DIAGRAMMES_DIR / "matrice-statuts-conseils.md").read_text()
    matrice_statuts = {
        line.strip()
        for line in matrice_content.split("\n")
        if line.strip().startswith("statut_")
    }
    matrice_conseils = {
        line.strip()
        for line in matrice_content.split("\n")
        if line.strip().startswith("conseils_")
    }
    statuts_filenames = {
        path.name
        for path in each_file_from(CONTENUS_DIR / "statuts", pattern="*.md")
        if path.name != "statut_moins_de_15_ans.md"
    }
    conseils_filenames = {
        path.name
        for path in each_file_from(
            CONTENUS_DIR / "conseils", pattern="conseils_personnels_*.md"
        )
    }
    if matrice_statuts - statuts_filenames:
        raise Exception(
            f"Statut file(s) missing for: {matrice_statuts - statuts_filenames}"
        )

    if matrice_conseils - conseils_filenames:
        raise Exception(
            f"Conseils file(s) missing for: {matrice_conseils - conseils_filenames}"
        )

    if statuts_filenames - matrice_statuts:
        raise Exception(
            f"Non-existent statut from matrice: {statuts_filenames - matrice_statuts}"
        )

    if conseils_filenames - matrice_conseils:
        raise Exception(
            f"Non-existent conseils personnels from matrice: {conseils_filenames - matrice_conseils}"
        )


if __name__ == "__main__":
    run()
