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
DIAGRAMMES_DIR = HERE / "diagrammes"
CONTENUS_DIR = HERE / "contenus"
TEMPLATES_DIR = HERE / "templates"


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
    dynamically_generated_links_via_injection = {
        "https://www.sante.fr/cf/centres-vaccination-covid/departement-22-cotes-d'armor.html",
        "https://www.sante.fr/cf/centres-vaccination-covid/departement-20A-corse-du-sud.html",
        "https://www.sante.fr/cf/centres-vaccination-covid/departement-01-ain.html",
        "https://www.sante.fr/cf/centres-vaccination-covid.html",
        "https://www.sante.fr/cf/centres-depistage-covid/departement-01.html",
        "https://www.sante.fr/cf/centres-depistage-covid/departement-2A.html",
        "https://www.sante.fr/cf/centres-depistage-covid.html",
    }
    parser = LinkExtractor()
    content = (SRC_DIR / "index.html").read_text()
    parser.feed(content)
    links = parser.links.union(dynamically_generated_links_via_injection)
    for link in sorted(links):
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

    # Make sure the cached files exist.
    for filename in sw_filenames:
        if not (
            (Path("src") / filename).exists() or (Path("static") / filename).exists()
        ):
            raise Exception(f"Non-existent file in service-worker.js: {filename}")

    REQUIRED_FILES = {"/", "style.css", "scripts/main.js", "favicon.ico"}

    KNOWN_EXCLUDED_FILES = {
        "browserconfig.xml",
        "illustrations/mesconseilscovid.png",
        "illustrations/solidarites-sante-gouv-fr-infog-vaccins-particuliers.png",
        "illustrations/isolement-foyer-malade.png",
        "index.html",
        "logo.png",
        "logo-favicon.png",
        "service-worker.js",
        "version.json",
        "cas-contact-a-risque.html",
        "sitemap.xml",
    }

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
            SRC_DIR / "fonts", pattern="*.woff2", exclude=[".DS_Store"]
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
            pattern="*.*",
            exclude=[".DS_Store"],
        )
    }
    if not src_file_names.issubset(sw_filenames):
        raise Exception(
            f"File(s) missing in service-worker.js: {src_file_names - sw_filenames}"
        )


@cli
def orphelins():
    template = (TEMPLATES_DIR / "index.html").read_text()
    for folder in each_folder_from(CONTENUS_DIR, exclude=["pages"]):
        for file_path, filename in each_file_from(
            folder, pattern="*.md", exclude=["README.md"]
        ):
            if filename.startswith("meta_") or filename.startswith("config_"):
                continue
            if filename[: -len(".md")] not in template:
                raise Exception(f"Reference missing for {filename}")


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
        filename
        for file_path, filename in each_file_from(
            CONTENUS_DIR / "statuts", pattern="*.md", exclude=["README.md"]
        )
    }
    conseils_filenames = {
        filename
        for file_path, filename in each_file_from(
            CONTENUS_DIR / "conseils",
            pattern="conseils_personnels_*.md",
            exclude=["README.md"],
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
