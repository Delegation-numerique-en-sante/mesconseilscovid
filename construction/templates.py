from pathlib import Path

from jinja2 import Environment as JinjaEnv
from jinja2 import FileSystemLoader, StrictUndefined

from .markdown import MarkdownContent, MarkdownInlineContent


HERE = Path(__file__).parent
TEMPLATES_DIR = HERE.parent / "templates"


jinja_env = JinjaEnv(
    loader=FileSystemLoader(str(TEMPLATES_DIR)), undefined=StrictUndefined
)


def render_template(src, **context):
    jinja_env.filters["me_or_them"] = me_or_them_filter
    jinja_env.filters["inline"] = inline_filter
    template = jinja_env.get_template(src)
    return template.render(**context)


def me_or_them_filter(value):
    assert isinstance(value, MarkdownContent)
    me, them = value.split()
    return me.render_me() + them.render_them()


def inline_filter(value):
    """Convert block content (default) to inline content."""
    assert isinstance(value, MarkdownContent)
    return MarkdownInlineContent(value.text, value.markdown)
