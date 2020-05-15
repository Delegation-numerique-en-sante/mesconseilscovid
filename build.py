#!/usr/bin/env python3
import fnmatch
import os
import shutil
from pathlib import Path
from time import perf_counter

import mistune
from jinja2 import Environment as JinjaEnv
from jinja2 import FileSystemLoader, StrictUndefined
from minicli import cli, run, wrap
from webassets import Bundle, Environment as AssetsEnv

HERE = Path(__file__).parent
SRC_DIR = HERE / "src"
DIST_DIR = HERE / "dist"

jinja_env = JinjaEnv(loader=FileSystemLoader(str(SRC_DIR)), undefined=StrictUndefined)

markdown = mistune.create_markdown(escape=False)

assets_env = AssetsEnv(
    directory=str(DIST_DIR),
    load_path=[str(SRC_DIR)],
    url="./",
    url_expire=False,
    debug=False,
    auto_build=True,
    versions="hash",
)
assets_env.register("js", Bundle("main.js", output="main-%(version)s.js"))
assets_env.register("css", Bundle("style.css", output="style-%(version)s.css"))


@cli
def all():
    clean()
    static()
    index()


@cli
def clean():
    """Clean output directory"""
    shutil.rmtree(DIST_DIR, ignore_errors=True)


@cli
def static():
    """Copy static files"""
    shutil.copytree(SRC_DIR / "static", DIST_DIR)
    shutil.copytree(SRC_DIR / "tests", DIST_DIR / "tests")


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
    responses = build_responses(Path("") / "contenus")
    render_template("template.html", DIST_DIR / "index.html", **responses)
    render_template("template_tests.html", DIST_DIR / "tests/index.html")


def render_template(src, output, **context):
    template = jinja_env.get_template(src)
    content = template.render(
        js_path=assets_env["js"].urls()[0],
        css_path=assets_env["css"].urls()[0],
        **context,
    )
    output.open("w").write(content)


@wrap
def perf_wrapper():
    start = perf_counter()
    yield
    elapsed = perf_counter() - start
    print(f"Done in {elapsed:.5f} seconds.")


if __name__ == "__main__":
    run()
