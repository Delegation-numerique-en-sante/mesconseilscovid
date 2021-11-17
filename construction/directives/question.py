from pathlib import Path

from mistune.directives import Directive
from mistune.markdown import preprocess

from construction.composants import render_html_summary
from construction.slugs import slugify_title
from construction.typographie import typographie

HERE = Path(__file__).parent
THEMATIQUES_DIR = HERE.parent.parent / "contenus" / "thematiques"


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
            nom_formulaire = dict(options).get("formulaire")
        else:
            level = 2
            feedback = "keep"
            nom_formulaire = None

        text = self.parse_text(m)
        children = block.parse(text, state, block.rules)

        if nom_formulaire:
            path = THEMATIQUES_DIR / "formulaires" / f"{nom_formulaire}.md"
            with path.open() as f:
                content = (
                    f'<div class="formulaire" data-nom="{nom_formulaire}">\n'
                    + f.read()
                    + "\n</div>"
                )
                nodes = block.parse(*preprocess(content, {"__file__": str(path)}))
                children = nodes + children

        if not children:
            raise ValueError(
                f"Question sans réponse : indentation manquante ?\n« {question} »"
            )

        return {
            "type": "question",
            "children": children,
            "params": (question, level, feedback),
        }

    def __call__(self, md):
        self.register_directive(md, "question")
        if md.renderer.NAME == "html":
            md.renderer.register("question", self.render_html)
        else:
            md.renderer.register("question", self.render_ast)

    @staticmethod
    def render_ast(text, question, level, feedback):
        return {
            "type": "question",
            "titre": question,
            "level": level,
            "feedback": feedback,
            "text": text,
        }

    @staticmethod
    def render_html(text, question, level, feedback):
        question_id = slugify_title(question)
        feedback_html = (
            """<form class="question-feedback">
    <fieldset>
        <legend>Avez-vous trouvé cette réponse utile&#8239;?</legend>
        <div>
            <label><input type="submit" class="button-invisible" data-value="non" value="🙁">Non</label>
            <label><input type="submit" class="button-invisible" data-value="bof" value="😐">Bof</label>
            <label><input type="submit" class="button-invisible" data-value="oui" value="🙂">Oui</label>
        </div>
    </fieldset>
</form>"""
            if feedback == "keep"
            else ""
        )
        return f"""<details id="{question_id}" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
{render_html_summary('', typographie(question), level, extra_span=' itemprop="name"')}
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<div itemprop="text">
{text}</div>
</div>
{feedback_html}
</details>
"""
