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
from webassets import Bundle
from webassets import Environment as AssetsEnv

HERE = Path(__file__).parent
SRC_DIR = HERE / "src"
DIST_DIR = HERE / "dist"
CONTENUS_DIR = HERE / "contenus"


class ImgsWithoutParagraphRenderer(mistune.HTMLRenderer):
    def paragraph(self, text):
        # In case of an image, we do not want to put it in a paragraph,
        # particularly useful to render illustrations.
        if text.strip().startswith("<img"):
            return text
        return f"<p>{text}</p>\n"


jinja_env = JinjaEnv(loader=FileSystemLoader(str(SRC_DIR)), undefined=StrictUndefined)

markdown = mistune.create_markdown(renderer=ImgsWithoutParagraphRenderer(escape=False))

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
    readmes()


@cli
def clean():
    """Clean output directory"""
    shutil.rmtree(DIST_DIR, ignore_errors=True)


@cli
def static():
    """Copy static files"""
    shutil.copytree(SRC_DIR / "static", DIST_DIR)
    shutil.copytree(SRC_DIR / "tests", DIST_DIR / "tests")


def each_folder_from(source_dir):
    """Walk across the `source_dir` and return the folder paths."""
    for direntry in os.scandir(source_dir):
        if direntry.is_dir():
            yield direntry


def each_markdown_from(source_dir, file_name="*.md"):
    """Walk across the `source_dir` and return the md file paths."""
    for filename in fnmatch.filter(os.listdir(source_dir), file_name):
        yield os.path.join(source_dir, filename), filename


def build_responses(source_dir):
    """Extract and convert markdown from a `source_dir` directory into a dict."""
    responses = {}
    for folder in each_folder_from(source_dir):
        for file_path, filename in each_markdown_from(folder):
            html_content = markdown.read(file_path)
            # Remove empty comments set to hack markdown rendering
            # when we do not want paragraphs.
            html_content = html_content.replace("<!---->", "")
            responses[filename[: -len(".md")]] = html_content

    return responses


@cli
def index():
    """Build the index with contents from markdown dedicated folder."""
    responses = build_responses(CONTENUS_DIR)
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


@cli
def readmes():
    """Build the readmes with all content from markdown files in it."""
    for folder in each_folder_from(CONTENUS_DIR):
        folder_content = f"""
# {folder.name.title()}

*Ce fichier est généré automatiquement pour pouvoir accéder rapidement aux contenus,\
il ne doit pas être édité !*

"""
        for file_path, filename in each_markdown_from(folder):
            if filename == "README.md":
                continue
            file_content = open(file_path).read()
            folder_content += f"""
## [{filename}]({filename})

{file_content}

---

"""
        (Path(folder.path) / "README.md").open("w").write(folder_content)


@wrap
def perf_wrapper():
    start = perf_counter()
    yield
    elapsed = perf_counter() - start
    print(f"Done in {elapsed:.5f} seconds.")


if __name__ == "__main__":
    run()
