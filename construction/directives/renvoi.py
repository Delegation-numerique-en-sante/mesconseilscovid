from mistune.directives import Directive

from construction.composants import render_html_summary
from construction.typographie import typographie


class RenvoiDirective(Directive):
    def __init__(self, questions_index=None):
        self.questions_index = questions_index or {}

    def parse(self, block, m, state):
        ref = m.group("value")
        nom_page, id_question = ref.split("#")
        nom_page = nom_page.lstrip("/")
        page = self.questions_index[nom_page]
        titre_page = page["titre"]
        titre_question = page["questions"][id_question]["titre"]

        options = self.parse_options(m)
        if options:
            level = int(dict(options).get("level", 2))
        else:
            level = 2
        return {
            "type": "renvoi",
            "children": [],
            "params": (nom_page, titre_page, id_question, titre_question, level),
        }

    def __call__(self, md):
        self.register_directive(md, "renvoi")
        if md.renderer.NAME == "html":
            md.renderer.register("renvoi", self.render_html)

    @staticmethod
    def render_html(text, nom_page, titre_page, id_question, titre_question, level):
        return f"""<details id="{id_question}" class="bloc-a-deplier">
    {render_html_summary('', typographie(titre_question, html=True), level)}
    <p>
        Voir la réponse sur notre page
        « <a href="{nom_page}#{id_question}">{typographie(titre_page, html=True)}</a> ».
    </p>
</details>
"""
