#!/usr/bin/env python3
import fnmatch
import os
from pathlib import Path
from time import perf_counter

import mistune
from jinja2 import Environment as Env
from jinja2 import FileSystemLoader, StrictUndefined
from minicli import cli, run, wrap

HERE = Path(".")
environment = Env(loader=FileSystemLoader(str(HERE / "src")), undefined=StrictUndefined)
markdown = mistune.create_markdown(escape=False)


def each_markdown_from(source_dir, file_name="*.md"):
    """Walk across the `source_dir` and return the md file paths."""
    for filename in fnmatch.filter(os.listdir(source_dir), file_name):
        yield os.path.join(source_dir, filename), filename


def build_responses(source_dir):
    """Extract and convert markdown from a `source_dir` directory into a dict."""
    responses = {}
    for file_path, filename in each_markdown_from(source_dir):
        html_content = markdown.read(file_path)
        # Remove empty comments set to hack markdown rendering
        # when we do not want paragraphs.
        html_content = html_content.replace("<!---->", "")
        responses[filename[: -len(".md")]] = html_content

    return responses


@cli
def index():
    """Build the index with contents from markdown dedicated folder."""
    template = environment.get_template("template.html")
    responses = build_responses(Path("") / "contenus")
    content = template.render(**responses)
    open(HERE / "src" / "index.html", "w").write(content)


@wrap
def perf_wrapper():
    start = perf_counter()
    yield
    elapsed = perf_counter() - start
    print(f"Done in {elapsed:.5f} seconds.")


if __name__ == "__main__":
    run()
