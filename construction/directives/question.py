from pathlib import Path

from mistune.directives import Directive

from construction.composants import render_html_summary
from construction.slugs import slugify_title
from construction.typographie import typographie

HERE = Path(__file__).parent
CONTENUS_DIR = HERE.parent.parent / "contenus"


class QuestionDirective(Directive):
    """
    Balisage FAQ pour les questions réponses

    https://developers.google.com/search/docs/data-types/faqpage?hl=fr
    """

    def parse(self, block, m, state):
        question = m.group("value")
        options = self.parse_options(m)
        if options:
            level = int(dict(options).get("level", 2))
            feedback = dict(options).get("feedback", "keep")
            open_ = dict(options).get("open", "").lower() == "true"
        else:
            level = 2
            feedback = "keep"
            open_ = False

        text = self.parse_text(m)
        children = block.parse(text, state, block.rules)

        if not children:
            raise ValueError(
                f"Question sans réponse : indentation manquante ?\n« {question} »"
            )

        return {
            "type": "question",
            "children": children,
            "params": (question, level, feedback, open_),
        }

    def __call__(self, md):
        self.register_directive(md, "question")
        if md.renderer.NAME == "html":
            md.renderer.register("question", self.render_html)
        else:
            md.renderer.register("question", self.render_ast)

    @staticmethod
    def render_ast(text, question, level, feedback, open_):
        return {
            "type": "question",
            "titre": question,
            "level": level,
            "feedback": feedback,
            "open": open_,
            "text": text,
        }

    @staticmethod
    def render_html(text, question, level, feedback, open_):
        question_id = slugify_title(question)
        # TODO: c'est quand même très proche de meta_feedback_conseils.md !
        feedback_html = (
            (CONTENUS_DIR / "meta" / "meta_feedback_inline.html")
            .read_text()
            .format(question=question)
            if feedback == "keep"
            else ""
        )
        return f"""<details id="{question_id}" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question"{' open' if open_ else ''}>
{render_html_summary('', typographie(question), level, extra_span=' itemprop="name"')}
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<div itemprop="text">
{text}</div>
</div>
{feedback_html}
</details>
"""
