from pathlib import Path


from jinja2 import Template
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
            f"""<form
    data-controller="switch feedback plausible"
    data-switch-delay-value="500"
    data-action="
        feedback#send
        switch:switched->feedback#focusIfVisible
        feedback:sent->switch#switch
    "
    data-switch-sources-param="feedback"
    data-switch-destinations-param="thankyou"
    data-feedback-endpoint-value="http://0.0.0.0:5500/feedback">
    <div class="question-feedback"
        data-switch-screen="controls"
        data-action="pageChanged@document->switch#switch"
        data-switch-sources-param="feedback thankyou partager"
        data-switch-destinations-param="controls">
        <p>Ces conseils vous ont été utiles ?</p>
        <div class="feedback-controls">
            <div>
                <label><input type="radio" name="kind" class="button-invisible" value="🙁"
                    data-action="switch#switch feedback#spreadReponse feedback#setNegativeFeedback plausible#record"
                    data-plausible-event-name-param="Avis par question"
                    data-plausible-props-param='{{"{question}": "🙁"}}'
                    data-switch-sources-param="controls"
                    data-switch-destinations-param="feedback"><span class="enlarge">🙁</span> Non</label>
                <label><input type="radio" name="kind" class="button-invisible" value="😐"
                    data-action="switch#switch feedback#spreadReponse feedback#setNegativeFeedback plausible#record"
                    data-plausible-event-name-param="Avis par question"
                    data-plausible-props-param='{{"{question}": "😐"}}'
                    data-switch-sources-param="controls"
                    data-switch-destinations-param="feedback"><span class="enlarge">😐</span> Bof</label>
                <label><input type="radio" name="kind" class="button-invisible" value="🙂"
                    data-action="switch#switch feedback#spreadReponse feedback#setPositiveFeedback plausible#record"
                    data-plausible-event-name-param="Avis par question"
                    data-plausible-props-param='{{"{question}": "🙂"}}'
                    data-switch-sources-param="controls"
                    data-switch-destinations-param="feedback"><span class="enlarge">🙂</span> Oui</label>
            </div>
        </div>
    </div>
    <div class="feedback-form" hidden data-switch-screen="feedback">
        <fieldset>
            <p role="status">Merci pour votre retour.</p>
            <label for="message_conseils">
                <span data-feedback-target="positif"
                    >Avez-vous des remarques ou des suggestions pour améliorer ces conseils ?</span>
                <span data-feedback-target="negatif"
                    >Pouvez-vous nous en dire plus, afin que nous puissions améliorer ces conseils ?</span>
            </label>
            <textarea
            id="message_conseils" name="message" rows="9" cols="20" required
            data-feedback-target="textarea"
            ></textarea>
        </fieldset>
        <div class="form-controls">
            <input type="submit" class="button" value="Envoyer mes remarques">
        </div>
        <p class="feedback-email">ou écrivez-nous à : <a href="mailto:contact@mesconseilscovid.fr">contact@mesconseilscovid.fr</a></p>
    </div>
    <div class="feedback-thankyou" hidden data-switch-screen="thankyou">
        <p>
            Votre réponse : <span data-feedback-target="reponse"></span>
        </p>
        <p>Merci pour votre avis !</p>
    </div>
</form>
"""
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
