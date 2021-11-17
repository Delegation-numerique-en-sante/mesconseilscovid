from mistune.directives import Directive


class InjectionDirective(Directive):
    def __init__(self, questions_index=None):
        self.questions_index = questions_index or {}

    def parse(self, block, m, state):
        ref = m.group("value")
        nom_page, id_question = ref.split("#")
        nom_page = nom_page.lstrip("/")
        page = self.questions_index[nom_page]
        details_question = page["questions"][id_question]["details"]

        return {
            "type": "injection",
            "children": [],
            "params": (details_question,),
        }

    def __call__(self, md):
        self.register_directive(md, "injection")
        if md.renderer.NAME == "html":
            md.renderer.register("injection", self.render_html)

    @staticmethod
    def render_html(text, details_question):
        return details_question
