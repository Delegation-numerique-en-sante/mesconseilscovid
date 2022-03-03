from difflib import SequenceMatcher

import mistune
from selectolax.parser import HTMLParser as SelectolaxHTMLParser

from .directives.question import QuestionDirective
from .markdown import create_markdown_parser, render_markdown_file
from .slugs import slugify_title
from .thematiques import get_thematiques


def build_questions_index():
    html_parser = create_markdown_parser()
    return {
        page.name + ".html": {"titre": page.title, "questions": extract_questions(page)}
        for page in get_thematiques(html_parser)
    }


def extract_questions(page):
    ast_parser = mistune.create_markdown(
        renderer=mistune.AstRenderer(), plugins=[QuestionDirective()]
    )
    ast_tree = ast_parser.read(page.path)

    html_parser = create_markdown_parser()
    html = str(render_markdown_file(page.path, html_parser))
    html_tree = SelectolaxHTMLParser(html)

    def _extract_questions(tree):
        if isinstance(tree, list):
            for node in tree:
                if node["type"] == "question":
                    yield node
                else:
                    if "children" in node:
                        yield from _extract_questions(node["children"])

    questions = HelpfulDict()
    for node in _extract_questions(ast_tree):
        slug = slugify_title(node["titre"])

        details = html_tree.css_first(f"#{slug}").html
        # On uniformise le niveau de titres à h3.
        details = details.replace("<h2", "<h3").replace("</h2>", "</h3>")
        details = details.replace("<h4", "<h3").replace("</h4>", "</h3>")
        # On remplace les liens relatifs à la volée.
        details = details.replace('href="#', f'href="{page.name}.html#')

        questions[slug] = {
            "titre": node["titre"],
            "details": details,
        }
    return questions


class HelpfulDict(dict):
    def __getitem__(self, key):
        try:
            return super().__getitem__(key)
        except KeyError:
            closest = max(
                self.keys(), key=lambda q: SequenceMatcher(None, q, key).ratio()
            )
            raise HelpfulKeyError(key, closest) from None


class HelpfulKeyError(KeyError):
    def __init__(self, key, closest):
        super().__init__(f"{key!r} (vouliez-vous dire {closest!r}?)")
