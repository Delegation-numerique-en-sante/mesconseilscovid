import mistune
from selectolax.parser import HTMLParser as SelectolaxHTMLParser

from .directives.question import QuestionDirective
from .markdown import create_markdown_parser
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
    html = html_parser.read(page.path)
    html_tree = SelectolaxHTMLParser(html)

    def _extract_questions(tree):
        if isinstance(tree, list):
            for node in tree:
                if node["type"] == "question":
                    yield node
                else:
                    if "children" in node:
                        yield from _extract_questions(node["children"])

    questions = {}
    for node in _extract_questions(ast_tree):
        slug = slugify_title(node["titre"])
        questions[slug] = {
            "titre": node["titre"],
            "details": html_tree.css_first(f"#{slug}").html,
        }
    return questions
